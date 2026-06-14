"use client";

import type React from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex w-full overflow-hidden">
      {/* Persistent Shared Sidebar */}
      <Sidebar />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden z-10 relative">
        <Header />

        {/* Content Canvas */}
        <main className="flex-1 pt-24 px-8 pb-8 overflow-y-auto max-w-[1600px] w-full mx-auto">
          {children}
        </main>

        {/* System Footer Info */}
        <footer className="h-8 bg-surface-container-lowest/80 backdrop-blur-sm border-t border-outline-variant px-8 flex items-center justify-between text-[10px] font-mono text-on-surface-variant/50">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              NODE_LOC: TOK-HOST-A4
            </span>
            <span>LATENCY: 12ms</span>
          </div>
          <div className="flex items-center gap-4 uppercase font-bold">
            <span>TokyoClinic OS v4.2.0</span>
            <span className="text-primary">Encrypted Link Active</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
