"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    examDurationMins: 15,
    passingMarksPercent: 33.33,
    negativeMarking: false,
    companyName: "Niva Bupa Health Insurance - ARM Banca Assessment",
  });

  const handleSaveSettings = () => {
    alert("System settings saved successfully!");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">System & Exam Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Configure exam duration, pass marks, negative marking, and company branding.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Company / Organization Name</label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Exam Duration (Minutes)</label>
            <input
              type="number"
              value={settings.examDurationMins}
              onChange={(e) => setSettings({ ...settings, examDurationMins: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Passing Mark Threshold (%)</label>
            <input
              type="number"
              value={settings.passingMarksPercent}
              onChange={(e) => setSettings({ ...settings, passingMarksPercent: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <p className="font-bold text-slate-900 text-sm">Negative Marking</p>
            <p className="text-xs text-slate-500">Deduct 0.25 marks for incorrect answers</p>
          </div>
          <input
            type="checkbox"
            checked={settings.negativeMarking}
            onChange={(e) => setSettings({ ...settings, negativeMarking: e.target.checked })}
            className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
          />
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
