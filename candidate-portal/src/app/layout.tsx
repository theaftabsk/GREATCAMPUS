import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./exam/exam.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Niva Bupa – ARM Banca Recruitment Assessment",
  description: "Niva Bupa Health Insurance – Assistant Relationship Manager Banca Channel Recruitment Assessment Portal",
  keywords: "Niva Bupa, ARM, Banca Assessment, Health Insurance Recruitment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
