"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen, Plus, Clock, Link2, Copy, CheckCircle2, Trash2,
  Edit2, RefreshCw, X, Calendar, AlertCircle, Zap, Users,
  Eye, EyeOff
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

interface AssessmentSession {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  activeFrom?: string;
  activeUntil?: string;
  durationMins: number;
  totalQuestions: number;
  totalCandidates: number;
  passingPercentage: number;
  maxProctorWarnings: number;
  uniqueCandidateLink: string;
  createdAt: string;
}

const EXAM_DURATION_MINS = 45;
const TOTAL_QUESTIONS = 60;

function getComputedStatus(session: AssessmentSession): "ACTIVE" | "UPCOMING" | "EXPIRED" | "INACTIVE" | "DRAFT" {
  if (session.status === "INACTIVE") return "INACTIVE";
  if (session.status === "DRAFT") return "DRAFT";
  const now = new Date();
  if (session.activeFrom && now < new Date(session.activeFrom)) return "UPCOMING";
  if (session.activeUntil && now > new Date(session.activeUntil)) return "EXPIRED";
  return "ACTIVE";
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    ACTIVE:   { label: "● Active",   cls: "status-active" },
    UPCOMING: { label: "◔ Upcoming", cls: "status-upcoming" },
    EXPIRED:  { label: "✕ Expired",  cls: "status-expired" },
    INACTIVE: { label: "○ Inactive", cls: "status-inactive" },
    DRAFT:    { label: "✎ Draft",    cls: "status-draft" },
  };
  const s = map[status] || map["INACTIVE"];
  return <span className={`session-status-badge ${s.cls}`}>{s.label}</span>;
}

