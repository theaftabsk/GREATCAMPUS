"use client";

import Navbar from "@/components/Navbar";
import "./exam/exam.css";
import { Lock, BookOpen, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(160deg, #E8F6FD 0%, #F4FAFF 50%, #FFF8EE 100%)", display: "flex", flexDirection: "column" }}>
      <Navbar mode="public" />

      <main style={{ flex: 1, padding: "clamp(24px, 5vw, 60px) 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "760px", background: "white", borderRadius: "24px", border: "1.5px solid #C8E8F8", boxShadow: "0 16px 48px rgba(0,63,114,0.12)", overflow: "hidden", textAlign: "center" }}>
          
          {/* Header Banner */}
          <div style={{ background: "linear-gradient(135deg, #003F72, #00AEEF)", padding: "36px 32px", color: "white" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.18)", padding: "6px 14px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "12px" }}>
              <BookOpen size={13} /> NIVA BUPA HR EVALUATION & ASSESSMENT PORTAL
            </div>
            <h1 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 900, marginBottom: "8px" }}>
              Candidate Assessment Engine
            </h1>
            <p style={{ fontSize: "14px", opacity: 0.9, margin: 0, maxWidth: "560px", marginInline: "auto" }}>
              Secure Proctored Platform for Agency Unit Manager & ARM Banca Assessments
            </p>
          </div>

          {/* Access Restricted Box */}
          <div style={{ padding: "48px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "18px" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#FEF2F2", border: "2px solid #FCA5A5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock size={36} color="#DC2626" />
            </div>

            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", margin: 0 }}>
              Direct Access Restricted
            </h2>

            <p style={{ fontSize: "14px", color: "#475569", maxWidth: "540px", lineHeight: "1.65", margin: 0 }}>
              This portal does not host a public registration page. Candidates can only enter an exam using an official unique assessment URL provided by HR or Headstart CRM.
            </p>

            <div style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: "12px", padding: "12px 20px", fontSize: "13px", fontWeight: 600, color: "#334155", fontFamily: "monospace", marginTop: "8px" }}>
              Example Exam URL: http://localhost:3000/[session-slug]
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#166534", background: "#DCFCE7", padding: "6px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: 700, marginTop: "12px" }}>
              <ShieldCheck size={14} /> AI Proctoring & Headstart CRM Integration Active
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
