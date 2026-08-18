"use client";

import { useState } from "react";
import { X, Sliders, AlertTriangle, ShieldAlert, ArrowRight, CheckCircle2 } from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

interface CreditAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: {
    id: string;
    name: string;
    creditLimit: number;
    usedCredit: number;
    remainingCredit: number;
  } | null;
  onSuccess: () => void;
}

export default function CreditAdjustModal({
  isOpen,
  onClose,
  tenant,
  onSuccess,
}: CreditAdjustModalProps) {
  const [newLimit, setNewLimit] = useState<number>(tenant ? tenant.creditLimit : 500);
  const [reason, setReason] = useState<string>("Executive Quota Revision");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !tenant) return null;

  const used = tenant.usedCredit;
  const isBelowUsed = newLimit < used;
  const diff = newLimit - tenant.creditLimit;
  const newRemaining = Math.max(0, newLimit - used);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBelowUsed) {
      setError(`Cannot reduce credit limit below ${used} used credits.`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/super-admin/tenants/${tenant.id}/credits/adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newLimit: Number(newLimit),
          adminName: "Super Admin",
          reason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || "Failed to adjust credit limit.");
      }
    } catch {
      setError("Network error while communicating with server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl shadow-indigo-950/50 relative overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Title & Close */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Adjust Credit Limit</h3>
              <p className="text-xs text-slate-400 font-medium">Tenant: <strong className="text-indigo-300">{tenant.name}</strong></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5 relative z-10">
          {/* Current State Info Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px]">Current Total Limit</span>
              <strong className="text-slate-100 text-sm font-mono">{tenant.creditLimit.toLocaleString()}</strong>
            </div>
            <div className="text-center">
              <span className="text-slate-400 block text-[11px]">Already Consumed</span>
              <strong className="text-amber-400 text-sm font-mono">{tenant.usedCredit.toLocaleString()} Used</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">Current Balance</span>
              <strong className="text-cyan-400 text-sm font-mono">{tenant.remainingCredit.toLocaleString()} Left</strong>
            </div>
          </div>

          {/* New Limit Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              New Credit Limit * (Minimum: {used})
            </label>
            <div className="relative">
              <input
                type="number"
                min={used}
                required
                value={newLimit}
                onChange={(e) => setNewLimit(parseInt(e.target.value) || 0)}
                className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-lg font-black text-slate-100 focus:outline-none ${
                  isBelowUsed
                    ? "border-rose-500 text-rose-400 focus:ring-1 focus:ring-rose-500"
                    : "border-slate-700 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                }`}
              />
              <span className="absolute right-4 top-3 text-xs font-bold text-slate-500">Credits</span>
            </div>
          </div>

          {/* Real-Time Safety Warning Alert */}
          {isBelowUsed ? (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>
                Safety Rule Violation: Cannot set limit lower than {used} used credits! (Attempting {newLimit})
              </span>
            </div>
          ) : (
            /* Calculation Preview */
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/20 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>Adjustment Delta:</span>
                <span className={`font-mono font-bold ${diff >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                  {diff >= 0 ? `+${diff}` : diff} Credits
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Consumed Exam Credits:</span>
                <span className="font-mono text-slate-200 font-bold">{used.toLocaleString()} (Preserved)</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-black text-indigo-400">
                <span>New Remaining Available Credits:</span>
                <span className="font-mono text-sm font-black">{newRemaining.toLocaleString()} Credits</span>
              </div>
            </div>
          )}

          {/* Reason / Memo */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Adjustment Reason / Memo
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Contract Amendment / Budget Reallocation"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-400"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || isBelowUsed}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-black text-xs transition shadow-lg shadow-indigo-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Adjusting..." : "Confirm Adjustment"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
