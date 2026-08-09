"use client";

import { useState, useEffect } from "react";
import {
  Search, Plus, Trash2, Edit, Eye, X, BookOpen, Layers, CheckCircle2, RefreshCw
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

interface AssessmentItem {
  id: string;
  name: string;
  subjects: Array<{
    id: string;
    name: string;
    sections: Array<{
      id: string;
      name: string;
    }>;
  }>;
}

export default function AdminQuestionsPage() {
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Question Modal
  const [showQModal, setShowQModal] = useState(false);
  const [editingQ, setEditingQ] = useState<any | null>(null);
  const [qFormData, setQFormData] = useState({
    sectionId: "",
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    marks: 1,
  });

  const loadAssessments = async () => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/assessments`);
      const data = await res.json();
      if (data.success && Array.isArray(data.assessments)) {
        setAssessments(data.assessments);
        if (data.assessments.length > 0 && !selectedAssessmentId) {
          setSelectedAssessmentId(data.assessments[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load assessments:", err);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const baseUrl = getApiBaseUrl();
      let url = `${baseUrl}/api/v1/questions`;
      const queryParams: string[] = [];

      if (selectedSectionId) queryParams.push(`sectionId=${selectedSectionId}`);
      else if (selectedSubjectId) queryParams.push(`subjectId=${selectedSubjectId}`);
      else if (selectedAssessmentId) queryParams.push(`assessmentId=${selectedAssessmentId}`);

      if (queryParams.length > 0) url += `?${queryParams.join("&")}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setQuestions(data.questions || []);
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
    fetchQuestions();
  }, [selectedAssessmentId, selectedSubjectId, selectedSectionId]);

  const activeAssessment = assessments.find((a) => a.id === selectedAssessmentId);
  const activeSubjects = activeAssessment?.subjects || [];
  const activeSubject = activeSubjects.find((s) => s.id === selectedSubjectId);
  const activeSections = activeSubject?.sections || [];

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qFormData.sectionId || !qFormData.question) {
      alert("Please select a section and enter question text.");
      return;
    }

    try {
      const baseUrl = getApiBaseUrl();
      const url = editingQ ? `${baseUrl}/api/v1/questions/${editingQ.id}` : `${baseUrl}/api/v1/questions`;
      const method = editingQ ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(qFormData),
      });

      const data = await res.json();
      if (data.success) {
        setShowQModal(false);
        setEditingQ(null);
        fetchQuestions();
      }
    } catch (err) {
      alert("Failed to save question.");
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/questions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchQuestions();
    } catch (err) {
      alert("Failed to delete question.");
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-blue-600" />
            Question Pool Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Filter questions by Exam ➔ Subject ➔ Section and manage options & correct answers.
          </p>
        </div>

        <button
          onClick={() => {
            const firstSectionId = activeSections[0]?.id || activeSubjects[0]?.sections[0]?.id || "";
            setEditingQ(null);
            setQFormData({
              sectionId: selectedSectionId || firstSectionId,
              question: "",
              optionA: "",
              optionB: "",
              optionC: "",
              optionD: "",
              correctAnswer: "A",
              marks: 1,
            });
            setShowQModal(true);
          }}
          className="inline-flex items-center space-x-2 bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </button>
      </div>

      {/* Hierarchical Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="font-bold text-slate-700 block mb-1">Select Exam / Assessment</label>
          <select
            value={selectedAssessmentId}
            onChange={(e) => {
              setSelectedAssessmentId(e.target.value);
              setSelectedSubjectId("");
              setSelectedSectionId("");
            }}
            className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 outline-none"
          >
            {assessments.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Filter Subject</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              setSelectedSectionId("");
            }}
            className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 outline-none"
          >
            <option value="">All Subjects</option>
            {activeSubjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Filter Section</label>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-800 outline-none"
          >
            <option value="">All Sections</option>
            {activeSections.map((sec) => (
              <option key={sec.id} value={sec.id}>{sec.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Search Question Text</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-800 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Questions Table / Cards */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-bold mt-2">Loading Question Pool...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-500 space-y-3">
          <Layers className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-bold">No questions found matching selected criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => (
            <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    Q{idx + 1}
                  </span>
                  <span className="text-xs font-extrabold text-slate-800">
                    {q.section?.subject?.name || "Subject"} ➔ <span className="text-blue-600">{q.section?.name || "Section"}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingQ(q);
                      setQFormData({
                        sectionId: q.sectionId,
                        question: q.question,
                        optionA: q.optionA,
                        optionB: q.optionB,
                        optionC: q.optionC,
                        optionD: q.optionD,
                        correctAnswer: q.correctAnswer,
                        marks: q.marks,
                      });
                      setShowQModal(true);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>

                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900">{q.question}</h4>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {[
                  { k: "A", v: q.optionA },
                  { k: "B", v: q.optionB },
                  { k: "C", v: q.optionC },
                  { k: "D", v: q.optionD },
                ].map((opt) => {
                  const isCorrect = q.correctAnswer === opt.k;
                  return (
                    <div
                      key={opt.k}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        isCorrect
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <span><strong>{opt.k}:</strong> {opt.v}</span>
                      {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ADD/EDIT QUESTION MODAL */}
      {showQModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900">
                {editingQ ? "Edit Question" : "Add Question to Pool"}
              </h2>
              <button onClick={() => setShowQModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Section *</label>
                <select
                  required
                  value={qFormData.sectionId}
                  onChange={(e) => setQFormData({ ...qFormData, sectionId: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
                >
                  <option value="">-- Select Section --</option>
                  {activeSubjects.flatMap((s) =>
                    s.sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {s.name} ➔ {sec.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Question Text *</label>
                <textarea
                  required
                  placeholder="Type the full question statement..."
                  value={qFormData.question}
                  onChange={(e) => setQFormData({ ...qFormData, question: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Option A *</label>
                  <input
                    type="text"
                    required
                    value={qFormData.optionA}
                    onChange={(e) => setQFormData({ ...qFormData, optionA: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Option B *</label>
                  <input
                    type="text"
                    required
                    value={qFormData.optionB}
                    onChange={(e) => setQFormData({ ...qFormData, optionB: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Option C *</label>
                  <input
                    type="text"
                    required
                    value={qFormData.optionC}
                    onChange={(e) => setQFormData({ ...qFormData, optionC: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Option D *</label>
                  <input
                    type="text"
                    required
                    value={qFormData.optionD}
                    onChange={(e) => setQFormData({ ...qFormData, optionD: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Correct Option Answer *</label>
                <select
                  value={qFormData.correctAnswer}
                  onChange={(e) => setQFormData({ ...qFormData, correctAnswer: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold outline-none"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowQModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-md"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
