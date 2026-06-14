"use client";

import { motion } from "motion/react";
import type React from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 10, filter: "blur(2px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.25, 1],
    opacity: [0.6, 1, 0.6],
    filter: [
      "drop-shadow(0 0 2px rgba(187, 154, 247, 0.4))",
      "drop-shadow(0 0 8px rgba(187, 154, 247, 0.8))",
      "drop-shadow(0 0 2px rgba(187, 154, 247, 0.4))",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

export const BrandLogo: React.FC = () => {
  const letters = "TokyoClinic".split("");

  return (
    <div className="flex flex-col select-none">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-1.5"
      >
        {/* Animated Brand Name */}
        <h1 className="font-headline-md text-headline-md font-extrabold text-primary tracking-tight flex">
          {letters.map((char, index) => (
            <motion.span
              // biome-ignore lint/suspicious/noArrayIndexKey: static string sequence
              key={`logo-char-${index}`}
              variants={letterVariants}
              className="inline-block origin-bottom hover:text-secondary hover:scale-110 transition-transform duration-200 cursor-pointer"
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Pulse Indicator */}
        <motion.span
          variants={pulseVariants}
          animate="animate"
          className="w-2.5 h-2.5 rounded-full bg-primary mt-1"
        />
      </motion.div>

      {/* Subtitle slide in */}
      <motion.p
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 0.7, x: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
        className="font-label-caps text-label-caps text-on-surface-variant tracking-widest mt-1 font-mono text-[9px]"
      >
        Precision Care OS
      </motion.p>
    </div>
  );
};
