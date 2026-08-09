"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Menu } from "lucide-react";

interface NavbarProps {
  onMobileSidebarToggle?: () => void;
}

export default function Navbar({ onMobileSidebarToggle }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Niva Bupa Brand Logo */}
        <div className="flex items-center space-x-3">
          {onMobileSidebarToggle && (
            <button
              onClick={onMobileSidebarToggle}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/admin" className="flex items-center space-x-3">
            <Image
              src="/niva-bupa-logo.png"
              alt="Niva Bupa Health Insurance"
              width={210}
              height={191}
              style={{
                height: "44px",
                width: "auto",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 160, 230, 0.2)",
                objectFit: "contain"
              }}
              priority
            />
          </Link>
          
          <span className="hidden sm:inline-block text-[11px] font-extrabold uppercase text-slate-500 border-l border-slate-200 pl-3">
            ARM Banca HR Admin Portal
          </span>
        </div>

        {/* Status indicator */}
        <div className="flex items-center space-x-2 bg-blue-50 text-blue-800 px-3.5 py-1.5 rounded-full border border-blue-200 text-xs font-extrabold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>HR Admin Portal</span>
        </div>

      </div>
    </header>
  );
}
