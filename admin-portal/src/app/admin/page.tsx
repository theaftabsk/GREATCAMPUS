"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Award, TrendingUp, BookOpen, ChevronRight, ShieldCheck } from "lucide-react";
import { getApiBaseUrl } from "@/lib/config";

export default function AdminOverviewDashboard() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = getApiBaseUrl();
    Promise.all([
      fetch(`${baseUrl}/api/v1/candidates`).then((r) => r.json()),
      fetch(`${baseUrl}/api/v1/questions`).then((r) => r.json()),
    ])
      .then(([cRes, qRes]) => {
        if (cRes?.success) setCandidates(cRes.candidates || []);
        if (qRes?.success) setQuestions(qRes.questions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-bold">Loading Dashboard Analytics...</p>
      </div>
    );
  }

  const totalCand = candidates.length;
  const completedCand = candidates.filter((c) => c.status === "COMPLETED");
  const avgScore = completedCand.length > 0
    ? Math.round(completedCand.reduce((acc, c) => acc + (c.attempt?.percentage || c.percentage || 0), 0) / completedCand.length)
    : 0;
  const passedCount = completedCand.filter((c) => c.attempt?.isPassed).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Total Candidates</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalCand}</p>
            <span className="text-[11px] font-bold text-emerald-600 mt-0.5 inline-block">Registered System Pool</span>
          </div>
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Average Score</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{avgScore}%</p>
            <span className="text-[11px] font-bold text-blue-600 mt-0.5 inline-block">{completedCand.length} Completed</span>
          </div>
          <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Qualified Candidates</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{passedCount}</p>
            <span className="text-[11px] font-bold text-slate-500 mt-0.5 inline-block">Passed Assessment</span>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">Question Bank Pool</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{questions.length}</p>
            <span className="text-[11px] font-bold text-slate-500 mt-0.5 inline-block">Fixed 60 Questions</span>
          </div>
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Candidate Performance Summary Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-extrabold text-slate-900">Candidate Performance Status Summary</h2>
          </div>
          <span className="text-[11px] font-bold text-slate-400">Live Metrics</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-center">
            <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">Completed</span>
            <p className="text-xl font-black text-emerald-800 mt-1">{completedCand.length}</p>
          </div>

          <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl text-center">
            <span className="text-[10px] font-extrabold uppercase text-blue-700 tracking-wider">In Progress</span>
            <p className="text-xl font-black text-blue-800 mt-1">
              {candidates.filter((c) => c.status === "IN_PROGRESS").length}
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <span className="text-[10px] font-extrabold uppercase text-slate-600 tracking-wider">Registered</span>
            <p className="text-xl font-black text-slate-800 mt-1">
              {candidates.filter((c) => c.status === "REGISTERED" || !c.status).length}
            </p>
          </div>

          <div className="p-4 bg-red-50/80 border border-red-200 rounded-xl text-center">
            <span className="text-[10px] font-extrabold uppercase text-red-700 tracking-wider">Disqualified</span>
            <p className="text-xl font-black text-red-800 mt-1">
              {candidates.filter((c) => c.status === "DISQUALIFIED").length}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link
          href="/admin/candidates"
          className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition shadow-sm inline-flex items-center gap-2"
        >
          <span>Candidate Evaluation</span>
          <ChevronRight className="w-4 h-4" />
        </Link>

        <Link
          href="/admin/assessments"
          className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition shadow-2xs inline-flex items-center gap-2"
        >
          <span>Exams & Assessments</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link
          href="/admin/questions"
          className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition shadow-2xs inline-flex items-center gap-2"
        >
          <span>Question Bank CMS</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>
      </div>

    </div>
  );
}
