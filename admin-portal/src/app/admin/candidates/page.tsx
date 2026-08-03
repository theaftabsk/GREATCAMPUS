"use client";

import { useState, useEffect } from "react";
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Printer,
  X,
  Mic
} from "lucide-react";

export default function AdminCandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [recommendationFilter, setRecommendationFilter] = useState("ALL");

  // Selected candidate scorecard modal
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [simScoreInput, setSimScoreInput] = useState(0);
  const [simFeedbackInput, setSimFeedbackInput] = useState("");

  const fetchCandidates = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/candidates");
      const data = await res.json();
      if (data.success) setCandidates(data.candidates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSaveSimulationGrade = async () => {
    if (!selectedCandidate) return;

    try {
      const res = await fetch("http://localhost:4000/api/v1/candidates/grade-simulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: selectedCandidate.id,
          score: simScoreInput,
          feedback: simFeedbackInput,
          gradedBy: "HR Admin",
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Simulation evaluation saved successfully!");
        fetchCandidates();
        setSelectedCandidate(data.candidate);
      }
    } catch (err) {
      alert("Failed to save simulation grade");
    }
  };

  const handlePrintScorecard = () => {
    window.print();
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.referenceId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      recommendationFilter === "ALL" || c.hiringRecommendation === recommendationFilter;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Candidate Evaluation Directory</h1>
          <p className="text-sm text-slate-500 mt-0.5">Inspect full test answers, simulation responses, anti-cheat flags, and printable scorecards.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search candidate name or ref ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none w-60"
            />
          </div>

          <select
            value={recommendationFilter}
            onChange={(e) => setRecommendationFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="ALL">All Recommendations</option>
            <option value="Strong Hire">Strong Hire</option>
            <option value="Hire">Hire</option>
            <option value="Maybe">Maybe</option>
            <option value="Reject">Reject</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold uppercase text-slate-500">
              <tr>
                <th className="py-4 px-6">Candidate Details</th>
                <th className="py-4 px-6">Ref ID</th>
                <th className="py-4 px-6">Score</th>
                <th className="py-4 px-6">Recommendation</th>
                <th className="py-4 px-6">Anti-Cheat Flags</th>
                <th className="py-4 px-6">Simulation Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                    No candidate records submitted yet. As candidates complete tests, they appear here live!
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.email} • {c.phone}</p>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-700 font-bold">{c.referenceId}</td>
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-slate-900 text-base">{c.percentage}%</span>
                      <span className="text-xs text-slate-400 block">({c.score}/{c.totalPossibleScore})</span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${
                          c.hiringRecommendation === "Strong Hire"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : c.hiringRecommendation === "Hire"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : c.hiringRecommendation === "Maybe"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {c.hiringRecommendation}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {c.tabSwitches > 0 || c.fullscreenExits > 0 ? (
                        <span className="inline-flex items-center space-x-1 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-lg text-xs font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Tab: {c.tabSwitches} | Fullscreen: {c.fullscreenExits}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Clean Session</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs font-semibold">
                      {c.simulation ? (
                        c.simulation.score > 0 ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            Graded ({c.simulation.score}/30)
                          </span>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                            Pending HR Grade
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400">No Response</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedCandidate(c);
                          setSimScoreInput(c.simulation?.score || 0);
                          setSimFeedbackInput(c.simulation?.feedback || "");
                        }}
                        className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-1.5 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Scorecard</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative print:max-h-none print:shadow-none print:border-none print:rounded-none">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 print:hidden">
              <span className="text-xs font-extrabold uppercase text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
                Official Candidate Assessment Scorecard
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrintScorecard}
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF Report</span>
                </button>

                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{selectedCandidate.name}</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Email: {selectedCandidate.email} | Mobile: {selectedCandidate.phone} | Ref ID: <strong className="text-slate-800">{selectedCandidate.referenceId}</strong>
                  </p>
                </div>

                <div className="mt-4 sm:mt-0 text-left sm:text-right">
                  <span className="text-3xl font-black text-blue-600">{selectedCandidate.percentage}%</span>
                  <span className="text-xs text-slate-400 block font-semibold">({selectedCandidate.score}/{selectedCandidate.totalPossibleScore} Marks)</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">Automated Recommendation</span>
                  <p className="text-lg font-extrabold text-slate-900">{selectedCandidate.hiringRecommendation}</p>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase border ${
                    selectedCandidate.hiringRecommendation === "Strong Hire"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : selectedCandidate.hiringRecommendation === "Hire"
                      ? "bg-blue-100 text-blue-800 border-blue-300"
                      : selectedCandidate.hiringRecommendation === "Maybe"
                      ? "bg-amber-100 text-amber-800 border-amber-300"
                      : "bg-red-100 text-red-800 border-red-300"
                  }`}
                >
                  {selectedCandidate.hiringRecommendation}
                </span>
              </div>

              {selectedCandidate.simulation && (
                <div className="p-6 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-4">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
                    <Mic className="w-5 h-5 text-indigo-600" />
                    <span>Section 7: Sales Simulation Evaluation</span>
                  </h3>

                  {selectedCandidate.simulation.textResponse && (
                    <div className="bg-white p-4 rounded-xl border border-indigo-100 text-sm text-slate-800 italic leading-relaxed">
                      &quot;{selectedCandidate.simulation.textResponse}&quot;
                    </div>
                  )}

                  <div className="pt-2 print:hidden">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase text-slate-700">HR Score out of 30 Marks:</label>
                      <span className="font-extrabold text-indigo-700 text-base">{simScoreInput} / 30 Marks</span>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={30}
                      value={simScoreInput}
                      onChange={(e) => setSimScoreInput(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />

                    <textarea
                      rows={2}
                      placeholder="Add HR feedback for interview committee..."
                      value={simFeedbackInput}
                      onChange={(e) => setSimFeedbackInput(e.target.value)}
                      className="w-full mt-3 p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none"
                    ></textarea>

                    <button
                      onClick={handleSaveSimulationGrade}
                      className="mt-3 px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      Save Simulation Grade & Feedback
                    </button>
                  </div>
                </div>
              )}

              <div className="p-4 bg-red-50/50 border border-red-200 rounded-2xl text-xs">
                <h4 className="font-bold text-red-900 mb-1 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Proctoring & Anti-Cheat Audit Logs</span>
                </h4>
                <p className="text-red-700">
                  Tab Switches Detected: <strong>{selectedCandidate.tabSwitches}</strong> | Fullscreen Exits: <strong>{selectedCandidate.fullscreenExits}</strong>
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
