"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, CheckCircle2, ShieldAlert, Clock, Award, Copy, ExternalLink, Link2 } from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

interface AssessmentItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  durationMins: number;
  passingPercentage: number;
  maxProctorWarnings: number;
  status: string;
}

export default function AdminSettingsPage() {
  const [activeAssessment, setActiveAssessment] = useState<AssessmentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [settings, setSettings] = useState({
    companyName: "Niva Bupa Health Insurance - ARM Banca Assessment",
    examDurationMins: 45,
    passingMarksPercent: 50.0,
    maxProctorWarnings: 3,
    negativeMarking: false,
  });

  const loadActiveSettings = async () => {
    setLoading(true);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/assessments`);
      const data = await res.json();
      if (data.success && Array.isArray(data.assessments) && data.assessments.length > 0) {
        const active = data.assessments.find((a: AssessmentItem) => a.status === "ACTIVE") || data.assessments[0];
        setActiveAssessment(active);
        setSettings({
          companyName: active.name,
          examDurationMins: active.durationMins || 45,
          passingMarksPercent: active.passingPercentage || 50.0,
          maxProctorWarnings: active.maxProctorWarnings || 3,
          negativeMarking: false,
        });
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveSettings();
  }, []);

  const getCandidateExamLink = () => {
    const candidateBaseUrl = "https://greatcampus-1.onrender.com";
    if (!activeAssessment) return `${candidateBaseUrl}/exam`;
    return `${candidateBaseUrl}/exam?assessment=${activeAssessment.slug || activeAssessment.id}`;
  };

  const handleCopyLink = () => {
    const link = getCandidateExamLink();
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssessment) return;

    setSaving(true);
    setSavedSuccess(false);

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/assessments/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeAssessment.id,
          name: settings.companyName,
          durationMins: Number(settings.examDurationMins),
          passingPercentage: Number(settings.passingMarksPercent),
          maxProctorWarnings: Number(settings.maxProctorWarnings),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        loadActiveSettings();
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-blue-600" />
          System & Exam Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Configure active exam duration, pass marks, proctoring limits, and copy unique candidate exam share link.
        </p>
      </div>

      {/* Shareable Unique Exam Link Card */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-6 rounded-2xl text-white shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-300 font-extrabold text-xs uppercase tracking-wider">
            <Link2 className="w-4 h-4 text-blue-400" />
            <span>Shareable Candidate Exam Link</span>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            ACTIVE ASSESSMENT
          </span>
        </div>

        <p className="text-xs text-slate-300 font-medium">
          Share this unique URL with candidates or configure it inside Headstart CRM for direct assessment entrance:
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            readOnly
            value={getCandidateExamLink()}
            className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-blue-100 font-mono select-all outline-none"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95"
          >
            {copiedLink ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Exam Link</span>
              </>
            )}
          </button>
          <a
            href={getCandidateExamLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center space-x-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs rounded-xl transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Test Open</span>
          </a>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center space-x-3 text-xs font-bold shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>✅ System & Exam Settings updated successfully in database! All future candidate attempts will use these settings.</span>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <form onSubmit={handleSaveSettings} className="space-y-6">

          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1.5">
              Active Assessment Name / Title *
            </label>
            <input
              type="text"
              required
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Exam Duration (Mins)</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={settings.examDurationMins}
                onChange={(e) => setSettings({ ...settings, examDurationMins: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>Passing Score %</span>
              </label>
              <input
                type="number"
                required
                min={1}
                max={100}
                value={settings.passingMarksPercent}
                onChange={(e) => setSettings({ ...settings, passingMarksPercent: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1.5 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                <span>Max Warnings</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={settings.maxProctorWarnings}
                onChange={(e) => setSettings({ ...settings, maxProctorWarnings: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="font-extrabold text-slate-900 text-xs">Negative Marking</p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Deduct 0.25 marks for incorrect candidate answers</p>
            </div>
            <input
              type="checkbox"
              checked={settings.negativeMarking}
              onChange={(e) => setSettings({ ...settings, negativeMarking: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={saving || loading}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-extrabold text-xs rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Settings..." : "Save Settings"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
