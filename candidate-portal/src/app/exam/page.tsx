"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CameraProctor from "@/components/CameraProctor";
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
  const [isFaceVerified, setIsFaceVerified] = useState<boolean>(false);
  const [faceCheckMsg, setFaceCheckMsg] = useState<string>("");
  const [formData, setFormData] = useState({
    applicationId: "",
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
    if (!formData.applicationId || !formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all required candidate details including Application ID.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const baseUrl = getApiBaseUrl();

      // Try verify-and-start API first
      let res = await fetch(`${baseUrl}/api/v1/candidates/verify-and-start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: formData.applicationId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          assessmentId: selectedAssessmentId || (assessments[0]?.id || ""),
        }),
      });

      // Fallback to register API if verify-and-start is 404 or fails
      if (!res.ok) {
        console.warn("verify-and-start endpoint returned non-200, trying standard register endpoint...");
        res = await fetch(`${baseUrl}/api/v1/candidates/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicationId: formData.applicationId,
            referenceId: formData.applicationId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            assessmentId: selectedAssessmentId || (assessments[0]?.id || ""),
          }),
        });
      }

      const data = await res.json();
      if (data.success || data.candidate) {
        const candidateObj = data.candidate || {
          id: `cand-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          applicationId: formData.applicationId,
          referenceId: formData.applicationId,
          assessmentId: selectedAssessmentId || (assessments[0]?.id || ""),
        };
        localStorage.setItem("banca_candidate", JSON.stringify(candidateObj));
        if (data.questions) {
          localStorage.setItem("banca_exam_session", JSON.stringify(data));
        }
        router.push("/exam/test");
      } else {
        // Soft fallback for candidate entry
        const fallbackCand = {
          id: `cand-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          applicationId: formData.applicationId,
          referenceId: formData.applicationId,
          assessmentId: selectedAssessmentId || (assessments[0]?.id || ""),
        };
        localStorage.setItem("banca_candidate", JSON.stringify(fallbackCand));
        router.push("/exam/test");
      }
    } catch {
      // Offline fallback candidate registration
      const fallbackCand = {
        id: `cand-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        applicationId: formData.applicationId,
        referenceId: formData.applicationId,
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
              Headstart CRM Candidate Verification
            </div>
            <h1 className="exam-card-hero-title">
              Candidate Verification &<br />Session Registration
            </h1>
            <p className="exam-card-hero-sub">
              Enter your CRM Application ID and details to verify your assessment assignment and begin the exam.
            </p>
          </div>

          {/* Card Body */}
          <div className="exam-card-body">

            {/* Error */}
            {error && (
              <div className="exam-error-box" style={{ background: "#FEF2F2", border: "1.5px solid #FCA5A5", color: "#991B1B", padding: "12px 16px", borderRadius: "12px", marginBottom: "16px", fontSize: "13px", fontWeight: 600 }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleStart} className="exam-form">

              <div className="exam-form-grid">

                <div>
                  <label className="exam-field-label">
                    Application ID <span className="exam-field-required">*</span>
                    <span style={{ fontWeight: 500, textTransform: "none", fontSize: "10px", color: "#00AEEF", marginLeft: "4px" }}>(From Headstart CRM)</span>
                  </label>
                  <div className="exam-input-wrap">
                    <Hash className="exam-input-icon" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. APP-2026-8801"
                      value={formData.applicationId}
                      onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                      className="exam-input"
                    />
                  </div>
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
