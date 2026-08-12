"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search, Edit2, X, BookOpen, CheckCircle2, RefreshCw, AlertCircle, Hash
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  marks: number;
  status: string;
  createdAt: string;
}

const emptyForm = {
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctAnswer: "A",
  marks: 1,
};

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [showModal, setShowModal] = useState(false);
  const [editingQ, setEditingQ] = useState<Question | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/questions`);
      const data = await res.json();
      if (data.success) setQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const filtered = questions.filter((q) =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset to page 1 whenever search changes
  const handleSearch = (val: string) => { setSearchTerm(val); setCurrentPage(1); };

  const openEdit = (q: Question) => {
    setEditingQ(q);
    setFormData({
      question: q.question,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      marks: q.marks,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    const { question, optionA, optionB, optionC, optionD, correctAnswer } = formData;
    if (!question.trim() || !optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      setFormError("All fields are required.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const baseUrl = getApiBaseUrl();
      if (editingQ) {
        await fetch(`${baseUrl}/api/v1/questions/${editingQ.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      setShowModal(false);
      await fetchQuestions();
    } catch (err: any) {
      setFormError(err.message || "Failed to save question.");
    } finally {
      setSaving(false);
    }
  };

  const optionColor: Record<string, string> = {
    A: "#6366f1", B: "#0ea5e9", C: "#f59e0b", D: "#10b981",
  };

  return (
    <div className="qp-page">
      {/* Header */}
      <div className="qp-header">
        <div className="qp-header-left">
          <div className="qp-header-icon"><BookOpen size={20} /></div>
          <div>
            <h1 className="qp-title">Question Bank</h1>
            <p className="qp-subtitle">
              {questions.length} questions · All assessments share this fixed pool
            </p>
          </div>
        </div>
        <div className="qp-header-actions">
          <button className="qp-refresh-btn" onClick={fetchQuestions} title="Refresh">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="qp-search-wrap">
        <Search size={15} className="qp-search-icon" />
        <input
          className="qp-search"
          placeholder="Search questions…"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchTerm && (
          <button className="qp-search-clear" onClick={() => handleSearch("")}>
            <X size={13} />
          </button>
        )}
      </div>

      {/* Question List */}
      {loading ? (
        <div className="qp-loading">Loading questions…</div>
      ) : filtered.length === 0 ? (
        <div className="qp-empty">
          <BookOpen size={36} style={{ opacity: 0.3, display: "block", margin: "0 auto 12px" }} />
          <p>{searchTerm ? "No questions match your search." : "No questions in the question bank yet."}</p>
          {!searchTerm && null}
        </div>
      ) : (
        <>
          <div className="qp-list">
            {paginated.map((q) => (
              <div key={q.id} className="qp-card">
                <div className="qp-card-top">
                  <div className="qp-card-num">
                    <Hash size={11} /> {questions.indexOf(q) + 1}
                  </div>
                  <div className="qp-card-actions">
                    <button className="qp-btn-edit" onClick={() => openEdit(q)}>
                      <Edit2 size={13} /> Edit
                    </button>
                  </div>
                </div>

                <p className="qp-question-text">{q.question}</p>

                <div className="qp-options">
                  {(["A", "B", "C", "D"] as const).map((opt) => (
                    <div
                      key={opt}
                      className={`qp-option ${q.correctAnswer === opt ? "qp-option--correct" : ""}`}
                      style={q.correctAnswer === opt ? { borderColor: optionColor[opt] } : {}}
                    >
                      <span className="qp-opt-label" style={{ background: optionColor[opt] }}>{opt}</span>
                      <span className="qp-opt-text">{q[`option${opt}` as keyof Question] as string}</span>
                      {q.correctAnswer === opt && (
                        <CheckCircle2 size={14} className="qp-correct-icon" style={{ color: optionColor[opt] }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="qp-pagination">
              <button
                className="qp-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <div className="qp-page-info">
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                <span className="qp-page-count">({filtered.length} questions)</span>
              </div>
              <button
                className="qp-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div
          className="qp-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="qp-modal">
            <div className="qp-modal-header">
            <h2>Edit Question</h2>
              <button className="qp-modal-close" onClick={() => setShowModal(false)}>
                <X size={17} />
              </button>
            </div>

            <div className="qp-modal-body">
              {formError && (
                <div className="qp-form-error"><AlertCircle size={14} /> {formError}</div>
              )}

              <div className="qp-form-group">
                <label>Question Text *</label>
                <textarea
                  rows={3}
                  placeholder="Enter the question…"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="qp-form-input qp-form-textarea"
                />
              </div>

              {(["A", "B", "C", "D"] as const).map((opt) => (
                <div key={opt} className="qp-form-group">
                  <label>
                    <span className="qp-opt-label-sm" style={{ background: optionColor[opt] }}>{opt}</span>
                    Option {opt} *
                  </label>
                  <input
                    type="text"
                    placeholder={`Option ${opt}…`}
                    value={formData[`option${opt}` as keyof typeof formData] as string}
                    onChange={(e) => setFormData({ ...formData, [`option${opt}`]: e.target.value })}
                    className="qp-form-input"
                  />
                </div>
              ))}

              <div className="qp-form-row">
                <div className="qp-form-group">
                  <label>Correct Answer *</label>
                  <select
                    value={formData.correctAnswer}
                    onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                    className="qp-form-input"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div className="qp-form-group">
                  <label>Marks</label>
                  <input
                    type="number" min={0.5} max={5} step={0.5}
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
                    className="qp-form-input"
                  />
                </div>
              </div>
            </div>

            <div className="qp-modal-footer">
              <button className="qp-modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="qp-modal-save" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .qp-page { padding: 24px; max-width: 900px; margin: 0 auto; }
        .qp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .qp-header-left { display: flex; align-items: center; gap: 14px; }
        .qp-header-icon { width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg,#6366f1,#818cf8); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
        .qp-title { font-size: 1.35rem; font-weight: 700; color: #e2e8f0; margin: 0; }
        .qp-subtitle { font-size: 0.8rem; color: #64748b; margin: 2px 0 0; }
        .qp-header-actions { display: flex; gap: 8px; align-items: center; }
        .qp-refresh-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; border-radius: 8px; padding: 8px; cursor: pointer; display: flex; align-items: center; }
        .qp-add-btn { background: linear-gradient(135deg,#6366f1,#818cf8); border: none; color: #fff; border-radius: 10px; padding: 9px 16px; font-size: 0.86rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; }

        .qp-search-wrap { position: relative; margin-bottom: 20px; }
        .qp-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #64748b; }
        .qp-search { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 36px; color: #e2e8f0; font-size: 0.88rem; outline: none; box-sizing: border-box; }
        .qp-search:focus { border-color: rgba(99,102,241,0.5); }
        .qp-search-clear { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #64748b; cursor: pointer; display: flex; align-items: center; padding: 2px; }

        .qp-loading { text-align: center; padding: 60px; color: #64748b; font-size: 0.9rem; }
        .qp-empty { text-align: center; padding: 60px 20px; color: #64748b; }

        .qp-list { display: flex; flex-direction: column; gap: 12px; }

        .qp-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; }
        .qp-card-top { display: flex; justify-content: space-between; align-items: center; }
        .qp-card-num { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; font-weight: 700; color: #6366f1; background: rgba(99,102,241,0.1); border-radius: 6px; padding: 3px 8px; }
        .qp-card-actions { display: flex; gap: 7px; }
        .qp-btn-edit { display: flex; align-items: center; gap: 4px; font-size: 0.74rem; font-weight: 600; padding: 5px 10px; border-radius: 7px; border: 1px solid rgba(99,102,241,0.3); background: rgba(99,102,241,0.1); color: #818cf8; cursor: pointer; }
        .qp-btn-delete { display: flex; align-items: center; gap: 4px; font-size: 0.74rem; font-weight: 600; padding: 5px 10px; border-radius: 7px; border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); color: #f87171; cursor: pointer; }

        .qp-question-text { font-size: 0.9rem; color: #cbd5e1; line-height: 1.5; margin: 0; }

        .qp-options { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .qp-option { display: flex; align-items: flex-start; gap: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 9px; padding: 8px 10px; position: relative; }
        .qp-option--correct { background: rgba(99,102,241,0.06); }
        .qp-opt-label { font-size: 0.7rem; font-weight: 700; color: #fff; border-radius: 5px; padding: 2px 6px; flex-shrink: 0; }
        .qp-opt-text { font-size: 0.8rem; color: #94a3b8; line-height: 1.4; flex: 1; }
        .qp-correct-icon { position: absolute; top: 8px; right: 8px; flex-shrink: 0; }

        /* Modal */
        .qp-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; backdrop-filter: blur(4px); }
        .qp-modal { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; }
        .qp-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 22px 14px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .qp-modal-header h2 { font-size: 1.05rem; font-weight: 700; color: #e2e8f0; margin: 0; }
        .qp-modal-close { background: none; border: none; color: #64748b; cursor: pointer; padding: 4px; border-radius: 6px; display: flex; align-items: center; }
        .qp-modal-body { padding: 18px 22px; display: flex; flex-direction: column; gap: 12px; }
        .qp-form-group { display: flex; flex-direction: column; gap: 5px; }
        .qp-form-group label { font-size: 0.78rem; font-weight: 600; color: #94a3b8; display: flex; align-items: center; gap: 6px; }
        .qp-form-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; padding: 9px 12px; color: #e2e8f0; font-size: 0.86rem; outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
        .qp-form-input:focus { border-color: rgba(99,102,241,0.5); }
        .qp-form-textarea { resize: vertical; font-family: inherit; }
        .qp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .qp-opt-label-sm { font-size: 0.67rem; font-weight: 700; color: #fff; border-radius: 4px; padding: 1px 5px; }
        .qp-form-error { display: flex; align-items: center; gap: 7px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; padding: 9px 12px; font-size: 0.8rem; color: #f87171; }
        .qp-modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 22px; border-top: 1px solid rgba(255,255,255,0.08); }
        .qp-modal-cancel { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; border-radius: 9px; padding: 8px 16px; font-size: 0.86rem; cursor: pointer; }
        .qp-modal-save { background: linear-gradient(135deg,#6366f1,#818cf8); border: none; color: #fff; border-radius: 9px; padding: 8px 18px; font-size: 0.86rem; font-weight: 600; cursor: pointer; }
        .qp-modal-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .qp-pagination { display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 24px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.07); }
        .qp-page-btn { background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3); color: #818cf8; border-radius: 9px; padding: 8px 16px; font-size: 0.84rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .qp-page-btn:hover:not(:disabled) { background: rgba(99,102,241,0.2); }
        .qp-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .qp-page-info { font-size: 0.84rem; color: #94a3b8; text-align: center; }
        .qp-page-info strong { color: #e2e8f0; }
        .qp-page-count { margin-left: 6px; font-size: 0.76rem; color: #475569; }
          .qp-options { grid-template-columns: 1fr; }
          .qp-form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
