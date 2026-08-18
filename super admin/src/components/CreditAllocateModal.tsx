"use client";

import { useState } from "react";
import { X, Plus, Coins, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

interface CreditAllocateModalProps {
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

export default function CreditAllocateModal({
  isOpen,
  onClose,
  tenant,
  onSuccess,
}: CreditAllocateModalProps) {
  const [amount, setAmount] = useState<number>(500);
  const [notes, setNotes] = useState<string>("Quarterly Top-up Allocation");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !tenant) return null;

  const newTotalLimit = tenant.creditLimit + (amount || 0);
  const newRemaining = tenant.remainingCredit + (amount || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setError("Please enter a valid credit amount greater than 0.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/super-admin/tenants/${tenant.id}/credits/allocate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          adminName: "Super Admin",
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || "Failed to allocate credits.");
      }
    } catch {
      setError("Network error while connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [100, 250, 500, 1000, 2500];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl shadow-cyan-950/50 relative overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Title & Close */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Allocate Exam Credits</h3>
              <p className="text-xs text-slate-400 font-medium">Tenant: <strong className="text-cyan-300">{tenant.name}</strong></p>
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
          {/* Quick Amount Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Quick Presets (+Credits)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    amount === val
                      ? "bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/30"
                      : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60"
                  }`}
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Credits to Allocate *
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-lg font-black text-cyan-300 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <span className="absolute right-4 top-3 text-xs font-bold text-slate-500">Credits</span>
            </div>
          </div>

          {/* Notes / Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Allocation Notes / Memo
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Approved Batch Top-up for Q3 Hiring"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Real-Time Calculation Preview Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/20 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>Current Limit & Balance:</span>
              <span className="font-mono font-bold text-slate-200">
                {tenant.creditLimit.toLocaleString()} Limit ({tenant.remainingCredit.toLocaleString()} left)
              </span>
            </div>
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <span>Adding Credits:</span>
              <span className="font-mono text-sm font-black">+{amount.toLocaleString()} Credits</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-black text-emerald-400">
              <span>New Total Limit & Remaining:</span>
              <span className="font-mono text-sm">
                {newTotalLimit.toLocaleString()} Limit ({newRemaining.toLocaleString()} left)
              </span>
            </div>
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
              disabled={loading || amount <= 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Allocating..." : "Confirm Allocation"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
