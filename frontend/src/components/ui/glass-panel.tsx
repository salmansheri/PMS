"use client";

import { type HTMLMotionProps, motion } from "motion/react";
import type React from "react";

export interface GlassPanelProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  borderColor?: "default" | "primary" | "secondary" | "tertiary" | "error";
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  hoverEffect = false,
  borderColor = "default",
  className = "",
  ...props
}) => {
  const baseStyles =
    "glass-panel p-5 rounded-lg transition-all duration-300 relative overflow-hidden";

  const borderStyles = {
    default: "hover:border-outline-variant/30",
    primary: "border-primary/20 hover:border-primary/50",
    secondary: "border-secondary/20 hover:border-secondary/50",
    tertiary: "border-tertiary/20 hover:border-tertiary/50",
    error: "border-error/20 hover:border-error/50",
  };

  const animationProps = hoverEffect
    ? {
        whileHover: {
          y: -4,
          borderColor:
            borderColor === "primary"
              ? "#d4bbff"
              : borderColor === "secondary"
                ? "#7fd0ff"
                : borderColor === "tertiary"
                  ? "#cfcb50"
                  : borderColor === "error"
                    ? "#ffb4ab"
                    : "#958e9c",
          boxShadow:
            borderColor === "primary"
              ? "0 4px 20px rgba(212,187,255,0.15)"
              : borderColor === "secondary"
                ? "0 4px 20px rgba(127,208,255,0.15)"
                : borderColor === "tertiary"
                  ? "0 4px 20px rgba(207,203,80,0.15)"
                  : borderColor === "error"
                    ? "0 4px 20px rgba(255,180,171,0.15)"
                    : "0 4px 20px rgba(255,255,255,0.05)",
        },
        transition: { duration: 0.3, ease: "easeOut" as const },
      }
    : {};

  return (
    <motion.div
      className={`${baseStyles} ${borderStyles[borderColor]} ${className}`}
      {...animationProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};
