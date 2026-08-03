import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import "./exam/exam.css";
import {
  ArrowRight, ShieldCheck, Clock, CheckCircle2,
  Award, Users, BarChart3, Lock, Mic, Heart
} from "lucide-react";

const sections = [
  {
    num: "01",
    weight: "20%",
    time: "10 mins",
    title: "Communication & Customer Handling",
    desc: "10 Questions testing senior customer interaction, empathy, and active listening skills.",
    color: "#00AEEF",
    bg: "#EBF7FF",
    border: "#B3E0F9",
  },
  {
    num: "02",
    weight: "15%",
    time: "10 mins",
    title: "Basic English",
    desc: "10 Questions assessing practical business grammar, vocabulary, and professional phrasing.",
    color: "#0090C8",
    bg: "#E0F2FE",
    border: "#7DD3FC",
  },
  {
    num: "03",
    weight: "15%",
    time: "10 mins",
    title: "Mental Ability & Reasoning",
    desc: "10 Questions evaluating series completion, coding-decoding, and logical problem solving.",
    color: "#F7941D",
    bg: "#FEF3E2",
    border: "#FCD38A",
  },
  {
    num: "04",
    weight: "20%",
    time: "15 mins",
    title: "Basic Maths & Numerical Ability",
    desc: "10 Questions focusing on practical conversion rates, percentage returns, and simple calculations.",
    color: "#003F72",
    bg: "#E8F0F8",
    border: "#9FC3DE",
  },
  {
    num: "05",
    weight: "15%",
    time: "10 mins",
    title: "Banking & Financial Awareness",
    desc: "10 Questions covering EMI, credit score, savings accounts, and basic life/health insurance concepts.",
    color: "#16A34A",
    bg: "#DCFCE7",
    border: "#86EFAC",
  },
  {
    num: "06",
    weight: "15%",
    time: "10 mins",
    title: "Sales Orientation & Judgement",
    desc: "10 Questions testing objection handling, targets mindset, and situational judgment in Banca environment.",
    color: "#D97706",
    bg: "#FEF3C7",
    border: "#FCD34D",
  },
];

const features = [
  {
    icon: Lock,
    iconColor: "#DC2626",
    iconBg: "#FEE2E2",
    title: "Anti-Cheating Proctoring",
    desc: "Auto-detection of Tab Switching, Window Blur, and Copy-Paste attempts logged in real time.",
  },
  {
    icon: BarChart3,
    iconColor: "#00AEEF",
    iconBg: "#EBF7FF",
    title: "Recommendation Engine",
    desc: "Automated decisioning: Strong Hire (85%+), Hire (70–84%), Maybe, or Reject.",
  },
  {
    icon: Users,
    iconColor: "#16A34A",
    iconBg: "#DCFCE7",
    title: "PDF Scorecard Export",
    desc: "One-click printable assessment scorecard with radar breakdown for interviewers.",
  },
];

