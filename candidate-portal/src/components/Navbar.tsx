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
    <header className="nb-navbar">
      <div className="nb-navbar-inner">

        {/* Logo */}
        <Link href="/" className="nb-logo-wrap">
          <Image
            src="/niva-bupa-logo.svg"
            alt="Niva Bupa Health Insurance"
            width={140}
            height={48}
            className="nb-logo-img"
            priority
          />
          <div className="nb-logo-divider hidden-mobile" />
          <div className="nb-logo-tagline hidden-mobile">
            <span className="nb-logo-tagline-title">ARM Banca Assessment</span>
            <span className="nb-logo-tagline-sub">Recruitment Portal</span>
          </div>
        </Link>

        {/* Right Side */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {mode === "candidate" && candidateName && (
            <div className="nb-candidate-badge">
              <span className="nb-pulse-dot" />
              <span className="hidden-mobile" style={{ opacity: 0.75 }}>Candidate:</span>
              <span style={{ maxWidth: "110px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                gap: "6px",
                padding: "9px 18px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #0090C8, #00AEEF)",
                color: "white",
                fontWeight: 800,
                fontSize: "13px",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(0,174,239,0.3)",
                whiteSpace: "nowrap",
              }}
            >
              Begin Exam
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
