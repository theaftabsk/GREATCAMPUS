"use client";

import { useState, useEffect } from "react";
import {
  X,
  Printer,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ShieldCheck,
  FileText,
  MessageSquare,
  User,
  Calendar,
  Sparkles,
  BarChart2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

interface SectionData {
  sectionOrder: number;
  name: string;
  questionRange: string;
  score: number;
  totalMarks: number;
  percentage: number;
}

interface QuestionResponse {
  questionOrder: number;
  sectionName: string;
  questionText: string;
  candidateOption: string | null;
  correctOption: string;
  isCorrect: boolean;
  marks: number;
}

interface ReportData {
  success: boolean;
  candidate: {
    id: string;
    name: string;
    email: string;
    phone: string;
    applicationId: string;
    crmCandidateId: string | null;
    status: string;
  };
  assessment: {
    id: string;
    title: string;
    slug: string;
    durationMins: number;
    passingPercentage: number;
  };
  result: {
    status: "QUALIFIED" | "NOT QUALIFIED" | "LOCKED" | "DISQUALIFIED";
    isPassed: boolean;
    score: number;
    totalMarks: number;
    percentage: number;
  };
  timing: {
    startedAt: string;
    submittedAt: string;
    durationSeconds: number;
    durationFormatted: string;
  };
  sections: SectionData[];
  responses: QuestionResponse[];
  proctoring: {
    warningCount: number;
    maxWarnings: number;
    lockReason?: string;
    events: Array<{ id: string; eventType: string; details?: string; timestamp: string }>;
  };
  remarks: Array<{ id: string; adminId: string; action: string; reason?: string; createdAt: string }>;
}

interface CandidateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string | null;
}

