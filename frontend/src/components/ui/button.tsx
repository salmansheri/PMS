"use client";

import { type HTMLMotionProps, motion } from "motion/react";
import type React from "react";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  glow = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "relative inline-flex items-center justify-center font-bold font-sans transition-all duration-300 outline-none focus:ring-1 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer select-none rounded";

  const variants = {
    primary:
      "bg-primary text-surface-container-lowest hover:brightness-110 active:brightness-95 hover:-translate-y-0.5 active:translate-y-0 disabled:bg-primary/50 disabled:text-surface-container-lowest/50 disabled:transform-none",
    secondary:
      "bg-transparent border border-secondary text-secondary hover:bg-secondary/15 hover:-translate-y-0.5 active:translate-y-0 disabled:border-secondary/50 disabled:text-secondary/50 disabled:transform-none",
    ghost:
      "bg-transparent text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface disabled:text-on-surface-variant/50",
    danger:
      "bg-error-container/20 border border-error text-error hover:bg-error/10 active:bg-error/20 disabled:border-error/50 disabled:text-error/50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-label-caps uppercase tracking-wider",
    md: "px-5 py-2.5 text-body-md",
    lg: "px-6 py-3.5 text-body-lg",
  };

  const glowStyles = glow
    ? variant === "primary"
      ? "shadow-[0_2px_8px_rgba(187,154,247,0.15)] hover:shadow-[0_4px_14px_rgba(187,154,247,0.6)]"
      : variant === "secondary"
        ? "shadow-[0_2px_8px_rgba(127,208,255,0.05)] hover:shadow-[0_4px_14px_rgba(127,208,255,0.3)]"
        : ""
    : "";

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};
