"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  X
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Question CMS Modal & View Modal
  const [showQModal, setShowQModal] = useState(false);
  const [viewingQ, setViewingQ] = useState<any | null>(null);
  const [editingQ, setEditingQ] = useState<any | null>(null);
  const [qFormData, setQFormData] = useState<any>({
    section: "communication",
    sectionName: "Communication & Customer Handling",
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    marks: 1,
    difficulty: "Medium",
  });

  // Question CMS Filters & Search
  const [qSectionFilter, setQSectionFilter] = useState("ALL");
  const [qSearchTerm, setQSearchTerm] = useState("");

  const fetchQuestions = async () => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/questions`);
      const data = await res.json();
      if (data.success) setQuestions(data.questions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const baseUrl = getApiBaseUrl();
      const url = `${baseUrl}/api/v1/questions`;
      const method = editingQ ? "PUT" : "POST";
      const body = editingQ ? { ...qFormData, id: editingQ.id } : qFormData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setShowQModal(false);
        setEditingQ(null);
        fetchQuestions();
      }
    } catch (err) {
      alert("Failed to save question");
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/questions?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchQuestions();
    } catch (err) {
      alert("Failed to delete question");
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSec = qSectionFilter === "ALL" || q.section === qSectionFilter;
    const matchesSearch =
      q.question.toLowerCase().includes(qSearchTerm.toLowerCase()) ||
      q.sectionName.toLowerCase().includes(qSearchTerm.toLowerCase());
    return matchesSec && matchesSearch;
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
          <h1 className="text-2xl font-extrabold text-slate-900">Question Bank CMS & Assessment Demo ({questions.length} Qs)</h1>
          <p className="text-sm text-slate-500 mt-0.5">Filter, search, inspect options, edit, or add new questions dynamically.</p>
        </div>

        <button
          onClick={() => {
            setEditingQ(null);
            setQFormData({
              section: "communication",
              sectionName: "Communication & Customer Handling",
              question: "",
              optionA: "",
              optionB: "",
              optionC: "",
              optionD: "",
              correctAnswer: "A",
              marks: 1,
              difficulty: "Medium",
            });
            setShowQModal(true);
          }}
          className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Question</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "ALL", label: `All Sections (${questions.length})` },
            { id: "communication", label: "1. Communication" },
            { id: "english", label: "2. English" },
            { id: "reasoning", label: "3. Reasoning" },
            { id: "maths", label: "4. Maths" },
            { id: "banking", label: "5. Banking" },
            { id: "sales", label: "6. Sales" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setQSectionFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                qSectionFilter === tab.id
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search questions..."
            value={qSearchTerm}
            onChange={(e) => setQSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 outline-none w-56 focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold uppercase text-slate-500">
              <tr>
                <th className="py-4 px-6">Q#</th>
                <th className="py-4 px-6">Section</th>
                <th className="py-4 px-6">Question Text</th>
                <th className="py-4 px-6">Correct Answer</th>
                <th className="py-4 px-6">Difficulty</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredQuestions.map((q, idx) => (
                <tr key={q.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs font-bold text-slate-400">Q{idx + 1}</td>
                  <td className="py-4 px-6 text-xs font-bold text-blue-700 shrink-0">{q.sectionName}</td>
                  <td className="py-4 px-6 text-slate-900 font-semibold max-w-md truncate">
                    {q.question}
                  </td>
                  <td className="py-4 px-6 font-extrabold text-emerald-700">
                    Option {q.correctAnswer}
                  </td>
                  <td className="py-4 px-6 text-xs font-semibold text-slate-600">{q.difficulty || "Medium"}</td>
                  <td className="py-4 px-6 text-right flex items-center justify-end space-x-2">
                    <button
                      onClick={() => setViewingQ(q)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Inspect Question Demo"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingQ(q);
                        setQFormData(q);
                        setShowQModal(true);
                      }}
                      className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                      title="Edit Question"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.id || "")}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewingQ && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl p-8 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <span className="text-xs font-extrabold uppercase text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
                {viewingQ.sectionName}
              </span>
              <button onClick={() => setViewingQ(null)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900 leading-relaxed mb-6">
              {viewingQ.question}
            </h3>

            <div className="space-y-3">
              {[
                { key: "A", text: viewingQ.optionA },
                { key: "B", text: viewingQ.optionB },
                { key: "C", text: viewingQ.optionC },
                { key: "D", text: viewingQ.optionD },
              ].map((opt) => {
                const isCorrect = viewingQ.correctAnswer === opt.key;
                return (
                  <div
                    key={opt.key}
                    className={`p-3.5 rounded-xl border flex items-center space-x-3 text-sm font-medium ${
                      isCorrect
                        ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCorrect ? "bg-emerald-600 text-white" : "bg-slate-300 text-slate-600"
                      }`}
                    >
                      {opt.key}
                    </span>
                    <span>{opt.text}</span>
                    {isCorrect && (
                      <span className="ml-auto text-xs font-extrabold text-emerald-700 uppercase bg-emerald-200/60 px-2 py-0.5 rounded">
                        Correct Answer
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Difficulty: {viewingQ.difficulty || "Medium"}</span>
              <button
                onClick={() => {
                  setEditingQ(viewingQ);
                  setQFormData(viewingQ);
                  setViewingQ(null);
                  setShowQModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
              >
                Edit Question
              </button>
            </div>
          </div>
        </div>
      )}

      {showQModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl p-8 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-xl font-extrabold text-slate-900">
                {editingQ ? "Edit Question" : "Add New Assessment Question"}
              </h2>
              <button onClick={() => setShowQModal(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Section</label>
                <select
                  value={qFormData.section}
                  onChange={(e) => {
                    const sec = e.target.value;
                    let secName = "Communication & Customer Handling";
                    if (sec === "english") secName = "Basic English";
                    else if (sec === "reasoning") secName = "Mental Ability & Reasoning";
                    else if (sec === "maths") secName = "Basic Maths & Numerical Ability";
                    else if (sec === "banking") secName = "Banking & Financial Awareness";
                    else if (sec === "sales") secName = "Sales Orientation & Situational Judgement";

                    setQFormData({ ...qFormData, section: sec, sectionName: secName });
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium outline-none"
                >
                  <option value="communication">Communication & Customer Handling</option>
                  <option value="english">Basic English</option>
                  <option value="reasoning">Mental Ability & Reasoning</option>
                  <option value="maths">Basic Maths & Numerical Ability</option>
                  <option value="banking">Banking & Financial Awareness</option>
                  <option value="sales">Sales Orientation & Situational Judgement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Question Text</label>
                <textarea
                  rows={3}
                  required
                  value={qFormData.question}
                  onChange={(e) => setQFormData({ ...qFormData, question: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Option A</label>
                  <input
                    type="text"
                    required
                    value={qFormData.optionA}
                    onChange={(e) => setQFormData({ ...qFormData, optionA: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Option B</label>
                  <input
                    type="text"
                    required
                    value={qFormData.optionB}
                    onChange={(e) => setQFormData({ ...qFormData, optionB: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Option C</label>
                  <input
                    type="text"
                    required
                    value={qFormData.optionC}
                    onChange={(e) => setQFormData({ ...qFormData, optionC: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Option D</label>
                  <input
                    type="text"
                    required
                    value={qFormData.optionD}
                    onChange={(e) => setQFormData({ ...qFormData, optionD: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Correct Answer Key</label>
                  <select
                    value={qFormData.correctAnswer}
                    onChange={(e) => setQFormData({ ...qFormData, correctAnswer: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Difficulty Level</label>
                  <select
                    value={qFormData.difficulty}
                    onChange={(e) => setQFormData({ ...qFormData, difficulty: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowQModal(false)}
                  className="px-5 py-2.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 shadow-sm"
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
