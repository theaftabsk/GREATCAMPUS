"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState({ username: "admin", password: "admin123" });
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/v1/auth/admin-login", {
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
    } catch (err) {
      // Fallback local auth if backend is offline
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-md mx-auto px-4 py-16 w-full flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">HR Admin Portal Login</h1>
            <p className="text-xs text-slate-500 mt-1">Authorized HR & Assessment Administrators Only</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Username</label>
              <input
                type="text"
                required
                value={adminUser.username}
                onChange={(e) => setAdminUser({ ...adminUser, username: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={adminUser.password}
                onChange={(e) => setAdminUser({ ...adminUser, password: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In to Admin Dashboard"}
            </button>

            <p className="text-xs text-slate-400 text-center mt-2">
              Default Credentials: Username <strong>admin</strong> | Password <strong>admin123</strong>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
