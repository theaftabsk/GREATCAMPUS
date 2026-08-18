"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import CreditAllocateModal from "@/components/CreditAllocateModal";
import CreditAdjustModal from "@/components/CreditAdjustModal";
import {
  Building2,
  Coins,
  Plus,
  Sliders,
  RefreshCw,
  Search,
  CheckCircle2,
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

export default function SuperAdminTenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedTenantForAllocate, setSelectedTenantForAllocate] = useState<any>(null);
  const [selectedTenantForAdjust, setSelectedTenantForAdjust] = useState<any>(null);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/super-admin/tenants`);
      const data = await res.json();
      if (data.success) {
        setTenants(data.tenants || []);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const filteredTenants = tenants.filter((t) =>
    t.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tenant.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Super Admin Console</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-extrabold text-blue-600">Tenants & Credits</span>
          </div>

          <button
            onClick={fetchTenants}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer border border-slate-200 shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>
        </header>

        <div className="p-6 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tenant Quota Administration</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Configure exam credit limits and monitor consumption across client organizations.
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search tenant name / slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
              />
            </div>
          </div>

          {/* Tenants Table Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Total Limit</th>
                    <th className="py-3 px-4 text-center">Used (1/Start)</th>
                    <th className="py-3 px-4 text-center">Remaining</th>
                    <th className="py-3 px-4 text-center">Assessments</th>
                    <th className="py-3 px-4 text-center">Candidates</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredTenants.map((t) => {
                    const remaining = t.credit.remainingCredit;
                    const used = t.credit.usedCredit;
                    const limit = t.credit.creditLimit;

                    return (
                      <tr key={t.tenant.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-4 px-4">
                          <div className="font-extrabold text-slate-900 text-sm">{t.tenant.name}</div>
                          <div className="text-[11px] text-blue-600 font-bold">{t.tenant.slug}</div>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold uppercase">
                            <CheckCircle2 className="w-3 h-3" />
                            {t.tenant.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-center font-mono text-sm font-black text-slate-900">
                          {limit.toLocaleString()}
                        </td>

                        <td className="py-4 px-4 text-center font-mono text-sm font-black text-amber-600">
                          {used.toLocaleString()}
                        </td>

                        <td className="py-4 px-4 text-center font-mono text-sm font-black text-emerald-600">
                          {remaining.toLocaleString()}
                        </td>

                        <td className="py-4 px-4 text-center font-bold text-slate-900">
                          {t.metrics.totalAssessments} (Free)
                        </td>

                        <td className="py-4 px-4 text-center font-bold text-slate-900">
                          {t.metrics.totalCandidates}
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                setSelectedTenantForAllocate({
                                  id: t.tenant.id,
                                  name: t.tenant.name,
                                  creditLimit: limit,
                                  usedCredit: used,
                                  remainingCredit: remaining,
                                })
                              }
                              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs border border-blue-200 transition flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Allocate</span>
                            </button>

                            <button
                              onClick={() =>
                                setSelectedTenantForAdjust({
                                  id: t.tenant.id,
                                  name: t.tenant.name,
                                  creditLimit: limit,
                                  usedCredit: used,
                                  remainingCredit: remaining,
                                })
                              }
                              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs border border-indigo-200 transition flex items-center gap-1 cursor-pointer"
                            >
                              <Sliders className="w-3.5 h-3.5" />
                              <span>Adjust</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <CreditAllocateModal
        isOpen={!!selectedTenantForAllocate}
        tenant={selectedTenantForAllocate}
        onClose={() => setSelectedTenantForAllocate(null)}
        onSuccess={fetchTenants}
      />

      <CreditAdjustModal
        isOpen={!!selectedTenantForAdjust}
        tenant={selectedTenantForAdjust}
        onClose={() => setSelectedTenantForAdjust(null)}
        onSuccess={fetchTenants}
      />
    </div>
  );
}