export default function CandidateReportModal({ isOpen, onClose, candidateId }: CandidateReportModalProps) {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "responses" | "proctoring" | "remarks">("overview");
  const [newRemark, setNewRemark] = useState("");
  const [savingRemark, setSavingRemark] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !candidateId) return;

    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/v1/candidates/${candidateId}/report`);
        const data = await res.json();
        if (data.success) {
          setReport(data);
        } else {
          setError(data.message || "Failed to load report data.");
        }
      } catch (err: any) {
        setError(err.message || "Network error loading candidate report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [isOpen, candidateId]);

  const handleSaveRemark = async () => {
    if (!candidateId || !newRemark.trim()) return;
    setSavingRemark(true);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/candidates/${candidateId}/remarks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remark: newRemark }),
      });
      const data = await res.json();
      if (data.success) {
        setReport((prev) =>
          prev
            ? {
                ...prev,
                remarks: [
                  {
                    id: data.remark.id,
                    adminId: "admin",
                    action: "REMARK",
                    reason: newRemark,
                    createdAt: new Date().toISOString(),
                  },
                  ...prev.remarks,
                ],
              }
            : null
        );
        setNewRemark("");
      }
    } catch {
      alert("Failed to save remark.");
    } finally {
      setSavingRemark(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto print:bg-white print:p-0">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto relative flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Modal Top Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white">
                Candidate Diagnostic Report & Scorecard
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Niva Bupa Health Insurance Assessment Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 px-3 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-bold text-slate-700">Loading Candidate Report & Section Diagnostics...</p>
          </div>
        ) : error || !report ? (
          <div className="p-12 text-center">
            <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-900">Unable to Load Report</h4>
            <p className="text-xs text-slate-500 mt-1">{error || "Candidate report record not found."}</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Top Candidate Summary Card */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
                    <User className="w-3.5 h-3.5" />
                    Application ID: {report.candidate.applicationId}
                  </div>
                  <h2 className="text-2xl font-black text-white">{report.candidate.name}</h2>
                  <p className="text-xs text-blue-200 mt-1">
                    {report.candidate.email} • {report.candidate.phone}
                  </p>
                  <p className="text-xs text-slate-300 font-medium mt-1">
                    Assessment: <strong>{report.assessment.title}</strong>
                  </p>
                </div>

                {/* Score & Result Pill */}
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <div className="text-center px-3">
                    <span className="block text-xs font-bold text-blue-200 uppercase">Score Marks</span>
                    <span className="text-3xl font-black text-white">
                      {report.result.score} <span className="text-base text-blue-300 font-normal">/ {report.result.totalMarks}</span>
                    </span>
                  </div>

                  <div className="h-10 w-px bg-white/20" />

                  <div className="text-center px-3">
                    <span className="block text-xs font-bold text-blue-200 uppercase">Percentage</span>
                    <span className="text-3xl font-black text-cyan-300">{report.result.percentage}%</span>
                  </div>

                  <div className="h-10 w-px bg-white/20" />

                  <div className="text-center px-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase ${
                        report.result.status === "QUALIFIED"
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                          : report.result.status === "LOCKED"
                          ? "bg-amber-500 text-white"
                          : "bg-rose-500 text-white"
                      }`}
                    >
                      {report.result.status === "QUALIFIED" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {report.result.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timing & Security Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-white/15 text-xs text-blue-100/90 font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>
                    Started: <strong>{new Date(report.timing.startedAt).toLocaleDateString()}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>
                    Duration: <strong>{report.timing.durationFormatted}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>
                    Warnings: <strong>{report.proctoring.warningCount} / {report.proctoring.maxWarnings}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>
                    Pass Benchmark: <strong>{report.assessment.passingPercentage}%</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 space-x-4 print:hidden">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                6-Section Diagnostics
              </button>
              <button
                onClick={() => setActiveTab("responses")}
                className={`pb-3 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "responses"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Question Responses ({report.responses.length})
              </button>
              <button
                onClick={() => setActiveTab("proctoring")}
                className={`pb-3 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "proctoring"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Proctoring Audit ({report.proctoring.events.length})
              </button>
              <button
                onClick={() => setActiveTab("remarks")}
                className={`pb-3 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === "remarks"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                HR Remarks ({report.remarks.length})
              </button>
            </div>

            {/* TAB 1: 6-Section Diagnostics */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                  Section-wise Performance Breakdown
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.sections.map((sec) => (
                    <div
                      key={sec.name}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-300 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-black text-slate-900">{sec.name}</h4>
                        <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {sec.questionRange}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-lg font-black text-slate-900">
                          {sec.score} <span className="text-xs font-normal text-slate-500">/ {sec.totalMarks} Marks</span>
                        </span>
                        <span className="text-sm font-extrabold text-blue-600">{sec.percentage}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            sec.percentage >= 70
                              ? "bg-emerald-500"
                              : sec.percentage >= 50
                              ? "bg-blue-600"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${sec.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Question Responses Breakdown */}
            {activeTab === "responses" && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                  Detailed Question Response Log
                </h3>

                <div className="space-y-3">
                  {report.responses.map((q) => (
                    <div
                      key={q.questionOrder}
                      className={`p-4 rounded-2xl border ${
                        q.isCorrect ? "bg-emerald-50/50 border-emerald-200" : "bg-rose-50/50 border-rose-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="inline-block text-[11px] font-extrabold uppercase px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 mb-1.5">
                            Q{q.questionOrder} • {q.sectionName}
                          </span>
                          <p className="text-xs font-bold text-slate-900 leading-relaxed">{q.questionText}</p>

                          <div className="mt-2.5 space-y-1 text-xs">
                            <p className="text-slate-700">
                              Candidate Answer:{" "}
                              <strong className={q.isCorrect ? "text-emerald-700 font-extrabold" : "text-rose-700 font-extrabold"}>
                                {q.candidateOption || "Not Answered"}
                              </strong>
                            </p>
                            <p className="text-slate-600">
                              Correct Answer: <strong className="text-slate-900 font-extrabold">{q.correctOption}</strong>
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-black uppercase whitespace-nowrap ${
                            q.isCorrect ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                          }`}
                        >
                          {q.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Proctoring Audit Timeline */}
            {activeTab === "proctoring" && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                  Proctoring Violation Audit Logs
                </h3>

                {report.proctoring.events.length === 0 ? (
                  <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-emerald-900">Zero Security Warnings Logged</p>
                    <p className="text-[11px] text-emerald-700">Candidate completed the exam cleanly without any proctoring violations.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {report.proctoring.events.map((evt, idx) => (
                      <div key={evt.id || idx} className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-amber-900 uppercase">{evt.eventType}</span>
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                              {new Date(evt.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          {evt.details && <p className="text-xs text-amber-800 mt-1">{evt.details}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: HR Remarks */}
            {activeTab === "remarks" && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">
                  HR Admin Remarks & Notes
                </h3>

                {/* Remark Input Form */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 print:hidden">
                  <textarea
                    rows={3}
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                    placeholder="Enter HR interview remarks, notes, or verification comments..."
                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    onClick={handleSaveRemark}
                    disabled={savingRemark || !newRemark.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {savingRemark ? "Saving..." : "Save HR Remark"}
                  </button>
                </div>

                {/* Remark List */}
                <div className="space-y-3">
                  {report.remarks.map((rem) => (
                    <div key={rem.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-700">Admin Remark</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(rem.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-900 font-semibold leading-relaxed">{rem.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
