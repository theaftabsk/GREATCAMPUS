"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Users, Mail, CheckCircle2, Clock, ShieldAlert,
  AlertTriangle, Download, Plus, Upload, RefreshCw, Search,
  ExternalLink, Copy, Check, FileSpreadsheet, Send, Lock,
  Award, XCircle, FileText
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";
import CandidateReportModal from "@/components/CandidateReportModal";
import ConfirmModal from "@/components/ConfirmModal";
import ToastContainer, { ToastMessage } from "@/components/Toast";

export default function AssessmentDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [copiedLink, setCopiedLink] = useState(false);

  // Pagination (30 candidates per page by default)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  // Single Add Candidate Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [singleCandidate, setSingleCandidate] = useState({ name: "", email: "", phone: "", applicationId: "" });
  const [addingCandidate, setAddingCandidate] = useState(false);

  // Excel Upload Modal
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelText, setExcelText] = useState("");
  const [parsedRows, setParsedRows] = useState<Array<{ name: string; email: string; phone: string; applicationId: string; valid: boolean }>>([]);
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  // Bulk Email Invite Modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [emailProgress, setEmailProgress] = useState<any>(null);

  // Selected Candidate for Report Modal
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Toast State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (type: "success" | "error" | "warning" | "info", message: string, title?: string) => {
    setToasts((prev) => [...prev, { id: Math.random().toString(36).substring(2, 9), type, message, title }]);
  };
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Delete Target State
  const [deleteCandidateTarget, setDeleteCandidateTarget] = useState<{ id: string; name: string } | null>(null);
  const [deletingCandidate, setDeletingCandidate] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/candidates/assessment-dashboard/${assessmentId}`);
      const resData = await res.json();
      if (resData.success) {
        setData(resData);
      } else {
        setError(resData.message || "Failed to load assessment dashboard.");
      }
    } catch (err: any) {
      setError(err.message || "Network error loading dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assessmentId) {
      loadDashboard();
    }
  }, [assessmentId]);

  const handleCopyLink = () => {
    if (data?.assessment?.candidateLink) {
      navigator.clipboard.writeText(data.assessment.candidateLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleAddSingleCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleCandidate.name || !singleCandidate.email) {
      alert("Name and email are required.");
      return;
    }
    setAddingCandidate(true);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/candidates/upload-excel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId,
          candidates: [singleCandidate],
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setShowAddModal(false);
        setSingleCandidate({ name: "", email: "", phone: "", applicationId: "" });
        await loadDashboard();
      } else {
        alert(resData.message || "Failed to add candidate.");
      }
    } catch {
      alert("Error adding candidate.");
    } finally {
      setAddingCandidate(false);
    }
  };

  // Parse CSV/TSV input pasted into textarea or file upload
  const handleParseText = (text: string) => {
    setExcelText(text);
    const lines = text.trim().split("\n");
    const rows: Array<{ name: string; email: string; phone: string; applicationId: string; valid: boolean }> = [];

    lines.forEach((line, idx) => {
      if (idx === 0 && (line.toLowerCase().includes("email") || line.toLowerCase().includes("name"))) {
        return; // skip header
      }
      const parts = line.split(/[,\t;|]/).map((p) => p.trim().replace(/^["']|["']$/g, ""));
      if (parts.length >= 2) {
        const name = parts[0] || "";
        const email = parts[1] || "";
        const phone = parts[2] || "";
        const applicationId = parts[3] || "";
        const valid = name.length > 0 && email.includes("@") && email.includes(".");
        rows.push({ name, email, phone, applicationId, valid });
      }
    });

    setParsedRows(rows);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) handleParseText(text);
    };
    reader.readAsText(file);
  };

  const handleConfirmExcelUpload = async () => {
    const validRows = parsedRows.filter((r) => r.valid);
    if (validRows.length === 0) {
      alert("No valid candidate rows to upload.");
      return;
    }

    setUploadingExcel(true);
    setUploadResult(null);

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/candidates/upload-excel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId,
          candidates: validRows,
        }),
      });
      const resData = await res.json();
      setUploadResult(resData);
      if (resData.success) {
        await loadDashboard();
      }
    } catch {
      alert("Error uploading candidate batch.");
    } finally {
      setUploadingExcel(false);
    }
  };

  const handleSendBulkInvites = async () => {
    setSendingEmails(true);
    setEmailProgress({ status: "SENDING", message: "Connecting to SMTP and dispatching candidate email invitations..." });

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/emails/send-bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId }),
      });
      const resData = await res.json();
      setEmailProgress({
        status: "COMPLETED",
        total: resData.total,
        sent: resData.sent,
        failed: resData.failed,
        message: resData.message,
        errors: resData.errors,
      });
      await loadDashboard();
    } catch (err: any) {
      setEmailProgress({ status: "FAILED", message: err.message || "Failed to send email invitations." });
    } finally {
      setSendingEmails(false);
    }
  };

  const handleSendInvite = async (candidateId: string, email: string) => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/emails/send-invite/${candidateId}`, { method: "POST" });
      const resData = await res.json();
      if (resData.success) {
        addToast("success", `Invitation email sent successfully to ${email}`, "Invitation Dispatched");
        await loadDashboard();
      } else {
        addToast("error", resData.message || "Failed to send email. Check SMTP settings.", "Email Failed");
      }
    } catch {
      addToast("error", "Error sending email invitation.", "Error");
    }
  };

  const handleUnlockCandidate = async (candidateId: string, name: string) => {
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/candidates/${candidateId}/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminName: "HR Administrator", reason: "Admin approved exam continuation" }),
      });
      const resData = await res.json();
      if (resData.success) {
        addToast("success", `Candidate '${name}' unlocked successfully! All answers & timer preserved.`, "Candidate Unlocked");
        await loadDashboard();
      } else {
        addToast("error", resData.message || "Failed to unlock candidate.", "Unlock Error");
      }
    } catch {
      addToast("error", "Error unlocking candidate.", "Error");
    }
  };

  const confirmDeleteCandidate = async () => {
    if (!deleteCandidateTarget) return;
    setDeletingCandidate(true);
    try {
      const baseUrl = getApiBaseUrl();
      await fetch(`${baseUrl}/api/v1/candidates/${deleteCandidateTarget.id}`, { method: "DELETE" });
      addToast("success", `Candidate '${deleteCandidateTarget.name}' deleted.`, "Candidate Deleted");
      setDeleteCandidateTarget(null);
      await loadDashboard();
    } catch {
      addToast("error", "Failed to delete candidate.", "Error");
    } finally {
      setDeletingCandidate(false);
    }
  };

  const handleDownloadSingleExcel = (candidateId: string) => {
    const baseUrl = getApiBaseUrl();
    window.open(`${baseUrl}/api/v1/candidates/${candidateId}/export-excel`, "_blank");
  };

  const downloadExcelReport = () => {
    const baseUrl = getApiBaseUrl();
    window.open(`${baseUrl}/api/v1/candidates/export-comprehensive/${assessmentId}`, "_blank");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "3px solid #00AEEF", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontSize: "14px", fontWeight: 700, color: "#64748B" }}>Loading Assessment Dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: "40px 24px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <AlertTriangle size={48} color="#DC2626" style={{ margin: "0 auto 16px" }} />
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A" }}>Assessment Session Not Found</h2>
        <p style={{ color: "#64748B", marginTop: "8px" }}>{error}</p>
        <Link href="/admin/assessments" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "20px", padding: "10px 20px", background: "#00AEEF", color: "white", borderRadius: "10px", textDecoration: "none", fontWeight: 700 }}>
          <ArrowLeft size={16} /> Return to Assessments
        </Link>
      </div>
    );
  }

  const { assessment, stats, candidates } = data;

  const filteredCandidates = (candidates || []).filter((c: any) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm);

    if (statusFilter === "ALL") return matchesSearch;
    if (statusFilter === "COMPLETED") return matchesSearch && c.status === "COMPLETED";
    if (statusFilter === "IN_PROGRESS") return matchesSearch && c.status === "IN_PROGRESS";
    if (statusFilter === "LOCKED") return matchesSearch && c.status === "LOCKED";
    if (statusFilter === "INVITED") return matchesSearch && (c.emailStatus === "SENT" || c.emailStatus === "DELIVERED");
    if (statusFilter === "NOT_STARTED") return matchesSearch && !c.attempt;
    if (statusFilter === "QUALIFIED") return matchesSearch && c.attempt?.isPassed;
    if (statusFilter === "NOT_QUALIFIED") return matchesSearch && c.attempt?.status === "COMPLETED" && !c.attempt?.isPassed;
    return matchesSearch;
  });

  return (
    <div style={{ padding: "28px 36px", background: "#F8FAFC", minHeight: "calc(100vh - 64px)" }}>

      {/* Top Breadcrumb Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
        <Link href="/admin/assessments" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "#64748B", textDecoration: "none" }}>
          <ArrowLeft size={16} /> All Assessments
        </Link>
        <span style={{ color: "#CBD5E1" }}>/</span>
        <span style={{ fontSize: "13px", fontWeight: 800, color: "#003F72" }}>{assessment.name}</span>
      </div>

      {/* Assessment Header Card */}
      <div style={{ background: "white", borderRadius: "18px", border: "1px solid #E2E8F0", padding: "24px 28px", marginBottom: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <span style={{ padding: "4px 10px", borderRadius: "8px", background: assessment.status === "ACTIVE" ? "#DCFCE7" : "#F1F5F9", color: assessment.status === "ACTIVE" ? "#166534" : "#475569", fontSize: "11px", fontWeight: 800 }}>
                {assessment.status}
              </span>
              <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>
                ⏱️ {assessment.durationMins} Mins • 60 Questions • Passing: {assessment.passingPercentage}%
              </span>
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: 900, color: "#0F172A", margin: "0 0 6px" }}>{assessment.name}</h1>
            <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>{assessment.description || "Niva Bupa Health Insurance Assessment"}</p>
          </div>

          {/* Assessment Link Pill */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F1F5F9", padding: "8px 14px", borderRadius: "12px", border: "1px solid #CBD5E1" }}>
            <span style={{ fontSize: "12px", fontFamily: "monospace", fontWeight: 700, color: "#1E293B", maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {assessment.candidateLink}
            </span>
            <button
              onClick={handleCopyLink}
              style={{ background: copiedLink ? "#10B981" : "#00AEEF", color: "white", border: "none", borderRadius: "8px", padding: "6px 12px", fontSize: "11px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
            >
              {copiedLink ? <Check size={13} /> : <Copy size={13} />}
              {copiedLink ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "Assigned Candidates", val: stats.totalCandidates, color: "#003F72", bg: "#EFF6FF", icon: Users },
          { label: "Invited (Emails)", val: stats.invitedCount, color: "#0284C7", bg: "#F0F9FF", icon: Mail },
          { label: "Not Started", val: stats.notStartedCount, color: "#64748B", bg: "#F8FAFC", icon: Clock },
          { label: "In Progress", val: stats.inProgressCount, color: "#D97706", bg: "#FFFBEB", icon: RefreshCw },
          { label: "Completed Exams", val: stats.completedCount, color: "#059669", bg: "#ECFDF5", icon: CheckCircle2 },
          { label: "Qualified (Pass)", val: stats.qualifiedCount, color: "#16A34A", bg: "#F0FDF4", icon: Award },
          { label: "Not Qualified", val: stats.notQualifiedCount, color: "#DC2626", bg: "#FEF2F2", icon: XCircle },
          { label: "Locked Sessions", val: stats.lockedCount, color: "#991B1B", bg: "#FEF2F2", icon: ShieldAlert },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} style={{ background: "white", padding: "16px", borderRadius: "14px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748B" }}>{kpi.label}</span>
                <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: kpi.bg, color: kpi.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={13} />
                </div>
              </div>
              <div style={{ fontSize: "22px", fontWeight: 900, color: kpi.color }}>{kpi.val}</div>
            </div>
          );
        })}
      </div>

      {/* Action Control Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "18px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: "260px" }}>
          {/* Search Box */}
          <div style={{ position: "relative", width: "100%", maxWidth: "340px" }}>
            <Search size={15} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search candidate, email, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "13px", color: "#0F172A", background: "white" }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "9px 14px", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: 700, color: "#334155", background: "white" }}
          >
            <option value="ALL">All Candidates ({candidates.length})</option>
            <option value="COMPLETED">Completed ({stats.completedCount})</option>
            <option value="IN_PROGRESS">In Progress ({stats.inProgressCount})</option>
            <option value="LOCKED">Locked ({stats.lockedCount})</option>
            <option value="QUALIFIED">Qualified ({stats.qualifiedCount})</option>
            <option value="NOT_QUALIFIED">Not Qualified ({stats.notQualifiedCount})</option>
            <option value="INVITED">Invited ({stats.invitedCount})</option>
            <option value="NOT_STARTED">Not Started ({stats.notStartedCount})</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => setShowExcelModal(true)}
            style={{ padding: "9px 16px", borderRadius: "10px", background: "#003F72", color: "white", fontSize: "12px", fontWeight: 800, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Upload size={14} /> Upload Excel Candidates
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            style={{ padding: "9px 14px", borderRadius: "10px", background: "#F1F5F9", color: "#334155", fontSize: "12px", fontWeight: 700, border: "1px solid #CBD5E1", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
          >
            <Plus size={14} /> Add Candidate
          </button>

          <button
            onClick={() => setShowEmailModal(true)}
            style={{ padding: "9px 16px", borderRadius: "10px", background: "#0284C7", color: "white", fontSize: "12px", fontWeight: 800, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Send size={14} /> Send Email Invites
          </button>

          <button
            onClick={downloadExcelReport}
            style={{ padding: "9px 16px", borderRadius: "10px", background: "#059669", color: "white", fontSize: "12px", fontWeight: 800, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Download size={14} /> Download 5-Sheet Report
          </button>

          <button
            onClick={loadDashboard}
            title="Refresh List"
            style={{ padding: "9px 12px", borderRadius: "10px", background: "white", border: "1px solid #CBD5E1", cursor: "pointer", color: "#64748B" }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Candidates Table */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #CBD5E1", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#F1F5F9", borderBottom: "2px solid #CBD5E1" }}>
              <th style={{ padding: "12px 16px", fontWeight: 800, color: "#334155", fontSize: "11px", textTransform: "uppercase" }}>Candidate</th>
              <th style={{ padding: "12px 16px", fontWeight: 800, color: "#334155", fontSize: "11px", textTransform: "uppercase" }}>App / Ref ID</th>
              <th style={{ padding: "12px 16px", fontWeight: 800, color: "#334155", fontSize: "11px", textTransform: "uppercase" }}>Status</th>
              <th style={{ padding: "12px 16px", fontWeight: 800, color: "#334155", fontSize: "11px", textTransform: "uppercase" }}>Score (60)</th>
              <th style={{ padding: "12px 16px", fontWeight: 800, color: "#334155", fontSize: "11px", textTransform: "uppercase" }}>Result</th>
              <th style={{ padding: "12px 16px", fontWeight: 800, color: "#334155", fontSize: "11px", textTransform: "uppercase" }}>Warnings</th>
              <th style={{ padding: "12px 16px", fontWeight: 800, color: "#334155", fontSize: "11px", textTransform: "uppercase" }}>Email Invite</th>
              <th style={{ padding: "12px 16px", fontWeight: 800, color: "#334155", fontSize: "11px", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: "48px 20px", textAlign: "center", color: "#64748B" }}>
                  <Users size={36} color="#CBD5E1" style={{ margin: "0 auto 10px" }} />
                  <p style={{ fontWeight: 700, margin: 0 }}>No candidates found</p>
                  <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>Click "Upload Excel Candidates" or "Add Candidate" above to assign candidates.</p>
                </td>
              </tr>
            ) : (
              filteredCandidates
                .slice((currentPage - 1) * pageSize, Math.min(filteredCandidates.length, currentPage * pageSize))
                .map((c: any) => {
                const att = c.attempt;
                const isPassed = att?.isPassed;

                return (
                  <tr key={c.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 800, color: "#0F172A" }}>{c.name}</div>
                      <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>{c.email} • {c.phone}</div>
                    </td>

                    <td style={{ padding: "14px 16px", fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: "#334155" }}>
                      {c.applicationId || c.referenceId}
                    </td>

                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 800,
                        background: c.status === "COMPLETED" ? "#DCFCE7" : c.status === "LOCKED" ? "#FEE2E2" : c.status === "IN_PROGRESS" ? "#FEF3C7" : "#F1F5F9",
                        color: c.status === "COMPLETED" ? "#166534" : c.status === "LOCKED" ? "#991B1B" : c.status === "IN_PROGRESS" ? "#92400E" : "#475569"
                      }}>
                        {c.status}
                      </span>
                    </td>

                    <td style={{ padding: "14px 16px", fontWeight: 800, color: att ? "#0F172A" : "#94A3B8" }}>
                      {att ? `${att.score} / ${att.totalPossibleScore || 60}` : "—"}
                      {att && <span style={{ fontSize: "11px", color: "#64748B", marginLeft: "4px" }}>({att.percentage}%)</span>}
                    </td>

                    <td style={{ padding: "14px 16px" }}>
                      {att ? (
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 800,
                          background: isPassed ? "#ECFDF5" : "#FEF2F2",
                          color: isPassed ? "#059669" : "#DC2626"
                        }}>
                          {isPassed ? "QUALIFIED" : "NOT QUALIFIED"}
                        </span>
                      ) : (
                        <span style={{ color: "#94A3B8", fontSize: "12px" }}>—</span>
                      )}
                    </td>

                    <td style={{ padding: "14px 16px" }}>
                      {att ? (
                        <span style={{ fontWeight: 700, color: att.warningCount > 0 ? "#DC2626" : "#64748B", fontSize: "12px" }}>
                          {att.warningCount} / 3
                        </span>
                      ) : "0 / 3"}
                    </td>

                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "10px",
                        fontWeight: 800,
                        background: c.emailStatus === "SENT" ? "#E0F2FE" : c.emailStatus === "FAILED" ? "#FEE2E2" : "#F1F5F9",
                        color: c.emailStatus === "SENT" ? "#0369A1" : c.emailStatus === "FAILED" ? "#B91C1C" : "#64748B"
                      }}>
                        {c.emailStatus || "PENDING"}
                      </span>
                    </td>

                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleDownloadSingleExcel(c.id)}
                          title="Download Individual Candidate Excel Scorecard (4 Sheets)"
                          style={{ padding: "6px 10px", borderRadius: "8px", background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0", fontSize: "11px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          <FileSpreadsheet size={12} /> Excel
                        </button>

                        <button
                          onClick={() => { setSelectedCandidateId(c.id); setIsReportModalOpen(true); }}
                          title="View Full Report & Proctoring Screenshots"
                          style={{ padding: "6px 10px", borderRadius: "8px", background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", fontSize: "11px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          <FileText size={12} /> Report
                        </button>

                        {c.status === "LOCKED" && (
                          <button
                            onClick={() => handleUnlockCandidate(c.id, c.name)}
                            title="Unlock Candidate"
                            style={{ padding: "6px 10px", borderRadius: "8px", background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0", fontSize: "11px", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                          >
                            <Lock size={12} /> Unlock
                          </button>
                        )}

                        <button
                          onClick={() => handleSendInvite(c.id, c.email)}
                          title="Send / Resend Email Invitation"
                          style={{ padding: "6px 8px", borderRadius: "8px", background: "#F8FAFC", color: "#475569", border: "1px solid #CBD5E1", cursor: "pointer" }}
                        >
                          <Mail size={12} />
                        </button>

                        <button
                          onClick={() => setDeleteCandidateTarget({ id: c.id, name: c.name })}
                          title="Delete Candidate"
                          style={{ padding: "6px 8px", borderRadius: "8px", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FCA5A5", cursor: "pointer" }}
                        >
                          <XCircle size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* 30 PER PAGE PAGINATION CONTROLS */}
        {filteredCandidates.length > 0 && (
          <div style={{ padding: "14px 20px", background: "#F8FAFC", borderTop: "1px solid #CBD5E1", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", fontSize: "12px", fontWeight: 700, color: "#475569" }}>
            <div>
              Showing <strong style={{ color: "#0F172A" }}>{(currentPage - 1) * pageSize + 1}</strong> to <strong style={{ color: "#0F172A" }}>{Math.min(filteredCandidates.length, currentPage * pageSize)}</strong> of <strong style={{ color: "#0F172A" }}>{filteredCandidates.length}</strong> candidates
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "white", color: "#334155", fontWeight: 800, cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                Previous
              </button>

              <span style={{ padding: "6px 12px", background: "white", border: "1px solid #CBD5E1", borderRadius: "8px", color: "#00AEEF", fontWeight: 900 }}>
                Page {currentPage} of {Math.max(1, Math.ceil(filteredCandidates.length / pageSize))}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(Math.ceil(filteredCandidates.length / pageSize), p + 1))}
                disabled={currentPage >= Math.ceil(filteredCandidates.length / pageSize)}
                style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "white", color: "#334155", fontWeight: 800, cursor: currentPage >= Math.ceil(filteredCandidates.length / pageSize) ? "not-allowed" : "pointer", opacity: currentPage >= Math.ceil(filteredCandidates.length / pageSize) ? 0.5 : 1 }}
              >
                Next
              </button>

              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                style={{ marginLeft: "8px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "white", fontWeight: 700, color: "#334155", fontSize: "12px" }}
              >
                <option value={30}>30 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* SINGLE CANDIDATE ADD MODAL */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ background: "white", borderRadius: "18px", maxWidth: "460px", width: "100%", padding: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", margin: "0 0 16px" }}>Add Candidate Manually</h3>
            <form onSubmit={handleAddSingleCandidate} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aftab Sk"
                  value={singleCandidate.name}
                  onChange={(e) => setSingleCandidate({ ...singleCandidate, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. candidate@example.com"
                  value={singleCandidate.email}
                  onChange={(e) => setSingleCandidate({ ...singleCandidate, email: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={singleCandidate.phone}
                    onChange={(e) => setSingleCandidate({ ...singleCandidate, phone: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>Application ID</label>
                  <input
                    type="text"
                    placeholder="APP-10293"
                    value={singleCandidate.applicationId}
                    onChange={(e) => setSingleCandidate({ ...singleCandidate, applicationId: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #E2E8F0" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: "8px 16px", borderRadius: "8px", background: "#F1F5F9", color: "#475569", border: "1px solid #CBD5E1", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingCandidate}
                  style={{ padding: "8px 18px", borderRadius: "8px", background: "#00AEEF", color: "white", border: "none", fontWeight: 800, fontSize: "12px", cursor: "pointer" }}
                >
                  {addingCandidate ? "Adding..." : "Add Candidate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXCEL UPLOAD MODAL WITH PREVIEW */}
      {showExcelModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ background: "white", borderRadius: "20px", maxWidth: "680px", width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", margin: 0 }}>Bulk Upload Candidates (Excel / CSV)</h3>
                <p style={{ fontSize: "12px", color: "#64748B", margin: "4px 0 0" }}>Upload .csv/.tsv or paste rows: Name, Email, Phone, Application ID</p>
              </div>
              <button onClick={() => setShowExcelModal(false)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}>✕</button>
            </div>

            {/* File Upload / Paste Toggle */}
            <div style={{ border: "2px dashed #CBD5E1", borderRadius: "12px", padding: "20px", textAlign: "center", background: "#F8FAFC", marginBottom: "16px" }}>
              <input type="file" accept=".csv,.txt,.tsv" onChange={handleFileUpload} style={{ display: "none" }} id="excel-file-input" />
              <label htmlFor="excel-file-input" style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "#003F72", color: "white", borderRadius: "8px", fontWeight: 700, fontSize: "12px" }}>
                <Upload size={14} /> Browse CSV File
              </label>
              <span style={{ fontSize: "12px", color: "#64748B", margin: "0 10px" }}>or paste table below</span>
            </div>

            <textarea
              rows={5}
              placeholder={"Name,Email,Phone,ApplicationID\nAftab Sk,aftab@example.com,9876543210,APP-001\nRahul Roy,rahul@example.com,9876543211,APP-002"}
              value={excelText}
              onChange={(e) => handleParseText(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", fontFamily: "monospace", color: "#0F172A", marginBottom: "16px" }}
            />

            {/* Validation Preview Table */}
            {parsedRows.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: "#334155" }}>
                    Parsed Preview ({parsedRows.filter(r => r.valid).length} Valid / {parsedRows.length} Total)
                  </span>
                </div>
                <div style={{ maxHeight: "180px", overflowY: "auto", border: "1px solid #E2E8F0", borderRadius: "8px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "#F1F5F9", borderBottom: "1px solid #CBD5E1" }}>
                        <th style={{ padding: "6px 10px" }}>Name</th>
                        <th style={{ padding: "6px 10px" }}>Email</th>
                        <th style={{ padding: "6px 10px" }}>Phone</th>
                        <th style={{ padding: "6px 10px" }}>App ID</th>
                        <th style={{ padding: "6px 10px" }}>Validation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRows.map((r, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9", background: r.valid ? "white" : "#FEF2F2" }}>
                          <td style={{ padding: "6px 10px", fontWeight: 700 }}>{r.name}</td>
                          <td style={{ padding: "6px 10px" }}>{r.email}</td>
                          <td style={{ padding: "6px 10px" }}>{r.phone || "—"}</td>
                          <td style={{ padding: "6px 10px" }}>{r.applicationId || "—"}</td>
                          <td style={{ padding: "6px 10px" }}>
                            <span style={{ padding: "2px 6px", borderRadius: "4px", fontSize: "9px", fontWeight: 800, background: r.valid ? "#DCFCE7" : "#FEE2E2", color: r.valid ? "#166534" : "#991B1B" }}>
                              {r.valid ? "VALID" : "INVALID"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Upload Result Alert */}
            {uploadResult && (
              <div style={{ padding: "10px 14px", borderRadius: "8px", background: uploadResult.success ? "#ECFDF5" : "#FEF2F2", color: uploadResult.success ? "#065F46" : "#991B1B", fontSize: "12px", fontWeight: 700, marginBottom: "16px" }}>
                {uploadResult.message}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setShowExcelModal(false)}
                style={{ padding: "9px 16px", borderRadius: "8px", background: "#F1F5F9", color: "#475569", border: "1px solid #CBD5E1", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}
              >
                Close
              </button>
              <button
                type="button"
                disabled={uploadingExcel || parsedRows.filter(r => r.valid).length === 0}
                onClick={handleConfirmExcelUpload}
                style={{ padding: "9px 20px", borderRadius: "8px", background: "#00AEEF", color: "white", border: "none", fontWeight: 800, fontSize: "12px", cursor: "pointer" }}
              >
                {uploadingExcel ? "Processing..." : `Assign ${parsedRows.filter(r => r.valid).length} Candidates`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK EMAIL INVITATION MODAL */}
      {showEmailModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ background: "white", borderRadius: "20px", maxWidth: "480px", width: "100%", padding: "28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", textAlign: "center" }}>
            <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#EFF6FF", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Mail size={28} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", margin: "0 0 6px" }}>Send Email Invitations</h3>
            <p style={{ fontSize: "12px", color: "#64748B", lineHeight: 1.5, marginBottom: "20px" }}>
              Dispatch official Niva Bupa assessment invitations with personalized unique links to all assigned candidates via Authenticated SMTP.
            </p>

            {emailProgress && (
              <div
                style={{
                  padding: "14px",
                  borderRadius: "12px",
                  background:
                    emailProgress.status === "COMPLETED"
                      ? emailProgress.sent > 0
                        ? "#ECFDF5"
                        : "#FEF2F2"
                      : "#EFF6FF",
                  color:
                    emailProgress.status === "COMPLETED"
                      ? emailProgress.sent > 0
                        ? "#065F46"
                        : "#991B1B"
                      : "#0369A1",
                  border:
                    emailProgress.status === "COMPLETED"
                      ? emailProgress.sent > 0
                        ? "1px solid #A7F3D0"
                        : "1px solid #FECACA"
                      : "1px solid #BAE6FD",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginBottom: "16px",
                  textAlign: "left",
                }}
              >
                {emailProgress.status === "COMPLETED" ? (
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: "4px" }}>
                      {emailProgress.sent > 0
                        ? `✅ Dispatched: ${emailProgress.sent} Sent • ${emailProgress.failed} Failed (Total: ${emailProgress.total})`
                        : `❌ Dispatch Failed: 0 Sent • ${emailProgress.failed} Failed (Total: ${emailProgress.total})`}
                    </div>
                    {emailProgress.message && (
                      <div style={{ fontSize: "11px", fontWeight: 600, opacity: 0.9 }}>
                        {emailProgress.message}
                      </div>
                    )}
                    {emailProgress.failed > 0 && emailProgress.sent === 0 && (
                      <div style={{ fontSize: "11px", marginTop: "6px", color: "#B91C1C", fontWeight: 700 }}>
                        ⚠️ SMTP is not connected. Go to <a href="/admin/settings" style={{ textDecoration: "underline", color: "#0284C7" }}>System Settings</a> to configure your SMTP credentials.
                      </div>
                    )}
                  </div>
                ) : (
                  <div>⏳ {emailProgress.message}</div>
                )}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
                style={{ padding: "10px 18px", borderRadius: "8px", background: "#F1F5F9", color: "#475569", border: "1px solid #CBD5E1", fontWeight: 700, fontSize: "12px", cursor: "pointer" }}
              >
                Close
              </button>
              <button
                type="button"
                disabled={sendingEmails}
                onClick={handleSendBulkInvites}
                style={{ padding: "10px 24px", borderRadius: "8px", background: "#0284C7", color: "white", border: "none", fontWeight: 800, fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
              >
                {sendingEmails ? "Sending Batch..." : "Start Sending Invites"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANDIDATE REPORT & SCREENSHOTS MODAL */}
      <CandidateReportModal
        candidateId={selectedCandidateId}
        isOpen={isReportModalOpen}
        onClose={() => { setIsReportModalOpen(false); setSelectedCandidateId(null); }}
        onRefresh={loadDashboard}
      />

      {/* Modern Confirm Delete Candidate Modal */}
      <ConfirmModal
        isOpen={!!deleteCandidateTarget}
        title="Delete Candidate Record"
        message={`Are you sure you want to permanently delete candidate '${deleteCandidateTarget?.name}'? This will remove all their exam attempt and proctoring data.`}
        confirmText="Delete Candidate"
        cancelText="Cancel"
        isDanger={true}
        loading={deletingCandidate}
        onConfirm={confirmDeleteCandidate}
        onCancel={() => { if (!deletingCandidate) setDeleteCandidateTarget(null); }}
      />

      {/* Modern Floating Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}
