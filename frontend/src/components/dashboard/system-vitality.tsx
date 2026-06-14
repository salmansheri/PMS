"use client";

import { motion } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import { GlassPanel } from "../ui/glass-panel";

export interface SystemVitalityProps {
  initialLatency?: number;
  forceOffline?: boolean;
}

export const SystemVitality: React.FC<SystemVitalityProps> = ({
  initialLatency = 14,
  forceOffline = false,
}) => {
  const [latency, setLatency] = useState(initialLatency);
  const [heights, setHeights] = useState<number[]>([
    40, 70, 100, 60, 80, 40, 90, 50,
  ]);

  useEffect(() => {
    if (forceOffline) return;

    const interval = setInterval(() => {
      // Fluctuate latency slightly
      setLatency((prev) => {
        const dev = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + dev;
        return next < 8 ? 10 : next > 25 ? 18 : next;
      });

      // Update random heights for bars
      setHeights((prev) =>
        prev.map((h) => {
          const change = Math.floor(Math.random() * 30) - 15; // -15% to +15%
          let next = h + change;
          if (next < 20) next = 30;
          if (next > 100) next = 90;
          return next;
        }),
      );
    }, 1500);

    return () => clearInterval(interval);
  }, [forceOffline]);

  return (
    <GlassPanel className="p-6 relative overflow-hidden group hover:border-outline/30 flex flex-col justify-between h-[180px]">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            animate={forceOffline ? { opacity: 0.5 } : { opacity: [1, 0.4, 1] }}
            transition={
              forceOffline
                ? undefined
                : { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
            }
            className={`w-2.5 h-2.5 rounded-full ${
              forceOffline
                ? "bg-error shadow-[0_0_8px_rgba(255,180,171,0.5)]"
                : "bg-secondary shadow-[0_0_8px_rgba(127,208,255,0.8)]"
            }`}
          />
          <h4 className="font-label-caps text-label-caps text-on-surface-variant font-mono">
            System Vitality
          </h4>
        </div>

        {/* Fluctuate bars */}
        <div className="flex items-end gap-1.5 h-12 mb-4">
          {heights.map((h, idx) => (
            <motion.div
              // biome-ignore lint/suspicious/noArrayIndexKey: array length is fixed and elements don't shift
              key={idx}
              animate={{ height: forceOffline ? "5%" : `${h}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className={`w-1.5 rounded-full ${forceOffline ? "bg-outline-variant" : "bg-secondary"}`}
              style={{ minHeight: "5%" }}
            />
          ))}
        </div>

        <div className="flex justify-between items-center text-xs text-on-surface-variant font-data-mono font-mono">
          <span>Network Latency</span>
          <span
            className={`${forceOffline ? "text-error" : "text-tertiary"} transition-colors duration-300`}
          >
            {forceOffline ? "OFFLINE" : `${latency}ms Optimal`}
          </span>
        </div>
      </div>

      {/* Background radial glow */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-secondary/5 blur-[60px] rounded-full group-hover:bg-secondary/15 transition-colors duration-700 pointer-events-none" />
    </GlassPanel>
  );
};
