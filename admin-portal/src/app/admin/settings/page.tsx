"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Save, CheckCircle2, ShieldCheck, User, Lock, KeyRound, AlertCircle } from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

export default function AdminSettingsPage() {
  const [username, setUsername] = useState("admin");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!username.trim()) {
      setErrorMsg("Username cannot be empty.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg("New Password and Confirm Password do not match.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }

    setSaving(true);

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/auth/update-credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          currentPassword,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update admin credentials.");
      }

      setSuccessMsg("Admin credentials updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while saving settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="set-page">
      {/* Header Bar */}
      <div className="set-header">
        <p className="set-subtitle">Update HR Administrator username and access password</p>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="set-alert set-alert--success">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="set-alert set-alert--error">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Credentials Card */}
      <div className="set-card">
        <div className="set-card-header">
          <KeyRound size={18} className="set-card-icon" />
          <div>
            <h2 className="set-card-title">Security & Credentials</h2>
            <p className="set-card-sub">Manage login credentials for HR Admin portal</p>
          </div>
        </div>

        <form onSubmit={handleUpdateCredentials} className="set-form">
          <div className="set-form-group">
            <label className="set-label">
              <User size={14} /> Admin Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="set-input"
              placeholder="e.g. admin"
            />
          </div>

          <div className="set-form-group">
            <label className="set-label">
              <Lock size={14} /> Current Password (optional for first change)
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="set-input"
              placeholder="Enter current password"
            />
          </div>

          <div className="set-form-row">
            <div className="set-form-group">
              <label className="set-label">
                <Lock size={14} /> New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="set-input"
                placeholder="Enter new password (min 6 chars)"
              />
            </div>

            <div className="set-form-group">
              <label className="set-label">
                <Lock size={14} /> Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="set-input"
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          <div className="set-form-footer">
            <button type="submit" disabled={saving} className="set-save-btn">
              <Save size={16} />
              {saving ? "Updating Credentials…" : "Save Password & Username"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .set-page { padding: 28px 36px; width: 100%; max-width: 800px; margin: 0; background-color: #f8fafc; min-height: calc(100vh - 64px); box-sizing: border-box; }
        .set-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
        .set-header-icon { width: 44px; height: 44px; border-radius: 12px; background: #2563eb; display: flex; align-items: center; justify-content: center; color: #ffffff; flex-shrink: 0; box-shadow: 0 4px 12px rgba(37,99,235,0.25); }
        .set-title { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0; tracking: -0.02em; }
        .set-subtitle { font-size: 0.84rem; color: #64748b; margin-top: 2px; font-weight: 500; }

        .set-alert { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 12px; font-size: 0.86rem; margin-bottom: 20px; font-weight: 700; }
        .set-alert--success { background: #dcfce7; border: 1px solid #86efac; color: #166534; }
        .set-alert--error { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; }

        .set-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .set-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
        .set-card-icon { color: #2563eb; }
        .set-card-title { font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0; }
        .set-card-sub { font-size: 0.8rem; color: #64748b; margin-top: 2px; font-weight: 500; }

        .set-form { display: flex; flex-direction: column; gap: 16px; }
        .set-form-group { display: flex; flex-direction: column; gap: 6px; }
        .set-label { font-size: 0.82rem; font-weight: 700; color: #334155; display: flex; align-items: center; gap: 6px; }
        .set-input { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; color: #0f172a; font-size: 0.88rem; font-weight: 500; outline: none; transition: border-color 0.2s, box-shadow 0.2s; width: 100%; box-sizing: border-box; }
        .set-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
        .set-input::placeholder { color: #94a3b8; }
        .set-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        .set-form-footer { display: flex; justify-content: flex-end; margin-top: 8px; }
        .set-save-btn { background: #2563eb; border: none; color: #ffffff; border-radius: 10px; padding: 10px 22px; font-size: 0.88rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 7px; transition: background 0.2s; box-shadow: 0 2px 6px rgba(37,99,235,0.3); }
        .set-save-btn:hover { background: #1d4ed8; }
        .set-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        @media (max-width: 580px) {
          .set-form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
