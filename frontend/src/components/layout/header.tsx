"use client";

import { motion } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useLogout } from "@/hooks/api/use-auth";
import { useNotifications } from "@/hooks/api/use-notifications";
import { useUserStore } from "@/store";
import { Input } from "../ui/custom-input";

export interface HeaderProps {
  avatarUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBwggfQNfOeo5Gn9aAWATXejpMWGmBvOCfC0gLaipOH91xADtKXxFoKGsv1KqNLt73XSTfROYXxJp31iWeGU80p9MYNq4EMCgUIyWWJBIh5hbmRM55_AwM2QJFuK0tnWplVdlOtGOKfGNkaRAZbbWJsjX70_JGZFLhVU7FMnlHJCOT82vdKMnO-XPgIcTIgwYfjzXGoQBLRZtDb-M6bmIKejIa8YeAxX48aBAALurnkBVrzjmrIcplAOg8hP7CGaJyUoAorQRmDbw79",
}) => {
  const user = useUserStore((state) => state.user);
  const logoutMutation = useLogout();
  const { notifications, markAllRead } = useNotifications();
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const doctorName = user?.fullName || "Guest Operator";
  const role = user?.role ? user.role.replace("ROLE_", "") : "OFFLINE";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <div className="relative" ref={dropdownRef}>
            <motion.button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              whileHover={{ scale: 1.1, color: "#7fd0ff" }}
              whileTap={{ scale: 0.95 }}
              className="material-symbols-outlined cursor-pointer hover:drop-shadow-[0_0_8px_rgba(127,208,255,0.5)] outline-none relative block"
            >
              notifications
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-surface text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-surface shadow-sm animate-pulse">
                  {notifications.length}
                </span>
              )}
            </motion.button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-surface-container/95 border border-outline-variant rounded-xl shadow-2xl backdrop-blur-md overflow-hidden z-50 flex flex-col">
                <div className="flex justify-between items-center px-4 py-3 border-b border-outline-variant bg-surface-container-high">
                  <span className="text-xs font-bold text-on-surface">
                    Unread Alerts
                  </span>
                  {notifications.length > 0 && (
                    // biome-ignore lint/a11y/useButtonType: <explanation>
<button
                      onClick={() => {
                        markAllRead.mutate({});
                        setDropdownOpen(false);
                      }}
                      className="text-[10px] font-mono uppercase tracking-wider text-primary hover:text-primary-container transition-colors duration-150 cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-outline-variant/30">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-secondary/60">
                      All caught up! No unread notifications.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="px-4 py-3 hover:bg-surface-container-high transition-colors duration-150"
                      >
                        <p className="text-xs text-on-surface leading-normal">
                          {notif.message}
                        </p>
                        <div className="flex justify-between items-center mt-1.5">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-secondary/80">
                            {notif.channel || "Alert"}
                          </span>
                          <span className="text-[9px] text-secondary/50">
                            {notif.createdAt
                              ? new Date(notif.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" },
                                )
                              : ""}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
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
            onClick={() => logoutMutation.mutate({})}
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
