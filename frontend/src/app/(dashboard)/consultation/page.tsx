"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClinicalNotes } from "@/components/consultation/clinical-notes";
import { PrescriptionBuilder } from "@/components/consultation/prescription-builder";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { LoadingState } from "@/components/ui/loading-state";
import { StateController } from "@/components/ui/state-controller";
import { SystemAlertBanner } from "@/components/ui/system-alert-banner";
import { VitalsCard } from "@/components/ui/vitals-card";

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const simulatorStates = [
  { value: "normal", label: "Normal (Animated)", icon: "check_circle" },
  { value: "empty", label: "Empty State", icon: "hourglass_empty" },
  { value: "loading", label: "Loading Sync", icon: "refresh" },
  { value: "alert", label: "System Alert", icon: "warning" },
];

export default function ConsultationPage() {
  const router = useRouter();
  const [activeState, setActiveState] = useState<string>("normal");

  if (activeState === "loading") {
    return (
      <div className="flex-1 flex flex-col justify-center min-h-[70vh]">
        <LoadingState
          message="TokyoClinic OS - Synchronizing Consultation Chart..."
          statusText="Fetching patient clinical registry"
        />
        <StateController
          states={simulatorStates}
          currentState={activeState}
          onStateChange={setActiveState}
          title="Consultation States"
        />
      </div>
    );
  }

  const isEmpty = activeState === "empty";

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-6 flex-grow flex flex-col relative"
    >
      <AnimatePresence>
        {activeState === "alert" && (
          <SystemAlertBanner message="CRITICAL ALERT: PATIENT PENICILLIN HYPERSENSITIVITY DETECTED" />
        )}
      </AnimatePresence>

      {/* Patient Sub-header Bar */}
      <div className="p-5 bg-surface-container-low/50 backdrop-blur-sm flex flex-col md:flex-row justify-between items-stretch md:items-center border border-outline-variant/30 rounded-xl gap-4">
        <div className="flex items-center gap-6">
          <div>
            <h2
              className={`font-headline-md text-headline-md font-bold ${isEmpty ? "text-on-surface-variant/40" : "text-on-surface"}`}
            >
              {isEmpty ? "No Active Patient" : "Takeshi Kovacs"}
            </h2>
            <p className="font-data-mono text-xs text-secondary font-mono mt-0.5">
              {isEmpty
                ? "ID: -- • --Y/-- • --"
                : "ID: #TK-8829-JP • 42Y/M • O-Positive"}
            </p>
          </div>
          <div className="h-10 w-px bg-outline-variant hidden md:block" />
          <div className="flex flex-col">
            <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider font-mono">
              Current Status
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`w-2.5 h-2.5 rounded-full ${isEmpty ? "bg-outline-variant" : "bg-tertiary animate-pulse shadow-[0_0_8px_rgba(207,203,80,0.6)]"}`}
              />
              <span
                className={`text-sm font-bold font-mono ${isEmpty ? "text-on-surface-variant" : "text-tertiary"}`}
              >
                {isEmpty ? "Standby Mode" : "Active Consultation"}
              </span>
            </div>
          </div>
        </div>
        {!isEmpty && (
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex items-center gap-2 py-2 border border-outline-variant font-label-caps text-xs font-mono"
            >
              <span className="material-symbols-outlined text-[18px]">
                history
              </span>
              History
            </Button>
            <Button
              variant="primary"
              glow
              onClick={() => {
                alert("Consultation visit completed successfully!");
                router.push("/");
              }}
              className="flex items-center gap-2 py-2 font-label-caps text-xs font-mono"
            >
              <span className="material-symbols-outlined text-[18px]">
                save
              </span>
              Complete Visit
            </Button>
          </div>
        )}
      </div>

      {/* Consultation Panels Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-grow">
        {/* Left Column: Diagnostics & Allergies */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Allergies */}
          <GlassPanel className="p-5 hover:border-outline/20">
            <h3 className="font-label-caps text-xs text-secondary font-mono tracking-wider mb-4 uppercase flex items-center justify-between font-bold">
              Allergies & Risks
              {!isEmpty && (
                <span className="material-symbols-outlined text-error animate-pulse text-base">
                  warning
                </span>
              )}
            </h3>
            {isEmpty ? (
              <p className="text-xs text-on-surface-variant/50 font-mono uppercase tracking-wider">
                No active allergy logs
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-error/10 border border-error/20 text-error text-[10px] font-mono font-bold rounded">
                  PENICILLIN
                </span>
                <span className="px-2 py-1 bg-error/10 border border-error/20 text-error text-[10px] font-mono font-bold rounded">
                  NSAIDS
                </span>
                <span className="px-2 py-1 bg-tertiary/10 border border-tertiary/20 text-tertiary text-[10px] font-mono font-bold rounded">
                  HYPERTENSION
                </span>
              </div>
            )}
          </GlassPanel>

          {/* History Timeline */}
          <GlassPanel className="p-5 flex-grow hover:border-outline/20">
            <h3 className="font-label-caps text-xs text-secondary font-mono tracking-wider mb-6 uppercase font-bold">
              Medical History
            </h3>
            {isEmpty ? (
              <p className="text-xs text-on-surface-variant/50 font-mono uppercase tracking-wider">
                No patient history loaded
              </p>
            ) : (
              <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant/60">
                <div className="relative pl-8 group">
                  <div className="absolute left-0 top-1.5 w-4.5 h-4.5 bg-primary border-4 border-surface-container rounded-full cursor-help hover:scale-125 transition-transform" />
                  <p className="font-data-mono text-[11px] text-on-surface-variant font-mono">
                    2025-10-12
                  </p>
                  <p className="font-sans text-sm font-bold text-on-surface mt-0.5">
                    Acute Bronchitis
                  </p>
                  <p className="text-xs text-on-surface-variant/70 italic mt-0.5">
                    Treated with Azithromycin
                  </p>
                </div>
                <div className="relative pl-8 group">
                  <div className="absolute left-0 top-1.5 w-4.5 h-4.5 bg-outline border-4 border-surface-container rounded-full cursor-help hover:scale-125 transition-transform" />
                  <p className="font-data-mono text-[11px] text-on-surface-variant font-mono">
                    2025-04-05
                  </p>
                  <p className="font-sans text-sm font-bold text-on-surface mt-0.5">
                    Spinal MRI
                  </p>
                  <p className="text-xs text-on-surface-variant/70 italic mt-0.5">
                    L4-L5 protrusion observed
                  </p>
                </div>
                <div className="relative pl-8 group">
                  <div className="absolute left-0 top-1.5 w-4.5 h-4.5 bg-outline border-4 border-surface-container rounded-full cursor-help hover:scale-125 transition-transform" />
                  <p className="font-data-mono text-[11px] text-on-surface-variant font-mono">
                    2024-11-20
                  </p>
                  <p className="font-sans text-sm font-bold text-on-surface mt-0.5">
                    Annual Check-up
                  </p>
                  <p className="text-xs text-on-surface-variant/70 italic mt-0.5">
                    BP 138/88, elevated LDL
                  </p>
                </div>
              </div>
            )}
          </GlassPanel>

          {/* Imaging */}
          <GlassPanel className="p-5 hover:border-outline/20">
            <h3 className="font-label-caps text-xs text-secondary font-mono tracking-wider mb-4 uppercase font-bold">
              Recent Imaging
            </h3>
            {isEmpty ? (
              <p className="text-xs text-on-surface-variant/50 font-mono uppercase tracking-wider">
                No telemetry scans
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="relative group cursor-pointer overflow-hidden rounded-lg border border-outline-variant/30">
                  <img
                    className="w-full h-24 object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                    alt="Chest X-Ray"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBk3lzDYe__PJNEC_m8BG8g2yDXs6i0o4vz2awZeiAteTyNkdIvZifc8xOlbN-PFd8AZLxosoTbbndH_X9ExAkQuxu3_xP8QK9BUfvQN1AxrbO8awROSZQQA8dWZ1HGl4tGhyjg0ImRjqyXqEH6IU8Ap3BhKJ6PaT2G-Opq6QUK-cLFi6p6vzyoq9Ov3MoJ5MH9F7DSZun04Qfeh_nYTD8yo9N-fvuVB4_w90C5biRItbR6F_Ahk3DH87AbfMZpr8tHrnUMi6MVVTFA"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-black/70 px-2 py-0.5 text-[9px] text-white font-mono">
                    CHEST_XR_PA
                  </div>
                </div>
                <div className="relative group cursor-pointer overflow-hidden rounded-lg border border-outline-variant/30">
                  <img
                    className="w-full h-24 object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                    alt="Brain MRI"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlZUIogR1HutTquwRecfXx8E2aslZKnPmKDUsgfsl1GkELdYVJ6q_I9VdLPHvkenTxdvpcgZ5J6Ez9xv0_NMhz0M2F-ebMSmDPIF7pZoPnUXqiXVvhcYMl-6ecj9Kv8PwWQOGcqiCYtDBVDIAMpxU7m9ZUOS1escxxlY2NQLELAfU84MCovEEPsfsX7iQkXrPISZim-YfeASKlYi30enqlDibuMgCC5m78E0YyBqDF0OkDudVv-QDAJ2tf8zueGiwRHiqNM5Ke4FDD"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-black/70 px-2 py-0.5 text-[9px] text-white font-mono">
                    MRI_BRAIN_SAG
                  </div>
                </div>
              </div>
            )}
          </GlassPanel>
        </div>

        {/* Middle Column: Vitals and Notes */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <VitalsCard
              title="Heart Rate"
              initialValue="78"
              unit="BPM"
              icon="favorite"
              type="hr"
              color="error"
              forceOffline={isEmpty}
            />
            <VitalsCard
              title="Blood Pressure"
              initialValue="124 / 82"
              unit="mmHg"
              icon="monitor_heart"
              type="bp"
              color="secondary"
              forceOffline={isEmpty}
            />
            <VitalsCard
              title="Oxygen (SpO2)"
              initialValue="98"
              unit="%"
              icon="air"
              type="spo2"
              color="tertiary"
              forceOffline={isEmpty}
            />
          </div>

          <ClinicalNotes disabled={isEmpty} />
        </div>

        {/* Right Column: Prescription Builder */}
        <div className="lg:col-span-3">
          <PrescriptionBuilder disabled={isEmpty} />
        </div>
      </div>

      <StateController
        states={simulatorStates}
        currentState={activeState}
        onStateChange={setActiveState}
        title="Consultation States"
      />
    </motion.div>
  );
}
