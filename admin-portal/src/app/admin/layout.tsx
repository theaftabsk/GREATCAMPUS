"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  BookOpen,
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
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-semibold text-xs text-slate-700">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/assessments",
      label: "Exams & Assessments",
      icon: FileText,
    },
    {
      href: "/admin/candidates",
      label: "Candidate Evaluation",
      icon: UserCheck,
    },
    {
      href: "/admin/questions",
      label: "Question Bank CMS",
      icon: BookOpen,
    },
    {
      href: "/admin/settings",
      label: "System Settings",
      icon: SettingsIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* Fixed Header Navbar */}
      <Navbar onMobileSidebarToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex w-full relative">
        
        {/* Mobile Sidebar Backdrop */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          ></div>
        )}

        {/* Dedicated Fixed Left Sidebar */}
        <aside
          className={`fixed top-16 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between overflow-y-auto shrink-0 transform transition-transform duration-300 ${
            mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-5 space-y-6">
            
            {/* Sidebar Navigation Header Label */}
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Banca Navigation
              </span>
              <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Live Portal
              </span>
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`w-full p-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-white" />}
                  </Link>
                );
              })}
            </nav>

          </div>

          {/* Sidebar Footer User Info */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 m-4 rounded-xl border flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-xs shadow-2xs">
                HR
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">System Admin</p>
                <p className="text-[10px] text-slate-400 font-semibold">Banca Channel</p>
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

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 pt-16 min-h-screen w-full">
          <div className="w-full">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
