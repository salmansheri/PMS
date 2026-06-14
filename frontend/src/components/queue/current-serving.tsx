"use client";

import { motion } from "motion/react";
import type React from "react";
import { GlassPanel } from "../ui/glass-panel";

export interface CurrentServingProps {
  token?: string;
  doctorName?: string;
  roomName?: string;
  disabled?: boolean;
}

export const CurrentServing: React.FC<CurrentServingProps> = ({
  token = "A-128",
  doctorName = "Dr. S. Tanaka",
  roomName = "Consultation 4",
  disabled = false,
}) => {
  return (
    <GlassPanel
      className={`p-8 flex flex-col items-center justify-center text-center relative overflow-hidden h-[360px] group ${
        disabled ? "hover:border-outline-variant/30" : "hover:border-success/30"
      }`}
    >
      {/* Background aesthetic blobs */}
      {!disabled && (
        <>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-success/10 rounded-full blur-[100px] group-hover:bg-success/20 transition-all duration-700 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/15 transition-all duration-700 pointer-events-none" />
        </>
      )}

      <p className="font-label-caps text-label-caps tracking-widest text-on-surface-variant mb-4 relative z-10 font-mono">
        CURRENT TOKEN SERVING
      </p>

      <div className="relative z-10 flex items-center justify-center">
        {/* Glow-pulsing Serving Token text */}
        <motion.span
          animate={
            disabled
              ? { textShadow: "none" }
              : {
                  textShadow: [
                    "0 0 10px rgba(158, 206, 106, 0.4), 0 0 20px rgba(158, 206, 106, 0.2)",
                    "0 0 20px rgba(158, 206, 106, 0.8), 0 0 40px rgba(158, 206, 106, 0.4)",
                    "0 0 10px rgba(158, 206, 106, 0.4), 0 0 20px rgba(158, 206, 106, 0.2)",
                  ],
                }
          }
          transition={
            disabled
              ? undefined
              : { repeat: Infinity, duration: 4, ease: "easeInOut" }
          }
          className={`font-black text-[110px] leading-none font-data-mono font-mono ${
            disabled ? "text-on-surface-variant/40" : "text-success"
          }`}
        >
          {disabled ? "IDLE" : token}
        </motion.span>
        {/* Pulsing Status Dot */}
        <motion.div
          animate={
            disabled
              ? { scale: 1, opacity: 0.3 }
              : { scale: [1, 1.25, 1], opacity: [1, 0.6, 1] }
          }
          transition={
            disabled
              ? undefined
              : { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }
          className={`absolute -right-8 top-2 h-3 w-3 rounded-full ${
            disabled
              ? "bg-outline-variant shadow-none"
              : "bg-success shadow-[0_0_8px_rgba(158,206,106,0.8)]"
          }`}
        />
      </div>

      <div className="mt-8 flex gap-8 border-t border-outline-variant pt-6 w-full max-w-sm mx-auto relative z-10 text-center">
        <div className="flex-1">
          <p className="text-on-surface-variant text-[11px] font-label-caps font-mono uppercase mb-1">
            DOCTOR
          </p>
          <p
            className={`font-headline-md font-bold text-sm md:text-base ${disabled ? "text-on-surface-variant/50" : "text-secondary"}`}
          >
            {disabled ? "--" : doctorName}
          </p>
        </div>
        <div className="w-px bg-outline-variant h-10 self-center" />
        <div className="flex-1">
          <p className="text-on-surface-variant text-[11px] font-label-caps font-mono uppercase mb-1">
            ROOM
          </p>
          <p
            className={`font-headline-md font-bold text-sm md:text-base ${disabled ? "text-on-surface-variant/50" : "text-on-surface"}`}
          >
            {disabled ? "--" : roomName}
          </p>
        </div>
      </div>
    </GlassPanel>
  );
};
