"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Menu } from "lucide-react";

interface NavbarProps {
  onMobileSidebarToggle?: () => void;
}

export default function Navbar({ onMobileSidebarToggle }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
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
              src="/niva-bupa-logo.svg"
              alt="Niva Bupa Health Insurance"
              width={140}
              height={44}
              style={{ height: "36px", width: "auto" }}
              priority
            />
          </Link>
          
          <span className="hidden sm:inline-block text-[11px] font-extrabold uppercase text-slate-500 border-l border-slate-200 pl-3">
            ARM Banca HR Admin Portal
          </span>
        </div>

        {/* Status indicator */}
        <div className="flex items-center space-x-2 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-full border border-blue-200 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>HR Admin Portal</span>
        </div>

      </div>
    </header>
  );
}
