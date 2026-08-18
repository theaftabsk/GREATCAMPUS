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

        {/* Prominent Niva Bupa Logo */}
        <Link href="/" className="nb-logo-wrap">
          <Image
            src="/niva-bupa-logo.png"
            alt="Niva Bupa Health Insurance"
            width={180}
            height={160}
            className="nb-logo-img"
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

        {/* Right Side Candidate Badge */}
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
        </div>

      </div>
    </header>
  );
}
