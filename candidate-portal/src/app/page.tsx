import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import "./exam/exam.css";
import {
  ArrowRight, ShieldCheck, Clock, CheckCircle2,
  Award, Users, BarChart3, Lock, Mic, Heart, Volume2, Star
} from "lucide-react";

const sections = [
  {
    num: "01",
    module: "AUM Module",
    time: "5 mins",
    title: "Communication & Advanced English",
    desc: "10 Questions evaluating senior customer interaction, empathy, and professional vocabulary.",
    color: "#00AEEF",
    bg: "#EBF7FF",
    border: "#B3E0F9",
  },
  {
    num: "02",
    module: "AUM Module",
    time: "5 mins",
    title: "Mental Ability & Applied Math",
    desc: "10 Questions evaluating series completion, conversion rates, and logical reasoning.",
    color: "#0090C8",
    bg: "#E0F2FE",
    border: "#7DD3FC",
  },
  {
    num: "03",
    module: "AUM Module",
    time: "5 mins",
    title: "Sales Readiness & Insurance Awareness",
    desc: "10 Questions assessing objection handling, targets mindset, and insurance policy awareness.",
    color: "#F7941D",
    bg: "#FEF3E2",
    border: "#FCD38A",
  },
  {
    num: "04",
    module: "ARM Banca Module",
    time: "5 mins",
    title: "Customer Handling & English",
    desc: "10 Questions evaluating consultative objection handling, active listening, and grammar.",
    color: "#003F72",
    bg: "#E8F0F8",
    border: "#9FC3DE",
  },
  {
    num: "05",
    module: "ARM Banca Module",
    time: "5 mins",
    title: "Numerical Reasoning & Banking",
    desc: "10 Questions covering EMI calculations, returns, savings accounts, and financial concepts.",
    color: "#16A34A",
    bg: "#DCFCE7",
    border: "#86EFAC",
  },
  {
    num: "06",
    module: "ARM Banca Module",
    time: "5 mins",
    title: "Sales Orientation & Situational Judgement",
    desc: "10 Questions testing Banca branch walk-in conversion, relationship management, and sales ethics.",
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
    icon: Mic,
    iconColor: "#7C3AED",
    iconBg: "#F3E8FF",
    title: "Role-Play Voice Pitch Engine",
    desc: "3-5 minute live voice recording roleplay with instant HR committee audio review & grading.",
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

          {/* Prominent Center Hero Logo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
            <Image
              src="/niva-bupa-logo.png"
              alt="Niva Bupa Health Insurance"
              width={210}
              height={191}
              priority
              style={{
                height: "clamp(90px, 18vw, 130px)",
                width: "auto",
                borderRadius: "18px",
                boxShadow: "0 10px 30px rgba(0, 160, 230, 0.28)",
                objectFit: "contain"
              }}
            />
          </div>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(0,174,239,0.1)", border: "1.5px solid rgba(0,174,239,0.3)",
            padding: "8px 20px", borderRadius: "50px",
            fontSize: "12px", fontWeight: 800, color: "#003F72",
            letterSpacing: "0.06em", textTransform: "uppercase",
            marginBottom: "20px",
          }}>
            <Heart size={14} color="#F7941D" fill="#F7941D" />
            Banca Channel ARM & AUM Recruitment Assessment
          </div>

          <h1 style={{
            fontSize: "clamp(28px, 6vw, 54px)", fontWeight: 900,
            color: "#1A2B40", lineHeight: 1.2, letterSpacing: "-0.02em",
            maxWidth: "820px", margin: "0 auto 16px",
          }}>
            Niva Bupa Health Insurance Assessment{" "}
            <span style={{ color: "#00AEEF" }}>
              (AUM + ARM Banca Modules)
            </span>
          </h1>

          <p style={{
            fontSize: "clamp(14px, 2.5vw, 17px)", color: "#4A6580",
            maxWidth: "680px", margin: "0 auto 36px", lineHeight: 1.7, fontWeight: 500
          }}>
            Comprehensive 2-module assessment measuring customer handling, numerical reasoning,
            financial awareness, sales orientation, and practical role-play simulations.
          </p>

          {/* Large CTA Button */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <Link href="/exam" style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "18px 40px", borderRadius: "16px",
              background: "linear-gradient(135deg, #0090C8, #00AEEF)",
              color: "white", fontWeight: 900, fontSize: "17px",
              textDecoration: "none",
              boxShadow: "0 10px 30px rgba(0,174,239,0.4)",
              transition: "all 0.2s",
            }}>
              Begin Candidate Exam
              <ArrowRight size={20} />
            </Link>
          </div>

        </section>

        {/* ── STATS STRIP ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px", marginBottom: "48px",
        }}>
          {[
            { label: "Total Duration", value: "30 Min", color: "#00AEEF" },
            { label: "Total Questions", value: "60 Qs", color: "#F7941D" },
            { label: "Passing Cutoff", value: "30 Correct", color: "#16A34A" },
            { label: "Simulation Marks", value: "30 Pts", color: "#003F72" },
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
              Assigned Assessment Structure — 2 Modules (12 Sections) | 60 Questions | 30 Minutes
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
                    {s.module}
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

        {/* ── PRACTICAL ROLEPLAY SIMULATION ── */}
        <section style={{
          background: "linear-gradient(135deg, #002D54 0%, #005A9C 55%, #0090C8 100%)",
          borderRadius: "24px", padding: "clamp(24px,4vw,36px)",
          marginBottom: "48px", position: "relative", overflow: "hidden",
          boxShadow: "0 12px 40px rgba(0,45,84,0.28)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          alignItems: "center"
        }}>
          <div style={{
            position: "absolute", top: "-50px", right: "-50px",
            width: "200px", height: "200px", borderRadius: "50%",
            background: "rgba(247,148,29,0.18)",
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "rgba(247,148,29,0.25)", border: "1px solid rgba(247,148,29,0.45)",
              color: "#FFD28A", fontSize: "11px", fontWeight: 800,
              letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "6px 14px", borderRadius: "50px", marginBottom: "14px",
            }}>
              <Mic size={13} />
              Practical Assessment • 30 Marks
            </div>
            <h3 style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 900, color: "white", marginBottom: "12px", lineHeight: 1.25 }}>
              5-Minute Practical Sales Simulation
            </h3>
            <p style={{ fontSize: "clamp(12px,2.5vw,14px)", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, fontWeight: 500 }}>
              Candidates conduct a 3–5 minute roleplay scenario converting a Fixed Deposit walk-in
              customer into a Health Insurance discussion. Recorded live & evaluated by HR committee.
            </p>
          </div>

          {/* Right Side Glassmorphic Scorecard Preview */}
          <div style={{
            position: "relative", zIndex: 1,
            background: "rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.22)",
            borderRadius: "20px", padding: "20px",
            color: "white"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", width: "100%" }}>
              <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#FFD28A", display: "flex", alignItems: "center", gap: "6px" }}>
                <Star size={13} /> 6 HR Evaluation Criteria (30 Pts)
              </span>
              <span style={{ fontSize: "10px", background: "rgba(255,255,255,0.2)", padding: "2px 8px", borderRadius: "10px", fontWeight: 700, marginLeft: "auto" }}>
                5 Marks Each
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "11px", fontWeight: 700 }}>
              {[
                "Communication Clarity", "Confidence & Presence",
                "Customer Listening", "Questioning / Discovery",
                "Sales Orientation", "Simple Explanation"
              ].map((c) => (
                <div key={c} style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  padding: "8px 10px", borderRadius: "10px",
                  display: "flex", alignItems: "center", gap: "6px"
                }}>
                  <CheckCircle2 size={13} color="#4ADE80" />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c}</span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: "14px", paddingTop: "12px",
              borderTop: "1px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", gap: "8px",
              fontSize: "11px", color: "rgba(255,255,255,0.9)", fontWeight: 600
            }}>
              <Volume2 size={15} color="#FFD28A" />
              <span>Full Audio Recording saved to HR Admin Portal</span>
            </div>
          </div>

        </section>

        {/* ── FEATURES STRIP ── */}
        <section style={{ marginBottom: "56px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
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

      {/* ── PROMINENT FOOTER ── */}
      <footer style={{
        background: "white", borderTop: "1.5px solid #C8E8F8",
        padding: "28px 16px", textAlign: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
          <Image
            src="/niva-bupa-logo.png"
            alt="Niva Bupa Health Insurance"
            width={210}
            height={191}
            style={{
              height: "clamp(56px, 10vw, 75px)",
              width: "auto",
              borderRadius: "12px",
              boxShadow: "0 4px 14px rgba(0, 160, 230, 0.18)",
              objectFit: "contain"
            }}
          />
        </div>
        <p style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>
          © 2026 Niva Bupa Health Insurance • ARM Banca Channel Recruitment Assessment Platform
        </p>
      </footer>
    </div>
  );
}
