import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";
import { CompareProvider } from "@/context/CompareContext";
import CompareTray from "@/components/compare/CompareTray";

import ShortlistCount from "@/components/ui/ShortlistCount";

export const metadata: Metadata = {
  title: "EduQuest | College Discovery Platform",
  description: "Find and compare the best colleges with NIRF-verified rankings, live fee data, and AI-powered admission prediction.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className="bg-white text-slate-900 antialiased"
        style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
      >
        <CompareProvider>
          {/* Fixed Glassmorphism Navbar — z-50 keeps it above all content */}
          <header className="fixed top-0 w-full z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              {/* Brand */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md group-hover:shadow-blue-500/40 transition-shadow">
                  E
                </span>
                <span className="text-lg font-black tracking-tighter text-slate-900">
                  EDUQUEST
                </span>
              </Link>

              {/* Navigation */}
              <nav className="flex items-center gap-1">
                <Link
                  href="/colleges"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                >
                  Explore Colleges
                </Link>
                <ShortlistCount />
                <Link
                  href="/predictor"
                  className="ml-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-opacity shadow-md shadow-blue-500/25"
                >
                  AI Predictor
                </Link>
              </nav>
            </div>
          </header>

          {/* pt-16 offsets the fixed 64px navbar so content is never hidden */}
          <main className="pt-16">{children}</main>
          <CompareTray />
        </CompareProvider>
      </body>
    </html>
  );
}