export default function Home() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: "linear-gradient(160deg, #E8F6FD 0%, #F4FAFF 50%, #FFF8EE 100%)" }}>
      <Navbar mode="public" />

      <main style={{ flex: 1, maxWidth: "1160px", margin: "0 auto", width: "100%", padding: "0 16px" }}>

        {/* ── HERO ── */}
        <section style={{ textAlign: "center", padding: "52px 0 48px" }}>

          {/* Logo Hero */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
            <Image
              src="/niva-bupa-logo.svg"
              alt="Niva Bupa Health Insurance"
              width={200}
              height={70}
              priority
              style={{ height: "clamp(50px, 10vw, 70px)", width: "auto" }}
            />
          </div>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(0,174,239,0.1)", border: "1.5px solid rgba(0,174,239,0.3)",
            padding: "6px 16px", borderRadius: "50px",
            fontSize: "11px", fontWeight: 700, color: "#003F72",
            letterSpacing: "0.06em", textTransform: "uppercase",
            marginBottom: "20px",
          }}>
            <Heart size={12} color="#F7941D" fill="#F7941D" />
            Banca Channel ARM Recruitment Assessment
          </div>

          <h1 style={{
            fontSize: "clamp(26px, 6vw, 52px)", fontWeight: 900,
            color: "#1A2B40", lineHeight: 1.2, letterSpacing: "-0.02em",
            maxWidth: "780px", margin: "0 auto 16px",
          }}>
            Evaluate High-Potential{" "}
            <span style={{ color: "#00AEEF" }}>
              Assistant Relationship Managers
            </span>
          </h1>

          <p style={{
            fontSize: "clamp(13px, 2.5vw, 16px)", color: "#4A6580",
            maxWidth: "620px", margin: "0 auto 32px", lineHeight: 1.7,
          }}>
            Comprehensive multi-competency evaluation measuring customer handling, numerical reasoning,
            financial awareness, sales orientation, and practical role-play simulations.
          </p>

          {/* CTA */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <Link href="/exam" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "15px 32px", borderRadius: "14px",
              background: "linear-gradient(135deg, #0090C8, #00AEEF)",
              color: "white", fontWeight: 800, fontSize: "15px",
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(0,174,239,0.35)",
              transition: "all 0.2s",
            }}>
              Begin Candidate Exam
              <ArrowRight size={18} />
            </Link>
            <p style={{ fontSize: "11px", color: "#8BA4BE", fontWeight: 500 }}>
              65 Minutes • 60 MCQs + Practical Simulation
            </p>
          </div>

        </section>

        {/* ── STATS STRIP ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px", marginBottom: "48px",
        }}>
          {[
            { label: "Total Duration", value: "65 Min", color: "#00AEEF" },
            { label: "MCQ Questions", value: "60 Qs", color: "#F7941D" },
            { label: "Assessment Sections", value: "7 Sec", color: "#003F72" },
            { label: "Simulation Marks", value: "30 Pts", color: "#16A34A" },
          ].map((s) => (
            <div key={s.label} style={{
              background: "white", border: "1.5px solid #C8E8F8",
              borderRadius: "16px", padding: "18px 16px", textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,174,239,0.08)",
            }}>
              <div style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "#8BA4BE", fontWeight: 600, marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── SECTIONS GRID ── */}
        <section style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Award size={20} color="#00AEEF" />
            <h2 style={{ fontSize: "clamp(16px, 3vw, 20px)", fontWeight: 800, color: "#1A2B40" }}>
              Assessment Structure — 60 Questions | 60 Minutes
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "14px",
          }}>
            {sections.map((s) => (
              <div key={s.num} style={{
                background: "white", border: `1.5px solid ${s.border}`,
                borderRadius: "18px", padding: "20px",
                boxShadow: "0 2px 12px rgba(0,174,239,0.07)",
                transition: "transform 0.18s, box-shadow 0.18s",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{
                    display: "inline-block",
                    background: s.bg, border: `1.5px solid ${s.border}`,
                    color: s.color, fontSize: "10px", fontWeight: 800,
                    textTransform: "uppercase", letterSpacing: "0.06em",
                    padding: "4px 10px", borderRadius: "50px",
                  }}>
                    Section {s.num} • {s.weight}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#8BA4BE", fontWeight: 600 }}>
                    <Clock size={12} />
                    {s.time}
                  </span>
                </div>
                <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#1A2B40", marginBottom: "6px" }}>{s.title}</h3>
                <p style={{ fontSize: "12px", color: "#4A6580", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 7 ROLEPLAY BANNER ── */}
        <section style={{
          background: "linear-gradient(135deg, #003F72 0%, #0070B8 55%, #00AEEF 100%)",
          borderRadius: "24px", padding: "clamp(24px,5vw,40px)",
          marginBottom: "48px", position: "relative", overflow: "hidden",
          boxShadow: "0 12px 40px rgba(0,63,114,0.25)",
        }}>
          <div style={{
            position: "absolute", top: "-40px", right: "-40px",
            width: "160px", height: "160px", borderRadius: "50%",
            background: "rgba(247,148,29,0.18)",
          }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: "640px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "rgba(247,148,29,0.25)", border: "1px solid rgba(247,148,29,0.45)",
              color: "#FFD28A", fontSize: "10px", fontWeight: 800,
              letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "5px 12px", borderRadius: "50px", marginBottom: "14px",
            }}>
              <Mic size={11} />
              Practical Assessment • 30 Marks
            </div>
            <h3 style={{ fontSize: "clamp(18px,4vw,26px)", fontWeight: 900, color: "white", marginBottom: "10px" }}>
              Section 7: 5-Minute Practical Sales Simulation
            </h3>
            <p style={{ fontSize: "clamp(12px,2.5vw,14px)", color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              Candidates complete a 3–5 minute roleplay scenario converting a Fixed Deposit walk-in
              customer into a Health Insurance discussion. Evaluated on Clarity, Confidence, Need
              Discovery, and Simple Explanation.
            </p>
          </div>
        </section>

        {/* ── FEATURES STRIP ── */}
        <section style={{ marginBottom: "56px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "14px",
          }}>
            {features.map((f) => (
              <div key={f.title} style={{
                background: "white", border: "1.5px solid #C8E8F8",
                borderRadius: "18px", padding: "20px",
                display: "flex", gap: "14px", alignItems: "flex-start",
                boxShadow: "0 2px 10px rgba(0,174,239,0.07)",
              }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: f.iconBg, display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <f.icon size={20} color={f.iconColor} />
                </div>
                <div>
                  <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#1A2B40", marginBottom: "4px" }}>{f.title}</h4>
                  <p style={{ fontSize: "11.5px", color: "#4A6580", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "white", borderTop: "1.5px solid #C8E8F8",
        padding: "20px 16px", textAlign: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "6px" }}>
          <Image src="/niva-bupa-logo.svg" alt="Niva Bupa" width={90} height={32} style={{ height: "28px", width: "auto" }} />
        </div>
        <p style={{ fontSize: "11px", color: "#8BA4BE", fontWeight: 500 }}>
          © 2026 Niva Bupa Health Insurance • ARM Banca Channel Recruitment Assessment Platform
        </p>
      </footer>
    </div>
  );
}
