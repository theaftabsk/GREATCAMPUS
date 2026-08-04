"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

interface NavbarProps {
  mode?: "public" | "candidate";
  candidateName?: string;
}

export default function Navbar({ mode = "public", candidateName }: NavbarProps) {
  return (
    <header className="nb-navbar" style={{ height: "72px", borderBottom: "1.5px solid #C8E8F8" }}>
      <div className="nb-navbar-inner" style={{ height: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>

        {/* Prominent Niva Bupa Logo */}
        <Link href="/" className="nb-logo-wrap" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <Image
            src="/niva-bupa-logo.svg"
            alt="Niva Bupa Health Insurance"
            width={200}
            height={60}
            style={{ height: "46px", width: "auto" }}
            priority
          />
          <div className="nb-logo-divider hidden-mobile" style={{ height: "30px", width: "1.5px", background: "#CBD5E1", margin: "0 4px" }} />
          <div className="nb-logo-tagline hidden-mobile" style={{ display: "flex", flexDirection: "column" }}>
            <span className="nb-logo-tagline-title" style={{ fontSize: "14px", fontWeight: 900, color: "#1A2B40", lineHeight: 1.1 }}>
              ARM Banca Assessment
            </span>
            <span className="nb-logo-tagline-sub" style={{ fontSize: "11px", fontWeight: 700, color: "#00AEEF", marginTop: "2px" }}>
              Recruitment Portal
            </span>
          </div>
        </Link>

        {/* Right Side Prominent Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {mode === "candidate" && candidateName && (
            <div className="nb-candidate-badge">
              <span className="nb-pulse-dot" />
              <span className="hidden-mobile" style={{ opacity: 0.75 }}>Candidate:</span>
              <span style={{ maxWidth: "130px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {candidateName}
              </span>
            </div>
          )}

          {mode === "public" && (
            <Link
              href="/exam"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 26px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #0090C8 0%, #00AEEF 100%)",
                color: "white",
                fontWeight: 900,
                fontSize: "15px",
                textDecoration: "none",
                boxShadow: "0 6px 20px rgba(0,174,239,0.4)",
                whiteSpace: "nowrap",
                letterSpacing: "0.01em",
                transition: "transform 0.15s, box-shadow 0.15s"
              }}
            >
              Begin Exam →
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
