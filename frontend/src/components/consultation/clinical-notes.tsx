"use client";

import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { GlassPanel } from "../ui/glass-panel";
import { Textarea } from "../ui/input";

export interface ClinicalNotesProps {
  initialNotes?: string;
  onNotesChange?: (notes: string) => void;
  suggestion?: string;
  disabled?: boolean;
}

export const ClinicalNotes: React.FC<ClinicalNotesProps> = ({
  initialNotes = "",
  onNotesChange,
  suggestion = "Based on patient's BP history and current readings, consider reviewing Stage 1 Hypertension management protocols.",
  disabled = false,
}) => {
  const [notes, setNotes] = useState(initialNotes);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNotes(text);
    if (onNotesChange) {
      onNotesChange(text);
    }
  };

  return (
    <GlassPanel
      className={`flex-grow flex flex-col overflow-hidden shadow-lg p-0 hover:border-outline/20 ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Toolbar */}
      <div className="p-4 bg-surface-variant/30 border-b border-outline-variant flex justify-between items-center">
        <h3 className="font-headline-md text-sm font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">
            edit_note
          </span>
          Clinical Notes
        </h3>
        {!disabled && (
          <div className="flex gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, color: "#d4bbff" }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-on-surface-variant transition-colors outline-none cursor-pointer h-9 w-9 flex items-center justify-center rounded-lg hover:bg-surface-container-highest"
            >
              <span className="material-symbols-outlined text-base">
                text_format
              </span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, color: "#d4bbff" }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-on-surface-variant transition-colors outline-none cursor-pointer h-9 w-9 flex items-center justify-center rounded-lg hover:bg-surface-container-highest"
            >
              <span className="material-symbols-outlined text-base">
                attachment
              </span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, color: "#d4bbff" }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-on-surface-variant transition-colors outline-none cursor-pointer h-9 w-9 flex items-center justify-center rounded-lg hover:bg-surface-container-highest"
            >
              <span className="material-symbols-outlined text-base">mic</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-6 relative min-h-[300px]">
        <Textarea
          placeholder={
            disabled
              ? "No active patient session. Start a new consultation to record observations."
              : "Start typing clinical observations, patient symptoms, and physical exam findings here..."
          }
          value={notes}
          onChange={handleChange}
          disabled={disabled}
          className="h-full min-h-[200px]"
        />

        {/* Smart Suggestion Overlay */}
        {!disabled && suggestion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute bottom-6 right-6 max-w-xs bg-surface-container-highest border border-primary/30 p-4 rounded-lg shadow-2xl backdrop-blur-md suggestion-glow"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-base animate-pulse">
                auto_awesome
              </span>
              <span className="text-[10px] font-label-caps font-mono font-bold text-primary uppercase">
                Smart Suggestion
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed font-sans">
              {suggestion}
            </p>
          </motion.div>
        )}
      </div>
    </GlassPanel>
  );
};
