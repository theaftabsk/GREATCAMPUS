"use client";

import { useState, useEffect } from "react";
import { Search, Filter, RefreshCw, Lock, Unlock, Trash2, CheckCircle2, AlertTriangle, UserCheck, ShieldAlert } from "lucide-react";
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
    const reason = prompt(`Unlock candidate '${name}'?\n\nEnter unlock reason (optional):\n\nNote: Warning history will be preserved as audit record.`, "Admin reviewed proctoring logs - approved to continue");
    if (reason === null) return; // User pressed Cancel

    setActionLoadingId(candidateId);
    try {
      const baseUrl = getApiBaseUrl();
      const token = localStorage.getItem("adminToken") || "";
      // Decode admin info from token for audit log
      let adminName = "HR Administrator";
      try {
        const payload = JSON.parse(atob(token.split(".")[1] || "e30="));
        adminName = payload.username || adminName;
      } catch { /* silent */ }

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
    return matchesSearch && c.status === statusFilter;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Candidate Evaluation & Security Locks</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Monitor proctoring violation warnings, exam scores, and unlock candidate accounts locked by 3-warning thresholds.
          </p>
        </div>
        <button
          onClick={loadCandidates}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition shadow-2xs flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Name, Application ID, Email or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses ({candidates.length})</option>
            <option value="LOCKED">🔒 LOCKED ({candidates.filter((c) => c.status === "LOCKED" || c.attempt?.status === "LOCKED").length})</option>
            <option value="COMPLETED">Completed ({candidates.filter((c) => c.status === "COMPLETED").length})</option>
            <option value="IN_PROGRESS">In Progress ({candidates.filter((c) => c.status === "IN_PROGRESS").length})</option>
            <option value="REGISTERED">Registered ({candidates.filter((c) => c.status === "REGISTERED").length})</option>
            <option value="DISQUALIFIED">Disqualified ({candidates.filter((c) => c.status === "DISQUALIFIED").length})</option>
          </select>
        </div>
      </div>

      {/* Candidate Data Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 font-bold">Loading Candidates...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No candidates found</p>
            <p className="text-xs text-slate-400">Try adjusting your search or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="py-3.5 px-4">Candidate Details</th>
                  <th className="py-3.5 px-4">CRM Application ID</th>
                  <th className="py-3.5 px-4">Exam Session</th>
                  <th className="py-3.5 px-4">Security Warnings</th>
                  <th className="py-3.5 px-4">Status & Score</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredCandidates.map((c) => {
                  const isLocked = c.status === "LOCKED" || c.attempt?.status === "LOCKED" || c.status === "DISQUALIFIED";
                  const warnings = c.attempt?.warningCount || 0;
                  const maxWarnings = c.attempt?.maxProctorWarningsSnapshot || 3;

                  return (
                    <tr key={c.id} className={`hover:bg-slate-50/60 transition ${isLocked ? "bg-red-50/30" : ""}`}>
                      {/* Candidate Name & Contact */}
                      <td className="py-4 px-4">
                        <div className="font-extrabold text-slate-900">{c.name}</div>
                        <div className="text-[11px] text-slate-400">{c.email} • {c.phone}</div>
                      </td>

                      {/* Application ID */}
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md">
                          {c.applicationId || c.referenceId || "N/A"}
                        </span>
                      </td>

                      {/* Assessment Name */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-800">{c.assessment?.name || "Niva Bupa Assessment"}</div>
                        <div className="text-[10px] text-blue-600 font-bold">{c.assessment?.slug}</div>
                      </td>

                      {/* Proctor Warnings */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-1.5">
                          {isLocked ? (
                            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          )}
                          <span className={`font-black text-xs ${isLocked ? "text-red-700" : warnings > 0 ? "text-amber-700" : "text-slate-600"}`}>
                            {warnings} / {maxWarnings} Warnings
                          </span>
                        </div>
                        {isLocked && (
                          <span className="inline-block mt-1 text-[10px] font-black uppercase text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                            {c.status === "LOCKED" || c.attempt?.status === "LOCKED" ? "🔒 LOCKED (3 Warnings)" : "DISQUALIFIED"}
                          </span>
                        )}
                      </td>

                      {/* Status & Score */}
                      <td className="py-4 px-4">
                        {c.status === "COMPLETED" ? (
                          <div>
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> Completed
                            </span>
                            <div className="text-xs font-black text-slate-900 mt-1">
                              Score: {c.attempt?.score || c.score || 0} / {c.attempt?.totalPossibleScore || 60} ({c.attempt?.percentage || 0}%)
                            </div>
                          </div>
                        ) : c.status === "LOCKED" || c.attempt?.status === "LOCKED" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                            <Lock className="w-3 h-3" /> LOCKED
                          </span>
                        ) : c.status === "DISQUALIFIED" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                            Disqualified
                          </span>
                        ) : c.status === "IN_PROGRESS" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                            In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            Registered
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {isLocked && (
                            <button
                              onClick={() => handleUnlock(c.id, c.name)}
                              disabled={actionLoadingId === c.id}
                              className="px-3 py-1.5 bg-emerald-600 text-white text-[11px] font-extrabold rounded-lg hover:bg-emerald-700 transition shadow-xs flex items-center gap-1"
                              title="Unlock Candidate Account & Reset Warnings"
                            >
                              <Unlock className="w-3.5 h-3.5" />
                              <span>{actionLoadingId === c.id ? "Unlocking..." : "Unlock Candidate"}</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(c.id, c.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Candidate Record"
                          >
                            <Trash2 className="w-4 h-4" />
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
