"use client";

import type React from "react";
import { Button } from "../ui/button";
import { GlassPanel } from "../ui/glass-panel";

export interface QuickActionsProps {
  onAddPatient?: () => void;
  onAddDoctor?: () => void;
  onGenerateToken?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onAddPatient,
  onAddDoctor,
  onGenerateToken,
}) => {
  return (
    <GlassPanel className="p-6 rounded-xl hover:border-outline/30 flex flex-col justify-between h-full min-h-[300px]">
      <div>
        <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-6">
          Quick Actions
        </h3>
        <p className="text-xs text-on-surface-variant mb-6 font-sans">
          Trigger system operations, register medical staff or incoming
          patients.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Add Patient */}
        <Button
          variant="primary"
          glow
          onClick={onAddPatient}
          className="w-full justify-between p-4 rounded-lg active:scale-95 transition-all duration-300 group"
        >
          <span className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
            <span className="material-symbols-outlined">person_add</span>
            Add Patient
          </span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-300">
            chevron_right
          </span>
        </Button>

        {/* Add Doctor */}
        <Button
          variant="secondary"
          onClick={onAddDoctor}
          className="w-full justify-between p-4 rounded-lg active:scale-95 transition-all duration-300 group"
        >
          <span className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
            <span className="material-symbols-outlined">
              medical_information
            </span>
            Add Doctor
          </span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-300">
            chevron_right
          </span>
        </Button>

        {/* Generate Token */}
        <Button
          variant="ghost"
          onClick={onGenerateToken}
          className="w-full justify-between p-4 rounded-lg border border-primary text-primary hover:bg-primary/10 active:scale-95 transition-all duration-300 group"
        >
          <span className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
            <span className="material-symbols-outlined">
              confirmation_number
            </span>
            Generate Token
          </span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-300">
            chevron_right
          </span>
        </Button>
      </div>
    </GlassPanel>
  );
};
