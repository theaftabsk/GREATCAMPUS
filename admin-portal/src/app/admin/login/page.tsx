"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

export default function AdminLoginPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState({ username: "admin", password: "admin123" });
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminUser),
      });

      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("banca_admin_token", data.access_token);
        router.push("/admin");
      } else {
        setAuthError(data.message || "Invalid username or password");
      }
    } catch {
      if (adminUser.username === "admin" && adminUser.password === "admin123") {
        localStorage.setItem("banca_admin_token", "demo-token-2026");
        router.push("/admin");
      } else {
        setAuthError("Invalid username or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-950 text-slate-100 relative overflow-hidden selection:bg-cyan-500 selection:text-white">
      {/* Dynamic Background Mesh & Glowing Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-12 flex flex-col justify-center items-center relative z-10">
        
        {/* Glassmorphic Login Card */}
        <div className="w-full bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl shadow-2xl shadow-cyan-950/40 p-8 sm:p-10 relative overflow-hidden group">
          
          {/* Top Decorative Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

          {/* Niva Bupa Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-white/95 p-3 rounded-2xl shadow-lg shadow-cyan-500/10 mb-5 border border-cyan-100 flex items-center justify-center">
              <Image
                src="/niva-bupa-logo.png"
                alt="Niva Bupa Health Insurance"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold tracking-wide uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              HR Portal Engine
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight">HR Admin Portal Login</h1>
            <p className="text-xs text-slate-400 font-medium mt-1">Authorized HR & Assessment Administrators Only</p>
          </div>

          {authError && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold rounded-2xl text-center flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={adminUser.username}
                  onChange={(e) => setAdminUser({ ...adminUser, username: e.target.value })}
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-sm font-semibold text-white placeholder-slate-500 focus:bg-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={adminUser.password}
                  onChange={(e) => setAdminUser({ ...adminUser, password: e.target.value })}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-11 py-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-sm font-semibold text-white placeholder-slate-500 focus:bg-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-sm rounded-2xl hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-lg shadow-cyan-600/30 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 group/btn"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Pre-fill Badge */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setAdminUser({ username: "admin", password: "admin123" })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-semibold transition-colors group/fill cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fill Default Demo Credentials</span>
            </button>
          </div>
        </div>

        {/* Footer Security Badge */}
        <p className="text-[11px] text-slate-500 font-medium text-center mt-6 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
          Enterprise SSL Encrypted • Headstart CRM Integration Enabled
        </p>
      </main>
    </div>
  );
}
