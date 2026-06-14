"use client";

import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StateController } from "@/components/ui/state-controller";
import { SystemAlertBanner } from "@/components/ui/system-alert-banner";
import { Textarea } from "@/components/ui/textarea";
import { useRegisterPatient } from "@/hooks/api/use-patients";

const genderItems = [
  { label: "Select Gender...", value: null },
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other / Non-binary", value: "other" },
  { label: "Prefer not to say", value: "prefer_not" },
];

const bloodTypeItems = [
  { label: "Select Blood Type...", value: null },
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
  { value: "Unknown", label: "Unknown" },
];

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const simulatorStates = [
  { value: "empty", label: "Empty Intake", icon: "hourglass_empty" },
  { value: "intake_form", label: "Registration Flow", icon: "edit_document" },
  { value: "loading", label: "Loading Sync", icon: "refresh" },
  { value: "success", label: "Registration Success", icon: "check_circle" },
  { value: "alert", label: "System Alert", icon: "warning" },
];

const registerPatientSchema = z.object({
  name: z.string().min(1, "Full legal name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender selection is required"),
  ssn: z.string().min(1, "Social security number/National ID is required"),
  nationality: z.string().min(1, "Nationality is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  address: z.string().min(1, "Home address is required"),
  emergencyName: z.string().min(1, "Emergency contact name is required"),
  emergencyRelation: z.string().min(1, "Relationship is required"),
  emergencyPhone: z.string().min(1, "Emergency phone number is required"),
  bloodType: z.string(),
  language: z.string().min(1, "Primary language is required"),
  conditions: z.array(z.string()),
  allergies: z.array(z.string()),
  provider: z.string().min(1, "Insurance provider is required"),
  policyNum: z.string().min(1, "Policy number is required"),
  groupNum: z.string(),
});

export default function PatientIntakePage() {
  const registerPatientMutation = useRegisterPatient();
  const [activeState, setActiveState] = useState<string>("intake_form");
  const [step, setStep] = useState(1);
  const [registeredPatientId, setRegisteredPatientId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
      dob: "",
      gender: "",
      ssn: "",
      nationality: "",
      phone: "",
      email: "",
      address: "",
      emergencyName: "",
      emergencyRelation: "",
      emergencyPhone: "",
      bloodType: "",
      language: "",
      conditions: [] as string[],
      allergies: [] as string[],
      provider: "",
      policyNum: "",
      groupNum: "",
    },
    validators: {
      onChange: registerPatientSchema,
    },
    onSubmit: async ({ value }) => {
      setActiveState("loading");
      try {
        const formattedGender = value.gender
          ? value.gender.toUpperCase()
          : "OTHER";
        const patient = await registerPatientMutation.mutateAsync({
          body: {
            name: value.name,
            dateOfBirth: value.dob,
            gender: formattedGender,
            ssn: value.ssn,
            phone: value.phone,
            email: value.email,
            bloodType: value.bloodType || "O_POSITIVE",
            emergencyContactName: value.emergencyName,
            emergencyContactPhone: value.emergencyPhone,
          },
        });
        setRegisteredPatientId(
          patient.id
            ? `TC-${patient.id.substring(0, 8).toUpperCase()}`
            : "TC-SUCCESS",
        );
        setActiveState("success");
      } catch (err) {
        const error = err as Error;
        setErrorMessage(
          error.message || "INTAKE TRANS-ENCRYPTION SYNCHRONIZATION FAILURE",
        );
        setActiveState("alert");
      }
    },
  });

  const handleNextStep = async () => {
    if (step === 1) {
      await form.validate("change");
      const fields = [
        "name",
        "dob",
        "gender",
        "ssn",
        "nationality",
        "phone",
        "email",
        "address",
        "emergencyName",
        "emergencyRelation",
        "emergencyPhone",
        "language",
      ] as const;

      const hasErrors = fields.some(
        (f) => (form.getFieldMeta(f)?.errors?.length ?? 0) > 0,
      );
      if (hasErrors) {
        return;
      }
    } else if (step === 3) {
      await form.validate("change");
      const fields = ["provider", "policyNum"] as const;
      const hasErrors = fields.some(
        (f) => (form.getFieldMeta(f)?.errors?.length ?? 0) > 0,
      );
      if (hasErrors) {
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const resetIntake = () => {
    form.reset();
    setRegisteredPatientId("");
    setErrorMessage("");
    setStep(1);
    setActiveState("intake_form");
  };

  if (activeState === "loading") {
    return (
      <div className="flex-1 flex flex-col justify-center min-h-[70vh]">
        <LoadingState
          message="TokyoClinic OS - Syncing Biometric Ledger..."
          statusText="Encrypting demographic files & assigning hash index"
        />
        <StateController
          states={simulatorStates}
          currentState={activeState}
          onStateChange={setActiveState}
          title="Intake States"
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="space-y-8 flex flex-col relative w-full"
    >
      <AnimatePresence>
        {activeState === "alert" && (
          <SystemAlertBanner
            message={
              errorMessage ||
              "INSURANCE SYNCHRONIZATION OFFLINE - INTAKE COMPILING LOCAL ENCRYPTED CACHE"
            }
          />
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto w-full">
        {/* Welcome Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface mb-2 font-bold">
              Patient Registration
            </h2>
            <p className="text-on-surface-variant font-body-lg">
              {activeState === "empty"
                ? "The digital registration node is currently idle."
                : "Enter new patient demographic and baseline clinical data."}
            </p>
          </div>

          <div className="text-right font-mono text-xs text-on-surface-variant">
            <p className="text-secondary font-bold">
              ID:{" "}
              {activeState === "success"
                ? registeredPatientId || "TC-8842-X"
                : "AUTO-GEN"}
            </p>
            <p className="mt-1">Date: 2026-06-14</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeState === "empty" ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex items-center justify-center min-h-[400px]"
            >
              <GlassPanel className="p-12 text-center max-w-lg relative overflow-hidden group rounded-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/10 via-secondary/15 to-primary/10" />
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-4 block animate-pulse">
                  groups
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold mb-2">
                  No Active Registration Session
                </h3>
                <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                  Terminal ID: TOK-INTAKE-4 is currently waiting. Initialize the
                  registration workspace to continue.
                </p>
                <Button
                  variant="primary"
                  glow
                  onClick={() => setActiveState("intake_form")}
                  className="font-mono text-xs uppercase tracking-wider px-6"
                >
                  Start New Patient Form
                </Button>
              </GlassPanel>
            </motion.div>
          ) : activeState === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-center py-8"
            >
              <GlassPanel className="p-8 max-w-xl w-full border-success/30 bg-gradient-to-b from-success/5 to-transparent relative overflow-hidden text-center rounded-xl">
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-success/10 rounded-full blur-[80px]" />

                <div className="h-16 w-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-success/30 shadow-[0_0_20px_rgba(158,206,106,0.3)]">
                  <span className="material-symbols-outlined text-success text-3xl">
                    check
                  </span>
                </div>

                <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-1">
                  Registration Complete
                </h3>
                <p className="text-on-surface-variant text-sm mb-8">
                  Biometric payload written to localized ledger node.
                </p>

                <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 mb-8 max-w-sm mx-auto text-left relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-success" />
                  <p className="text-[10px] font-label-caps text-on-surface-variant font-mono uppercase tracking-wider mb-2">
                    TokyoClinic Identity Card
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-sans font-bold text-on-surface text-base">
                        {form.state.values.name || "Jane Doe"}
                      </p>
                      <p className="text-2xs text-on-surface-variant font-mono uppercase mt-0.5">
                        DOB: {form.state.values.dob || "1994-10-27"} • BLOOD:{" "}
                        {form.state.values.bloodType || "O+"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-data-mono font-mono font-black text-success text-lg tracking-wide shadow-glow-sm">
                        {registeredPatientId || "TC-8842-X"}
                      </p>
                      <span className="text-[9px] font-mono text-success/70 bg-success/10 px-2 py-0.5 rounded border border-success/20">
                        ACTIVE
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="primary"
                    glow
                    onClick={resetIntake}
                    className="font-mono text-xs uppercase tracking-wider px-6"
                  >
                    Register Next
                  </Button>
                  <Button
                    variant="secondary"
                    className="font-mono text-xs uppercase tracking-wider px-6"
                    onClick={() => window.print()}
                  >
                    <span className="material-symbols-outlined text-sm mr-2">
                      print
                    </span>
                    Print Badge
                  </Button>
                </div>
              </GlassPanel>
            </motion.div>
          ) : (
            <motion.div
              key="flow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Stepper Card */}
              <GlassPanel className="p-6 mb-8 rounded-lg shadow-md border-primary/20 bg-surface-container-low/40">
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-outline-variant -z-10"></div>

                  {/* Step 1 */}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex flex-col items-center bg-[#24283b] px-4 group outline-none"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 mb-2 transition-all duration-300 ${
                        step === 1
                          ? "bg-primary border-primary text-on-primary shadow-[0_0_12px_rgba(187,154,247,0.5)] animate-pulse-glow"
                          : step > 1
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-surface-variant border-outline-variant text-on-surface-variant"
                      }`}
                    >
                      1
                    </div>
                    <span
                      className={`font-label-caps text-[10px] tracking-wider font-mono uppercase ${step === 1 ? "text-primary" : "text-on-surface-variant"}`}
                    >
                      Personal Info
                    </span>
                  </button>

                  {/* Step 2 */}
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex flex-col items-center bg-[#24283b] px-4 group outline-none"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 mb-2 transition-all duration-300 ${
                        step === 2
                          ? "bg-primary border-primary text-on-primary shadow-[0_0_12px_rgba(187,154,247,0.5)] animate-pulse-glow"
                          : step > 2
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-surface-variant border-outline-variant text-on-surface-variant"
                      }`}
                    >
                      2
                    </div>
                    <span
                      className={`font-label-caps text-[10px] tracking-wider font-mono uppercase ${step === 2 ? "text-primary" : "text-on-surface-variant"}`}
                    >
                      Medical History
                    </span>
                  </button>

                  {/* Step 3 */}
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex flex-col items-center bg-[#24283b] px-4 group outline-none"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 mb-2 transition-all duration-300 ${
                        step === 3
                          ? "bg-primary border-primary text-on-primary shadow-[0_0_12px_rgba(187,154,247,0.5)] animate-pulse-glow"
                          : step > 3
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-surface-variant border-outline-variant text-on-surface-variant"
                      }`}
                    >
                      3
                    </div>
                    <span
                      className={`font-label-caps text-[10px] tracking-wider font-mono uppercase ${step === 3 ? "text-primary" : "text-on-surface-variant"}`}
                    >
                      Insurance
                    </span>
                  </button>

                  {/* Step 4 */}
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="flex flex-col items-center bg-[#24283b] px-4 group outline-none"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 mb-2 transition-all duration-300 ${
                        step === 4
                          ? "bg-primary border-primary text-on-primary shadow-[0_0_12px_rgba(187,154,247,0.5)] animate-pulse-glow"
                          : "bg-surface-variant border-outline-variant text-on-surface-variant"
                      }`}
                    >
                      4
                    </div>
                    <span
                      className={`font-label-caps text-[10px] tracking-wider font-mono uppercase ${step === 4 ? "text-primary" : "text-on-surface-variant"}`}
                    >
                      Review
                    </span>
                  </button>
                </div>
              </GlassPanel>

              {/* Form Content */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-8"
              >
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-8"
                    >
                      {/* Personal Info Card */}
                      <div className="surface-card rounded-lg overflow-hidden border border-outline-variant/30">
                        <div className="bg-[#2f3549] px-6 py-3 border-b border-outline-variant/50">
                          <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">
                              badge
                            </span>
                            Personal Information
                          </h3>
                        </div>
                        <div className="p-6">
                          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <form.Field name="name">
                              {(field) => (
                                <Field
                                  data-invalid={
                                    field.state.meta.errors.length > 0
                                  }
                                >
                                  <FieldLabel
                                    htmlFor="name"
                                    className="font-label-caps text-label-caps text-on-surface-variant"
                                  >
                                    Full Legal Name
                                  </FieldLabel>
                                  <Input
                                    id="name"
                                    placeholder="e.g., Jane Doe"
                                    value={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    aria-invalid={
                                      field.state.meta.errors.length > 0
                                    }
                                  />
                                  {field.state.meta.errors.length > 0 && (
                                    <FieldError
                                      errors={field.state.meta.errors.map(
                                        (err) => ({
                                          message: String(err),
                                        }),
                                      )}
                                    />
                                  )}
                                </Field>
                              )}
                            </form.Field>

                            <form.Field name="dob">
                              {(field) => (
                                <Field
                                  data-invalid={
                                    field.state.meta.errors.length > 0
                                  }
                                >
                                  <FieldLabel
                                    htmlFor="dob"
                                    className="font-label-caps text-label-caps text-on-surface-variant"
                                  >
                                    Date of Birth
                                  </FieldLabel>
                                  <Input
                                    id="dob"
                                    type="date"
                                    value={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    aria-invalid={
                                      field.state.meta.errors.length > 0
                                    }
                                  />
                                  {field.state.meta.errors.length > 0 && (
                                    <FieldError
                                      errors={field.state.meta.errors.map(
                                        (err) => ({
                                          message: String(err),
                                        }),
                                      )}
                                    />
                                  )}
                                </Field>
                              )}
                            </form.Field>

                            <form.Field name="gender">
                              {(field) => (
                                <Field
                                  data-invalid={
                                    field.state.meta.errors.length > 0
                                  }
                                >
                                  <FieldLabel
                                    htmlFor="gender"
                                    className="font-label-caps text-label-caps text-on-surface-variant"
                                  >
                                    Gender
                                  </FieldLabel>
                                  <Select
                                    value={field.state.value || null}
                                    onValueChange={(val) =>
                                      field.handleChange(val || "")
                                    }
                                    items={genderItems}
                                  >
                                    <SelectTrigger
                                      id="gender"
                                      aria-invalid={
                                        field.state.meta.errors.length > 0
                                      }
                                      className="w-full bg-[#1a1c23]/50 border-outline-variant/30 text-on-surface"
                                    >
                                      <SelectValue placeholder="Select Gender" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#24283b] border border-outline-variant text-on-surface">
                                      <SelectGroup>
                                        {genderItems.map((item) => (
                                          <SelectItem
                                            key={item.value ?? "null"}
                                            value={item.value ?? ""}
                                          >
                                            {item.label}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                  {field.state.meta.errors.length > 0 && (
                                    <FieldError
                                      errors={field.state.meta.errors.map(
                                        (err) => ({
                                          message: String(err),
                                        }),
                                      )}
                                    />
                                  )}
                                </Field>
                              )}
                            </form.Field>

                            <form.Field name="ssn">
                              {(field) => (
                                <Field
                                  data-invalid={
                                    field.state.meta.errors.length > 0
                                  }
                                >
                                  <FieldLabel
                                    htmlFor="ssn"
                                    className="font-label-caps text-label-caps text-on-surface-variant"
                                  >
                                    Social Security Number / National ID
                                  </FieldLabel>
                                  <Input
                                    id="ssn"
                                    placeholder="e.g. XXX-XX-XXXX"
                                    value={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    aria-invalid={
                                      field.state.meta.errors.length > 0
                                    }
                                  />
                                  {field.state.meta.errors.length > 0 && (
                                    <FieldError
                                      errors={field.state.meta.errors.map(
                                        (err) => ({
                                          message: String(err),
                                        }),
                                      )}
                                    />
                                  )}
                                </Field>
                              )}
                            </form.Field>

                            <form.Field name="nationality">
                              {(field) => (
                                <Field
                                  className="md:col-span-2"
                                  data-invalid={
                                    field.state.meta.errors.length > 0
                                  }
                                >
                                  <FieldLabel
                                    htmlFor="nationality"
                                    className="font-label-caps text-label-caps text-on-surface-variant"
                                  >
                                    Nationality
                                  </FieldLabel>
                                  <Input
                                    id="nationality"
                                    placeholder="e.g., Japanese"
                                    value={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    aria-invalid={
                                      field.state.meta.errors.length > 0
                                    }
                                  />
                                  {field.state.meta.errors.length > 0 && (
                                    <FieldError
                                      errors={field.state.meta.errors.map(
                                        (err) => ({
                                          message: String(err),
                                        }),
                                      )}
                                    />
                                  )}
                                </Field>
                              )}
                            </form.Field>
                          </FieldGroup>
                        </div>
                      </div>

                      {/* Contact Details Card */}
                      <div className="surface-card rounded-lg overflow-hidden border border-outline-variant/30">
                        <div className="bg-[#2f3549] px-6 py-3 border-b border-outline-variant/50">
                          <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">
                              contact_mail
                            </span>
                            Contact Details
                          </h3>
                        </div>
                        <div className="p-6">
                          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <form.Field name="phone">
                              {(field) => (
                                <Field
                                  data-invalid={
                                    field.state.meta.errors.length > 0
                                  }
                                >
                                  <FieldLabel
                                    htmlFor="phone"
                                    className="font-label-caps text-label-caps text-on-surface-variant"
                                  >
                                    Phone Number
                                  </FieldLabel>
                                  <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    value={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    aria-invalid={
                                      field.state.meta.errors.length > 0
                                    }
                                  />
                                  {field.state.meta.errors.length > 0 && (
                                    <FieldError
                                      errors={field.state.meta.errors.map(
                                        (err) => ({
                                          message: String(err),
                                        }),
                                      )}
                                    />
                                  )}
                                </Field>
                              )}
                            </form.Field>

                            <form.Field name="email">
                              {(field) => (
                                <Field
                                  data-invalid={
                                    field.state.meta.errors.length > 0
                                  }
                                >
                                  <FieldLabel
                                    htmlFor="email"
                                    className="font-label-caps text-label-caps text-on-surface-variant"
                                  >
                                    Email Address
                                  </FieldLabel>
                                  <Input
                                    id="email"
                                    type="email"
                                    placeholder="patient@example.com"
                                    value={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    aria-invalid={
                                      field.state.meta.errors.length > 0
                                    }
                                  />
                                  {field.state.meta.errors.length > 0 && (
                                    <FieldError
                                      errors={field.state.meta.errors.map(
                                        (err) => ({
                                          message: String(err),
                                        }),
                                      )}
                                    />
                                  )}
                                </Field>
                              )}
                            </form.Field>

                            <form.Field name="address">
                              {(field) => (
                                <Field
                                  className="md:col-span-2"
                                  data-invalid={
                                    field.state.meta.errors.length > 0
                                  }
                                >
                                  <FieldLabel
                                    htmlFor="address"
                                    className="font-label-caps text-label-caps text-on-surface-variant"
                                  >
                                    Home Address
                                  </FieldLabel>
                                  <Textarea
                                    id="address"
                                    className="w-full bg-[#1a1c23]/50 border-outline-variant/30 text-on-surface"
                                    placeholder="Full residential address..."
                                    rows={2}
                                    value={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    aria-invalid={
                                      field.state.meta.errors.length > 0
                                    }
                                  />
                                  {field.state.meta.errors.length > 0 && (
                                    <FieldError
                                      errors={field.state.meta.errors.map(
                                        (err) => ({
                                          message: String(err),
                                        }),
                                      )}
                                    />
                                  )}
                                </Field>
                              )}
                            </form.Field>
                          </FieldGroup>
                        </div>
                      </div>

                      {/* Emergency Contact & Baseline Split Cards */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="surface-card rounded-lg overflow-hidden border border-outline-variant/30">
                          <div className="bg-[#2f3549] px-6 py-3 border-b border-outline-variant/50">
                            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                              <span className="material-symbols-outlined text-error">
                                emergency
                              </span>
                              Emergency Contact
                            </h3>
                          </div>
                          <div className="p-6">
                            <FieldGroup className="flex flex-col gap-4">
                              <form.Field name="emergencyName">
                                {(field) => (
                                  <Field
                                    data-invalid={
                                      field.state.meta.errors.length > 0
                                    }
                                  >
                                    <FieldLabel
                                      htmlFor="emergencyName"
                                      className="font-label-caps text-label-caps text-on-surface-variant"
                                    >
                                      Contact Name
                                    </FieldLabel>
                                    <Input
                                      id="emergencyName"
                                      placeholder="e.g., John Doe"
                                      value={field.state.value}
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                      aria-invalid={
                                        field.state.meta.errors.length > 0
                                      }
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                      <FieldError
                                        errors={field.state.meta.errors.map(
                                          (err) => ({
                                            message: String(err),
                                          }),
                                        )}
                                      />
                                    )}
                                  </Field>
                                )}
                              </form.Field>

                              <div className="grid grid-cols-2 gap-4">
                                <form.Field name="emergencyRelation">
                                  {(field) => (
                                    <Field
                                      data-invalid={
                                        field.state.meta.errors.length > 0
                                      }
                                    >
                                      <FieldLabel
                                        htmlFor="emergencyRelation"
                                        className="font-label-caps text-label-caps text-on-surface-variant"
                                      >
                                        Relationship
                                      </FieldLabel>
                                      <Input
                                        id="emergencyRelation"
                                        placeholder="e.g., Spouse"
                                        value={field.state.value}
                                        onChange={(e) =>
                                          field.handleChange(e.target.value)
                                        }
                                        aria-invalid={
                                          field.state.meta.errors.length > 0
                                        }
                                      />
                                      {field.state.meta.errors.length > 0 && (
                                        <FieldError
                                          errors={field.state.meta.errors.map(
                                            (err) => ({
                                              message: String(err),
                                            }),
                                          )}
                                        />
                                      )}
                                    </Field>
                                  )}
                                </form.Field>

                                <form.Field name="emergencyPhone">
                                  {(field) => (
                                    <Field
                                      data-invalid={
                                        field.state.meta.errors.length > 0
                                      }
                                    >
                                      <FieldLabel
                                        htmlFor="emergencyPhone"
                                        className="font-label-caps text-label-caps text-on-surface-variant"
                                      >
                                        Phone
                                      </FieldLabel>
                                      <Input
                                        id="emergencyPhone"
                                        type="tel"
                                        placeholder="555-0199"
                                        value={field.state.value}
                                        onChange={(e) =>
                                          field.handleChange(e.target.value)
                                        }
                                        aria-invalid={
                                          field.state.meta.errors.length > 0
                                        }
                                      />
                                      {field.state.meta.errors.length > 0 && (
                                        <FieldError
                                          errors={field.state.meta.errors.map(
                                            (err) => ({
                                              message: String(err),
                                            }),
                                          )}
                                        />
                                      )}
                                    </Field>
                                  )}
                                </form.Field>
                              </div>
                            </FieldGroup>
                          </div>
                        </div>

                        <div className="surface-card rounded-lg overflow-hidden border border-outline-variant/30">
                          <div className="bg-[#2f3549] px-6 py-3 border-b border-outline-variant/50">
                            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                              <span className="material-symbols-outlined text-secondary">
                                vital_signs
                              </span>
                              Medical Baseline
                            </h3>
                          </div>
                          <div className="p-6">
                            <FieldGroup className="flex flex-col gap-4">
                              <form.Field name="bloodType">
                                {(field) => (
                                  <Field
                                    data-invalid={
                                      field.state.meta.errors.length > 0
                                    }
                                  >
                                    <FieldLabel
                                      htmlFor="bloodType"
                                      className="font-label-caps text-label-caps text-on-surface-variant"
                                    >
                                      Blood Type
                                    </FieldLabel>
                                    <Select
                                      value={field.state.value || null}
                                      onValueChange={(val) =>
                                        field.handleChange(val || "")
                                      }
                                      items={bloodTypeItems}
                                    >
                                      <SelectTrigger
                                        id="bloodType"
                                        aria-invalid={
                                          field.state.meta.errors.length > 0
                                        }
                                        className="w-full bg-[#1a1c23]/50 border-outline-variant/30 text-on-surface"
                                      >
                                        <SelectValue placeholder="Select Blood Type" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-[#24283b] border border-outline-variant text-on-surface">
                                        <SelectGroup>
                                          {bloodTypeItems.map((item) => (
                                            <SelectItem
                                              key={item.value ?? "null"}
                                              value={item.value ?? ""}
                                            >
                                              {item.label}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                    {field.state.meta.errors.length > 0 && (
                                      <FieldError
                                        errors={field.state.meta.errors.map(
                                          (err) => ({
                                            message: String(err),
                                          }),
                                        )}
                                      />
                                    )}
                                  </Field>
                                )}
                              </form.Field>

                              <form.Field name="language">
                                {(field) => (
                                  <Field
                                    data-invalid={
                                      field.state.meta.errors.length > 0
                                    }
                                  >
                                    <FieldLabel
                                      htmlFor="language"
                                      className="font-label-caps text-label-caps text-on-surface-variant"
                                    >
                                      Primary Language
                                    </FieldLabel>
                                    <Input
                                      id="language"
                                      placeholder="e.g., English, Japanese"
                                      value={field.state.value}
                                      onChange={(e) =>
                                        field.handleChange(e.target.value)
                                      }
                                      aria-invalid={
                                        field.state.meta.errors.length > 0
                                      }
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                      <FieldError
                                        errors={field.state.meta.errors.map(
                                          (err) => ({
                                            message: String(err),
                                          }),
                                        )}
                                      />
                                    )}
                                  </Field>
                                )}
                              </form.Field>
                            </FieldGroup>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-4 pt-6 border-t border-outline-variant">
                        <Button
                          type="button"
                          variant="secondary"
                          className="font-mono text-xs uppercase tracking-wider"
                          onClick={() => alert("Draft saved locally.")}
                        >
                          <span className="material-symbols-outlined text-sm mr-2">
                            save
                          </span>
                          Save Draft
                        </Button>
                        <Button
                          type="button"
                          variant="primary"
                          glow
                          className="font-mono text-xs uppercase tracking-wider"
                          onClick={handleNextStep}
                        >
                          Continue
                          <span className="material-symbols-outlined text-sm ml-2">
                            arrow_forward
                          </span>
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-8"
                    >
                      <div className="surface-card rounded-lg overflow-hidden border border-outline-variant/30">
                        <div className="bg-[#2f3549] px-6 py-3 border-b border-outline-variant/50">
                          <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">
                              history
                            </span>
                            Medical History & Pre-existing Conditions
                          </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <form.Field name="conditions">
                            {(field) => (
                              <FieldSet>
                                <FieldLegend
                                  variant="label"
                                  className="font-label-caps text-primary text-xs uppercase mb-1 font-mono tracking-wider"
                                >
                                  Pre-existing Conditions
                                </FieldLegend>
                                <FieldDescription className="text-xs text-on-surface-variant">
                                  Check all that apply
                                </FieldDescription>
                                <FieldGroup className="gap-3 mt-3">
                                  {[
                                    "Hypertension",
                                    "Diabetes (Type I/II)",
                                    "Asthma / COPD",
                                    "Coronary Artery Disease",
                                    "Chronic Kidney Disease",
                                    "Thyroid Disorder",
                                  ].map((cond) => (
                                    <Field
                                      orientation="horizontal"
                                      key={cond}
                                      className="items-center"
                                    >
                                      <Checkbox
                                        id={`cond-${cond}`}
                                        checked={field.state.value.includes(
                                          cond,
                                        )}
                                        onCheckedChange={() => {
                                          const nextVal =
                                            field.state.value.includes(cond)
                                              ? field.state.value.filter(
                                                  (c) => c !== cond,
                                                )
                                              : [...field.state.value, cond];
                                          field.handleChange(nextVal);
                                        }}
                                      />
                                      <FieldLabel
                                        htmlFor={`cond-${cond}`}
                                        className="font-normal cursor-pointer text-sm text-on-surface hover:text-white transition-colors"
                                      >
                                        {cond}
                                      </FieldLabel>
                                    </Field>
                                  ))}
                                </FieldGroup>
                              </FieldSet>
                            )}
                          </form.Field>

                          <form.Field name="allergies">
                            {(field) => (
                              <FieldSet>
                                <FieldLegend
                                  variant="label"
                                  className="font-label-caps text-primary text-xs uppercase mb-1 font-mono tracking-wider"
                                >
                                  Allergies & Adverse Reactions
                                </FieldLegend>
                                <FieldDescription className="text-xs text-on-surface-variant">
                                  Check all that apply
                                </FieldDescription>
                                <FieldGroup className="gap-3 mt-3">
                                  {[
                                    "Penicillin / Antibiotics",
                                    "Aspirin / NSAIDs",
                                    "Sulfa Drugs",
                                    "Latex",
                                    "Contrast Dye",
                                    "Peanuts / Food Allergies",
                                  ].map((all) => (
                                    <Field
                                      orientation="horizontal"
                                      key={all}
                                      className="items-center"
                                    >
                                      <Checkbox
                                        id={`all-${all}`}
                                        checked={field.state.value.includes(
                                          all,
                                        )}
                                        onCheckedChange={() => {
                                          const nextVal =
                                            field.state.value.includes(all)
                                              ? field.state.value.filter(
                                                  (a) => a !== all,
                                                )
                                              : [...field.state.value, all];
                                          field.handleChange(nextVal);
                                        }}
                                      />
                                      <FieldLabel
                                        htmlFor={`all-${all}`}
                                        className="font-normal cursor-pointer text-sm text-on-surface hover:text-white transition-colors"
                                      >
                                        {all}
                                      </FieldLabel>
                                    </Field>
                                  ))}
                                </FieldGroup>
                              </FieldSet>
                            )}
                          </form.Field>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-4 pt-6 border-t border-outline-variant">
                        <Button
                          type="button"
                          variant="ghost"
                          className="font-mono text-xs uppercase tracking-wider"
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          variant="primary"
                          glow
                          className="font-mono text-xs uppercase tracking-wider"
                          onClick={handleNextStep}
                        >
                          Continue
                          <span className="material-symbols-outlined text-sm ml-2">
                            arrow_forward
                          </span>
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-8"
                    >
                      <div className="surface-card rounded-lg overflow-hidden border border-outline-variant/30">
                        <div className="bg-[#2f3549] px-6 py-3 border-b border-outline-variant/50">
                          <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">
                              health_insurance
                            </span>
                            Insurance Policy Coverage
                          </h3>
                        </div>
                        <div className="p-6">
                          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <form.Field name="provider">
                              {(field) => (
                                <Field
                                  data-invalid={
                                    field.state.meta.errors.length > 0
                                  }
                                >
                                  <FieldLabel
                                    htmlFor="provider"
                                    className="font-label-caps text-label-caps text-on-surface-variant"
                                  >
                                    Insurance Provider
                                  </FieldLabel>
                                  <Input
                                    id="provider"
                                    placeholder="e.g. Nippon Life Insurance"
                                    value={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    aria-invalid={
                                      field.state.meta.errors.length > 0
                                    }
                                  />
                                  {field.state.meta.errors.length > 0 && (
                                    <FieldError
                                      errors={field.state.meta.errors.map(
                                        (err) => ({
                                          message: String(err),
                                        }),
                                      )}
                                    />
                                  )}
                                </Field>
                              )}
                            </form.Field>

                            <form.Field name="policyNum">
                              {(field) => (
                                <Field
                                  data-invalid={
                                    field.state.meta.errors.length > 0
                                  }
                                >
                                  <FieldLabel
                                    htmlFor="policyNum"
                                    className="font-label-caps text-label-caps text-on-surface-variant"
                                  >
                                    Policy / Member Number
                                  </FieldLabel>
                                  <Input
                                    id="policyNum"
                                    placeholder="e.g. NL-9938-AA"
                                    value={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    aria-invalid={
                                      field.state.meta.errors.length > 0
                                    }
                                  />
                                  {field.state.meta.errors.length > 0 && (
                                    <FieldError
                                      errors={field.state.meta.errors.map(
                                        (err) => ({
                                          message: String(err),
                                        }),
                                      )}
                                    />
                                  )}
                                </Field>
                              )}
                            </form.Field>

                            <form.Field name="groupNum">
                              {(field) => (
                                <Field
                                  className="md:col-span-2"
                                  data-invalid={
                                    field.state.meta.errors.length > 0
                                  }
                                >
                                  <FieldLabel
                                    htmlFor="groupNum"
                                    className="font-label-caps text-label-caps text-on-surface-variant"
                                  >
                                    Group Number
                                  </FieldLabel>
                                  <Input
                                    id="groupNum"
                                    placeholder="e.g. GR-0042"
                                    value={field.state.value}
                                    onChange={(e) =>
                                      field.handleChange(e.target.value)
                                    }
                                    aria-invalid={
                                      field.state.meta.errors.length > 0
                                    }
                                  />
                                  {field.state.meta.errors.length > 0 && (
                                    <FieldError
                                      errors={field.state.meta.errors.map(
                                        (err) => ({
                                          message: String(err),
                                        }),
                                      )}
                                    />
                                  )}
                                </Field>
                              )}
                            </form.Field>
                          </FieldGroup>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-4 pt-6 border-t border-outline-variant">
                        <Button
                          type="button"
                          variant="ghost"
                          className="font-mono text-xs uppercase tracking-wider"
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          variant="primary"
                          glow
                          className="font-mono text-xs uppercase tracking-wider"
                          onClick={handleNextStep}
                        >
                          Continue
                          <span className="material-symbols-outlined text-sm ml-2">
                            arrow_forward
                          </span>
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-8"
                    >
                      <div className="surface-card rounded-lg overflow-hidden border border-outline-variant/30">
                        <div className="bg-[#2f3549] px-6 py-3 border-b border-outline-variant/50">
                          <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">
                              assignment_turned_in
                            </span>
                            Verify Information
                          </h3>
                        </div>
                        <div className="p-6 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-b border-outline-variant pb-4">
                            <div>
                              <p className="text-2xs font-label-caps text-on-surface-variant uppercase tracking-wider">
                                Patient Name
                              </p>
                              <p className="font-bold text-on-surface mt-1">
                                {form.state.values.name || "Jane Doe"}
                              </p>
                            </div>
                            <div>
                              <p className="text-2xs font-label-caps text-on-surface-variant uppercase tracking-wider">
                                DOB / Gender
                              </p>
                              <p className="text-on-surface mt-1 font-mono uppercase">
                                {form.state.values.dob || "1994-10-27"} •{" "}
                                {form.state.values.gender || "female"}
                              </p>
                            </div>
                            <div>
                              <p className="text-2xs font-label-caps text-on-surface-variant uppercase tracking-wider">
                                Phone / Email
                              </p>
                              <p className="text-on-surface mt-1 font-mono">
                                {form.state.values.phone || "+1 (555) 000-0000"}{" "}
                                •{" "}
                                {form.state.values.email ||
                                  "patient@example.com"}
                              </p>
                            </div>
                            <div>
                              <p className="text-2xs font-label-caps text-on-surface-variant uppercase tracking-wider font-mono">
                                SSN / Nationality
                              </p>
                              <p className="text-on-surface mt-1 font-mono">
                                {form.state.values.ssn || "XXX-XX-XXXX"} •{" "}
                                {form.state.values.nationality || "Japanese"}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-b border-outline-variant pb-4">
                            <div>
                              <p className="text-2xs font-label-caps text-on-surface-variant uppercase tracking-wider">
                                Emergency Contact
                              </p>
                              <p className="text-on-surface mt-1 font-bold">
                                {form.state.values.emergencyName || "John Doe"}{" "}
                                (
                                {form.state.values.emergencyRelation ||
                                  "Spouse"}
                                )
                              </p>
                              <p className="text-2xs text-on-surface-variant font-mono mt-0.5">
                                {form.state.values.emergencyPhone || "555-0199"}
                              </p>
                            </div>
                            <div>
                              <p className="text-2xs font-label-caps text-on-surface-variant uppercase tracking-wider">
                                Baseline Stats
                              </p>
                              <p className="text-on-surface mt-1">
                                Blood Type:{" "}
                                <span className="font-mono font-bold text-secondary">
                                  {form.state.values.bloodType || "O+"}
                                </span>{" "}
                                • Lang:{" "}
                                {form.state.values.language || "English"}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-b border-outline-variant pb-4">
                            <div>
                              <p className="text-2xs font-label-caps text-on-surface-variant uppercase tracking-wider">
                                Pre-existing Conditions
                              </p>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {form.state.values.conditions.length > 0 ? (
                                  form.state.values.conditions.map((c) => (
                                    <span
                                      key={c}
                                      className="text-2xs bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded font-bold font-mono uppercase"
                                    >
                                      {c}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-on-surface-variant italic text-xs">
                                    None Declared
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-2xs font-label-caps text-on-surface-variant uppercase tracking-wider">
                                Allergies
                              </p>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {form.state.values.allergies.length > 0 ? (
                                  form.state.values.allergies.map((a) => (
                                    <span
                                      key={a}
                                      className="text-2xs bg-error/10 border border-error/20 text-error px-2 py-0.5 rounded font-bold font-mono uppercase"
                                    >
                                      {a}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-on-surface-variant italic text-xs">
                                    None Declared
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-sm">
                            <p className="text-2xs font-label-caps text-on-surface-variant uppercase tracking-wider">
                              Insurance Cover
                            </p>
                            <p className="text-on-surface mt-1 font-bold">
                              {form.state.values.provider ||
                                "Nippon Life Insurance"}
                            </p>
                            <p className="text-2xs text-on-surface-variant font-mono mt-0.5">
                              Policy:{" "}
                              {form.state.values.policyNum || "NL-9938-AA"} •
                              Group: {form.state.values.groupNum || "GR-0042"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-4 pt-6 border-t border-outline-variant">
                        <Button
                          type="button"
                          variant="ghost"
                          className="font-mono text-xs uppercase tracking-wider"
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          glow
                          className="font-mono text-xs uppercase tracking-wider px-8"
                        >
                          Submit Registration
                          <span className="material-symbols-outlined text-sm ml-2">
                            check
                          </span>
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <StateController
        states={simulatorStates}
        currentState={activeState === "alert" ? "alert" : activeState}
        onStateChange={setActiveState}
        title="Intake States"
      />
    </motion.div>
  );
}
