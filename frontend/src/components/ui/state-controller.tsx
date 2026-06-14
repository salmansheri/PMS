"use client";

import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { GlassPanel } from "./glass-panel";

interface StateOption {
  value: string;
  label: string;
  icon: string;
}

interface StateControllerProps {
  states: StateOption[];
  currentState: string;
  onStateChange: (state: string) => void;
  title?: string;
}

export const StateController: React.FC<StateControllerProps> = ({
  states,
  currentState,
  onStateChange,
  title = "Screen State",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {!isOpen ? (
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_0_15px_rgba(187,154,247,0.4)] hover:shadow-[0_0_25px_rgba(187,154,247,0.7)] transition-all cursor-pointer border-none outline-none animate-bounce"
          style={{ animationDuration: "3s" }}
          title="Switch Screen State"
        >
          <span className="material-symbols-outlined text-2xl">tune</span>
        </motion.button>
      ) : (
        <GlassPanel className="w-64 p-4 shadow-2xl rounded-xl border border-primary/30 bg-surface-container-high/90 backdrop-blur-md relative">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-outline-variant/50">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-lg">
                tune
              </span>
              <span className="font-label-caps text-xs font-mono font-bold text-on-surface uppercase tracking-wider">
                {title}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer border-none bg-transparent p-0 outline-none"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div className="space-y-2">
            {states.map((state) => {
              const isActive = currentState === state.value;
              return (
                <button
                  type="button"
                  key={state.value}
                  onClick={() => onStateChange(state.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-left font-body-md transition-all cursor-pointer border border-transparent outline-none ${
                    isActive
                      ? "bg-primary text-on-primary font-bold shadow-[0_0_10px_rgba(187,154,247,0.2)]"
                      : "bg-background/40 hover:bg-background/70 text-on-surface-variant hover:text-on-surface hover:border-outline-variant/30"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">
                      {state.icon}
                    </span>
                    <span className="text-xs font-medium font-mono">
                      {state.label}
                    </span>
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-on-primary rounded-full animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-[9px] font-data-mono font-mono text-on-surface-variant/40 mt-3 text-center uppercase tracking-widest">
            TokyoClinic Simulator
          </p>
        </GlassPanel>
      )}
    </div>
  );
};
