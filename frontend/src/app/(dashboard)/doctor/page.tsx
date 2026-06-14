"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClinicSchedule } from "@/components/dashboard/clinic-schedule";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TelehealthCard } from "@/components/dashboard/telehealth-card";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { LoadingState } from "@/components/ui/loading-state";
import { StateController } from "@/components/ui/state-controller";
import { SystemAlertBanner } from "@/components/ui/system-alert-banner";

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

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [activeState, setActiveState] = useState<string>("normal");
  const [showCall, setShowCall] = useState(false);

  if (activeState === "loading") {
    return (
      <div className="flex-1 flex flex-col justify-center min-h-[70vh]">
        <LoadingState
          message="TokyoClinic OS - Loading Doctor Dashboard..."
          statusText="Establishing clinic database sync"
        />
        <StateController
          states={simulatorStates}
          currentState={activeState}
          onStateChange={setActiveState}
          title="Doctor States"
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
      className="space-y-8 relative"
    >
      <AnimatePresence>
        {activeState === "alert" && (
          <SystemAlertBanner message="SYSTEM ALERT: MRI ROOM 04 MAINTENANCE INITIATED" />
        )}
      </AnimatePresence>

      {/* Doctor Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">
            Clinic Overview
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            System status:{" "}
            <span
              className={
                isEmpty ? "text-error font-mono" : "text-secondary font-mono"
              }
            >
              {isEmpty ? "STANDBY" : "NOMINAL"}
            </span>{" "}
            • Shift: Day Cycle
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="flex items-center gap-2 border border-outline-variant font-label-caps text-xs py-2"
          >
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Export Reports
          </Button>
          <Button
            variant="primary"
            glow
            onClick={() => router.push("/consultation")}
            className="flex items-center gap-2 font-label-caps text-xs py-2"
          >
            <span className="material-symbols-outlined text-base">add</span>
            New Consultation
          </Button>
        </div>
      </div>

      {/* Statistics widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassPanel className="p-6 relative overflow-hidden group hover:border-primary/40">
          <p className="font-label-caps text-xs text-on-surface-variant uppercase mb-4 tracking-wider font-mono">
            Patients Seen
          </p>
          <h3 className="font-headline-xl text-[40px] text-primary font-black">
            {isEmpty ? "0" : "24"}
          </h3>
          <p className="font-data-mono text-[11px] text-secondary font-mono mt-2">
            {isEmpty ? "0% change" : "+12% vs. Yesterday"}
          </p>
        </GlassPanel>

        <GlassPanel className="p-6 relative overflow-hidden group hover:border-error/40">
          <p className="font-label-caps text-xs text-on-surface-variant uppercase mb-4 tracking-wider font-mono">
            Pending Reports
          </p>
          <h3
            className={`font-headline-xl text-[40px] font-black ${isEmpty ? "text-on-surface-variant" : "text-error"}`}
          >
            {isEmpty ? "00" : "08"}
          </h3>
          <p className="font-data-mono text-[11px] text-error font-mono mt-2">
            {isEmpty ? "No priority reviews" : "Urgent Priority: 03"}
          </p>
        </GlassPanel>

        <GlassPanel className="p-6 relative overflow-hidden group hover:border-outline/40">
          <p className="font-label-caps text-xs text-on-surface-variant uppercase mb-4 tracking-wider font-mono">
            Avg Consultation Time
          </p>
          <h3 className="font-headline-xl text-[40px] text-on-surface font-black">
            {isEmpty ? "0.0" : "18.5"}
            <span className="text-body-md font-normal text-on-surface-variant ml-1 font-sans">
              min
            </span>
          </h3>
          <p className="font-data-mono text-[11px] text-on-surface-variant font-mono mt-2">
            {isEmpty ? "Offline" : "Optimal range reached"}
          </p>
        </GlassPanel>

        <GlassPanel
          className={`p-6 border relative overflow-hidden flex flex-col justify-between ${
            isEmpty
              ? "bg-surface-container border-outline-variant/30 text-on-surface-variant"
              : "bg-primary-container/10 border-primary/30 text-on-primary-container"
          }`}
        >
          <div>
            <p
              className={`font-label-caps text-xs uppercase mb-3 tracking-wider font-mono font-bold ${
                isEmpty ? "text-on-surface-variant" : "text-primary"
              }`}
            >
              System Alerts
            </p>
            <p className="font-body-md font-bold mb-1 text-on-surface">
              {isEmpty ? "No Active Warnings" : "MRI Maintenance"}
            </p>
            <p className="text-xs text-on-surface-variant leading-snug">
              {isEmpty
                ? "Clinical subsystems are in a nominal standby status."
                : "Unit 04 scheduled for diagnostics at 18:00 JST."}
            </p>
          </div>
          {!isEmpty && (
            <button
              type="button"
              className="text-[11px] font-bold underline uppercase text-primary hover:text-primary-container transition-colors text-left outline-none cursor-pointer mt-3"
            >
              Details
            </button>
          )}
        </GlassPanel>
      </div>

      {/* Timeline schedule and telehealth */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <ClinicSchedule
            schedule={isEmpty ? [] : undefined}
            onViewFullSchedule={() => {}}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lab Reports Summary */}
            <GlassPanel className="p-6 hover:border-secondary/30 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h5 className="font-headline-md text-[18px] font-bold text-on-surface">
                    Recent Lab Reports
                  </h5>
                  <span className="material-symbols-outlined text-secondary">
                    science
                  </span>
                </div>
                {isEmpty ? (
                  <div className="py-12 text-center text-on-surface-variant/70 font-mono text-xs uppercase tracking-widest">
                    No labs processed
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-background/50 p-3 rounded group hover:bg-background transition-colors cursor-default border border-outline-variant/30">
                      <div>
                        <p className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                          Hemoglobin A1c
                        </p>
                        <p className="font-data-mono text-[11px] text-on-surface-variant font-mono">
                          Patient: Hana W.
                        </p>
                      </div>
                      <span className="text-tertiary font-mono font-bold">
                        5.7%
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-background/50 p-3 rounded group hover:bg-background transition-colors cursor-default border border-outline-variant/30">
                      <div>
                        <p className="text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
                          Lipid Profile
                        </p>
                        <p className="font-data-mono text-[11px] text-on-surface-variant font-mono">
                          Patient: Yuto S.
                        </p>
                      </div>
                      <span className="text-error font-mono font-bold">
                        High
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </GlassPanel>

            {/* Telehealth Widget */}
            <TelehealthCard
              onStartCall={isEmpty ? undefined : () => setShowCall(true)}
              disabled={isEmpty}
            />
          </div>
        </div>
        <div className="lg:col-span-4">
          <RecentActivity
            activities={isEmpty ? [] : undefined}
            alertMessage={
              isEmpty
                ? {
                    title: "Clinical Message",
                    content: "No new operational alerts in current shift.",
                  }
                : undefined
            }
          />
        </div>
      </div>

      {/* Telehealth Call Mock Overlay */}
      <AnimatePresence>
        {showCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-surface-container border border-secondary/40 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative"
            >
              <div className="aspect-video w-full bg-slate-900 relative">
                {/* Doctor viewport placeholder */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="material-symbols-outlined text-secondary text-5xl animate-pulse">
                    videocam
                  </span>
                  <p className="text-secondary font-mono mt-4 uppercase tracking-wider text-xs">
                    Connecting Telehealth Video Feed...
                  </p>
                  <p className="text-on-surface-variant text-sm font-bold mt-2">
                    Patient: Akari Tanaka
                  </p>
                </div>

                {/* Self preview overlay */}
                <div className="absolute bottom-6 right-6 w-32 h-24 bg-surface-container-lowest rounded-lg border border-primary/20 overflow-hidden shadow-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl">
                    person
                  </span>
                  <span className="absolute bottom-1 right-2 text-[9px] font-mono text-primary">
                    Self
                  </span>
                </div>
              </div>

              {/* Call Controls */}
              <div className="bg-surface-container-lowest p-6 flex justify-between items-center border-t border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-secondary rounded-full animate-pulse" />
                  <span className="font-mono text-xs text-secondary uppercase font-bold">
                    Live Stream
                  </span>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    className="p-3 bg-surface-container rounded-full h-11 w-11 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-lg">
                      mic_off
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="p-3 bg-surface-container rounded-full h-11 w-11 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-lg">
                      videocam_off
                    </span>
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setShowCall(false)}
                    className="px-6 rounded-full font-bold flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">
                      call_end
                    </span>
                    Hang Up
                  </Button>
                </div>

                <span className="text-xs text-on-surface-variant font-mono">
                  00:00:18
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <StateController
        states={simulatorStates}
        currentState={activeState}
        onStateChange={setActiveState}
        title="Doctor States"
      />
    </motion.div>
  );
}
