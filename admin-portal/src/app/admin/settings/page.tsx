"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, CheckCircle2, ShieldAlert, Clock, Award } from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

interface AssessmentItem {
  id: string;
  name: string;
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

  const [settings, setSettings] = useState({
    companyName: "Niva Bupa Health Insurance - ARM Banca Assessment",
    examDurationMins: 30,
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
          examDurationMins: active.durationMins || 30,
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

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssessment) return;

    setSaving(true);
    setSavedSuccess(false);

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/v1/assessments/${activeAssessment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
          Configure active exam duration, pass marks, proctoring limits, and organization title dynamically.
        </p>
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
