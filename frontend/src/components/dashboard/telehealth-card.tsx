"use client";

import { motion } from "motion/react";
import type React from "react";
import { Button } from "../ui/button";
import { GlassPanel } from "../ui/glass-panel";

export interface TelehealthCardProps {
  patientName?: string;
  avatarUrl?: string;
  waitingTime?: string;
  onStartCall?: () => void;
  disabled?: boolean;
}

export const TelehealthCard: React.FC<TelehealthCardProps> = ({
  patientName = "Akari Tanaka",
  avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCauzuQpH9JECIG_S_5Ki57qOw-nhmBuDsNld5Klj4pGQ071_Gir7REqpH_2bCVjANjgetl-XkHLPHj-6POU5GTLQh5PP3uQwTt8UuIV0oGp5n5hc2kzL727p5hLM8F9BxNtXtRhjxcsIKURnSYg9g7a3BnDOOKoucvYmfUTLCdSzeOIv7ikyOS0ECQbIu26jxbJyIMCzp7Zkjee0_pvVJXisfMO6uuKR1zxUr3fek4qYkURyriyWMgrBE198GA2kCuXz-fn2tToTkD",
  waitingTime = "4m",
  onStartCall,
  disabled = false,
}) => {
  return (
    <GlassPanel className="p-6 relative overflow-hidden flex flex-col justify-between hover:border-secondary/30">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h5 className="font-headline-md text-[18px] font-bold text-on-surface">
            Active Telehealth
          </h5>
          <span className="material-symbols-outlined text-primary">
            videocam
          </span>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            {disabled ? (
              <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant">
                  person_off
                </span>
              </div>
            ) : (
              <>
                <img
                  alt={patientName}
                  className="w-12 h-12 rounded-full object-cover"
                  src={avatarUrl}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-surface shadow-[0_0_8px_rgba(127,208,255,0.8)]" />
              </>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-body-md text-sm font-bold text-on-surface">
                {disabled ? "Buffer Queue Empty" : patientName}
              </p>
              {!disabled && (
                <motion.span
                  animate={{ scale: [0.9, 1.1, 0.9], opacity: [1, 0.5, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                  className="w-2 h-2 bg-secondary rounded-full inline-block"
                />
              )}
            </div>
            <p className="font-data-mono text-[11px] font-mono text-on-surface-variant/70">
              {disabled
                ? "No patients in waiting room"
                : `In Waiting Room (${waitingTime})`}
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="secondary"
        glow={!disabled}
        onClick={disabled ? undefined : onStartCall}
        className={`w-full font-label-caps text-xs py-2 font-mono ${disabled ? "opacity-45 cursor-not-allowed pointer-events-none" : ""}`}
      >
        {disabled ? "NO CALLS ACTIVE" : "START CALL"}
      </Button>
    </GlassPanel>
  );
};
