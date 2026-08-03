"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import "../exam/exam.css";
import { User, Mail, Phone, Hash, AlertTriangle, ArrowRight } from "lucide-react";

export default function CandidateRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    referenceId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all required candidate details.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/v1/candidates/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          referenceId: formData.referenceId || `REF-${Date.now().toString().slice(-6)}`,
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
      // Fallback if NestJS backend is not yet running
      const fallbackCand = {
        id: `cand-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        referenceId: formData.referenceId || `REF-${Date.now().toString().slice(-6)}`,
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
              ARM Banca Recruitment Assessment
            </div>
            <h1 className="exam-card-hero-title">
              Candidate Verification &<br />Session Registration
            </h1>
            <p className="exam-card-hero-sub">
              Fill in your details below to initialise your secure, timed assessment session.
            </p>
          </div>

          {/* Card Body */}
          <div className="exam-card-body">

            {/* Instructions Notice */}
            <div className="exam-notice">
              <div className="exam-notice-icon">
                <AlertTriangle size={18} />
              </div>
              <div>
                <p className="exam-notice-title">Important — Read Before Starting</p>
                <ul className="exam-notice-list">
                  <li>Total Duration: <strong>65 Minutes</strong> (60 MCQs + Practical Sales Simulation).</li>
                  <li>Do <strong>NOT</strong> switch tabs or minimize the browser. Proctoring is active.</li>
                  <li>The exam auto-submits when the countdown timer reaches zero.</li>
                  <li>Results are confidential — scores are reviewed by HR only.</li>
                </ul>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="exam-error-box">{error}</div>
            )}

            {/* Form */}
            <form onSubmit={handleStart} className="exam-form">
              <div className="exam-form-grid">

                <div>
                  <label className="exam-field-label">
                    Full Name <span className="exam-field-required">*</span>
                  </label>
                  <div className="exam-input-wrap">
                    <User className="exam-input-icon" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anish Sharma"
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
                      placeholder="anish@example.com"
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
                    Reference / Application ID
                    <span style={{ fontWeight: 500, textTransform: "none", fontSize: "9.5px", color: "#94A3B8", marginLeft: "4px" }}>(optional)</span>
                  </label>
                  <div className="exam-input-wrap">
                    <Hash className="exam-input-icon" />
                    <input
                      type="text"
                      placeholder="e.g. REF-88219"
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
