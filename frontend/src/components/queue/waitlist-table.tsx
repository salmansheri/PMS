"use client";

import { motion } from "motion/react";
import type React from "react";
import { GlassPanel } from "../ui/glass-panel";

export interface QueueToken {
  id: string;
  token: string;
  patientName: string;
  waitTime: string;
  status: "Ready" | "Waiting" | "Checked In";
  borderHighlight: "secondary" | "primary" | "success";
}

export interface WaitlistTableProps {
  tokens?: QueueToken[];
  onServeToken?: (token: QueueToken) => void;
}

const defaultTokens: QueueToken[] = [
  {
    id: "1",
    token: "A-129",
    patientName: "Kenji Sato",
    waitTime: "08 mins",
    status: "Ready",
    borderHighlight: "secondary",
  },
  {
    id: "2",
    token: "A-130",
    patientName: "Minato Takahashi",
    waitTime: "14 mins",
    status: "Waiting",
    borderHighlight: "primary",
  },
  {
    id: "3",
    token: "B-042",
    patientName: "Akiko Yamamoto",
    waitTime: "22 mins",
    status: "Waiting",
    borderHighlight: "primary",
  },
  {
    id: "4",
    token: "A-131",
    patientName: "Haruto Suzuki",
    waitTime: "35 mins",
    status: "Checked In",
    borderHighlight: "success",
  },
];

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
};

export const WaitlistTable: React.FC<WaitlistTableProps> = ({
  tokens = defaultTokens,
  onServeToken,
}) => {
  const borderColors = {
    secondary:
      "hover:border-secondary hover:shadow-[0_0_15px_rgba(127,208,255,0.1)]",
    primary:
      "hover:border-primary hover:shadow-[0_0_15px_rgba(212,187,255,0.1)]",
    success:
      "hover:border-success hover:shadow-[0_0_15px_rgba(158,206,106,0.1)]",
  };

  const statusBadges = {
    Ready:
      "bg-secondary/15 text-secondary border border-secondary/20 shadow-[0_0_5px_rgba(127,208,255,0.4)] animate-pulse",
    Waiting:
      "bg-surface-variant text-on-surface-variant border border-outline-variant",
    "Checked In": "bg-success/15 text-success border border-success/20",
  };

  return (
    <GlassPanel className="flex-1 flex flex-col overflow-hidden min-h-0 hover:border-outline/20 p-0">
      <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/40">
        <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
          Up Next
        </h2>
        <span className="font-label-caps text-[10px] text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 shadow-[0_0_10px_rgba(212,187,255,0.1)] font-mono font-bold">
          {tokens.length} IN WAITLIST
        </span>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="sticky top-0 bg-surface-container/95 backdrop-blur-md z-10 border-b border-outline-variant">
            <tr className="text-on-surface-variant font-label-caps text-[11px] font-mono uppercase">
              <th className="px-6 py-3 font-normal w-1/4">Token</th>
              <th className="px-6 py-3 font-normal w-1/3">Patient Name</th>
              <th className="px-6 py-3 font-normal w-1/4">Wait Time</th>
              <th className="px-6 py-3 font-normal w-1/4">Status</th>
            </tr>
          </thead>
          <motion.tbody
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="divide-y divide-outline-variant"
          >
            {tokens.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-on-surface-variant/40 py-8">
                    <span className="material-symbols-outlined text-4xl mb-3 animate-pulse text-outline-variant">
                      hourglass_empty
                    </span>
                    <p className="font-mono text-xs uppercase tracking-widest">
                      Waitlist Clear
                    </p>
                    <p className="text-[10px] text-on-surface-variant/50 mt-1">
                      No active tokens in the queue system.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              tokens.map((tok) => (
                <motion.tr
                  key={tok.id}
                  variants={rowVariants}
                  onClick={() => onServeToken?.(tok)}
                  className={`hover:bg-surface-container-highest/40 transition-all duration-300 group border-l-2 border-transparent cursor-pointer table-row ${
                    borderColors[tok.borderHighlight]
                  }`}
                >
                  <td className="px-6 py-4 font-data-mono text-secondary group-hover:text-secondary-fixed transition-colors font-mono text-sm">
                    {tok.token}
                  </td>
                  <td className="px-6 py-4 font-sans font-bold text-on-surface group-hover:text-white transition-colors text-sm">
                    {tok.patientName}
                  </td>
                  <td className="px-6 py-4 font-data-mono text-on-surface-variant font-mono text-xs">
                    {tok.waitTime}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-tight relative overflow-hidden ${
                        statusBadges[tok.status]
                      }`}
                    >
                      <span className="relative z-10">{tok.status}</span>
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </motion.tbody>
        </table>
      </div>
    </GlassPanel>
  );
};
