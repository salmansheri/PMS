"use client";

import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Input } from "../ui/custom-input";

export interface HeaderProps {
  avatarUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBwggfQNfOeo5Gn9aAWATXejpMWGmBvOCfC0gLaipOH91xADtKXxFoKGsv1KqNLt73XSTfROYXxJp31iWeGU80p9MYNq4EMCgUIyWWJBIh5hbmRM55_AwM2QJFuK0tnWplVdlOtGOKfGNkaRAZbbWJsjX70_JGZFLhVU7FMnlHJCOT82vdKMnO-XPgIcTIgwYfjzXGoQBLRZtDb-M6bmIKejIa8YeAxX48aBAALurnkBVrzjmrIcplAOg8hP7CGaJyUoAorQRmDbw79",
}) => {
  const { user, logout } = useUser();
  const [search, setSearch] = useState("");

  const doctorName = user?.fullName || "Guest Operator";
  const role = user?.role ? user.role.replace("ROLE_", "") : "OFFLINE";

  return (
    <header className="absolute top-0 left-0 right-0 w-full h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex justify-between items-center px-8 z-40">
      {/* Search Input */}
      <div className="flex items-center flex-1 max-w-md">
        <Input
          icon="search"
          placeholder="Search patients, medical codes, diagnostics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-surface-container-lowest"
        />
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-on-surface-variant">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1, color: "#7fd0ff" }}
            whileTap={{ scale: 0.95 }}
            className="material-symbols-outlined cursor-pointer hover:drop-shadow-[0_0_8px_rgba(127,208,255,0.5)] outline-none"
          >
            notifications
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.1, color: "#7fd0ff" }}
            whileTap={{ scale: 0.95 }}
            className="material-symbols-outlined cursor-pointer hover:drop-shadow-[0_0_8px_rgba(127,208,255,0.5)] outline-none"
          >
            help_outline
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.1, color: "#7fd0ff" }}
            whileTap={{ scale: 0.95 }}
            className="material-symbols-outlined cursor-pointer hover:drop-shadow-[0_0_8px_rgba(127,208,255,0.5)] outline-none"
          >
            dark_mode
          </motion.button>
          <motion.button
            type="button"
            onClick={logout}
            whileHover={{ scale: 1.1, color: "#ff7f7f" }}
            whileTap={{ scale: 0.95 }}
            className="material-symbols-outlined cursor-pointer hover:drop-shadow-[0_0_8px_rgba(255,127,127,0.5)] outline-none"
            title="Logout Operator Session"
          >
            logout
          </motion.button>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-outline-variant" />

        {/* Doctor Identity */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="font-sans text-sm font-bold text-on-surface group-hover:text-primary transition-colors duration-200">
              {doctorName}
            </p>
            <p className="font-label-caps text-[10px] uppercase text-secondary tracking-widest font-mono">
              {role}
            </p>
          </div>
          <motion.img
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-full border border-primary/40 object-cover group-hover:border-primary/80 transition-colors"
            alt={doctorName}
            src={avatarUrl}
          />
        </div>
      </div>
    </header>
  );
};
