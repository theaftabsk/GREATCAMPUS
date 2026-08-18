"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Coins,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Sliders,
  UserCheck,
  FileSpreadsheet,
} from "lucide-react";

export default function ExamActivityLogsPage() {
  const [histories, setHistories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50); // Default 50 items per page
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [quotaData, setQuotaData] = useState<any>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.niva.greatcampus.in";
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...(filterType !== "ALL" && { type: filterType }),
        ...(searchTerm.trim() !== "" && { search: searchTerm.trim() }),
      });

      const [logRes, quotaRes] = await Promise.all([
        fetch(`${apiUrl}/api/v1/credits/history?${queryParams.toString()}`),
        fetch(`${apiUrl}/api/v1/credits/quota`),
      ]);

      const logData = await logRes.json();
      const qData = await quotaRes.json();

      if (logData.success) {
        setHistories(logData.histories || []);
        setTotalPages(logData.totalPages || 1);
        setTotalRecords(logData.total || 0);
      }

      if (qData.success) {
        setQuotaData(qData);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, pageSize, filterType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Activity className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Exam Activity & Credit Audit Logs
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Chronological audit trail of candidate exam start usages, credit deductions, and tenant allocations (Showing 50 records per page).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setPage(1);
              fetchLogs();
            }}
            title="Refresh Logs"
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Credit KPI Overview Bar */}
      {quotaData && quotaData.credit && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Allocated Limit</span>
              <strong className="text-2xl font-black text-slate-900 font-mono mt-0.5 block">
                {quotaData.credit.creditLimit.toLocaleString()}
              </strong>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Coins className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Exam Starts (Used)</span>
              <strong className="text-2xl font-black text-amber-600 font-mono mt-0.5 block">
                {quotaData.credit.usedCredit.toLocaleString()}
              </strong>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Remaining Balance</span>
              <strong className="text-2xl font-black text-emerald-600 font-mono mt-0.5 block">
                {quotaData.credit.remainingCredit.toLocaleString()}
              </strong>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate name, email, or application ID..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </form>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Event Filter */}
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Event Types</option>
            <option value="DEDUCTION">Exam Starts (-1 Credit)</option>
            <option value="ALLOCATION">Credit Allocations (+)</option>
            <option value="ADJUSTMENT">Limit Adjustments</option>
          </select>

          {/* Page Size Switcher */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value={25}>Show 25 / page</option>
            <option value={50}>Show 50 / page (Default)</option>
            <option value={100}>Show 100 / page</option>
          </select>
        </div>
      </div>

      {/* Main Logs Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-center">Event Type</th>
                <th className="py-3 px-4 text-center">Credit Usage</th>
                <th className="py-3 px-4">Candidate / Activity Details</th>
                <th className="py-3 px-4 text-center">Warnings</th>
                <th className="py-3 px-4 text-center">Exam Status / Score</th>
                <th className="py-3 px-4 text-right">Balance After</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-slate-500">Loading 50 audit logs...</span>
                    </div>
                  </td>
                </tr>
              ) : histories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-400 font-bold text-xs">
                    No activity audit logs found matching your criteria.
                  </td>
                </tr>
              ) : (
                histories.map((h, idx) => {
                  const isDeduction = h.type === "DEDUCTION" || h.amount < 0;
                  const isAllocation = h.type === "ALLOCATION" || h.amount > 0;
                  const cand = h.candidateDetails;
                  const attempt = cand?.latestAttempt;

                  const rowNumber = (page - 1) * pageSize + (idx + 1);

                  return (
                    <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Row Index */}
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-xs">
                        {rowNumber}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-800 text-xs">
                          {new Date(h.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {new Date(h.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            h.type === "ALLOCATION"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : h.type === "DEDUCTION"
                              ? "bg-amber-50 border-amber-200 text-amber-800"
                              : "bg-indigo-50 border-indigo-200 text-indigo-700"
                          }`}
                        >
                          {h.type === "DEDUCTION" ? "Exam Start" : h.type}
                        </span>
                      </td>

                      {/* Credit Change */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs font-black whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-0.5 ${
                            isDeduction ? "text-amber-600" : "text-emerald-600"
                          }`}
                        >
                          {h.amount > 0 ? `+${h.amount}` : h.amount}
                        </span>
                      </td>

                      {/* Candidate / Activity Details */}
                      <td className="py-3.5 px-4">
                        {cand ? (
                          <div>
                            <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                              <span>{cand.name}</span>
                              {cand.applicationId && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono font-bold">
                                  App ID: {cand.applicationId}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {cand.email} • {cand.phone}
                            </div>
                            {cand.assessmentName && (
                              <div className="text-[10px] text-blue-600 font-bold mt-0.5">
                                {cand.assessmentName}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="font-bold text-slate-800 text-xs">
                            {h.description}
                          </div>
                        )}
                      </td>

                      {/* Security Warnings */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {attempt ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                              attempt.warningCount >= 3
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : attempt.warningCount > 0
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-slate-50 text-slate-600"
                            }`}
                          >
                            {attempt.warningCount} / 3
                          </span>
                        ) : (
                          <span className="text-slate-300 font-mono">—</span>
                        )}
                      </td>

                      {/* Status / Score */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {attempt ? (
                          <div>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                attempt.status === "COMPLETED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : attempt.status === "IN_PROGRESS"
                                  ? "bg-blue-100 text-blue-800"
                                  : attempt.status === "LOCKED"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {attempt.status}
                            </span>
                            {attempt.status === "COMPLETED" && (
                              <div className="font-mono text-xs font-black text-slate-800 mt-0.5">
                                {attempt.score} / {attempt.totalPossibleScore} ({Math.round(attempt.percentage)}%)
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs font-medium">Logged</span>
                        )}
                      </td>

                      {/* Balance After */}
                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-800 text-xs whitespace-nowrap">
                        {h.balanceAfter.toLocaleString()} Remaining
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalRecords > 0 && (
          <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-slate-600">
            <div>
              Showing {histories.length} of {totalRecords} total audit logs ({pageSize} per page)
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-blue-600 font-mono font-black shadow-2xs">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
