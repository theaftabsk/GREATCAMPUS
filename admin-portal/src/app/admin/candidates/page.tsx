"use client";

import { useState, useEffect } from "react";
import {
  Search, RefreshCw, Lock, Unlock, Trash2, CheckCircle2,
  AlertTriangle, ShieldAlert, Download, Table, FileText, Award
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";
import CandidateReportModal from "@/components/CandidateReportModal";

export default function CandidatesManagementPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modal Report Card State
  const [selectedReportCandidateId, setSelectedReportCandidateId] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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

  const handleOpenReport = (candidateId: string) => {
    setSelectedReportCandidateId(candidateId);
    setIsReportModalOpen(true);
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
      alert("No candidate data available to export.");
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
    link.setAttribute("download", `Candidate_Evaluation_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const completedCount = candidates.filter((c) => c.status === "COMPLETED").length;
  const lockedCount = candidates.filter((c) => c.status === "LOCKED" || c.attempt?.status === "LOCKED").length;
  const inProgressCount = candidates.filter((c) => c.status === "IN_PROGRESS").length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Clean Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Candidate Evaluation</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Monitor candidate assessment progress, scores, proctoring warnings, and unlock accounts.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={loadCandidates}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition border border-slate-200 shadow-2xs flex items-center space-x-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search & Status Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name, email, phone or application ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Data Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 font-bold">Loading Candidate Records...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Table className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No Candidates Found</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {candidates.length === 0
                ? "The candidate database is currently empty and ready. As candidates take their exam, their real-time results will appear here."
                : "No candidates match your search term or filter selection."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border-spacing-0 font-sans text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="py-3.5 px-4 text-center w-12">#</th>
                  <th className="py-3.5 px-4">Candidate Details</th>
                  <th className="py-3.5 px-4">CRM Application ID</th>
                  <th className="py-3.5 px-4">Exam Session</th>
                  <th className="py-3.5 px-4 text-center">Security Warnings</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Score Marks</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredCandidates.map((c, idx) => {
                  const isLocked = c.status === "LOCKED" || c.attempt?.status === "LOCKED";
                  const isCompleted = c.status === "COMPLETED";
                  const warnings = c.attempt?.warningCount || 0;
                  const maxWarnings = c.attempt?.maxProctorWarningsSnapshot || 3;

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isLocked ? "bg-red-50/40" : ""
                      }`}
                    >
                      {/* Row Index */}
                      <td className="py-3.5 px-4 text-center font-mono text-[11px] text-slate-400 font-bold">
                        {idx + 1}
                      </td>

                      {/* Candidate Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">{c.name}</div>
                        <div className="text-[11px] text-slate-400">{c.email} • {c.phone}</div>
                      </td>

                      {/* Application ID */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                          {c.applicationId || c.referenceId || "N/A"}
                        </span>
                      </td>

                      {/* Assessment */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{c.assessment?.name || "Niva Bupa Assessment"}</div>
                        <div className="text-[10px] text-blue-600 font-bold">{c.assessment?.slug}</div>
                      </td>

                      {/* Warnings */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center space-x-1.5 font-bold text-xs">
                          {isLocked ? (
                            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                          <span className={isLocked ? "text-red-700 font-black" : warnings > 0 ? "text-amber-700" : "text-slate-600"}>
                            {warnings} / {maxWarnings}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-200">
                            <Lock className="w-3 h-3" /> 🔒 LOCKED
                          </span>
                        ) : c.status === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        ) : c.status === "IN_PROGRESS" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                            In Progress
                          </span>
                        ) : c.status === "DISQUALIFIED" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-200">
                            Disqualified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            Registered
                          </span>
                        )}
                      </td>

                      {/* Score Marks */}
                      <td className="py-3.5 px-4 text-center font-mono">
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
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* View Report Card Button for Completed Candidates */}
                          {isCompleted && (
                            <button
                              onClick={() => handleOpenReport(c.id)}
                              title="View Detailed Diagnostic Report Card"
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-[11px] rounded-lg border border-blue-200 transition flex items-center space-x-1 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              <span>Report Card</span>
                            </button>
                          )}

                          {/* View Audit Report Button for Locked / Disqualified Candidates */}
                          {isLocked && (
                            <>
                              <button
                                onClick={() => handleOpenReport(c.id)}
                                title="View Security Audit Report"
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold text-[11px] rounded-lg border border-amber-200 transition flex items-center space-x-1 cursor-pointer"
                              >
                                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                                <span>Audit Log</span>
                              </button>

                              <button
                                onClick={() => handleUnlock(c.id, c.name)}
                                disabled={actionLoadingId === c.id}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition shadow-2xs flex items-center space-x-1 cursor-pointer"
                              >
                                <Unlock className="w-3 h-3" />
                                <span>Unlock</span>
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleDelete(c.id, c.name)}
                            title="Delete Candidate Record"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
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

      {/* Candidate Diagnostic Report Modal Component */}
      <CandidateReportModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setSelectedReportCandidateId(null);
        }}
        candidateId={selectedReportCandidateId}
      />
    </div>
  );
}
