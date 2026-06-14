"use client";

import { motion } from "motion/react";
import type React from "react";

interface SystemAlertBannerProps {
  message: string;
}

export const SystemAlertBanner: React.FC<SystemAlertBannerProps> = ({
  message,
}) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0, y: -10 }}
      animate={{ height: "auto", opacity: 1, y: 0 }}
      exit={{ height: 0, opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden w-full"
    >
      <div className="mb-6 bg-error/15 border border-error/40 text-error px-6 py-4 rounded-xl flex items-center justify-between shadow-[0_0_15px_rgba(255,180,171,0.1)] relative overflow-hidden group">
        {/* Scanning status pip */}
        <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-error shadow-[0_0_10px_rgba(255,180,171,0.8)] animate-pulse" />
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-error animate-pulse text-2xl">
            warning
          </span>
          <span className="font-mono text-xs font-bold tracking-wider uppercase font-data-mono">
            {message}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-error animate-ping" />
          <span className="text-[10px] font-mono font-bold text-error/80 font-data-mono uppercase">
            Elevated State
          </span>
        </div>
      </div>
    </motion.div>
  );
};
