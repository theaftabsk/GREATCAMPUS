import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NIVA BUPA - HR Admin Evaluation Portal",
  description: "Official HR Administration & Assessment Evaluation Platform for Niva Bupa Health Insurance",
  icons: {
    icon: [
      { url: "/niva-bupa-logo.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/niva-bupa-logo.png",
    apple: "/niva-bupa-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className={`${plusJakartaSans.className} antialiased bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
