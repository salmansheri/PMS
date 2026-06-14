"use client";

import { motion } from "motion/react";
import type React from "react";
import { GlassPanel } from "../ui/glass-panel";

export interface KpiData {
  title: string;
  value: string;
  badge: string;
  icon: string;
  changeType: "increase" | "decrease" | "neutral";
  color: "primary" | "secondary" | "tertiary";
}

export interface KpiGridProps {
  data?: KpiData[];
}

const defaultKpis: KpiData[] = [
  {
    title: "Total Patients",
    value: "12,482",
    badge: "+12.5%",
    icon: "person",
    changeType: "increase",
    color: "primary",
  },
  {
    title: "Active Doctors",
    value: "156",
    badge: "Stable",
    icon: "medical_services",
    changeType: "neutral",
    color: "secondary",
  },
  {
    title: "Live Appointments",
    value: "42",
    badge: "-2.4%",
    icon: "event_note",
    changeType: "decrease",
    color: "tertiary",
  },
  {
    title: "Active Tokens",
    value: "892",
    badge: "High Vol",
    icon: "token",
    changeType: "increase",
    color: "primary",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 20 },
  },
};

export const KpiGrid: React.FC<KpiGridProps> = ({ data = defaultKpis }) => {
  const badgeColors = {
    increase: "text-success",
    decrease: "text-error",
    neutral: "text-on-surface-variant",
  };

  const bgColors = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    tertiary: "bg-tertiary/10 text-tertiary",
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-4 gap-6"
    >
      {data.map((kpi, _idx) => (
        <motion.div key={kpi.title} variants={cardVariants}>
          <GlassPanel
            hoverEffect
            borderColor={kpi.color}
            className="p-5 flex flex-col justify-between h-36"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-2 rounded-lg ${bgColors[kpi.color]} flex items-center justify-center`}
              >
                <span className="material-symbols-outlined">{kpi.icon}</span>
              </div>
              <span
                className={`font-label-caps text-xs font-mono font-bold ${badgeColors[kpi.changeType]}`}
              >
                {kpi.badge}
              </span>
            </div>
            <div>
              <h3 className="text-on-surface-variant font-label-caps text-[11px] uppercase tracking-wider mb-1 font-mono">
                {kpi.title}
              </h3>
              <p className="font-headline-lg text-headline-lg font-bold text-on-surface hover:text-primary transition-colors duration-200">
                {kpi.value}
              </p>
            </div>
          </GlassPanel>
        </motion.div>
      ))}
    </motion.div>
  );
};
