"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail, RefreshCw, Search, CheckCircle2, AlertTriangle,
  RotateCcw, Settings, Send, Clock, ShieldCheck, Filter
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

export default function EmailAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const baseUrl = getApiBaseUrl();
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "50");
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (searchTerm.trim()) params.append("search", searchTerm.trim());

      const res = await fetch(`${baseUrl}/api/v1/emails/logs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
        setTotal(data.total || 0);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadLogs();
  };

  const handleResend = async (emailLogId: string, email: string) => {
    setResendingId(emailLogId);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/emails/resend/${emailLogId}`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Email invitation resent successfully to ${email}`);
        await loadLogs();
      } else {
        alert(data.message || "Failed to resend email.");
      }
    } catch {
      alert("Error resending email invitation.");
    } finally {
      setResendingId(null);
    }
  };

  const sentCount = logs.filter((l) => l.status === "SENT" || l.status === "DELIVERED").length;
  const failedCount = logs.filter((l) => l.status === "FAILED").length;
  const pendingCount = logs.filter((l) => l.status === "PENDING").length;

  return (
    <div style={{ padding: "28px 36px", background: "#F8FAFC", minHeight: "calc(100vh - 64px)" }}>

      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#0F172A", margin: "0 0 4px" }}>
            Email Audit & Delivery Tracking
          </h1>
          <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
            Real-time delivery status for all candidate assessment invitations dispatched via Authenticated SMTP
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={loadLogs}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "10px", background: "white", border: "1px solid #CBD5E1", fontSize: "13px", fontWeight: 700, color: "#334155", cursor: "pointer" }}
          >
            <RefreshCw size={14} /> Refresh Logs
          </button>

          <Link
            href="/admin/settings"
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", borderRadius: "10px", background: "#003F72", color: "white", fontSize: "13px", fontWeight: 800, textDecoration: "none" }}
          >
            <Settings size={14} /> Configure SMTP Server
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "24px" }}>
        <div style={{ background: "white", padding: "18px", borderRadius: "14px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#EFF6FF", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Mail size={20} />
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748B" }}>Total Emails Logged</div>
            <div style={{ fontSize: "20px", fontWeight: 900, color: "#0F172A" }}>{total}</div>
          </div>
        </div>

        <div style={{ background: "white", padding: "18px", borderRadius: "14px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#ECFDF5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748B" }}>Delivered / Sent</div>
            <div style={{ fontSize: "20px", fontWeight: 900, color: "#059669" }}>{sentCount}</div>
          </div>
        </div>

        <div style={{ background: "white", padding: "18px", borderRadius: "14px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "#FEF2F2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748B" }}>Failed Dispatches</div>
            <div style={{ fontSize: "20px", fontWeight: 900, color: "#DC2626" }}>{failedCount}</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "18px", flexWrap: "wrap" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px", flex: 1, maxWidth: "420px" }}>
          <div style={{ position: "relative", width: "100%" }}>
            <Search size={15} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search recipient, candidate, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px", color: "#0F172A", background: "white" }}
            />
          </div>
          <button type="submit" style={{ padding: "9px 16px", borderRadius: "10px", background: "#00AEEF", color: "white", border: "none", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>
            Search
          </button>
        </form>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Status:</span>
          {["ALL", "SENT", "FAILED", "PENDING"].map((st) => (
            <button
              key={st}
              onClick={() => { setStatusFilter(st); setPage(1); }}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                background: statusFilter === st ? "#003F72" : "white",
                color: statusFilter === st ? "white" : "#475569",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #CBD5E1", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#F1F5F9", borderBottom: "2px solid #CBD5E1" }}>
              <th style={{ padding: "12px 16px", fontWeight: 800, color: "#334155", fontSize: "11px", textTransform: "uppercase" }}>Recipient / Candidate</th>
              <th style={{ padding: "12px 16px", fontWeight: 800, color: "#334155", fontSize: "11px", textTransform: "uppercase" }}>Assessment Session</th>
              <th style={{ padding: "12px 16px", fontWeight: 800, color: "#334155", fontSize: "11px", textTransform: "uppercase" }}>Email Subject</th>
              <th style={{ padding: "12px 16px", fontWeight: 800, color: "#334155", fontSize: "11px", textTransform: "uppercase" }}>Status</th>
              <th style={{ padding: "12px 16px", fontWeight: 800, color: "#334155", fontSize: "11px", textTransform: "uppercase" }}>Sent Time</th>
              <th style={{ padding: "12px 16px", fontWeight: 800, color: "#334155", fontSize: "11px", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #00AEEF", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto 8px" }} />
                  Loading delivery logs...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "48px 20px", textAlign: "center", color: "#64748B" }}>
                  <Mail size={36} color="#CBD5E1" style={{ margin: "0 auto 10px" }} />
                  <p style={{ fontWeight: 700, margin: 0 }}>No email logs found</p>
                  <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>Dispatched invitations will automatically appear here.</p>
                </td>
              </tr>
            ) : (
              logs.map((log: any) => {
                const isFailed = log.status === "FAILED";
                const isSent = log.status === "SENT" || log.status === "DELIVERED";

                return (
                  <tr key={log.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 800, color: "#0F172A" }}>{log.candidateName || "Candidate"}</div>
                      <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px", fontFamily: "monospace" }}>{log.recipientEmail}</div>
                    </td>

                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#334155" }}>
                      {log.assessmentName || "Niva Bupa Assessment"}
                    </td>

                    <td style={{ padding: "14px 16px", color: "#475569", maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {log.subject}
                    </td>

                    <td style={{ padding: "14px 16px" }}>
                      <div>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 800,
                          background: isSent ? "#ECFDF5" : isFailed ? "#FEF2F2" : "#F1F5F9",
                          color: isSent ? "#059669" : isFailed ? "#DC2626" : "#64748B"
                        }}>
                          {log.status}
                        </span>
                        {log.errorMessage && (
                          <div style={{ fontSize: "11px", color: "#B91C1C", marginTop: "4px", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={log.errorMessage}>
                            ⚠️ {log.errorMessage}
                          </div>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: "14px 16px", fontSize: "12px", color: "#64748B" }}>
                      {log.sentAt ? new Date(log.sentAt).toLocaleString() : new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <button
                        onClick={() => handleResend(log.id, log.recipientEmail)}
                        disabled={resendingId === log.id}
                        style={{ padding: "6px 12px", borderRadius: "8px", background: "#EFF6FF", color: "#0284C7", border: "1px solid #BFDBFE", fontSize: "11px", fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <RotateCcw size={12} /> {resendingId === log.id ? "Sending..." : "Resend"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
