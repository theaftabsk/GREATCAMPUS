"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("banca_admin_token");
    if (!token && pathname !== "/admin/login") {
      setIsAuthenticated(false);
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("banca_admin_token");
    setIsAuthenticated(false);
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-semibold text-slate-700">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      
      <Navbar onMobileSidebarToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex w-full">
        
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          ></div>
        )}

        {/* Dedicated Admin Left Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-300 lg:static lg:translate-x-0 ${
            mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          }`}
        >
          <div className="p-6 space-y-8">
            
            <div className="pb-6 border-b border-slate-100">
              <Image
                src="/niva-bupa-logo.png"
                alt="Niva Bupa Health Insurance"
                width={210}
                height={191}
                style={{
                  height: "48px",
                  width: "auto",
                  borderRadius: "10px",
                  boxShadow: "0 3px 10px rgba(0, 160, 230, 0.2)",
                  objectFit: "contain"
                }}
                priority
              />
              <span className="text-[10px] font-extrabold uppercase text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 mt-2 inline-block">
                ARM Banca Assessment
              </span>
            </div>

            <nav className="space-y-1.5">
              
              <Link
                href="/admin"
                onClick={() => setMobileSidebarOpen(false)}
                className={`w-full p-3 rounded-2xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  pathname === "/admin"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard Overview</span>
                </div>
                {pathname === "/admin" && <ChevronRight className="w-4 h-4" />}
              </Link>

              <Link
                href="/admin/candidates"
                onClick={() => setMobileSidebarOpen(false)}
                className={`w-full p-3 rounded-2xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  pathname === "/admin/candidates"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-4 h-4" />
                  <span>Candidate Evaluation</span>
                </div>
                {pathname === "/admin/candidates" && <ChevronRight className="w-4 h-4" />}
              </Link>

              <Link
                href="/admin/questions"
                onClick={() => setMobileSidebarOpen(false)}
                className={`w-full p-3 rounded-2xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  pathname === "/admin/questions"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4" />
                  <span>Question Bank CMS</span>
                </div>
                {pathname === "/admin/questions" && <ChevronRight className="w-4 h-4" />}
              </Link>

              <Link
                href="/admin/settings"
                onClick={() => setMobileSidebarOpen(false)}
                className={`w-full p-3 rounded-2xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  pathname === "/admin/settings"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <SettingsIcon className="w-4 h-4" />
                  <span>System Settings</span>
                </div>
                {pathname === "/admin/settings" && <ChevronRight className="w-4 h-4" />}
              </Link>

            </nav>

          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 m-4 rounded-2xl border flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-xs">
                HR
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">System Admin</p>
                <p className="text-[10px] text-slate-400 font-medium">Banca Channel</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </aside>

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
