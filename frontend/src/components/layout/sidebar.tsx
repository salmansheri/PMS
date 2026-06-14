"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { BrandLogo } from "./BrandLogo";

export type TabType =
  | "admin"
  | "doctor"
  | "consultation"
  | "queue"
  | "patients";

interface NavItem {
  id: TabType;
  href: string;
  label: string;
  icon: string;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const items: NavItem[] = [
    { id: "admin", href: "/", label: "Admin Dashboard", icon: "dashboard" },
    {
      id: "patients",
      href: "/patients",
      label: "Patient Intake",
      icon: "edit_document",
    },
    {
      id: "doctor",
      href: "/doctor",
      label: "Doctor Dashboard",
      icon: "calendar_today",
    },
    {
      id: "consultation",
      href: "/consultation",
      label: "Consultation Chart",
      icon: "chat_bubble",
    },
    { id: "queue", href: "/queue", label: "Token Queue", icon: "queue" },
  ];

  // Helper to check active state based on route pathname
  const getActiveTab = (): TabType => {
    if (pathname === "/patients") return "patients";
    if (pathname === "/doctor") return "doctor";
    if (pathname === "/consultation") return "consultation";
    if (pathname === "/queue") return "queue";
    return "admin"; // Default to admin for root path
  };

  const activeTab = getActiveTab();

  return (
    <aside className="h-full w-64 flex-shrink-0 bg-surface-container-lowest border-r border-outline-variant flex flex-col py-6 z-50">
      {/* Brand Header */}
      <div className="px-6 mb-10">
        <BrandLogo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 relative">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center px-6 py-3.5 relative text-left outline-none transition-colors duration-200 cursor-pointer ${
                isActive
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[2px_0_10px_rgba(212,187,255,0.4)]"
                  style={{ originX: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {isActive && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-surface-container-high/40 z-[-1] shadow-[inset_4px_0_10px_rgba(212,187,255,0.05)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="material-symbols-outlined mr-4">
                {item.icon}
              </span>
              <span className="font-body-md font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* New Patient CTA Button */}
      <div className="px-6 mb-2 mt-auto">
        <Link href="/patients" className="w-full">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-primary/30 bg-primary/5 text-primary text-xs font-mono font-bold hover:bg-primary/10 transition-colors uppercase tracking-wider outline-none cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">
              person_add
            </span>
            New Patient
          </button>
        </Link>
      </div>

      {/* Footer System Status */}
      <div className="px-6 border-t border-outline-variant pt-6 space-y-4">
        <div className="flex items-center gap-3 text-on-surface-variant text-xs">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(158,206,106,0.8)]" />
          <span className="font-data-mono font-mono text-[10px]">
            SYS_STATUS: NOMINAL
          </span>
        </div>
        <div className="text-on-surface-variant text-xs opacity-60 font-data-mono font-mono">
          NODE: TOK-APP-V4
        </div>
      </div>
    </aside>
  );
};
