"use client";

import { useState, useEffect } from "react";
import {
  Search, Plus, Eye, Printer, Trash2, X, BookOpen, AlertTriangle,
  CheckCircle2, ShieldAlert, FileText, UserPlus, Layers, ShieldCheck
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

interface AssessmentOption {
  id: string;
  name: string;
}

export default function AdminCandidatesPage() {
  const [assessments, setAssessments] = useState<AssessmentOption[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);

  // Add Candidate Form
  const [candForm, setCandForm] = useState({
    name: "",
    email: "",
    phone: "",
    referenceId: "",
    assessmentId: "",
  });

  const loadAssessments = async () => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/assessments`);
      const data = await res.json();
      if (data.success && Array.isArray(data.assessments)) {
        setAssessments(data.assessments);
        if (data.assessments.length > 0 && !candForm.assessmentId) {
          setCandForm((p) => ({ ...p, assessmentId: data.assessments[0].id }));
        }
      }
    } catch (err) {
      console.error("Failed to load assessments:", err);
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const baseUrl = getApiBaseUrl();
      let url = `${baseUrl}/api/v1/candidates`;
      if (selectedAssessmentId) url += `?assessmentId=${selectedAssessmentId}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setCandidates(data.candidates || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [selectedAssessmentId]);

  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candForm.name || !candForm.email || !candForm.assessmentId) {
      alert("Please fill in candidate name, email, and select an assigned exam.");
      return;
    }

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/candidates/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: candForm.name,
          email: candForm.email,
          phone: candForm.phone,
          referenceId: candForm.referenceId || `REF-${Date.now().toString().slice(-6)}`,
          assessmentId: candForm.assessmentId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddCandidateModal(false);
        setCandForm({ name: "", email: "", phone: "", referenceId: "", assessmentId: assessments[0]?.id || "" });
        fetchCandidates();
      }
    } catch (err) {
      alert("Failed to register candidate.");
    }
  };

  const handleDeleteCandidate = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete candidate record for "${name}"?`)) return;
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/candidates/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        if (selectedCandidate?.id === id) setSelectedCandidate(null);
        fetchCandidates();
      }
    } catch (err) {
      alert("Failed to delete candidate.");
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.referenceId.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <UserPlus className="w-7 h-7 text-blue-600" />
            Candidate Assessment Evaluation
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Assign Candidates to Exams, inspect Subject/Section performance, and audit proctoring logs.
          </p>
        </div>

        <button
          onClick={() => setShowAddCandidateModal(true)}
          className="inline-flex items-center space-x-2 bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Candidate to Exam</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="font-bold text-slate-700 block mb-1">Filter by Exam / Assessment</label>
          <select
            value={selectedAssessmentId}
            onChange={(e) => setSelectedAssessmentId(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 outline-none"
          >
            <option value="">All Exams</option>
            {assessments.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="font-bold text-slate-700 block mb-1">Search Candidate</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Name, Email, or Reference ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-800 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-bold mt-2">Loading Candidate Evaluations...</p>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-500 space-y-3">
          <Layers className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-bold">No candidates found.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
                <th className="p-4">Candidate & Ref ID</th>
                <th className="p-4">Assigned Exam</th>
                <th className="p-4">Exam Status</th>
                <th className="p-4">Score / Percentage</th>
                <th className="p-4">Proctor Warnings</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCandidates.map((c) => {
                const attempt = c.attempt;
                const status = c.status;

                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-400">{c.email} | <strong className="text-blue-600">{c.referenceId}</strong></div>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-slate-800">{c.assessment?.name}</span>
                    </td>

                    <td className="p-4">
                      {status === "COMPLETED" ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          COMPLETED
                        </span>
                      ) : status === "IN_PROGRESS" ? (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          IN_PROGRESS
                        </span>
                      ) : status === "DISQUALIFIED" ? (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                          DISQUALIFIED
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          REGISTERED
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      {attempt && attempt.submittedAt ? (
                        <div>
                          <strong className="text-sm text-slate-900">{attempt.score}/{attempt.totalPossibleScore}</strong>
                          <span className="text-xs text-slate-500 ml-1">({attempt.percentage}%)</span>
                          {attempt.isPassed ? (
                            <span className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">PASSED</span>
                          ) : (
                            <span className="ml-2 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">FAILED</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Not Submitted</span>
                      )}
                    </td>

                    <td className="p-4">
                      {attempt ? (
                        <span className={`inline-flex items-center gap-1 font-bold ${attempt.warningCount > 0 ? "text-red-600" : "text-slate-600"}`}>
                          <ShieldAlert className="w-3.5 h-3.5" />
                          {attempt.warningCount} / {attempt.maxProctorWarnings}
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedCandidate(c)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg font-bold text-xs inline-flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" /> View Report
                      </button>
                      <button
                        onClick={() => handleDeleteCandidate(c.id, c.name)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ASSIGN CANDIDATE MODAL */}
      {showAddCandidateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900">Assign Candidate to Exam</h2>

            <form onSubmit={handleCreateCandidate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Assigned Exam *</label>
                <select
                  required
                  value={candForm.assessmentId}
                  onChange={(e) => setCandForm({ ...candForm, assessmentId: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-blue-600 outline-none"
                >
                  {assessments.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Candidate Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aftab SK"
                  value={candForm.name}
                  onChange={(e) => setCandForm({ ...candForm, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="aftab@example.com"
                  value={candForm.email}
                  onChange={(e) => setCandForm({ ...candForm, email: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={candForm.phone}
                  onChange={(e) => setCandForm({ ...candForm, phone: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reference / Access Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. REF-BANK-1001"
                  value={candForm.referenceId}
                  onChange={(e) => setCandForm({ ...candForm, referenceId: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCandidateModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-md"
                >
                  Create & Assign Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED SCORECARD / ANALYTICS DRAWER */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full h-full max-h-[95vh] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto space-y-6">

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">{selectedCandidate.name}</h2>
                  <p className="text-xs text-slate-500">Ref: <strong className="text-blue-600">{selectedCandidate.referenceId}</strong> | {selectedCandidate.email}</p>
                </div>
                <button onClick={() => setSelectedCandidate(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Assessment Summary Banner */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Assigned Exam</span>
                  <strong className="text-slate-900">{selectedCandidate.assessment?.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Status</span>
                  <strong className="text-slate-900">{selectedCandidate.status}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Score</span>
                  <strong className="text-blue-600 font-extrabold text-sm">{selectedCandidate.attempt?.score || 0} / {selectedCandidate.attempt?.totalPossibleScore || 0}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Percentage</span>
                  <strong className="text-slate-900">{selectedCandidate.attempt?.percentage || 0}%</strong>
                </div>
              </div>

              {/* Subject Breakdown */}
              {selectedCandidate.attempt?.subjectBreakdown?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Subject Performance Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCandidate.attempt.subjectBreakdown.map((sb: any) => (
                      <div key={sb.subjectName} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 text-xs">
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>{sb.subjectName}</span>
                          <span className="text-blue-600">{sb.correct} / {sb.total}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${sb.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section Breakdown */}
              {selectedCandidate.attempt?.sectionBreakdown?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Section Accuracy Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {selectedCandidate.attempt.sectionBreakdown.map((sec: any) => (
                      <div key={sec.sectionName} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="text-[10px] text-slate-400 truncate">{sec.subjectName}</div>
                        <div className="font-bold text-slate-800 truncate">{sec.sectionName}</div>
                        <div className="text-blue-600 font-extrabold text-xs mt-1">{sec.correct} / {sec.total} Correct</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Proctoring Timeline */}
              {selectedCandidate.attempt?.proctoringLogs?.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    Proctoring Audit Log ({selectedCandidate.attempt.proctoringLogs.length} Events)
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedCandidate.attempt.proctoringLogs.map((log: any, lIdx: number) => (
                      <div key={lIdx} className="p-2.5 bg-red-50 border border-red-100 rounded-xl text-xs flex items-center justify-between text-red-800">
                        <span><strong>{log.eventType}:</strong> {log.details || "Violation logged"}</span>
                        <span className="text-[10px] text-red-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Scorecard
              </button>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