function formatDatetimeLocal(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDisplay(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function AdminAssessmentsPage() {
  const [sessions, setSessions] = useState<AssessmentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal]     = useState(false);
  const [editTarget, setEditTarget]           = useState<AssessmentSession | null>(null);

  // Form
  const emptyForm = {
    name: "",
    description: "",
    durationMins: 45,
    activeFrom: "",
    activeUntil: "",
    passingPercentage: 50,
    maxProctorWarnings: 3,
    status: "ACTIVE",
  };
  const [form, setForm]     = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${getApiBaseUrl()}/api/v1/candidates/assessments/list`);
      const data = await res.json();
      if (data.success) setSessions(data.assessments || []);
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  const copyLink = (session: AssessmentSession) => {
    navigator.clipboard.writeText(session.uniqueCandidateLink).then(() => {
      setCopiedId(session.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const openCreate = () => {
    setForm({ ...emptyForm });
    setFormError("");
    setShowCreateModal(true);
  };

  const openEdit = (session: AssessmentSession) => {
    setEditTarget(session);
    setForm({
      name: session.name,
      description: session.description || "",
      durationMins: session.durationMins || 45,
      activeFrom: formatDatetimeLocal(session.activeFrom),
      activeUntil: formatDatetimeLocal(session.activeUntil),
      passingPercentage: session.passingPercentage,
      maxProctorWarnings: session.maxProctorWarnings,
      status: session.status,
    });
    setFormError("");
    setShowEditModal(true);
  };

  const handleSave = async (isEdit: boolean) => {
    if (!form.name.trim()) { setFormError("Session name is required."); return; }
    setSaving(true);
    setFormError("");
    try {
      const payload: any = {
        name: form.name.trim(),
        description: form.description || undefined,
        durationMins: Number(form.durationMins) || 45,
        activeFrom: form.activeFrom || undefined,
        activeUntil: form.activeUntil || undefined,
        passingPercentage: Number(form.passingPercentage),
        maxProctorWarnings: Number(form.maxProctorWarnings),
        status: form.status,
      };
      if (isEdit && editTarget) payload.id = editTarget.id;

      const res  = await fetch(`${getApiBaseUrl()}/api/v1/candidates/assessments/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Save failed");

      setShowCreateModal(false);
      setShowEditModal(false);
      await loadSessions();
    } catch (err: any) {
      setFormError(err.message || "Failed to save session.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this assessment session? This will also remove all candidate records linked to it.")) return;
    try {
      await fetch(`${getApiBaseUrl()}/api/v1/candidates/assessments/${id}`, { method: "DELETE" });
      await loadSessions();
    } catch { /* silent */ }
  };

  const handleToggleStatus = async (session: AssessmentSession) => {
    const newStatus = session.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await fetch(`${getApiBaseUrl()}/api/v1/candidates/assessments/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: session.id, name: session.name, status: newStatus }),
      });
      await loadSessions();
    } catch { /* silent */ }
  };

  return (
    <div className="assess-page">
      {/* Header */}
      <div className="assess-header">
        <div className="assess-header-left">
          <div className="assess-header-icon"><BookOpen size={22} /></div>
          <div>
            <h1 className="assess-title">Assessment Sessions</h1>
            <p className="assess-subtitle">Create & manage unique exam session links for candidates</p>
          </div>
        </div>
        <div className="assess-header-actions">
          <button className="assess-refresh-btn" onClick={loadSessions} title="Refresh">
            <RefreshCw size={15} />
          </button>
          <button className="assess-create-btn" onClick={openCreate}>
            <Plus size={16} /> New Session
          </button>
        </div>
      </div>

      {/* Fixed Exam Info Banner */}
      <div className="assess-fixed-banner">
        <div className="assess-fixed-item"><Zap size={14} /> <strong>60 Questions</strong> — Fixed</div>
        <div className="assess-fixed-divider" />
        <div className="assess-fixed-item"><Clock size={14} /> <strong>45 Minutes</strong> — Fixed</div>
        <div className="assess-fixed-divider" />
        <div className="assess-fixed-item"><BookOpen size={14} /> Shared Question Bank · All sessions use Q1–Q60</div>
      </div>

      {/* Session Grid */}
      {loading ? (
        <div className="assess-loading">Loading sessions…</div>
      ) : sessions.length === 0 ? (
        <div className="assess-empty">
          <BookOpen size={40} className="assess-empty-icon" />
          <p>No assessment sessions yet.</p>
          <button className="assess-create-btn" onClick={openCreate}><Plus size={15} /> Create First Session</button>
        </div>
      ) : (
        <div className="assess-grid">
          {sessions.map((session) => {
            const computedStatus = getComputedStatus(session);
            const isCopied = copiedId === session.id;
            return (
              <div key={session.id} className={`assess-card assess-card--${computedStatus.toLowerCase()}`}>
                <div className="assess-card-header">
                  <div className="assess-card-title-row">
                    <h2 className="assess-card-name">{session.name}</h2>
                    <StatusBadge status={computedStatus} />
                  </div>
                  {session.description && (
                    <p className="assess-card-desc">{session.description}</p>
                  )}
                </div>

                {/* Fixed Exam Stats */}
                <div className="assess-card-stats">
                  <div className="assess-stat"><BookOpen size={13} /> {TOTAL_QUESTIONS} Questions</div>
                  <div className="assess-stat"><Clock size={13} /> {EXAM_DURATION_MINS} Min</div>
                  <div className="assess-stat"><Users size={13} /> {session.totalCandidates} Candidates</div>
                </div>

                {/* Active Window */}
                <div className="assess-card-window">
                  <Calendar size={13} />
                  <div className="assess-window-times">
                    <span className="assess-window-label">From:</span>
                    <span className="assess-window-value">{formatDisplay(session.activeFrom)}</span>
                    <span className="assess-window-label">Until:</span>
                    <span className="assess-window-value">{formatDisplay(session.activeUntil)}</span>
                  </div>
                </div>

                {/* Unique Exam Link */}
                <div className="assess-link-row">
                  <div className="assess-link-box">
                    <Link2 size={12} />
                    <span className="assess-link-text" title={session.uniqueCandidateLink}>
                      {session.uniqueCandidateLink}
                    </span>
                  </div>
                  <button
                    className={`assess-copy-btn ${isCopied ? "assess-copy-btn--copied" : ""}`}
                    onClick={() => copyLink(session)}
                  >
                    {isCopied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                    {isCopied ? "Copied!" : "Copy"}
                  </button>
                </div>

                {/* Actions */}
                <div className="assess-card-actions">
                  <button className="assess-action-btn assess-action-btn--edit" onClick={() => openEdit(session)}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    className={`assess-action-btn ${session.status === "ACTIVE" ? "assess-action-btn--deactivate" : "assess-action-btn--activate"}`}
                    onClick={() => handleToggleStatus(session)}
                  >
                    {session.status === "ACTIVE" ? <><EyeOff size={13} /> Deactivate</> : <><Eye size={13} /> Activate</>}
                  </button>
                  <button className="assess-action-btn assess-action-btn--delete" onClick={() => handleDelete(session.id)}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {(showCreateModal || showEditModal) && (
        <div className="assess-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setShowCreateModal(false); setShowEditModal(false); }}}>
          <div className="assess-modal">
            <div className="assess-modal-header">
              <h2>{showCreateModal ? "Create New Session" : "Edit Session"}</h2>
              <button className="assess-modal-close" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}>
                <X size={18} />
              </button>
            </div>

            {/* Fixed Info */}
            <div className="assess-modal-fixed-info">
              <Zap size={13} /> All sessions use <strong>60 Questions · 45 Minutes</strong> (fixed, cannot be changed)
            </div>

            <div className="assess-modal-body">
              {formError && (
                <div className="assess-form-error"><AlertCircle size={14} /> {formError}</div>
              )}

              <div className="assess-form-group">
                <label>Session Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Banking Assessment — Batch A"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="assess-form-input"
                />
              </div>

              <div className="assess-form-group">
                <label>Description (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. For freshers batch August 2026"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="assess-form-input"
                />
              </div>

              <div className="assess-form-row">
                <div className="assess-form-group">
                  <label><Calendar size={13} /> Active From</label>
                  <input
                    type="datetime-local"
                    value={form.activeFrom}
                    onChange={(e) => setForm({ ...form, activeFrom: e.target.value })}
                    className="assess-form-input"
                  />
                  <span className="assess-form-hint">When candidates can start entering</span>
                </div>
                <div className="assess-form-group">
                  <label><Calendar size={13} /> Active Until</label>
                  <input
                    type="datetime-local"
                    value={form.activeUntil}
                    onChange={(e) => setForm({ ...form, activeUntil: e.target.value })}
                    className="assess-form-input"
                  />
                  <span className="assess-form-hint">Link expires after this time</span>
                </div>
              </div>

              <div className="assess-form-group">
                <label><Clock size={13} /> Exam Duration (Mins)</label>
                <input
                  type="number"
                  min={5}
                  max={300}
                  value={form.durationMins}
                  onChange={(e) => setForm({ ...form, durationMins: Number(e.target.value) })}
                  className="assess-form-input"
                  placeholder="45"
                />
                <span className="assess-form-hint">Time allowed for candidate countdown timer</span>
              </div>

              <div className="assess-form-row">
                <div className="assess-form-group">
                  <label>Passing % (default 50)</label>
                  <input
                    type="number" min={1} max={100}
                    value={form.passingPercentage}
                    onChange={(e) => setForm({ ...form, passingPercentage: Number(e.target.value) })}
                    className="assess-form-input"
                  />
                </div>
                <div className="assess-form-group">
                  <label>Max Proctor Warnings</label>
                  <input
                    type="number" min={1} max={10}
                    value={form.maxProctorWarnings}
                    onChange={(e) => setForm({ ...form, maxProctorWarnings: Number(e.target.value) })}
                    className="assess-form-input"
                  />
                </div>
              </div>

              <div className="assess-form-group">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="assess-form-input"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="assess-modal-footer">
              <button className="assess-modal-cancel" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}>
                Cancel
              </button>
              <button
                className="assess-modal-save"
                onClick={() => handleSave(showEditModal)}
                disabled={saving}
              >
                {saving ? "Saving…" : showCreateModal ? "Create Session" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .assess-page { padding: 24px; max-width: 1100px; margin: 0 auto; }
        .assess-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 16px; flex-wrap: wrap; }
        .assess-header-left { display: flex; align-items: center; gap: 14px; }
        .assess-header-icon { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg,#6366f1,#818cf8); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
        .assess-title { font-size: 1.4rem; font-weight: 700; color: #e2e8f0; margin: 0; }
        .assess-subtitle { font-size: 0.82rem; color: #64748b; margin: 2px 0 0; }
        .assess-header-actions { display: flex; gap: 10px; align-items: center; }
        .assess-refresh-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; border-radius: 8px; padding: 8px; cursor: pointer; display: flex; align-items: center; transition: background 0.2s; }
        .assess-refresh-btn:hover { background: rgba(255,255,255,0.1); }
        .assess-create-btn { background: linear-gradient(135deg,#6366f1,#818cf8); border: none; color: #fff; border-radius: 10px; padding: 9px 18px; font-size: 0.88rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: opacity 0.2s; }
        .assess-create-btn:hover { opacity: 0.9; }

        .assess-fixed-banner { display: flex; align-items: center; gap: 0; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25); border-radius: 12px; padding: 12px 20px; margin-bottom: 24px; flex-wrap: wrap; gap: 8px; }
        .assess-fixed-item { display: flex; align-items: center; gap: 7px; font-size: 0.84rem; color: #a5b4fc; }
        .assess-fixed-divider { width: 1px; height: 16px; background: rgba(99,102,241,0.3); margin: 0 12px; }

        .assess-loading { text-align: center; padding: 60px; color: #64748b; font-size: 0.9rem; }
        .assess-empty { text-align: center; padding: 80px 20px; color: #64748b; }
        .assess-empty-icon { margin: 0 auto 14px; opacity: 0.3; display: block; }

        .assess-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 18px; }

        .assess-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 14px; transition: border-color 0.2s; }
        .assess-card--active { border-color: rgba(52,211,153,0.3); }
        .assess-card--expired { border-color: rgba(239,68,68,0.2); opacity: 0.75; }
        .assess-card--upcoming { border-color: rgba(251,191,36,0.3); }
        .assess-card--inactive { opacity: 0.6; }
        .assess-card--draft { border-style: dashed; }

        .assess-card-header { display: flex; flex-direction: column; gap: 6px; }
        .assess-card-title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .assess-card-name { font-size: 1rem; font-weight: 700; color: #e2e8f0; margin: 0; line-height: 1.3; }
        .assess-card-desc { font-size: 0.78rem; color: #64748b; margin: 0; }

        .session-status-badge { font-size: 0.72rem; font-weight: 600; padding: 3px 9px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }
        .status-active   { background: rgba(52,211,153,0.15); color: #34d399; }
        .status-upcoming { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .status-expired  { background: rgba(239,68,68,0.15);  color: #f87171; }
        .status-inactive { background: rgba(100,116,139,0.15); color: #64748b; }
        .status-draft    { background: rgba(148,163,184,0.15); color: #94a3b8; }

        .assess-card-stats { display: flex; gap: 14px; flex-wrap: wrap; }
        .assess-stat { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; color: #94a3b8; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 20px; }

        .assess-card-window { display: flex; align-items: flex-start; gap: 8px; background: rgba(255,255,255,0.03); border-radius: 10px; padding: 10px 12px; }
        .assess-card-window > svg { color: #64748b; margin-top: 2px; flex-shrink: 0; }
        .assess-window-times { display: grid; grid-template-columns: auto 1fr; gap: 2px 8px; font-size: 0.78rem; }
        .assess-window-label { color: #64748b; }
        .assess-window-value { color: #cbd5e1; }

        .assess-link-row { display: flex; gap: 8px; align-items: center; }
        .assess-link-box { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 7px 10px; flex: 1; min-width: 0; }
        .assess-link-box > svg { color: #6366f1; flex-shrink: 0; }
        .assess-link-text { font-size: 0.72rem; color: #94a3b8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: monospace; }
        .assess-copy-btn { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; font-weight: 600; padding: 7px 12px; border-radius: 8px; border: 1px solid rgba(99,102,241,0.4); background: rgba(99,102,241,0.1); color: #818cf8; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
        .assess-copy-btn:hover { background: rgba(99,102,241,0.2); }
        .assess-copy-btn--copied { border-color: rgba(52,211,153,0.4); background: rgba(52,211,153,0.1); color: #34d399; }

        .assess-card-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .assess-action-btn { display: flex; align-items: center; gap: 5px; font-size: 0.76rem; font-weight: 600; padding: 6px 12px; border-radius: 8px; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; }
        .assess-action-btn--edit       { background: rgba(99,102,241,0.1); border-color: rgba(99,102,241,0.3); color: #818cf8; }
        .assess-action-btn--edit:hover { background: rgba(99,102,241,0.2); }
        .assess-action-btn--deactivate       { background: rgba(251,191,36,0.1); border-color: rgba(251,191,36,0.3); color: #fbbf24; }
        .assess-action-btn--deactivate:hover { background: rgba(251,191,36,0.2); }
        .assess-action-btn--activate       { background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.3); color: #34d399; }
        .assess-action-btn--activate:hover { background: rgba(52,211,153,0.2); }
        .assess-action-btn--delete       { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #f87171; }
        .assess-action-btn--delete:hover { background: rgba(239,68,68,0.2); }

        /* Modal */
        .assess-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; backdrop-filter: blur(4px); }
        .assess-modal { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; }
        .assess-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .assess-modal-header h2 { font-size: 1.1rem; font-weight: 700; color: #e2e8f0; margin: 0; }
        .assess-modal-close { background: none; border: none; color: #64748b; cursor: pointer; padding: 4px; border-radius: 6px; display: flex; align-items: center; }
        .assess-modal-close:hover { color: #e2e8f0; background: rgba(255,255,255,0.05); }
        .assess-modal-fixed-info { display: flex; align-items: center; gap: 8px; padding: 10px 24px; background: rgba(99,102,241,0.08); border-bottom: 1px solid rgba(99,102,241,0.15); font-size: 0.8rem; color: #a5b4fc; }
        .assess-modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
        .assess-form-group { display: flex; flex-direction: column; gap: 6px; }
        .assess-form-group label { font-size: 0.8rem; font-weight: 600; color: #94a3b8; display: flex; align-items: center; gap: 5px; }
        .assess-form-input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 9px 12px; color: #e2e8f0; font-size: 0.88rem; outline: none; transition: border-color 0.2s; }
        .assess-form-input:focus { border-color: rgba(99,102,241,0.5); }
        .assess-form-hint { font-size: 0.73rem; color: #475569; }
        .assess-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .assess-form-error { display: flex; align-items: center; gap: 7px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; padding: 9px 12px; font-size: 0.82rem; color: #f87171; }
        .assess-modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.08); }
        .assess-modal-cancel { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; border-radius: 10px; padding: 9px 18px; font-size: 0.88rem; cursor: pointer; }
        .assess-modal-save { background: linear-gradient(135deg,#6366f1,#818cf8); border: none; color: #fff; border-radius: 10px; padding: 9px 20px; font-size: 0.88rem; font-weight: 600; cursor: pointer; }
        .assess-modal-save:disabled { opacity: 0.6; cursor: not-allowed; }
        @media (max-width: 600px) {
          .assess-form-row { grid-template-columns: 1fr; }
          .assess-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
