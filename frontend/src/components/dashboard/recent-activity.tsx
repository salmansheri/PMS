"use client";

import type React from "react";
import { GlassPanel } from "../ui/glass-panel";

export interface ActivityItem {
  id: string;
  time: string;
  type: "report" | "consult" | "system";
  title: string;
  detail: string;
  color: "primary" | "secondary" | "tertiary";
}

export interface RecentActivityProps {
  activities?: ActivityItem[];
  alertMessage?: {
    title: string;
    content: string;
  };
}

const defaultActivities: ActivityItem[] = [
  {
    id: "1",
    time: "08:45 AM",
    type: "report",
    title: "New Report uploaded for Case #4920",
    detail: "Radiology: Chest X-Ray",
    color: "primary",
  },
  {
    id: "2",
    time: "Yesterday",
    type: "consult",
    title: "Consultation completed with Takumi K.",
    detail: "Prescription: Metformin 500mg",
    color: "secondary",
  },
  {
    id: "3",
    time: "Yesterday",
    type: "system",
    title: "System Maintenance: Core DB Updated",
    detail: "Security patches for HIPAA compliance v4.2",
    color: "tertiary",
  },
];

const defaultAlert = {
  title: "Clinic Message",
  content:
    "Staff meeting in Conference Hall B at 17:00 regarding the new digital record protocol. Attendance is mandatory.",
};

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = defaultActivities,
  alertMessage = defaultAlert,
}) => {
  const bulletColors = {
    primary: "bg-primary ring-surface",
    secondary: "bg-secondary ring-surface",
    tertiary: "bg-tertiary ring-surface",
  };

  const textColors = {
    primary: "group-hover:text-primary",
    secondary: "group-hover:text-secondary",
    tertiary: "group-hover:text-tertiary",
  };

  return (
    <GlassPanel className="h-full flex flex-col justify-between hover:border-outline/30">
      <div>
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/40">
          <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">
            Recent Activity
          </h4>
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors">
            filter_list
          </span>
        </div>

        <div className="p-6 space-y-6 relative">
          {/* Vertical Timeline Line */}
          {activities.length > 0 && (
            <div className="absolute left-[31px] top-8 bottom-8 w-[1px] bg-outline-variant" />
          )}

          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant/70 text-xs font-mono uppercase tracking-widest gap-3">
              <span className="material-symbols-outlined text-3xl text-outline-variant">
                history
              </span>
              No recent system activity
            </div>
          ) : (
            activities.map((act) => (
              <div
                key={act.id}
                className="relative flex gap-4 pl-8 group cursor-default"
              >
                {/* Animated Bullet */}
                <div
                  className={`absolute left-[3.5px] top-1.5 w-2 h-2 rounded-full ring-4 transition-transform duration-300 group-hover:scale-125 ${
                    bulletColors[act.color]
                  }`}
                />
                <div>
                  <p className="font-data-mono text-[10px] text-on-surface-variant uppercase mb-1 font-mono">
                    {act.time}
                  </p>
                  <p
                    className={`font-sans text-sm text-on-surface transition-colors duration-200 ${
                      textColors[act.color]
                    }`}
                  >
                    {act.title}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5 italic">
                    {act.detail}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Alert Warning Box */}
      <div className="p-6">
        <div className="bg-surface-variant/30 rounded border border-outline-variant p-4 hover:border-primary transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary">info</span>
            <p className="font-label-caps text-[11px] text-on-surface uppercase tracking-wider font-mono font-bold">
              {alertMessage.title}
            </p>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {alertMessage.content}
          </p>
        </div>
      </div>
    </GlassPanel>
  );
};
