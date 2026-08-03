import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GREATCAMPUS - HR Admin Evaluation Portal",
  description: "Dedicated HR Administration & Assessment Candidate Scorecard Evaluation Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
