"use client";

import { motion } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";
import { GlassPanel } from "./glass-panel";

export interface VitalsCardProps {
  title: string;
  initialValue: string;
  unit: string;
  icon: string;
  type: "hr" | "bp" | "spo2";
  color: "error" | "secondary" | "tertiary";
  forceOffline?: boolean;
}

export const VitalsCard: React.FC<VitalsCardProps> = ({
  title,
  initialValue,
  unit,
  icon,
  type,
  color,
  forceOffline = false,
}) => {
  const [value, setValue] = useState(forceOffline ? "--" : initialValue);

  // Fluctuating values logic for heartbeat/SpO2/BP to make it feel alive!
  useEffect(() => {
    if (forceOffline) {
      setValue("--");
      return;
    }
    setValue(initialValue);
    if (type === "bp") return; // Keep Blood Pressure mostly static

    const interval = setInterval(() => {
      setValue((prev) => {
        const numeric = parseFloat(prev);
        if (Number.isNaN(numeric)) return prev;

        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        let next = numeric + change;

        if (type === "hr") {
          if (next < 70) next = 72;
          if (next > 88) next = 86;
        } else if (type === "spo2") {
          if (next < 96) next = 97;
          if (next > 100) next = 99;
        }

        return String(next);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [type, forceOffline, initialValue]);

  const borderStyles = {
    error: forceOffline
      ? "border-l-4 border-l-outline-variant"
      : "border-l-4 border-l-error",
    secondary: forceOffline
      ? "border-l-4 border-l-outline-variant"
      : "border-l-4 border-l-secondary",
    tertiary: forceOffline
      ? "border-l-4 border-l-outline-variant"
      : "border-l-4 border-l-tertiary",
  };

  const textColors = {
    error: forceOffline ? "text-on-surface-variant/40" : "text-error",
    secondary: forceOffline ? "text-on-surface-variant/40" : "text-secondary",
    tertiary: forceOffline ? "text-on-surface-variant/40" : "text-tertiary",
  };

  const getSubtext = () => {
    if (forceOffline) return "SENSOR OFFLINE";
    switch (type) {
      case "hr":
        return "+2.4% vs last hour";
      case "bp":
        return "STABLE • -2% VS PREVIOUS";
      case "spo2":
        return "OPTIMAL RANGE";
      default:
        return "";
    }
  };

  return (
    <GlassPanel
      hoverEffect={!forceOffline}
      borderColor={forceOffline ? "default" : color}
      className={`vitals-glow flex flex-col justify-between h-40 ${borderStyles[color]}`}
    >
      <div className="flex justify-between items-start">
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          {title}
        </span>
        <motion.span
          animate={
            forceOffline
              ? { scale: 1, opacity: 0.3 }
              : type === "hr"
                ? { scale: [1, 1.2, 1, 1.1, 1] }
                : { opacity: [1, 0.8, 1] }
          }
          transition={
            forceOffline
              ? undefined
              : {
                  repeat: Infinity,
                  duration: type === "hr" ? 0.8 : 3,
                  ease: "easeInOut",
                }
          }
          className={`material-symbols-outlined ${textColors[color]}`}
        >
          {icon}
        </motion.span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-headline-xl text-headline-xl text-on-surface font-semibold font-sans">
          {value}
        </span>
        <span className="font-data-mono text-data-mono text-on-surface-variant font-mono">
          {unit}
        </span>
      </div>

      {type === "hr" && (
        <div className="h-4 flex items-center gap-1 overflow-hidden mt-2">
          <div className="h-2 bg-outline-variant/20 flex-grow rounded-sm relative overflow-hidden">
            {!forceOffline && (
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute top-0 left-0 h-full bg-error w-1/3 rounded-sm"
              />
            )}
          </div>
        </div>
      )}

      {type === "spo2" && (
        <div className="flex gap-0.5 mt-2 h-1.5">
          <div
            className={`h-1 flex-grow rounded-full ${forceOffline ? "bg-outline-variant/20" : "bg-tertiary"}`}
          />
          <div
            className={`h-1 flex-grow rounded-full ${forceOffline ? "bg-outline-variant/20" : "bg-tertiary"}`}
          />
          <div
            className={`h-1 flex-grow rounded-full ${forceOffline ? "bg-outline-variant/20" : "bg-tertiary"}`}
          />
          <div className="h-1 flex-grow bg-outline-variant/10 rounded-full" />
        </div>
      )}

      {type === "bp" && (
        <p
          className={`text-[10px] font-label-caps uppercase mt-2 ${textColors[color]}`}
        >
          {getSubtext()}
        </p>
      )}
    </GlassPanel>
  );
};
