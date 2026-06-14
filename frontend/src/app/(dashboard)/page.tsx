"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentAppointments } from "@/components/dashboard/recent-appointments";
import { SystemVitality } from "@/components/dashboard/system-vitality";
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

const zeroKpis = [
  {
    title: "Total Patients",
    value: "0",
    badge: "0.0%",
    icon: "person",
    changeType: "neutral" as const,
    color: "primary" as const,
  },
  {
    title: "Active Doctors",
    value: "0",
    badge: "Offline",
    icon: "medical_services",
    changeType: "neutral" as const,
    color: "secondary" as const,
  },
  {
    title: "Live Appointments",
    value: "0",
    badge: "0.0%",
    icon: "event_note",
    changeType: "neutral" as const,
    color: "tertiary" as const,
  },
  {
    title: "Active Tokens",
    value: "0",
    badge: "Idle",
    icon: "token",
    changeType: "neutral" as const,
    color: "primary" as const,
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeState, setActiveState] = useState<string>("normal");

  if (activeState === "loading") {
    return (
      <div className="flex-1 flex flex-col justify-center min-h-[70vh]">
        <LoadingState
          message="TokyoClinic OS - Loading System Nodes..."
          statusText="Fetching operations metrics"
        />
        <StateController
          states={simulatorStates}
          currentState={activeState}
          onStateChange={setActiveState}
          title="Admin States"
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8 relative"
    >
      <AnimatePresence>
        {activeState === "alert" && (
          <SystemAlertBanner message="CRITICAL ALERT: MAIN WING POWER DRIFT DETECTED" />
        )}
      </AnimatePresence>

      <div>
        <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">
          Dashboard Overview
        </h2>
        <p className="text-on-surface-variant font-body-lg">
          {activeState === "empty"
            ? "Biometric database offline. Operational stats currently zeroed."
            : "Real-time clinical operations and system health."}
        </p>
      </div>

      <KpiGrid data={activeState === "empty" ? zeroKpis : undefined} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <RecentAppointments
            appointments={activeState === "empty" ? [] : undefined}
            onViewAll={() => router.push("/doctor")}
          />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          <QuickActions
            onAddPatient={() => router.push("/patients")}
            onGenerateToken={() => router.push("/queue")}
            onAddDoctor={() => router.push("/doctor")}
          />
          <SystemVitality forceOffline={activeState === "empty"} />
        </div>
      </div>

      {/* Map / Capacity */}
      <GlassPanel className="rounded-xl overflow-hidden h-48 relative p-0 group">
        <img
          alt="Facility Map"
          className={`w-full h-full object-cover group-hover:scale-[1.01] transition-all duration-700 cursor-pointer ${
            activeState === "empty"
              ? "opacity-10 grayscale scale-[1.0] pointer-events-none"
              : "opacity-50 grayscale group-hover:opacity-75 group-hover:grayscale-0"
          }`}
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiWiwN8MYi2TOic6x5_n5a5qxKdf9uiWknEXNfeSz0rm-ojVM75eITY5gEdBg5IhnoppJQscw3Ie39P6a6So4UjaqReC1RJhiA54tKh0uMKu0b1bRzowO0Y5ozaCmNrWiSJWnm7jYF7VF9p4PS5HjDLKrSPkAR3s7T_JhYQvn9Y-jw8xecVbHkuGgfnV0KqMWazZy_1s3ZFTqYWq9_sm8v-wV8mwQ9PkQO6wgh8lUwQgKVcypdgmGGoNc6m0jEzGRwe6NfJpVQpIez"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent pointer-events-none group-hover:opacity-80 transition-opacity duration-500" />
        <div className="absolute bottom-4 left-6 group-hover:-translate-y-1 transition-all duration-500">
          <p className="font-headline-md text-on-surface font-bold">
            Main Wing
          </p>
          <p className="text-xs text-on-surface-variant font-label-caps font-mono tracking-wide mt-1">
            {activeState === "empty"
              ? "0% Capacity • 0 Active Units"
              : "92% Capacity • 14 Active Units"}
          </p>
        </div>
      </GlassPanel>

      <StateController
        states={simulatorStates}
        currentState={activeState}
        onStateChange={setActiveState}
        title="Admin States"
      />
    </motion.div>
  );
}
