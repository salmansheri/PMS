"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
// UI & Queue Components
import { CurrentServing } from "@/components/queue/current-serving";
import { IssueTokenForm } from "@/components/queue/issue-token-form";
import { WaitlistTable } from "@/components/queue/waitlist-table";
import { LoadingState } from "@/components/ui/loading-state";
import { StateController } from "@/components/ui/state-controller";
import { SystemAlertBanner } from "@/components/ui/system-alert-banner";
import { useQueueStore } from "@/store";

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

export default function QueuePage() {
  const [activeState, setActiveState] = useState<string>("normal");

  const tokens = useQueueStore((state) => state.tokens);
  const servingToken = useQueueStore((state) => state.servingToken);
  const servingDoctor = useQueueStore((state) => state.servingDoctor);
  const servingRoom = useQueueStore((state) => state.servingRoom);
  const addToken = useQueueStore((state) => state.addToken);
  const serveToken = useQueueStore((state) => state.serveToken);

  const displayedTokens = activeState === "empty" ? [] : tokens;

  if (activeState === "loading") {
    return (
      <div className="flex-1 flex flex-col justify-center min-h-[70vh]">
        <LoadingState
          message="Syncing token queue network..."
          statusText="Establishing WebSocket uplink"
        />
        <StateController
          states={simulatorStates}
          currentState={activeState}
          onStateChange={setActiveState}
          title="Queue States"
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8 min-h-full flex flex-col relative"
    >
      <AnimatePresence>
        {activeState === "alert" && (
          <SystemAlertBanner message="CRITICAL ALERT: QUEUE DISPATCH LINK DEGRADED" />
        )}
      </AnimatePresence>

      <div>
        <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">
          Token Queue Management
        </h2>
        <p className="text-on-surface-variant font-body-lg">
          {activeState === "empty"
            ? "Queue network offline. Dispensers running on emergency standalone mode."
            : "Monitor and dispatch patient triage and token queue lanes."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <CurrentServing
            token={servingToken}
            doctorName={servingDoctor}
            roomName={servingRoom}
            disabled={activeState === "empty"}
          />
          <WaitlistTable
            tokens={displayedTokens}
            onServeToken={(token) => {
              if (activeState !== "empty") {
                serveToken(token);
              }
            }}
          />
        </div>
        <div className="lg:col-span-5">
          <IssueTokenForm
            onIssueToken={(data) => {
              addToken(data.patientId, data.doctorDept, data.urgency);
            }}
            disabled={activeState === "empty"}
          />
        </div>
      </div>

      <StateController
        states={simulatorStates}
        currentState={activeState}
        onStateChange={setActiveState}
        title="Queue States"
      />
    </motion.div>
  );
}
