"use client";

import { useState, useEffect } from "react";
import {
  BookOpen, Plus, AlertTriangle, CheckCircle2, Layers, Grid,
  Clock, Award, ShieldAlert, Trash2, Edit2, ChevronRight, RefreshCw
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

interface SubjectSection {
  id: string;
  name: string;
  questionsToAsk: number;
  _count?: { questions: number };
}

interface AssessmentSubject {
  id: string;
  name: string;
  sections: SubjectSection[];
}

interface AssessmentItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  durationMins: number;
  passingPercentage: number;
  maxProctorWarnings: number;
  status: string;
  subjects: AssessmentSubject[];
  stats: {
    subjectCount: number;
    sectionCount: number;
    totalPoolQuestions: number;
    totalAttemptQuestions: number;
    isValid: boolean;
    validationErrors: Array<{ sectionName: string; required: number; available: number }>;
  };
}

export default function AdminAssessmentsPage() {
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentItem | null>(null);

  // Modals
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);

  // Form State
  const [examForm, setExamForm] = useState({ name: "", description: "", durationMins: 60, passingPercentage: 50, maxProctorWarnings: 3 });
  const [subjectName, setSubjectName] = useState("");
  const [sectionForm, setSectionForm] = useState({ subjectId: "", name: "", questionsToAsk: 5 });

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/assessments`);
      const data = await res.json();
      if (data.success && Array.isArray(data.assessments)) {
        setAssessments(data.assessments);
        if (data.assessments.length > 0 && !selectedAssessment) {
          setSelectedAssessment(data.assessments[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load assessments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/assessments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateExamModal(false);
        setExamForm({ name: "", description: "", durationMins: 60, passingPercentage: 50, maxProctorWarnings: 3 });
        loadAssessments();
      }
    } catch (err) {
      console.error("Create exam failed:", err);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssessment || !subjectName) return;
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/assessments/${selectedAssessment.id}/subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: subjectName }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddSubjectModal(false);
        setSubjectName("");
        loadAssessments();
      }
    } catch (err) {
      console.error("Add subject failed:", err);
    }
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionForm.subjectId || !sectionForm.name) return;
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/assessments/subjects/${sectionForm.subjectId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: sectionForm.name, questionsToAsk: sectionForm.questionsToAsk }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddSectionModal(false);
        setSectionForm({ subjectId: "", name: "", questionsToAsk: 5 });
        loadAssessments();
      }
    } catch (err) {
      console.error("Add section failed:", err);
    }
  };

  const handleDeleteAssessment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Assessment Exam?")) return;
    try {
      const baseUrl = getApiBaseUrl();
      await fetch(`${baseUrl}/api/v1/assessments/${id}`, { method: "DELETE" });
      setSelectedAssessment(null);
      loadAssessments();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-blue-600" />
            100% Dynamic Assessment Builder
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Manage Exams, Subjects, Sections, Question Sampling Rules, and Proctoring Limits dynamically.
          </p>
        </div>

        <button
          onClick={() => setShowCreateExamModal(true)}
          className="inline-flex items-center space-x-2 bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Exam</span>
        </button>
      </div>

      {/* Assessment Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((ass) => {
          const isSelected = selectedAssessment?.id === ass.id;
          return (
            <div
              key={ass.id}
              onClick={() => setSelectedAssessment(ass)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer bg-white relative ${
                isSelected
                  ? "border-blue-600 ring-2 ring-blue-500/20 shadow-xl"
                  : "border-slate-200 hover:border-slate-300 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-extrabold uppercase bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-md">
                  {ass.status} EXAM
                </span>

                {/* Validation Status Badge */}
                {ass.stats.isValid ? (
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Valid Pool
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Pool Incomplete
                  </span>
                )}
              </div>

              <h3 className="text-base font-extrabold text-slate-900 mb-1">{ass.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4">{ass.description || "No description provided."}</p>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Subjects / Sections</span>
                  <span className="font-bold text-slate-800">{ass.stats.subjectCount} Sub / {ass.stats.sectionCount} Sec</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Attempt Questions</span>
                  <span className="font-bold text-blue-600">{ass.stats.totalAttemptQuestions} Qs (from {ass.stats.totalPoolQuestions})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                  <span className="font-bold text-slate-800">{ass.durationMins} Mins</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Passing Mark</span>
                  <span className="font-bold text-slate-800">{ass.passingPercentage}%</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Selected Assessment Detailed Inspector & Builder */}
      {selectedAssessment && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">

          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-extrabold text-slate-900">{selectedAssessment.name}</h2>
                <button
                  onClick={() => handleDeleteAssessment(selectedAssessment.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Delete Exam"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">Configure subjects, sections, and questions to ask for this exam paper.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddSubjectModal(true)}
                className="inline-flex items-center space-x-2 bg-slate-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-slate-800 transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Subject</span>
              </button>
            </div>
          </div>

          {/* Validation Error Warnings */}
          {selectedAssessment.stats.validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-red-700 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>⚠ Question Pool Incomplete Warning (Exam cannot be started by candidate):</span>
              </div>
              <ul className="list-disc list-inside text-xs text-red-600 space-y-1">
                {selectedAssessment.stats.validationErrors.map((err, idx) => (
                  <li key={idx}>
                    <strong>{err.sectionName}</strong>: Requires {err.required} questions, but only {err.available} available in pool.
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Subjects Hierarchy List */}
          <div className="space-y-6">
            {selectedAssessment.subjects.map((sub, sIdx) => (
              <div key={sub.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                      {sIdx + 1}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900">{sub.name}</h3>
                  </div>

                  <button
                    onClick={() => {
                      setSectionForm({ subjectId: sub.id, name: "", questionsToAsk: 5 });
                      setShowAddSectionModal(true);
                    }}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Section</span>
                  </button>
                </div>

                {/* Sections List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sub.sections.map((sec, secIdx) => {
                    const poolCount = sec._count?.questions || 0;
                    const isSufficient = poolCount >= sec.questionsToAsk;

                    return (
                      <div key={sec.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">
                            Sec {secIdx + 1}: {sec.name}
                          </span>
                          {isSufficient ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                              OK ({poolCount}/{sec.questionsToAsk})
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                              Shortage ({poolCount}/{sec.questionsToAsk})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                          <span>Pool: <strong>{poolCount} Qs</strong></span>
                          <span>Candidate Gets: <strong className="text-blue-600">{sec.questionsToAsk} Qs</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* CREATE EXAM MODAL */}
      {showCreateExamModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900">Create New Assessment Exam</h2>

            <form onSubmit={handleCreateExam} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Exam Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bank Manager Assessment"
                  value={examForm.name}
                  onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  placeholder="Exam description..."
                  value={examForm.description}
                  onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    required
                    value={examForm.durationMins}
                    onChange={(e) => setExamForm({ ...examForm, durationMins: parseInt(e.target.value) || 60 })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Passing Score %</label>
                  <input
                    type="number"
                    required
                    value={examForm.passingPercentage}
                    onChange={(e) => setExamForm({ ...examForm, passingPercentage: parseFloat(e.target.value) || 50 })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Max Warnings</label>
                  <input
                    type="number"
                    required
                    value={examForm.maxProctorWarnings}
                    onChange={(e) => setExamForm({ ...examForm, maxProctorWarnings: parseInt(e.target.value) || 3 })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateExamModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-md"
                >
                  Create Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SUBJECT MODAL */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900">Add New Subject</h2>

            <form onSubmit={handleAddSubject} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subject 1: Banking & Financial Awareness"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-md"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SECTION MODAL */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900">Add New Section</h2>

            <form onSubmit={handleAddSection} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Section Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. General Banking"
                  value={sectionForm.name}
                  onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Questions to Ask Candidate (Random Draw) *</label>
                <input
                  type="number"
                  required
                  value={sectionForm.questionsToAsk}
                  onChange={(e) => setSectionForm({ ...sectionForm, questionsToAsk: parseInt(e.target.value) || 5 })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-md"
                >
                  Add Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
