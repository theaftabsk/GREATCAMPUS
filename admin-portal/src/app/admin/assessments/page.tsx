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
    ACTIVE:   { label: "Active",   cls: "status-active" },
    UPCOMING: { label: "Upcoming", cls: "status-upcoming" },
    EXPIRED:  { label: "Expired",  cls: "status-expired" },
    INACTIVE: { label: "Inactive", cls: "status-inactive" },
    DRAFT:    { label: "Draft",    cls: "status-draft" },
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
  if (!iso) return "Not set";
  return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function getDisplayExamLink(rawLink: string) {
  if (!rawLink) return "";
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    let slugOrId = rawLink;
    if (rawLink.includes("assessment=")) {
      slugOrId = rawLink.split("assessment=")[1];
    } else if (rawLink.includes("/")) {
      const parts = rawLink.split("/");
      slugOrId = parts[parts.length - 1];
    }
    return `http://localhost:3000/${slugOrId}`;
  }
  return rawLink;
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
      const res  = await fetch(`${getApiBaseUrl()}/api/v1/assessments`);
      const data = await res.json();
      if (data.success) setSessions(data.assessments || []);
    } catch { /* silent */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  const copyLink = (session: AssessmentSession) => {
    const linkToCopy = getDisplayExamLink(session.uniqueCandidateLink);
    navigator.clipboard.writeText(linkToCopy).then(() => {
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

      const res  = await fetch(`${getApiBaseUrl()}/api/v1/assessments/save`, {
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
    if (!confirm("Delete this assessment session? This will also remove candidate records linked to it.")) return;
    try {
      await fetch(`${getApiBaseUrl()}/api/v1/assessments/${id}`, { method: "DELETE" });
      await loadSessions();
    } catch { /* silent */ }
  };

  const handleToggleStatus = async (session: AssessmentSession) => {
    const newStatus = session.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await fetch(`${getApiBaseUrl()}/api/v1/assessments/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: session.id, name: session.name, status: newStatus }),
      });
      await loadSessions();
    } catch { /* silent */ }
  };

  return (
    <div className="assess-page">
      {/* Header Bar */}
      <div className="assess-header">
        <p className="assess-subtitle">Create unique candidate exam links with scheduled access windows</p>
        <div className="assess-header-actions">
          <button className="assess-refresh-btn" onClick={loadSessions} title="Refresh Sessions">
            <RefreshCw size={15} /> Refresh List
          </button>
          <button className="assess-create-btn" onClick={openCreate}>
            <Plus size={16} /> New Assessment Session
          </button>
        </div>
      </div>

      {/* Fixed Exam Info Banner */}
      <div className="assess-fixed-banner">
        <div className="assess-fixed-item"><Zap size={15} /> <strong>60 Questions</strong> — Shared Bank</div>
        <div className="assess-fixed-divider" />
        <div className="assess-fixed-item"><Clock size={15} /> <strong>45 Mins Default</strong> — Configurable</div>
        <div className="assess-fixed-divider" />
        <div className="assess-fixed-item"><BookOpen size={15} /> All sessions generate unique exam URLs</div>
      </div>

      {/* Session Grid */}
      {loading ? (
        <div className="assess-loading">
          <div className="assess-spinner"></div>
          <p>Loading assessment sessions...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="assess-empty">
          <BookOpen size={42} className="assess-empty-icon" />
          <p>No assessment sessions created yet.</p>
          <button className="assess-create-btn" onClick={openCreate} style={{ margin: "16px auto 0" }}>
            <Plus size={15} /> Create First Session
          </button>
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

                {/* Session Stats */}
                <div className="assess-card-stats">
                  <div className="assess-stat"><BookOpen size={13} /> {TOTAL_QUESTIONS} Questions</div>
                  <div className="assess-stat"><Clock size={13} /> {session.durationMins || EXAM_DURATION_MINS} Mins</div>
                  <div className="assess-stat"><Users size={13} /> {session.totalCandidates} Candidates</div>
                </div>

                {/* Active Window */}
                <div className="assess-card-window">
                  <Calendar size={14} className="assess-window-icon" />
                  <div className="assess-window-times">
                    <span className="assess-window-label">From:</span>
                    <span className="assess-window-value">{formatDisplay(session.activeFrom)}</span>
                    <span className="assess-window-label">Until:</span>
                    <span className="assess-window-value">{formatDisplay(session.activeUntil)}</span>
                  </div>
                </div>

                {/* Unique Candidate Exam Link */}
                <div className="assess-link-row">
                  <div className="assess-link-box">
                    <Link2 size={13} />
                    <span className="assess-link-text" title={getDisplayExamLink(session.uniqueCandidateLink)}>
                      {getDisplayExamLink(session.uniqueCandidateLink)}
                    </span>
                  </div>
                  <button
                    className={`assess-copy-btn ${isCopied ? "assess-copy-btn--copied" : ""}`}
                    onClick={() => copyLink(session)}
                  >
                    {isCopied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                    {isCopied ? "Copied" : "Copy"}
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
              <h2>{showCreateModal ? "Create Assessment Session" : "Edit Session"}</h2>
              <button className="assess-modal-close" onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}>
                <X size={18} />
              </button>
            </div>

            {/* Banner */}
            <div className="assess-modal-fixed-info">
              <Zap size={14} /> Shared Question Bank · <strong>60 Questions</strong> per candidate attempt
            </div>

            <div className="assess-modal-body">
              {formError && (
                <div className="assess-form-error"><AlertCircle size={15} /> {formError}</div>
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
                  <span className="assess-form-hint">Candidate access start time</span>
                </div>
                <div className="assess-form-group">
                  <label><Calendar size={13} /> Active Until</label>
                  <input
                    type="datetime-local"
                    value={form.activeUntil}
                    onChange={(e) => setForm({ ...form, activeUntil: e.target.value })}
                    className="assess-form-input"
                  />
                  <span className="assess-form-hint">Session expiration time</span>
                </div>
              </div>

              <div className="assess-form-row">
                <div className="assess-form-group">
                  <label>Passing Percentage (%)</label>
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
                  className="assess-form-input font-bold text-blue-600"
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
                {saving ? "Saving..." : showCreateModal ? "Create Session" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .assess-page { padding: 28px 36px; width: 100%; max-width: 100%; margin: 0; background-color: #f8fafc; min-height: calc(100vh - 64px); box-sizing: border-box; }
        
        .assess-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; width: 100%; }
        .assess-header-left { display: flex; align-items: center; gap: 14px; }
        .assess-header-icon { width: 44px; height: 44px; border-radius: 12px; background: #2563eb; display: flex; align-items: center; justify-content: center; color: #ffffff; flex-shrink: 0; box-shadow: 0 4px 12px rgba(37,99,235,0.25); }
        .assess-title { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0; tracking: -0.02em; }
        .assess-subtitle { font-size: 0.84rem; color: #64748b; margin-top: 2px; font-weight: 500; }
        .assess-header-actions { display: flex; gap: 10px; align-items: center; }
        .assess-refresh-btn { background: #ffffff; border: 1px solid #cbd5e1; color: #334155; border-radius: 10px; padding: 9px 16px; font-size: 0.84rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 7px; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .assess-refresh-btn:hover { background: #f1f5f9; border-color: #94a3b8; color: #0f172a; }
        .assess-create-btn { background: #2563eb; border: none; color: #ffffff; border-radius: 10px; padding: 9px 18px; font-size: 0.86rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 7px; transition: background 0.2s; box-shadow: 0 4px 12px rgba(37,99,235,0.25); }
        .assess-create-btn:hover { background: #1d4ed8; }

        .assess-fixed-banner { display: flex; align-items: center; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 14px; padding: 12px 20px; margin-bottom: 24px; flex-wrap: wrap; gap: 10px; width: 100%; box-sizing: border-box; }
        .assess-fixed-item { display: flex; align-items: center; gap: 7px; font-size: 0.85rem; color: #1d4ed8; font-weight: 600; }
        .assess-fixed-divider { width: 1px; height: 16px; background: #93c5fd; margin: 0 8px; }

        .assess-loading { text-align: center; padding: 60px; color: #64748b; font-size: 0.9rem; font-weight: 600; display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%; }
        .assess-spinner { width: 28px; height: 28px; border: 3px solid #2563eb; border-top-color: transparent; border-radius: 50%; animation: assessSpin 0.8s linear infinite; }
        @keyframes assessSpin { to { transform: rotate(360deg); } }

        .assess-empty { text-align: center; padding: 80px 20px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; color: #64748b; width: 100%; box-sizing: border-box; }
        .assess-empty-icon { margin: 0 auto 12px; color: #94a3b8; }

        .assess-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px; width: 100%; }

        .assess-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 20px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); transition: border-color 0.2s, box-shadow 0.2s; }
        .assess-card:hover { border-color: #cbd5e1; box-shadow: 0 6px 16px rgba(0,0,0,0.06); }
        .assess-card--active { border-top: 4px solid #16a34a; }
        .assess-card--upcoming { border-top: 4px solid #d97706; }
        .assess-card--expired { border-top: 4px solid #dc2626; opacity: 0.85; }
        .assess-card--inactive { opacity: 0.75; }

        .assess-card-header { display: flex; flex-direction: column; gap: 6px; }
        .assess-card-title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
        .assess-card-name { font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.3; }
        .assess-card-desc { font-size: 0.8rem; color: #64748b; margin: 0; font-weight: 500; }

        .session-status-badge { font-size: 0.74rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }
        .status-active   { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
        .status-upcoming { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .status-expired  { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
        .status-inactive { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
        .status-draft    { background: #f1f5f9; color: #64748b; border: 1px dashed #cbd5e1; }

        .assess-card-stats { display: flex; gap: 10px; flex-wrap: wrap; }
        .assess-stat { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; font-weight: 700; color: #334155; background: #f1f5f9; padding: 5px 11px; border-radius: 20px; border: 1px solid #e2e8f0; }

        .assess-card-window { display: flex; align-items: flex-start; gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 14px; }
        .assess-window-icon { color: #2563eb; margin-top: 2px; flex-shrink: 0; }
        .assess-window-times { display: grid; grid-template-columns: auto 1fr; gap: 3px 10px; font-size: 0.8rem; }
        .assess-window-label { color: #64748b; font-weight: 600; }
        .assess-window-value { color: #0f172a; font-weight: 700; }

        .assess-link-row { display: flex; gap: 8px; align-items: center; }
        .assess-link-box { display: flex; align-items: center; gap: 7px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 8px 12px; flex: 1; min-width: 0; }
        .assess-link-box > svg { color: #2563eb; flex-shrink: 0; }
        .assess-link-text { font-size: 0.76rem; color: #334155; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: monospace; }
        .assess-copy-btn { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; font-weight: 700; padding: 8px 14px; border-radius: 10px; border: 1px solid #bfdbfe; background: #eff6ff; color: #1d4ed8; cursor: pointer; white-space: nowrap; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
        .assess-copy-btn:hover { background: #dbeafe; }
        .assess-copy-btn--copied { border-color: #86efac; background: #f0fdf4; color: #166534; }

        .assess-card-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
        .assess-action-btn { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; font-weight: 700; padding: 7px 13px; border-radius: 9px; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; }
        .assess-action-btn--edit       { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
        .assess-action-btn--edit:hover { background: #dbeafe; }
        .assess-action-btn--deactivate       { background: #fef3c7; border-color: #fde68a; color: #92400e; }
        .assess-action-btn--deactivate:hover { background: #fde68a; }
        .assess-action-btn--activate       { background: #dcfce7; border-color: #86efac; color: #166534; }
        .assess-action-btn--activate:hover { background: #bbf7d0; }
        .assess-action-btn--delete       { background: #fee2e2; border-color: #fca5a5; color: #991b1b; }
        .assess-action-btn--delete:hover { background: #fecaca; }

        /* Modal */
        .assess-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; backdrop-filter: blur(4px); }
        .assess-modal { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; width: 100%; max-width: 540px; max-height: 92vh; overflow-y: auto; display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
        .assess-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
        .assess-modal-header h2 { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0; }
        .assess-modal-close { background: #f1f5f9; border: none; color: #64748b; cursor: pointer; padding: 5px; border-radius: 8px; display: flex; align-items: center; }
        .assess-modal-close:hover { color: #0f172a; background: #e2e8f0; }
        .assess-modal-fixed-info { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #eff6ff; border-bottom: 1px solid #bfdbfe; font-size: 0.8rem; color: #1d4ed8; font-weight: 600; }
        .assess-modal-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
        .assess-form-group { display: flex; flex-direction: column; gap: 4px; }
        .assess-form-group label { font-size: 0.78rem; font-weight: 700; color: #475569; display: flex; align-items: center; gap: 5px; }
        .assess-form-input { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 9px; padding: 8px 12px; color: #0f172a; font-size: 0.85rem; font-weight: 500; outline: none; transition: border-color 0.2s, box-shadow 0.2s; width: 100%; box-sizing: border-box; }
        .assess-form-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
        .assess-form-hint { font-size: 0.72rem; color: #64748b; font-weight: 500; }
        .assess-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .assess-form-row--3 { grid-template-columns: 1fr 1fr 1fr; }
        .assess-form-error { display: flex; align-items: center; gap: 8px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 9px 12px; font-size: 0.8rem; color: #dc2626; font-weight: 600; }
        .assess-modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px; border-top: 1px solid #e2e8f0; background: #f8fafc; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px; }
        .assess-modal-cancel { background: #ffffff; border: 1px solid #cbd5e1; color: #475569; border-radius: 9px; padding: 8px 16px; font-size: 0.85rem; font-weight: 600; cursor: pointer; }
        .assess-modal-save { background: #2563eb; border: none; color: #ffffff; border-radius: 9px; padding: 8px 20px; font-size: 0.85rem; font-weight: 700; cursor: pointer; box-shadow: 0 2px 6px rgba(37,99,235,0.3); }
        .assess-modal-save:hover { background: #1d4ed8; }
        .assess-modal-save:disabled { opacity: 0.6; cursor: not-allowed; }
        
        @media (max-width: 600px) {
          .assess-form-row { grid-template-columns: 1fr; }
          .assess-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
