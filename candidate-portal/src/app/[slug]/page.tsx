"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import CameraProctor from "@/components/CameraProctor";
import "../exam/exam.css";
import { User, Mail, Phone, Hash, ArrowRight, BookOpen, AlertTriangle, ShieldCheck, Clock } from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

interface AssessmentOption {
  id: string;
  name: string;
  description: string;
}

export default function DynamicAssessmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("");
  const [formData, setFormData] = useState({
    applicationId: "",
    name: "",
    email: "",
    phone: "",
    referenceId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeAssessment, setActiveAssessment] = useState<any>(null);
  const [isAssessmentExpired, setIsAssessmentExpired] = useState<boolean>(false);
  const [isAssessmentNotStarted, setIsAssessmentNotStarted] = useState<boolean>(false);

  useEffect(() => {
    async function loadAssessmentFromSlug() {
      try {
        const baseUrl = getApiBaseUrl();
        const targetIdentifier = slug;

        if (targetIdentifier) {
          const res = await fetch(`${baseUrl}/api/v1/candidates/assessments/details/${targetIdentifier}`);
          const data = await res.json();
          if (data.success && data.assessment) {
            setActiveAssessment(data.assessment);
            setSelectedAssessmentId(data.assessment.id);
            if (data.assessment.isExpired) {
              setIsAssessmentExpired(true);
              setError("This assessment session link is no longer active or has expired. Please contact your HR Administrator for a valid link.");
            } else if (data.assessment.isNotStarted) {
              setIsAssessmentNotStarted(true);
              const fromTime = data.assessment.activeFrom
                ? new Date(data.assessment.activeFrom).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
                : "a scheduled time";
              setError(`This assessment session hasn't started yet. It will be accessible from ${fromTime}.`);
            }
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load target assessment details:", err);
      }
    }
    loadAssessmentFromSlug();
  }, [slug]);

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

      let res = await fetch(`${baseUrl}/api/v1/candidates/verify-and-start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: formData.applicationId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          assessmentId: selectedAssessmentId || slug,
        }),
      });

      if (!res.ok) {
        res = await fetch(`${baseUrl}/api/v1/candidates/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicationId: formData.applicationId,
            referenceId: formData.applicationId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            assessmentId: selectedAssessmentId || slug,
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
          assessmentId: selectedAssessmentId || slug,
        };
        localStorage.setItem("banca_candidate", JSON.stringify(candidateObj));
        if (data.questions) {
          localStorage.setItem("banca_exam_session", JSON.stringify(data));
        }
        router.push("/exam/test");
      } else {
        const fallbackCand = {
          id: `cand-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          applicationId: formData.applicationId,
          referenceId: formData.applicationId,
          assessmentId: selectedAssessmentId || slug,
        };
        localStorage.setItem("banca_candidate", JSON.stringify(fallbackCand));
        router.push("/exam/test");
      }
    } catch {
      const fallbackCand = {
        id: `cand-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        applicationId: formData.applicationId,
        referenceId: formData.applicationId,
        assessmentId: selectedAssessmentId || slug,
      };
      localStorage.setItem("banca_candidate", JSON.stringify(fallbackCand));
      router.push("/exam/test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(160deg, #E8F6FD 0%, #F4FAFF 50%, #FFF8EE 100%)", display: "flex", flexDirection: "column" }}>
      <Navbar mode="public" />

      <main style={{ flex: 1, padding: "clamp(16px, 4vw, 36px) 16px 48px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "860px", background: "white", borderRadius: "24px", border: "1.5px solid #C8E8F8", boxShadow: "0 16px 48px rgba(0,63,114,0.12)", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg, #003F72, #00AEEF)", padding: "28px 32px", color: "white" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.18)", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "10px" }}>
              <BookOpen size={12} /> OFFICIAL ASSESSMENT SESSION
            </div>
            <h1 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 900, marginBottom: "6px" }}>
              {activeAssessment?.name || "Niva Bupa Health Insurance Assessment"}
            </h1>
            <p style={{ fontSize: "13px", opacity: 0.9, margin: 0 }}>
              {activeAssessment?.description || "Enter your Application ID to begin candidate verification & proctored assessment"}
            </p>
          </div>

          <div style={{ padding: "clamp(20px, 4vw, 36px)" }}>
            {error && (
              <div style={{ background: "#FEF2F2", border: "1.5px solid #FCA5A5", borderRadius: "12px", padding: "14px 18px", color: "#B91C1C", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                <AlertTriangle size={18} color="#DC2626" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleStart} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#1A2B40", marginBottom: "6px", textTransform: "uppercase" }}>
                  Headstart Application ID *
                </label>
                <div style={{ position: "relative" }}>
                  <Hash size={16} color="#00AEEF" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. APP-882019"
                    value={formData.applicationId}
                    onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                    disabled={isAssessmentExpired || isAssessmentNotStarted}
                    style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "10px", border: "1.5px solid #CBD5E1", fontSize: "14px", fontWeight: 600, color: "#0F172A" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#1A2B40", marginBottom: "6px", textTransform: "uppercase" }}>
                    Candidate Name *
                  </label>
                  <div style={{ position: "relative" }}>
                    <User size={16} color="#00AEEF" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={isAssessmentExpired || isAssessmentNotStarted}
                      style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "10px", border: "1.5px solid #CBD5E1", fontSize: "14px", fontWeight: 600, color: "#0F172A" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#1A2B40", marginBottom: "6px", textTransform: "uppercase" }}>
                    Email Address *
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} color="#00AEEF" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="email"
                      required
                      placeholder="candidate@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isAssessmentExpired || isAssessmentNotStarted}
                      style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "10px", border: "1.5px solid #CBD5E1", fontSize: "14px", fontWeight: 600, color: "#0F172A" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 800, color: "#1A2B40", marginBottom: "6px", textTransform: "uppercase" }}>
                    Phone Number *
                  </label>
                  <div style={{ position: "relative" }}>
                    <Phone size={16} color="#00AEEF" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="tel"
                      required
                      placeholder="Mobile Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={isAssessmentExpired || isAssessmentNotStarted}
                      style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "10px", border: "1.5px solid #CBD5E1", fontSize: "14px", fontWeight: 600, color: "#0F172A" }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "12px", paddingTop: "20px", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  disabled={loading || isAssessmentExpired || isAssessmentNotStarted}
                  style={{ padding: "14px 32px", borderRadius: "12px", background: isAssessmentExpired || isAssessmentNotStarted ? "#94A3B8" : "linear-gradient(135deg, #003F72, #00AEEF)", color: "white", fontWeight: 800, fontSize: "15px", border: "none", cursor: isAssessmentExpired || isAssessmentNotStarted ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: "10px", boxShadow: "0 6px 20px rgba(0,63,114,0.2)" }}
                >
                  {loading ? "Verifying with CRM..." : "Start Assessment"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
