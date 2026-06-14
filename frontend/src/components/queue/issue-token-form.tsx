"use client";

import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { GlassPanel } from "../ui/glass-panel";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

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
        className="flex-1 flex flex-col relative z-10"
      >
        <FieldGroup className="gap-6 flex-1 flex flex-col">
          {/* Select Patient */}
          <Field>
            <FieldLabel
              htmlFor="patient-select"
              className="font-label-caps text-on-surface-variant text-xs uppercase"
            >
              SELECT PATIENT
            </FieldLabel>
            <Select
              value={patientId}
              onValueChange={(val) => setPatientId(val || "")}
              items={patients}
              disabled={disabled}
            >
              <SelectTrigger className="w-full bg-[#1a1c23]/50 border-outline-variant/30 text-on-surface">
                <SelectValue placeholder="Search registered patients..." />
              </SelectTrigger>
              <SelectContent className="bg-[#24283b] border border-outline-variant text-on-surface">
                <SelectGroup>
                  {patients.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          {/* Assign Department */}
          <Field>
            <FieldLabel
              htmlFor="doctor-select"
              className="font-label-caps text-on-surface-variant text-xs uppercase"
            >
              ASSIGN DEPARTMENT / DOCTOR
            </FieldLabel>
            <Select
              value={doctorDept}
              onValueChange={(val) => setDoctorDept(val || "")}
              items={doctors}
              disabled={disabled}
            >
              <SelectTrigger className="w-full bg-[#1a1c23]/50 border-outline-variant/30 text-on-surface">
                <SelectValue placeholder="Select Doctor / Department..." />
              </SelectTrigger>
              <SelectContent className="bg-[#24283b] border border-outline-variant text-on-surface">
                <SelectGroup>
                  {doctors.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          {/* Urgency Level */}
          <Field>
            <FieldLabel
              id="urgency-label"
              className="font-label-caps text-on-surface-variant text-xs uppercase"
            >
              URGENCY LEVEL
            </FieldLabel>
            <ToggleGroup
              aria-labelledby="urgency-label"
              value={[urgency]}
              onValueChange={(val) => {
                if (val.length > 0) {
                  setUrgency(val[0] as "Routine" | "Urgent");
                }
              }}
              disabled={disabled}
              className="w-full flex gap-4"
            >
              <ToggleGroupItem
                value="Routine"
                disabled={disabled}
                className={`flex-1 h-auto py-3 px-4 rounded-lg border text-sm font-semibold active:scale-95 transition-all duration-200 outline-none hover:bg-transparent ${
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
              </ToggleGroupItem>
              <ToggleGroupItem
                value="Urgent"
                disabled={disabled}
                className={`flex-1 h-auto py-3 px-4 rounded-lg border text-sm font-semibold active:scale-95 transition-all duration-200 outline-none hover:bg-transparent ${
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
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>

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
        </FieldGroup>
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
