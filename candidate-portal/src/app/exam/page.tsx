"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import "../exam/exam.css";
import { User, Mail, Phone, Hash, ArrowRight, BookOpen } from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

interface AssessmentOption {
  id: string;
  name: string;
  description: string;
}

export default function CandidateRegistration() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<AssessmentOption[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    referenceId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/v1/assessments`);
        const data = await res.json();
        if (data.success && data.assessments && data.assessments.length > 0) {
          setAssessments(data.assessments);
          setSelectedAssessmentId(data.assessments[0].id);
        }
      } catch (err) {
        console.error("Failed to load assessments:", err);
      }
    }
    fetchAssessments();
  }, []);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all required candidate details.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/candidates/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          referenceId: formData.referenceId || `REF-${Date.now().toString().slice(-6)}`,
          assessmentId: selectedAssessmentId || (assessments[0]?.id || ""),
        }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("banca_candidate", JSON.stringify(data.candidate));
        router.push("/exam/test");
      } else {
        setError(data.message || "Failed to register candidate.");
      }
    } catch {
      // Fallback candidate registration
      const fallbackCand = {
        id: `cand-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        referenceId: formData.referenceId || `REF-BANK-1001`,
        assessmentId: selectedAssessmentId || (assessments[0]?.id || ""),
      };
      localStorage.setItem("banca_candidate", JSON.stringify(fallbackCand));
      router.push("/exam/test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exam-page">
      <Navbar mode="public" />

      <main className="exam-main">
        <div className="exam-card">

          {/* Hero Header */}
          <div className="exam-card-hero">
            <div className="exam-card-hero-badge">
              Assigned Candidate Verification
            </div>
            <h1 className="exam-card-hero-title">
              Candidate Verification &<br />Session Registration
            </h1>
            <p className="exam-card-hero-sub">
              Fill in your details below to initialize your assigned, secure, timed assessment test.
            </p>
          </div>

          {/* Card Body */}
          <div className="exam-card-body">

            {/* Error */}
            {error && (
              <div className="exam-error-box">{error}</div>
            )}

            {/* Form */}
            <form onSubmit={handleStart} className="exam-form">
              <div className="exam-form-grid">

                {/* Single Fixed Active Assessment Display */}
                <div style={{ gridColumn: "1 / -1", backgroundColor: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "12px", padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <BookOpen style={{ width: "20px", height: "20px", color: "#3b82f6" }} />
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#93c5fd", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Assigned Assessment (Fixed)
                    </span>
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: "0 0 6px 0" }}>
                    {assessments[0]?.name || "Niva Bupa Health Insurance Assessment"}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0, lineHeight: "1.5" }}>
                    Includes 2 Modules (AUM + ARM Banca) • 12 Sections • 60 Total Questions • 30 Minutes Duration
                  </p>
                </div>

                <div>
                  <label className="exam-field-label">
                    Full Name <span className="exam-field-required">*</span>
                  </label>
                  <div className="exam-input-wrap">
                    <User className="exam-input-icon" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aftab SK"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="exam-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="exam-field-label">
                    Email Address <span className="exam-field-required">*</span>
                  </label>
                  <div className="exam-input-wrap">
                    <Mail className="exam-input-icon" />
                    <input
                      type="email"
                      required
                      placeholder="aftab@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="exam-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="exam-field-label">
                    Mobile Number <span className="exam-field-required">*</span>
                  </label>
                  <div className="exam-input-wrap">
                    <Phone className="exam-input-icon" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="exam-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="exam-field-label">
                    Reference / Access Code
                    <span style={{ fontWeight: 500, textTransform: "none", fontSize: "9.5px", color: "#94A3B8", marginLeft: "4px" }}>(e.g. REF-BANK-1001)</span>
                  </label>
                  <div className="exam-input-wrap">
                    <Hash className="exam-input-icon" />
                    <input
                      type="text"
                      placeholder="e.g. REF-BANK-1001"
                      value={formData.referenceId}
                      onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                      className="exam-input"
                    />
                  </div>
                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="exam-submit-btn"
              >
                {loading ? (
                  <>
                    <span style={{ width: "16px", height: "16px", border: "2.5px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    <span>Initialising Session…</span>
                  </>
                ) : (
                  <>
                    <span>Begin Assessment Test</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
