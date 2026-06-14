"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { LoadingState } from "@/components/ui/loading-state";
import { StateController } from "@/components/ui/state-controller";

const simulatorStates = [
  { value: "landing", label: "Public Landing", icon: "home" },
  { value: "loading", label: "Loading Sync", icon: "refresh" },
  { value: "maintenance", label: "Maintenance Mode", icon: "construction" },
];

export default function LandingPage() {
  const router = useRouter();
  const [activeState, setActiveState] = useState<string>("landing");

  if (activeState === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-on-surface p-6">
        <LoadingState
          message="Synchronizing Central Health Hub..."
          statusText="Checking ledger node uptime & biometric database indexes"
        />
        <StateController
          states={simulatorStates}
          currentState={activeState}
          onStateChange={setActiveState}
          title="Landing States"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-on-surface flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      {/* Glow backgrounds */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl font-bold">
            health_metrics
          </span>
          <span className="font-sans font-bold text-lg tracking-tight">
            TokyoNight Clinic
          </span>
        </div>
        <div>
          {activeState === "maintenance" ? (
            <span className="text-[10px] font-mono text-error border border-error/30 bg-error/10 px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-error animate-ping" />
              SYSTEM DOWN
            </span>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push("/login")}
              className="font-mono text-2xs uppercase tracking-wider font-bold"
            >
              Sign In to Node
            </Button>
          )}
        </div>
      </header>

      {/* Hero Body */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col justify-center relative z-20">
        <AnimatePresence>
          {activeState === "maintenance" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <GlassPanel className="border-error/30 bg-error-container/10 p-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <span className="material-symbols-outlined text-error text-3xl shrink-0 animate-bounce">
                  construction
                </span>
                <div>
                  <h3 className="font-bold text-error font-headline-md">
                    Emergency Maintenance Node Activated
                  </h3>
                  <p className="text-on-surface-variant text-xs mt-1">
                    System core is currently undergoing routine biometric ledger
                    indexing. User logins are temporarily restricted. Uptime
                    estimated within 45 minutes.
                  </p>
                </div>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary">
              <span className="font-mono text-[10px] uppercase tracking-wider font-bold">
                Next-Gen Medical OS
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black font-sans leading-none tracking-tight text-on-surface">
              Tomorrow's Clinical <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-success">
                Architecture.
              </span>{" "}
              Today.
            </h2>

            <p className="text-on-surface-variant font-body-lg text-base md:text-lg max-w-xl leading-relaxed">
              A decentralized medical administration shell designed for speed,
              resilience, and cryptographic privacy. Integrated token lane
              management, biometric registration, and doctor metrics.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                glow={activeState !== "maintenance"}
                disabled={activeState === "maintenance"}
                onClick={() => router.push("/login")}
                className="px-8 py-4 font-mono text-xs uppercase tracking-wider"
              >
                {activeState === "maintenance"
                  ? "Uplink Disabled"
                  : "Initialize Operator Uplink"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  alert(
                    "TokyoNight Clinic OS — Version 2.10.4. Built for decentralized local-first operations.",
                  );
                }}
                className="px-6 py-4 font-mono text-xs uppercase tracking-wider"
              >
                Inspect Ledger Spec
              </Button>
            </div>
          </div>

          {/* Right Cards */}
          <div className="lg:col-span-5 space-y-6">
            <GlassPanel className="p-6 border-primary/20 hover:border-primary/40 transition-colors duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-all pointer-events-none" />
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <span className="material-symbols-outlined text-lg">
                    token
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-on-surface font-headline-md">
                    Decoupled LED Queueing
                  </h4>
                  <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">
                    Dispatch patient tokens into active lanes instantly.
                    Multi-doctor room pairing with live telemetry feeds.
                  </p>
                </div>
              </div>
            </GlassPanel>

            <GlassPanel className="p-6 border-secondary/20 hover:border-secondary/40 transition-colors duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-xl group-hover:bg-secondary/10 transition-all pointer-events-none" />
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0 border border-secondary/20">
                  <span className="material-symbols-outlined text-lg">
                    fingerprint
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-on-surface font-headline-md">
                    Biometric Client Hub
                  </h4>
                  <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">
                    Zero-trust patient intake and registrations. Commit
                    credentials to localized tamper-proof data stores.
                  </p>
                </div>
              </div>
            </GlassPanel>

            <GlassPanel className="p-6 border-success/20 hover:border-success/40 transition-colors duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-full blur-xl group-hover:bg-success/10 transition-all pointer-events-none" />
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0 border border-success/20">
                  <span className="material-symbols-outlined text-lg">
                    database
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-on-surface font-headline-md">
                    Cryptographic Medical Ledger
                  </h4>
                  <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">
                    Prescriptions and diagnoses are signed with operator
                    cryptographic keys to maintain security integrity.
                  </p>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-outline-variant/30 py-8 relative z-20 bg-background/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-on-surface-variant/50">
          <p>© 2026 TokyoNight Digital Cooperative. All rights reserved.</p>
          <div className="flex gap-6 uppercase">
            <a href="/landing#status" className="hover:text-primary">
              Ledger status
            </a>
            <a href="/landing#e2e" className="hover:text-primary">
              E2E Spec
            </a>
            <a href="/landing#api" className="hover:text-primary">
              API Uplink
            </a>
          </div>
        </div>
      </footer>

      <StateController
        states={simulatorStates}
        currentState={activeState}
        onStateChange={setActiveState}
        title="Landing States"
      />
    </div>
  );
}
