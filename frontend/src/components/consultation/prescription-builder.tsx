"use client";

import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { GlassPanel } from "../ui/glass-panel";
import { Input } from "../ui/input";

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  duration: string;
}

export interface PrescriptionBuilderProps {
  initialMedications?: Medication[];
  onPrescribe?: (meds: Medication[]) => void;
  disabled?: boolean;
}

const defaultMedications: Medication[] = [
  {
    id: "1",
    name: "Lisinopril 10mg",
    dosage: "1 Tablet Daily",
    duration: "30 Days",
  },
  {
    id: "2",
    name: "Atorvastatin 20mg",
    dosage: "1 Tablet Nocte",
    duration: "90 Days",
  },
];

export const PrescriptionBuilder: React.FC<PrescriptionBuilderProps> = ({
  initialMedications = defaultMedications,
  onPrescribe,
  disabled = false,
}) => {
  const [meds, setMeds] = useState<Medication[]>(
    disabled ? [] : initialMedications,
  );
  const [activeId, setActiveId] = useState<string | null>(
    disabled ? null : "1",
  );

  const form = useForm({
    defaultValues: {
      newMedName: "",
    },
    validators: {
      onChange: z.object({
        newMedName: z.string().min(1, "Name is required"),
      }),
    },
    onSubmit: async ({ value }) => {
      if (disabled || !value.newMedName.trim()) return;

      const newMed: Medication = {
        id: Date.now().toString(),
        name: value.newMedName.trim(),
        dosage: "1 Tablet Daily",
        duration: "30 Days",
      };

      setMeds((prev) => [...prev, newMed]);
      form.reset();
      setActiveId(newMed.id);
    },
  });

  // Sync state if disabled prop changes
  React.useEffect(() => {
    if (disabled) {
      setMeds([]);
      setActiveId(null);
    } else {
      setMeds(initialMedications);
      setActiveId("1");
    }
  }, [disabled, initialMedications]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMeds((prev) => prev.filter((m) => m.id !== id));
  };

  const handlePrescribeClick = () => {
    if (disabled) return;
    if (onPrescribe) {
      onPrescribe(meds);
    } else {
      alert(
        `Sent Prescription to pharmacy:\n${meds.map((m) => `- ${m.name}`).join("\n")}`,
      );
    }
  };

  return (
    <GlassPanel
      className={`p-0 flex flex-col h-full overflow-hidden hover:border-outline/20 ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Header */}
      <div className="p-5 border-b border-outline-variant bg-surface-container-low/40">
        <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
          Prescription
        </h3>
        <p className="text-[10px] font-label-caps text-secondary font-mono tracking-wider mt-1 uppercase">
          {disabled ? "Buffer Queue Empty" : "Order ID: RX-002194"}
        </p>
      </div>

      {/* Medications List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
        {disabled ? (
          <div className="py-12 text-center text-on-surface-variant/70 font-mono text-xs uppercase tracking-widest">
            No active prescriptions
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {meds.map((med) => {
              const isActive = activeId === med.id;
              return (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  onClick={() => setActiveId(med.id)}
                  className={`border rounded-lg p-4 group cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "border-primary bg-surface-variant/50 neon-glow-primary"
                      : "border-outline-variant bg-surface-variant/20 hover:bg-surface-variant/30"
                  }`}
                >
                  <div className="flex justify-between mb-2">
                    <p className="font-body-md font-bold text-on-surface">
                      {med.name}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(med.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-error hover:scale-110 active:scale-90 transition-all outline-none cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] text-on-surface-variant uppercase font-label-caps font-mono">
                        Dosage
                      </span>
                      <span className="font-data-mono text-on-surface font-mono">
                        {med.dosage}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] text-on-surface-variant uppercase font-label-caps font-mono">
                        Duration
                      </span>
                      <span className="font-data-mono text-on-surface font-mono">
                        {med.duration}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* Add Medication Input */}
        {!disabled && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="pt-4 border-t border-outline-variant/30"
          >
            <FieldGroup>
              <form.Field name="newMedName">
                {(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel className="sr-only">Add Medication</FieldLabel>
                    <Input
                      type="text"
                      placeholder="+ Add Medication"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={field.state.meta.errors.length > 0}
                      className="w-full bg-surface-container-lowest border border-dashed border-outline rounded-lg px-4 py-3 text-body-md focus:border-solid focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all pulse-border"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <FieldError
                        errors={field.state.meta.errors.map((err) => ({
                          message: String(err),
                        }))}
                      />
                    )}
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
          </form>
        )}
      </div>

      {/* Footer prescriber bar */}
      <div className="p-5 bg-surface-container-highest border-t border-outline-variant">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Pharmacy:</span>
            <span className="font-semibold text-on-surface">
              {disabled ? "--" : "Akihabara Central Rx"}
            </span>
          </div>
          <Button
            variant="secondary"
            glow={!disabled && meds.length > 0}
            onClick={handlePrescribeClick}
            disabled={disabled || meds.length === 0}
            className="w-full py-3 bg-secondary text-on-secondary font-bold flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">send</span>
            E-PRESCRIBE
          </Button>
        </div>
      </div>
    </GlassPanel>
  );
};
