"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CandidatesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-semibold text-xs text-slate-700">Redirecting to Dashboard...</p>
      </div>
    </div>
  );
}
