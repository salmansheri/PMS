"use client";

import { motion } from "motion/react";
import type React from "react";
import { GlassPanel } from "../ui/glass-panel";

export interface ScheduleItem {
  id: string;
  time: string;
  patientName: string;
  initials: string;
  detail: string;
  status: "Confirmed" | "Ongoing" | "Scheduled";
  colorType: "primary" | "secondary" | "neutral";
}

export interface ClinicScheduleProps {
  schedule?: ScheduleItem[];
  onViewFullSchedule?: () => void;
}

const defaultSchedule: ScheduleItem[] = [
  {
    id: "1",
    time: "09:00",
    patientName: "Takumi Kobayashi",
    initials: "TK",
    detail: "Post-Op Review • Room 302",
    status: "Confirmed",
    colorType: "primary",
  },
  {
    id: "2",
    time: "10:30",
    patientName: "Hana Watanabe",
    initials: "HW",
    detail: "Initial Consultation • Room 105",
    status: "Ongoing",
    colorType: "secondary",
  },
  {
    id: "3",
    time: "13:15",
    patientName: "Yuto Suzuki",
    initials: "YS",
    detail: "Cardiovascular Stress Test • Lab 02",
    status: "Scheduled",
    colorType: "neutral",
  },
  {
    id: "4",
    time: "15:45",
    patientName: "Ren Ishida",
    initials: "RI",
    detail: "Routine Check-up • Room 302",
    status: "Scheduled",
    colorType: "neutral",
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
  show: { opacity: 1, x: 0 },
};

export const ClinicSchedule: React.FC<ClinicScheduleProps> = ({
  schedule = defaultSchedule,
  onViewFullSchedule,
}) => {
  const badgeColors = {
    Confirmed: "bg-primary/10 text-primary border border-primary/20",
    Ongoing: "bg-secondary/10 text-secondary border border-secondary/20",
    Scheduled:
      "bg-surface-variant text-on-surface-variant border border-outline-variant",
  };

  const textColors = {
    primary: "text-secondary",
    secondary: "text-secondary",
    neutral: "text-on-surface-variant opacity-60",
  };

  return (
    <GlassPanel className="overflow-hidden flex flex-col h-full hover:border-outline/30">
      <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/40">
        <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">
          Today's Schedule
        </h4>
        <span className="bg-surface-variant px-3 py-1 rounded-full text-on-surface-variant font-data-mono text-[11px] font-mono">
          OCT 24, 2026
        </span>
      </div>

      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="show"
        className="divide-y divide-outline-variant flex-1 overflow-y-auto custom-scrollbar"
      >
        {schedule.length === 0 ? (
          <motion.div
            variants={rowVariants}
            className="flex flex-col items-center justify-center h-full py-16 text-on-surface-variant/70 text-xs font-mono uppercase tracking-widest gap-3"
          >
            <span className="material-symbols-outlined text-4xl text-outline-variant">
              calendar_today
            </span>
            No scheduled clinical visits
          </motion.div>
        ) : (
          schedule.map((item) => (
            <motion.div
              key={item.id}
              variants={rowVariants}
              className="flex items-center p-6 hover:bg-surface-variant/30 transition-all duration-200 group cursor-pointer"
            >
              {/* Time Column */}
              <div
                className={`w-16 font-data-mono text-base font-mono transition-transform duration-200 group-hover:scale-105 ${
                  textColors[item.colorType]
                }`}
              >
                {item.time}
              </div>

              {/* Middle Patient Info */}
              <div className="flex-1 flex items-center gap-4 px-6 border-l border-outline-variant">
                <div className="w-10 h-10 bg-surface-container-highest rounded border border-outline-variant flex items-center justify-center font-data-mono font-mono text-on-surface font-semibold text-xs group-hover:border-primary/50 transition-colors">
                  {item.initials}
                </div>
                <div>
                  <p className="font-headline-md text-[15px] font-bold text-on-surface group-hover:text-primary transition-colors">
                    {item.patientName}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {item.detail}
                  </p>
                </div>
              </div>

              {/* Status / Actions */}
              <div className="flex items-center gap-4">
                <span
                  className={`px-2.5 py-0.5 rounded font-data-mono text-[10px] font-mono font-bold uppercase ${
                    badgeColors[item.status]
                  }`}
                >
                  {item.status}
                </span>
                <button
                  type="button"
                  className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors outline-none cursor-pointer"
                >
                  more_vert
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      <div className="p-4 border-t border-outline-variant text-center bg-surface-container-low/20">
        <button
          type="button"
          onClick={onViewFullSchedule}
          className="text-primary font-label-caps text-xs hover:underline uppercase font-mono font-bold cursor-pointer"
        >
          View Full Schedule
        </button>
      </div>
    </GlassPanel>
  );
};
