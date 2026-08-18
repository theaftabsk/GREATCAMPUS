"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import CreditAllocateModal from "@/components/CreditAllocateModal";
import CreditAdjustModal from "@/components/CreditAdjustModal";
import {
  Coins,
  Building2,
  Users,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sliders,
  RefreshCw,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  ExternalLink,
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

export default function SuperAdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [selectedTenantForAllocate, setSelectedTenantForAllocate] = useState<any>(null);
  const [selectedTenantForAdjust, setSelectedTenantForAdjust] = useState<any>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/super-admin/dashboard`);
      const data = await res.json();
      setDashboardData(data);
    } catch {
      setError("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const summary = dashboardData?.summary || {
    totalCreditLimit: 1000,
    totalUsedCredit: 327,
    totalRemainingCredit: 673,
    totalTenants: 1,
    totalAssessments: 100,
    totalCandidates: 2450,
    totalAttempts: 327,
    completed: 290,
    inProgress: 12,
    notStarted: 2123,
  };

  const tenants = dashboardData?.tenants || [];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Super Admin Console</span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-extrabold text-cyan-400">Global Overview</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboard}
              title="Refresh Stats"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition cursor-pointer border border-slate-700/60"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Credit Engine Online</span>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Header Greeting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Enterprise Quota & Credit Management
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Real-time tracking of candidate exam starts, tenant quotas, and audit ledger.
              </p>
            </div>
          </div>

          {/* KPI Cards: CREDIT STATS (3 Hero Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Total Credit Limit */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Credit Limit</span>
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                  {summary.totalCreditLimit.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 ml-2 font-bold">Allocated</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">Across all active tenant accounts</p>
            </div>

            {/* Total Used Credits */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Used Exam Credits</span>
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                  {summary.totalUsedCredit.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 ml-2 font-bold">Consumed (1 / Exam Start)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">100% duplicate-protected usage</p>
            </div>

            {/* Total Remaining Credits */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Remaining Balance</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                  {summary.totalRemainingCredit.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 ml-2 font-bold">Available Starts</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">Ready for new candidate exam starts</p>
            </div>
          </div>

          {/* SECONDARY METRICS ROW (Assessment & Candidate Breakdown) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assessments</span>
              <strong className="text-xl font-black text-white font-mono mt-1 block">
                {summary.totalAssessments.toLocaleString()}
              </strong>
              <span className="text-[10px] text-slate-400 font-medium">0 Credit Cost</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidates</span>
              <strong className="text-xl font-black text-white font-mono mt-1 block">
                {summary.totalCandidates.toLocaleString()}
              </strong>
              <span className="text-[10px] text-slate-400 font-medium">Assigned Total</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam Starts</span>
              <strong className="text-xl font-black text-cyan-400 font-mono mt-1 block">
                {summary.totalAttempts.toLocaleString()}
              </strong>
              <span className="text-[10px] text-cyan-300/70 font-medium">Credits Used</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
              <strong className="text-xl font-black text-emerald-400 font-mono mt-1 block">
                {summary.completed.toLocaleString()}
              </strong>
              <span className="text-[10px] text-emerald-300/70 font-medium">Finished Tests</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">In Progress</span>
              <strong className="text-xl font-black text-blue-400 font-mono mt-1 block">
                {summary.inProgress.toLocaleString()}
              </strong>
              <span className="text-[10px] text-blue-300/70 font-medium">Active Now</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Not Started</span>
              <strong className="text-xl font-black text-slate-400 font-mono mt-1 block">
                {summary.notStarted.toLocaleString()}
              </strong>
              <span className="text-[10px] text-slate-400 font-medium">0 Credit Used</span>
            </div>
          </div>

          {/* TENANT MANAGEMENT CARD */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                  <span>Tenant Organization Accounts & Quotas</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Allocate credits (+Top-up) or adjust limits with strict under-consumption protection.
                </p>
              </div>
            </div>

            {/* Tenant Table */}
            <div className="overflow-x-auto mt-5">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="py-3.5 px-4">Organization Name</th>
                    <th className="py-3.5 px-4 text-center">Credit Limit</th>
                    <th className="py-3.5 px-4 text-center">Used Credits</th>
                    <th className="py-3.5 px-4 text-center">Remaining Balance</th>
                    <th className="py-3.5 px-4 text-center">Candidates</th>
                    <th className="py-3.5 px-4 text-right">Credit Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                  {tenants.map((t: any) => {
                    const remaining = t.credit.remainingCredit;
                    const used = t.credit.usedCredit;
                    const limit = t.credit.creditLimit;

                    return (
                      <tr key={t.tenant.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-4 px-4">
                          <div className="font-extrabold text-white text-sm">{t.tenant.name}</div>
                          <div className="text-[11px] text-cyan-400 font-bold">{t.tenant.slug}</div>
                        </td>

                        <td className="py-4 px-4 text-center font-mono text-sm font-black text-white">
                          {limit.toLocaleString()}
                        </td>

                        <td className="py-4 px-4 text-center font-mono text-sm font-black text-amber-400">
                          {used.toLocaleString()}
                        </td>

                        <td className="py-4 px-4 text-center font-mono text-sm font-black text-emerald-400">
                          {remaining.toLocaleString()}
                        </td>

                        <td className="py-4 px-4 text-center">
                          <div className="font-bold text-slate-200">
                            {t.metrics.totalCandidates.toLocaleString()} Assigned
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {t.metrics.notStarted.toLocaleString()} Not Started (0 credit)
                          </div>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                setSelectedTenantForAllocate({
                                  id: t.tenant.id,
                                  name: t.tenant.name,
                                  creditLimit: limit,
                                  usedCredit: used,
                                  remainingCredit: remaining,
                                })
                              }
                              title="Add / Allocate More Credits"
                              className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-extrabold text-xs border border-cyan-500/30 transition flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Allocate</span>
                            </button>

                            <button
                              onClick={() =>
                                setSelectedTenantForAdjust({
                                  id: t.tenant.id,
                                  name: t.tenant.name,
                                  creditLimit: limit,
                                  usedCredit: used,
                                  remainingCredit: remaining,
                                })
                              }
                              title="Adjust Total Limit"
                              className="px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 font-extrabold text-xs border border-indigo-500/30 transition flex items-center gap-1 cursor-pointer"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                              <span>Adjust Limit</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Allocate Credits Modal */}
      <CreditAllocateModal
        isOpen={!!selectedTenantForAllocate}
        tenant={selectedTenantForAllocate}
        onClose={() => setSelectedTenantForAllocate(null)}
        onSuccess={fetchDashboard}
      />

      {/* Adjust Limit Modal with Safety Rule Validation */}
      <CreditAdjustModal
        isOpen={!!selectedTenantForAdjust}
        tenant={selectedTenantForAdjust}
        onClose={() => setSelectedTenantForAdjust(null)}
        onSuccess={fetchDashboard}
      />
    </div>
  );
}
