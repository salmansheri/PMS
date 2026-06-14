"use client";

import type React from "react";
import { useEffect, useState } from "react";

interface LoadingStateProps {
  message?: string;
  statusText?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Synchronizing Clinical Data...",
  statusText = "Establishing Secure Uplink",
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) {
          return prev + 0.2;
        }
        const next = prev + Math.random() * 5;
        return next >= 100 ? 100 : next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 flex-1 w-full animate-fade-in relative z-10 select-none">
      {/* Drifting Grid Background (Applied inside loader if container has none) */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(187,154,247,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(187,154,247,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10 animate-grid-drift" />

      {/* Sync Progress Bar Section */}
      <section className="max-w-4xl mx-auto mb-10 text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_#7fd0ff]" />
          <p className="font-data-mono text-body-md text-secondary tracking-wide uppercase font-mono">
            {message}
          </p>
        </div>
        <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 shadow-[0_0_12px_rgba(187,154,247,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-data-mono text-on-surface-variant/50 uppercase tracking-tighter font-mono">
          <span>{statusText}</span>
          <span>{Math.floor(progress)}%</span>
        </div>
      </section>

      {/* Grid Layout for Modules */}
      <div className="grid grid-cols-12 gap-6">
        {/* Metrics Bar */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          {["k1", "k2", "k3", "k4"].map((key) => (
            <div
              key={key}
              className="h-32 rounded-xl bg-surface-container/50 border border-outline-variant/30 p-6 flex flex-col justify-between"
            >
              <div className="w-1/3 h-4 rounded bg-surface-container-highest animate-pulse" />
              <div className="w-2/3 h-8 rounded bg-surface-container-highest/60 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Main Section (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* High Fidelity Reports Loader (Asymmetric Card) */}
          <div className="bg-surface-container/50 border border-outline-variant/30 rounded-xl p-8 h-[360px] relative overflow-hidden">
            <div className="flex justify-between items-start mb-10">
              <div className="space-y-3 w-1/2">
                <div className="w-48 h-6 rounded bg-surface-container-highest animate-pulse" />
                <div className="w-64 h-4 rounded bg-surface-container-highest/50 animate-pulse" />
              </div>
              <div className="flex gap-2">
                <div className="w-20 h-8 rounded-full bg-surface-container-highest/60 animate-pulse" />
                <div className="w-20 h-8 rounded-full bg-surface-container-highest/60 animate-pulse" />
              </div>
            </div>
            {/* Visual Graph Placeholder */}
            <div className="absolute bottom-12 left-8 right-8 h-40 flex items-end gap-4">
              <div
                className="flex-1 bg-surface-container-highest/30 rounded-t-lg animate-pulse"
                style={{ height: "40%" }}
              />
              <div
                className="flex-1 bg-surface-container-highest/40 rounded-t-lg animate-pulse"
                style={{ height: "60%" }}
              />
              <div
                className="flex-1 bg-primary/20 rounded-t-lg animate-pulse"
                style={{ height: "85%" }}
              />
              <div
                className="flex-1 bg-surface-container-highest/35 rounded-t-lg animate-pulse"
                style={{ height: "55%" }}
              />
              <div
                className="flex-1 bg-surface-container-highest/30 rounded-t-lg animate-pulse"
                style={{ height: "45%" }}
              />
              <div
                className="flex-1 bg-surface-container-highest/45 rounded-t-lg animate-pulse"
                style={{ height: "70%" }}
              />
              <div
                className="flex-1 bg-surface-container-highest/40 rounded-t-lg animate-pulse"
                style={{ height: "50%" }}
              />
              <div
                className="flex-1 bg-surface-container-highest/25 rounded-t-lg animate-pulse"
                style={{ height: "35%" }}
              />
            </div>
          </div>

          {/* Activity Feed Loader */}
          <div className="bg-surface-container/50 border border-outline-variant/30 rounded-xl p-6">
            <div className="w-32 h-5 rounded bg-surface-container-highest animate-pulse mb-6" />
            <div className="space-y-6">
              {["a1", "a2"].map((key) => (
                <div key={key} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-1/3 h-4 rounded bg-surface-container-highest animate-pulse" />
                    <div className="w-1/2 h-3 rounded bg-surface-container-highest/50 animate-pulse" />
                  </div>
                  <div className="w-16 h-3 rounded bg-surface-container-highest/30 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Content (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Schedule Loader */}
          <div className="bg-surface-container/50 border border-outline-variant/30 rounded-xl p-6 h-full min-h-[480px]">
            <div className="flex justify-between items-center mb-6">
              <div className="w-32 h-6 rounded bg-surface-container-highest animate-pulse" />
              <div className="w-8 h-8 rounded bg-surface-container-highest animate-pulse" />
            </div>
            <div className="space-y-6">
              {["s1", "s2", "s3"].map((key) => (
                <div
                  key={key}
                  className="p-4 rounded-lg bg-surface-container-low/40 border-l-4 border-primary/20 space-y-4"
                >
                  <div className="flex justify-between">
                    <div className="w-16 h-3 rounded bg-surface-container-highest/40 animate-pulse" />
                    <div className="w-12 h-3 rounded bg-surface-container-highest/30 animate-pulse" />
                  </div>
                  <div className="w-3/4 h-5 rounded bg-surface-container-highest animate-pulse" />
                  <div className="w-1/2 h-3 rounded bg-surface-container-highest/50 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
