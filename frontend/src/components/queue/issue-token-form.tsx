"use client";

import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { Button } from "../ui/button";
import { GlassPanel } from "../ui/glass-panel";
import { Select } from "../ui/input";

export interface IssueTokenFormProps {
  onIssueToken?: (data: {
    patientId: string;
    doctorDept: string;
    urgency: "Routine" | "Urgent";
  }) => void;
  disabled?: boolean;
}

export const IssueTokenForm: React.FC<IssueTokenFormProps> = ({
  onIssueToken,
  disabled = false,
}) => {
  const [patientId, setPatientId] = useState("Search registered patients...");
  const [doctorDept, setDoctorDept] = useState(
    "General Medicine - Dr. S. Tanaka",
  );
  const [urgency, setUrgency] = useState<"Routine" | "Urgent">("Routine");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onIssueToken) {
      onIssueToken({ patientId, doctorDept, urgency });
    } else {
      alert(
        `Issued token successfully!\nPatient: ${patientId}\nDept: ${doctorDept}\nUrgency: ${urgency}`,
      );
    }
  };

  const patients = [
    {
      value: "Search registered patients...",
      label: "Search registered patients...",
    },
    { value: "Yuki Mori (ID: 88291)", label: "Yuki Mori (ID: 88291)" },
    { value: "Rina Nakamura (ID: 99120)", label: "Rina Nakamura (ID: 99120)" },
    { value: "Daiki Kato (ID: 44021)", label: "Daiki Kato (ID: 44021)" },
  ];

  const doctors = [
    {
      value: "General Medicine - Dr. S. Tanaka",
      label: "General Medicine - Dr. S. Tanaka",
    },
    {
      value: "Cardiology - Dr. H. Watanabe",
      label: "Cardiology - Dr. H. Watanabe",
    },
    { value: "Dermatology - Dr. K. Sato", label: "Dermatology - Dr. K. Sato" },
    { value: "Neurology - Dr. M. Kimura", label: "Neurology - Dr. M. Kimura" },
  ];

  return (
    <GlassPanel className="p-8 flex flex-col h-full border-primary/20 bg-gradient-to-b from-primary/5 to-transparent relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-2 relative z-10">
        Issue New Token
      </h2>
      <p className="text-on-surface-variant text-sm mb-8 relative z-10">
        Generate a unique identification token for new arrivals.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 flex-1 flex flex-col relative z-10"
      >
        {/* Select Patient */}
        <div>
          <Select
            label="SELECT PATIENT"
            options={patients}
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            disabled={disabled}
          />
        </div>

        {/* Assign Department */}
        <div>
          <Select
            label="ASSIGN DEPARTMENT / DOCTOR"
            options={doctors}
            value={doctorDept}
            onChange={(e) => setDoctorDept(e.target.value)}
            disabled={disabled}
          />
        </div>

        {/* Urgency Level */}
        <div>
          <span className="block font-label-caps text-on-surface-variant mb-2 uppercase text-xs">
            URGENCY LEVEL
          </span>
          <div className="flex gap-4">
            <button
              type="button"
              disabled={disabled}
              onClick={() => !disabled && setUrgency("Routine")}
              className={`flex-1 py-3 px-4 rounded border text-sm font-semibold active:scale-95 transition-all duration-200 outline-none ${
                disabled
                  ? urgency === "Routine"
                    ? "border-primary/30 bg-primary/5 text-primary/40 cursor-not-allowed"
                    : "border-outline-variant/30 bg-surface-container/30 text-on-surface-variant/30 cursor-not-allowed"
                  : urgency === "Routine"
                    ? "border-primary bg-primary/10 text-primary shadow-[0_0_10px_rgba(212,187,255,0.2)] cursor-pointer"
                    : "border-outline-variant bg-surface-container text-on-surface hover:border-primary/50 cursor-pointer"
              }`}
            >
              Routine
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => !disabled && setUrgency("Urgent")}
              className={`flex-1 py-3 px-4 rounded border text-sm font-semibold active:scale-95 transition-all duration-200 outline-none ${
                disabled
                  ? urgency === "Urgent"
                    ? "border-tertiary/30 bg-tertiary/5 text-tertiary/40 cursor-not-allowed"
                    : "border-outline-variant/30 bg-surface-container/30 text-on-surface-variant/30 cursor-not-allowed"
                  : urgency === "Urgent"
                    ? "border-tertiary bg-tertiary/10 text-tertiary shadow-[0_0_15px_rgba(207,203,80,0.25)] cursor-pointer"
                    : "border-outline-variant bg-surface-container text-on-surface hover:border-tertiary/50 cursor-pointer"
              }`}
            >
              Urgent
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-8 mt-auto">
          <Button
            type="submit"
            variant="primary"
            glow={!disabled}
            disabled={disabled}
            className="w-full py-4 rounded-xl flex items-center justify-center gap-3 relative overflow-hidden group font-headline-md font-bold text-sm"
          >
            {!disabled && (
              <motion.span
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[50%]"
              />
            )}
            <span className="material-symbols-outlined relative z-10 text-lg">
              print
            </span>
            <span className="relative z-10 font-mono uppercase tracking-wider">
              {disabled ? "QUEUING OFFLINE" : "ISSUE TOKEN (GENERATE)"}
            </span>
          </Button>
        </div>
      </form>

      {/* Form Footer */}
      <div className="mt-8 pt-6 border-t border-outline-variant flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 text-xs">
          <div
            className={`h-2 w-2 rounded-full animate-pulse ${disabled ? "bg-outline-variant" : "bg-success shadow-[0_0_8px_rgba(158,206,106,0.8)]"}`}
          />
          <span className="font-data-mono font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
            {disabled ? "System Offline" : "System Online"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant font-mono text-[10px]">
          <span className="material-symbols-outlined text-[15px]">print</span>
          <span>TOKYO-A-THERMAL</span>
        </div>
      </div>
    </GlassPanel>
  );
};
