"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, PanelLeftClose, PanelLeftOpen, Coins, AlertTriangle } from "lucide-react";

interface NavbarProps {
  onMobileSidebarToggle?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard Overview",
  "/admin/assessments": "Exams & Assessments",
  "/admin/candidates": "Candidate Evaluation",
  "/admin/emails": "Email Audit & Invites",
  "/admin/questions": "Question Bank CMS",
  "/admin/settings": "System Settings",
};

export default function Navbar({ onMobileSidebarToggle, isCollapsed, onToggleCollapse }: NavbarProps) {
  const pathname = usePathname();
  const currentTitle = pageTitles[pathname] || "HR Admin Portal";

  const [creditData, setCreditData] = useState<any>(null);

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.niva.greatcampus.in";
        const res = await fetch(`${apiUrl}/api/v1/credits/quota`);
        const data = await res.json();
        if (data.success) {
          setCreditData(data);
        }
      } catch {
        /* silent */
      }
    };

    fetchQuota();
    const interval = setInterval(fetchQuota, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="w-full h-full px-4 sm:px-6 flex items-center justify-between">
        
        {/* Left: Brand Logo, Mobile Menu, Desktop Collapse Toggle & Page Title */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button */}
          {onMobileSidebarToggle && (
            <button
              onClick={onMobileSidebarToggle}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Toggle Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Desktop Sidebar Collapse Toggle */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen className="w-5 h-5 text-blue-600" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
          )}

          <Link href="/admin" className="flex items-center space-x-3">
            <Image
              src="/niva-bupa-logo.png"
              alt="Niva Bupa Health Insurance"
              width={210}
              height={191}
              style={{
                height: "40px",
                width: "auto",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 160, 230, 0.18)",
                objectFit: "contain"
              }}
              priority
            />
          </Link>
          
          <div className="hidden sm:flex border-l border-slate-200 pl-3">
            <span className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              {currentTitle}
            </span>
          </div>
        </div>

        {/* Right: Real-time Credit indicator badge */}
        <div className="flex items-center gap-3">
          {creditData && creditData.credit && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-xs ${
                creditData.credit.isExhausted
                  ? "bg-rose-50 border-rose-200 text-rose-700"
                  : creditData.credit.isLow
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-blue-50/80 border-blue-200/80 text-blue-950"
              }`}
              title={`Total Limit: ${creditData.credit.creditLimit} | Used: ${creditData.credit.usedCredit} (1/Exam Start)`}
            >
              <Coins className={`w-4 h-4 ${creditData.credit.isExhausted ? "text-rose-600" : "text-blue-600"}`} />
              <span className="hidden md:inline">Exam Credits:</span>
              <span className="font-mono font-black text-blue-700">
                {creditData.credit.remainingCredit.toLocaleString()}
              </span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="font-mono text-slate-600">{creditData.credit.creditLimit.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 font-semibold hidden sm:inline">
                ({creditData.credit.usedCredit} used)
              </span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
