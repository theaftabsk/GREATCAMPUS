"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApiBaseUrl } from "@/lib/config";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function redirect() {
      try {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/v1/integration/headstart/assessments/active`);
        const data = await res.json();
        if (data?.success && data?.data?.[0]?.assessmentSlug) {
          router.replace(`/${data.data[0].assessmentSlug}`);
        } else {
          router.replace("/aa-2812");
        }
      } catch {
        router.replace("/aa-2812");
      }
    }
    redirect();
  }, [router]);

  return (
    <div style={{ minHeight: "100dvh", background: "linear-gradient(160deg, #E8F6FD 0%, #F4FAFF 50%, #FFF8EE 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "42px", height: "42px", border: "4px solid #00AEEF", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
        <p style={{ fontSize: "14px", fontWeight: 800, color: "#0F172A", letterSpacing: "0.2px" }}>
          Redirecting to Active Assessment Link...
        </p>
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
