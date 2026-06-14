"use client";

import { motion } from "motion/react";
import type React from "react";
import { GlassPanel } from "../ui/glass-panel";

export interface Appointment {
  id: string;
  patientName: string;
  initials: string;
  time: string;
  doctor: string;
  status: "Confirmed" | "In Progress" | "Cancelled" | "Pending";
  colorType: "primary" | "secondary" | "danger" | "neutral";
}

export interface RecentAppointmentsProps {
  appointments?: Appointment[];
  onViewAll?: () => void;
}

const defaultAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Kenji Nakamura",
    initials: "KN",
    time: "09:15 AM",
    doctor: "Dr. Sato",
    status: "Confirmed",
    colorType: "secondary",
  },
  {
    id: "2",
    patientName: "Yuki Matsui",
    initials: "YM",
    time: "10:30 AM",
    doctor: "Dr. Tanaka",
    status: "In Progress",
    colorType: "secondary",
  },
  {
    id: "3",
    patientName: "Hiroshi Takahashi",
    initials: "HT",
    time: "11:00 AM",
    doctor: "Dr. Watanabe",
    status: "Cancelled",
    colorType: "danger",
  },
  {
    id: "4",
    patientName: "Akiko Ito",
    initials: "AI",
    time: "11:45 AM",
    doctor: "Dr. Sato",
    status: "Confirmed",
    colorType: "secondary",
  },
  {
    id: "5",
    patientName: "Sora Kobayashi",
    initials: "SK",
    time: "12:15 PM",
    doctor: "Dr. Suzuki",
    status: "Pending",
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
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
};

export const RecentAppointments: React.FC<RecentAppointmentsProps> = ({
  appointments = defaultAppointments,
  onViewAll,
}) => {
  const statusBadges = {
    Confirmed: "bg-tertiary/10 text-tertiary border border-tertiary/20",
    "In Progress": "bg-secondary/10 text-secondary border border-secondary/20",
    Cancelled: "bg-error-container/20 text-error border border-error/20",
    Pending:
      "bg-surface-container-highest text-on-surface-variant border border-outline-variant",
  };

  const avatarColors = {
    primary: "bg-primary/20 text-primary",
    secondary: "bg-secondary/20 text-secondary",
    danger: "bg-error/20 text-error",
    neutral: "bg-surface-container-highest text-on-surface-variant",
  };

  return (
    <GlassPanel className="overflow-hidden flex flex-col h-full hover:border-outline/30">
      <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/40">
        <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
          Recent Appointments
        </h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-secondary font-label-caps text-xs hover:underline hover:text-secondary-fixed transition-colors font-mono cursor-pointer"
        >
          VIEW ALL
        </button>
      </div>
      <div className="overflow-x-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-on-surface-variant font-label-caps text-[11px] font-mono border-b border-outline-variant uppercase">
              <th className="px-6 py-4 font-normal">Patient Name</th>
              <th className="px-6 py-4 font-normal">Time</th>
              <th className="px-6 py-4 font-normal">Doctor</th>
              <th className="px-6 py-4 font-normal">Status</th>
            </tr>
          </thead>
          <motion.tbody
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="divide-y divide-outline-variant"
          >
            {appointments.length === 0 ? (
              <motion.tr variants={rowVariants}>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-on-surface-variant/70 font-mono text-xs uppercase tracking-wider"
                >
                  No active appointments in local registry.
                </td>
              </motion.tr>
            ) : (
              appointments.map((appt) => (
                <motion.tr
                  key={appt.id}
                  variants={rowVariants}
                  className="hover:bg-surface-container-highest/50 transition-colors duration-200 cursor-default"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                          avatarColors[appt.colorType]
                        }`}
                      >
                        {appt.initials}
                      </div>
                      <span className="text-on-surface font-medium text-sm">
                        {appt.patientName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-data-mono text-secondary font-mono text-xs">
                    {appt.time}
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant text-sm">
                    {appt.doctor}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded font-label-caps text-[10px] font-mono font-bold ${
                        statusBadges[appt.status]
                      }`}
                    >
                      {appt.status}
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
