import type { Metadata } from "next";
import "./globals.css";
import "./exam/exam.css";

export const metadata: Metadata = {
  title: "Niva Bupa – ARM Banca Recruitment Assessment",
  description: "Niva Bupa Health Insurance – Assistant Relationship Manager Banca Channel Recruitment Assessment Portal",
  keywords: "Niva Bupa, ARM, Banca Assessment, Health Insurance Recruitment",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
