"use client";

import { useState, useEffect } from "react";
import {
  Search, Filter, RefreshCw, Lock, Unlock, Trash2, CheckCircle2,
  AlertTriangle, ShieldAlert, FileSpreadsheet, Download, Table, Layers,
  ChevronDown, HelpCircle, Check, Sparkles
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

export default function CandidatesManagementPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/candidates`);
      const data = await res.json();
      if (data.success) {
        setCandidates(data.candidates || []);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const handleUnlock = async (candidateId: string, name: string) => {
    const reason = prompt(
      `Unlock candidate '${name}'?\n\nEnter unlock reason (optional):\n\nNote: Warning history will be preserved as audit record.`,
      "Admin reviewed proctoring logs - approved to continue"
    );
    if (reason === null) return;

    setActionLoadingId(candidateId);
    try {
      const baseUrl = getApiBaseUrl();
      const token = localStorage.getItem("adminToken") || "";
      let adminName = "HR Administrator";
      try {
        const payload = JSON.parse(atob(token.split(".")[1] || "e30="));
        adminName = payload.username || adminName;
      } catch {
        /* silent */
      }

      const res = await fetch(`${baseUrl}/api/v1/candidates/${candidateId}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ adminName, reason: reason || "Admin unlocked candidate" }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Candidate '${name}' unlocked successfully!\n\nWarning history preserved for audit.\nUnlocked by: ${adminName}`);
        await loadCandidates();
      } else {
        alert(data.message || "Failed to unlock candidate.");
      }
    } catch {
      alert("Error unlocking candidate.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (candidateId: string, name: string) => {
    if (!confirm(`Delete candidate '${name}' and all attempt records?`)) return;
    try {
      const baseUrl = getApiBaseUrl();
      await fetch(`${baseUrl}/api/v1/candidates/${candidateId}`, { method: "DELETE" });
      await loadCandidates();
    } catch {
      /* silent */
    }
  };

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm);

    if (statusFilter === "ALL") return matchesSearch;
    if (statusFilter === "LOCKED") return matchesSearch && (c.status === "LOCKED" || c.attempt?.status === "LOCKED");
    return matchesSearch && c.status === statusFilter;
  });

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredCandidates.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = [
      "Row",
      "Candidate Name",
      "Email Address",
      "Phone Number",
      "Application ID",
      "Assessment Name",
      "Status",
      "Warning Count",
      "Max Warnings",
      "Score Obtained",
      "Total Score",
      "Percentage",
      "Pass/Fail",
      "Registration Date",
    ];

    const rows = filteredCandidates.map((c, idx) => [
      idx + 1,
      `"${c.name || ""}"`,
      `"${c.email || ""}"`,
      `"${c.phone || ""}"`,
      `"${c.applicationId || c.referenceId || ""}"`,
      `"${c.assessment?.name || "Niva Bupa Assessment"}"`,
      `"${c.status || "REGISTERED"}"`,
      c.attempt?.warningCount || 0,
      c.attempt?.maxProctorWarningsSnapshot || 3,
      c.attempt?.score || 0,
      c.attempt?.totalPossibleScore || 60,
      `${c.attempt?.percentage || 0}%`,
      c.attempt?.isPassed ? "PASSED" : "FAILED",
      `"${new Date(c.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Candidate_Evaluation_Grid_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Excel Summary Stats
  const completedCount = candidates.filter((c) => c.status === "COMPLETED").length;
  const lockedCount = candidates.filter((c) => c.status === "LOCKED" || c.attempt?.status === "LOCKED").length;
  const inProgressCount = candidates.filter((c) => c.status === "IN_PROGRESS").length;
  const passCount = candidates.filter((c) => c.attempt?.isPassed).length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5 font-sans">
      {/* Top Excel Ribbon Toolbar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-inner">
            <FileSpreadsheet className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-tight">Candidate Evaluation Sheet</h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                LIVE EXCEL GRID
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Real-time candidate assessment database, security lock management & automated scoring sheet.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2 border border-emerald-500"
          >
            <Download className="w-4 h-4" />
            <span>Export to Excel / CSV</span>
          </button>

          <button
            onClick={loadCandidates}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition border border-slate-700 flex items-center space-x-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Sheet</span>
          </button>
        </div>
      </div>

      {/* Excel Sheet Summary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[10px] font-mono uppercase font-bold text-slate-400">Total Rows (=COUNTA)</div>
          <div className="text-xl font-black text-slate-900 mt-1">{candidates.length}</div>
          <div className="text-[11px] font-semibold text-slate-500">Registered Candidates</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs">
          <div className="text-[10px] font-mono uppercase font-bold text-emerald-600">Completed (=COUNTIF)</div>
          <div className="text-xl font-black text-emerald-700 mt-1">{completedCount}</div>
          <div className="text-[11px] font-semibold text-emerald-600">{passCount} Passed Criteria</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-blue-200 bg-blue-50/20 shadow-2xs">
          <div className="text-[10px] font-mono uppercase font-bold text-blue-600">In Progress</div>
          <div className="text-xl font-black text-blue-700 mt-1">{inProgressCount}</div>
          <div className="text-[11px] font-semibold text-blue-600">Active Test Sessions</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-red-200 bg-red-50/20 shadow-2xs">
          <div className="text-[10px] font-mono uppercase font-bold text-red-600">🔒 LOCKED ACCOUNTS</div>
          <div className="text-xl font-black text-red-700 mt-1">{lockedCount}</div>
          <div className="text-[11px] font-semibold text-red-600">3-Warning Violation Threshold</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <div className="text-[10px] font-mono uppercase font-bold text-slate-400">Sheet Grid Filter</div>
          <div className="text-xl font-black text-slate-900 mt-1">{filteredCandidates.length}</div>
          <div className="text-[11px] font-semibold text-slate-500">Rows Currently Visible</div>
        </div>
      </div>

      {/* Sheet Filter & Search Controls */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name, email, phone or application ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          {[
            { id: "ALL", label: `All (${candidates.length})` },
            { id: "LOCKED", label: `🔒 LOCKED (${lockedCount})` },
            { id: "COMPLETED", label: `Completed (${completedCount})` },
            { id: "IN_PROGRESS", label: `In Progress (${inProgressCount})` },
            { id: "REGISTERED", label: `Registered` },
            { id: "DISQUALIFIED", label: `Disqualified` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Excel Sheet Styled Data Grid Table */}
      <div className="bg-white border border-slate-300 rounded-xl shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 font-mono font-bold">Querying Live Database Rows...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Table className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No Candidate Rows Found in Database Sheet</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {candidates.length === 0
                ? "The database is clean and ready. When candidates attempt an assessment via their URL link, their records will automatically stream into this spreadsheet."
                : "No rows match your current search query or filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border-spacing-0 font-sans text-xs">
              {/* Excel Column Headers */}
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider select-none">
                  <th className="py-2.5 px-3 border-r border-slate-200 text-center w-12 bg-slate-200/60">#</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">Candidate Name & Email</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">Application ID</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">Assessment Session</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-center">Security Warnings</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-center">Status</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-center">Score Marks</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>

              {/* Table Rows with Excel Grid styling */}
              <tbody className="divide-y divide-slate-200">
                {filteredCandidates.map((c, idx) => {
                  const isLocked = c.status === "LOCKED" || c.attempt?.status === "LOCKED";
                  const warnings = c.attempt?.warningCount || 0;
                  const maxWarnings = c.attempt?.maxProctorWarningsSnapshot || 3;
                  const isEven = idx % 2 === 0;

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-emerald-50/40 transition font-medium ${
                        isLocked ? "bg-red-50/50" : isEven ? "bg-white" : "bg-slate-50/40"
                      }`}
                    >
                      {/* Excel Row Index */}
                      <td className="py-3 px-3 border-r border-slate-200 text-center font-mono text-[11px] text-slate-400 font-bold bg-slate-50/80">
                        {idx + 1}
                      </td>

                      {/* Candidate Name & Contact */}
                      <td className="py-3 px-3 border-r border-slate-200">
                        <div className="font-extrabold text-slate-900">{c.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{c.email} • {c.phone}</div>
                      </td>

                      {/* Application ID */}
                      <td className="py-3 px-3 border-r border-slate-200">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {c.applicationId || c.referenceId || "N/A"}
                        </span>
                      </td>

                      {/* Assessment */}
                      <td className="py-3 px-3 border-r border-slate-200">
                        <div className="font-bold text-slate-800">{c.assessment?.name || "Niva Bupa Assessment"}</div>
                        <div className="text-[10px] text-emerald-600 font-mono font-bold">{c.assessment?.slug}</div>
                      </td>

                      {/* Warnings */}
                      <td className="py-3 px-3 border-r border-slate-200 text-center">
                        <div className="inline-flex items-center space-x-1 font-mono font-bold text-xs">
                          {isLocked ? (
                            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                          <span className={isLocked ? "text-red-700 font-black" : warnings > 0 ? "text-amber-700" : "text-slate-600"}>
                            {warnings} / {maxWarnings}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 border-r border-slate-200 text-center">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-red-700 bg-red-100 border border-red-300 px-2 py-0.5 rounded-full">
                            <Lock className="w-3 h-3" /> 🔒 LOCKED
                          </span>
                        ) : c.status === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        ) : c.status === "IN_PROGRESS" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-blue-700 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-full">
                            In Progress
                          </span>
                        ) : c.status === "DISQUALIFIED" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">
                            Disqualified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                            Registered
                          </span>
                        )}
                      </td>

                      {/* Score Marks */}
                      <td className="py-3 px-3 border-r border-slate-200 text-center font-mono">
                        {c.status === "COMPLETED" ? (
                          <div>
                            <span className="font-extrabold text-xs text-slate-900">
                              {c.attempt?.score || 0} / {c.attempt?.totalPossibleScore || 60}
                            </span>
                            <div className="text-[10px] font-bold text-emerald-600">
                              ({c.attempt?.percentage || 0}%)
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {isLocked && (
                            <button
                              onClick={() => handleUnlock(c.id, c.name)}
                              disabled={actionLoadingId === c.id}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition shadow-2xs flex items-center space-x-1"
                            >
                              <Unlock className="w-3 h-3" />
                              <span>Unlock Account</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(c.id, c.name)}
                            title="Delete Candidate Record"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
