"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Award, CheckCircle2, TrendingUp, FileText } from "lucide-react";

export default function AdminOverviewDashboard() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:4000/api/v1/candidates").then((r) => r.json()),
      fetch("http://localhost:4000/api/v1/questions").then((r) => r.json()),
    ])
      .then(([cRes, qRes]) => {
        if (cRes.success) setCandidates(cRes.candidates);
        if (qRes.success) setQuestions(qRes.questions);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalCand = candidates.length;
  const avgScore = totalCand > 0 ? Math.round(candidates.reduce((acc, c) => acc + (c.percentage || 0), 0) / totalCand) : 0;
  const strongHires = candidates.filter((c) => c.hiringRecommendation === "Strong Hire").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Assessment Analytics & Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time candidate performance metrics connected to NestJS Enterprise API.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">Total Candidates</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{totalCand}</p>
            <span className="text-xs font-semibold text-emerald-600 mt-1 inline-block">NestJS DB Synced</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">Average Score</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{avgScore}%</p>
            <span className="text-xs font-semibold text-blue-600 mt-1 inline-block">Benchmark: 60%</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">Strong Hires (85%+)</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{strongHires}</p>
            <span className="text-xs font-semibold text-slate-500 mt-1 inline-block">Top Talent Pool</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-slate-500">Active Question Bank</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{questions.length}</p>
            <span className="text-xs font-semibold text-slate-500 mt-1 inline-block">6 Competency Sections</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
        </div>

      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
          <span>Automated Hiring Recommendation Engine</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
            <span className="text-xs font-bold uppercase text-emerald-800">Strong Hire (85%+)</span>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">
              {candidates.filter((c) => c.hiringRecommendation === "Strong Hire").length}
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
            <span className="text-xs font-bold uppercase text-blue-800">Hire (70-84%)</span>
            <p className="text-2xl font-extrabold text-blue-700 mt-1">
              {candidates.filter((c) => c.hiringRecommendation === "Hire").length}
            </p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center">
            <span className="text-xs font-bold uppercase text-amber-800">Maybe (55-69%)</span>
            <p className="text-2xl font-extrabold text-amber-700 mt-1">
              {candidates.filter((c) => c.hiringRecommendation === "Maybe").length}
            </p>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center">
            <span className="text-xs font-bold uppercase text-red-800">Reject (&lt;55%)</span>
            <p className="text-2xl font-extrabold text-red-700 mt-1">
              {candidates.filter((c) => c.hiringRecommendation === "Reject").length}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Link
          href="/admin/candidates"
          className="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          View All Candidate Scorecards
        </Link>
        <Link
          href="/admin/questions"
          className="px-6 py-3 bg-slate-200 text-slate-800 font-bold text-sm rounded-xl hover:bg-slate-300 transition-colors"
        >
          Manage Question CMS ({questions.length} Questions)
        </Link>
      </div>
    </div>
  );
}
