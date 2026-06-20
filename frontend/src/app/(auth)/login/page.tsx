"use client";

import { useForm } from "@tanstack/react-form";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { StateController } from "@/components/ui/state-controller";
import { SystemAlertBanner } from "@/components/ui/system-alert-banner";
import { useLogin, useRegister } from "@/hooks/api/use-auth";

const simulatorStates = [
  { value: "login", label: "Sign In", icon: "login" },
  { value: "signup", label: "Sign Up", icon: "person_add" },
  { value: "loading", label: "Loading State", icon: "refresh" },
  { value: "alert", label: "Invalid Key Error", icon: "error" },
];

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const [activeState, setActiveState] = useState<string>("login");
  const [alertText, setAlertText] = useState("");

  const loginForm = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        username: z
          .string()
          .min(1, "Email is required"),

        password: z.string().min(1, "Keycode is required"),
      }),
    },
    onSubmit: async ({ value }) => {
      setActiveState("loading");
      try {
        await loginMutation.mutateAsync({
          body: { username: value.username, password: value.password },
        });
        router.push("/");
      } catch (err) {
        const error = err as Error;
        setAlertText(
          error.message ||
            "CREDENTIAL DECRYPTION ERROR: SECURE AUTHENTICATION KEY INVALID",
        );
        setActiveState("alert");
      }
    },
  });

  const signupForm = useForm({
    defaultValues: {
      fullname: "",
      username: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        fullname: z.string().min(1, "Operator name is required"),
        username: z
          .string()
          .min(1, "Email is required"),

        password: z.string().min(6, "KeyCode must be at least 6 characters"),
      }),
    },
    onSubmit: async ({ value }) => {
      setActiveState("loading");
      try {
        await registerMutation.mutateAsync({
          body: {
            username: value.username,
            password: value.password,
            role: "ROLE_DOCTOR",
            fullName: value.fullname,
          },
        });
        setActiveState("login");
      } catch (err) {
        const error = err as Error;
        setAlertText(
          error.message ||
            "REGISTRATION REJECTED: AUTHORIZATION BOUNDARIES ENFORCED",
        );
        setActiveState("alert");
      }
    },
  });

  const mfaForm = useForm({
    defaultValues: {
      mfaCode: "",
    },
    validators: {
      onChange: z.object({
        mfaCode: z
          .string()
          .length(6, "MFA code must be exactly 6 digits")
          .regex(/^\d+$/, "MFA code must contain only numbers"),
      }),
    },
    onSubmit: async () => {
      setActiveState("loading");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    },
  });

  if (activeState === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-on-surface p-6">
        <LoadingState
          message="Establishing Secure Handshake..."
          statusText="Decrypting credential token via TLS 1.3 key exchange"
        />
        <StateController
          states={simulatorStates}
          currentState={activeState}
          onStateChange={setActiveState}
          title="Login States"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      {/* Background Neon Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <AnimatePresence>
          {activeState === "alert" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SystemAlertBanner
                message={
                  alertText ||
                  "CREDENTIAL DECRYPTION ERROR: SECURE AUTHENTICATION KEY INVALID"
                }
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 shadow-[0_0_15px_rgba(212,187,255,0.15)] text-primary">
            <span className="material-symbols-outlined text-base animate-pulse">
              shield_lock
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">
              Secure Terminal Node-4
            </span>
          </div>
          <h1 className="text-3xl font-bold font-sans tracking-tight text-on-surface bg-gradient-to-r from-white via-on-surface to-on-surface-variant bg-clip-text text-transparent">
            TokyoNight Clinic OS
          </h1>
          <p className="text-on-surface-variant text-sm">
            Enter biometric credentials to synchronize dashboard uplink.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {(activeState === "login" || activeState === "alert") && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <GlassPanel className="p-8 border-primary/20 bg-surface-container-low/40 backdrop-blur-xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    loginForm.handleSubmit();
                  }}
                  className="space-y-5"
                >
                  <FieldGroup className="gap-5">
                    <loginForm.Field name="username">
                      {(field) => (
                        <Field
                          data-invalid={field.state.meta.errors.length > 0}
                        >
                          <FieldLabel
                            htmlFor="email"
                            className="font-label-caps text-on-surface-variant uppercase text-xs"
                          >
                            OPERATOR USERNAME
                          </FieldLabel>
                          <Input
                            id="username"

                            placeholder="e.g: John Doe"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={field.state.meta.errors.length > 0}
                          />
                          {field.state.meta.errors.length > 0 && (
                            <FieldError
                              errors={field.state.meta.errors}
                            />
                          )}
                        </Field>
                      )}
                    </loginForm.Field>

                    <loginForm.Field name="password">
                      {(field) => (
                        <Field
                          data-invalid={field.state.meta.errors.length > 0}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <FieldLabel
                              htmlFor="password"
                              className="font-label-caps text-on-surface-variant uppercase text-xs"
                            >
                              OPERATOR KEYCODE
                            </FieldLabel>
                            <a
                              href="/login#forgot"
                              className="text-2xs text-primary hover:underline font-mono uppercase tracking-wider"
                            >
                              Forgot Key?
                            </a>
                          </div>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••••••"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={field.state.meta.errors.length > 0}
                          />
                          {field.state.meta.errors.length > 0 && (
                            <FieldError
                              errors={field.state.meta.errors}
                            />
                          )}
                        </Field>
                      )}
                    </loginForm.Field>
                  </FieldGroup>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      glow
                      className="w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider"
                    >
                      Authenticate Node
                    </Button>
                  </div>
                </form>

                <div className="mt-6 pt-6 border-t border-outline-variant text-center">
                  <p className="text-xs text-on-surface-variant">
                    First time operator?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveState("signup")}
                      className="text-primary hover:underline font-bold"
                    >
                      Register New Node
                    </button>
                  </p>
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {activeState === "signup" && (
            <motion.div
              key="signup"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <GlassPanel className="p-8 border-secondary/20 bg-surface-container-low/40 backdrop-blur-xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    signupForm.handleSubmit();
                  }}
                  className="space-y-5"
                >
                  <FieldGroup className="gap-5">
                    <signupForm.Field name="fullname">
                      {(field) => (
                        <Field
                          data-invalid={field.state.meta.errors.length > 0}
                        >
                          <FieldLabel
                            htmlFor="name"
                            className="font-label-caps text-on-surface-variant uppercase text-xs"
                          >
                            OPERATOR NAME
                          </FieldLabel>
                          <Input
                            id="name"
                            type="text"
                            placeholder="e.g. Kenji Sato"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={field.state.meta.errors.length > 0}
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
                    </signupForm.Field>

                    <signupForm.Field name="username">
                      {(field) => (
                        <Field
                          data-invalid={field.state.meta.errors.length > 0}
                        >
                          <FieldLabel
                            htmlFor="email-signup"
                            className="font-label-caps text-on-surface-variant uppercase text-xs"
                          >
                            EMAIL ADDRESS
                          </FieldLabel>
                          <Input
                            id="email-signup"
                            type="email"
                            placeholder="sato@tokyoclinic.net"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={field.state.meta.errors.length > 0}
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
                    </signupForm.Field>

                    <signupForm.Field name="password">
                      {(field) => (
                        <Field
                          data-invalid={field.state.meta.errors.length > 0}
                        >
                          <FieldLabel
                            htmlFor="password-signup"
                            className="font-label-caps text-on-surface-variant uppercase text-xs"
                          >
                            CREATE ACCESS KEYCODE
                          </FieldLabel>
                          <Input
                            id="password-signup"
                            type="password"
                            placeholder="••••••••••••"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={field.state.meta.errors.length > 0}
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
                    </signupForm.Field>
                  </FieldGroup>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="secondary"
                      glow
                      className="w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider"
                    >
                      Register Device Credentials
                    </Button>
                  </div>
                </form>

                <div className="mt-6 pt-6 border-t border-outline-variant text-center">
                  <p className="text-xs text-on-surface-variant">
                    Already registered?{" "}
                    <button
                      type="button"
                      onClick={() => setActiveState("login")}
                      className="text-primary hover:underline font-bold"
                    >
                      Uplink Existing Node
                    </button>
                  </p>
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {activeState === "mfa" && (
            <motion.div
              key="mfa"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <GlassPanel className="p-8 border-success/20 bg-surface-container-low/40 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-xl pointer-events-none" />

                <div className="text-center mb-6">
                  <span className="material-symbols-outlined text-success text-4xl mb-2 animate-pulse shadow-glow-sm">
                    mfa
                  </span>
                  <h3 className="font-headline-md font-bold text-on-surface">
                    MFA CHALLENGE REQUIRED
                  </h3>
                  <p className="text-on-surface-variant text-xs mt-1">
                    Enter the code sent to your authenticated mobile token.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    mfaForm.handleSubmit();
                  }}
                  className="space-y-6"
                >
                  <FieldGroup>
                    <mfaForm.Field name="mfaCode">
                      {(field) => (
                        <Field
                          data-invalid={field.state.meta.errors.length > 0}
                        >
                          <Input
                            id="mfaCode"
                            type="text"
                            maxLength={6}
                            placeholder="e.g. 123456"
                            className="text-center tracking-[0.75em] text-lg font-mono placeholder:tracking-normal placeholder:font-sans py-3"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={field.state.meta.errors.length > 0}
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
                    </mfaForm.Field>
                  </FieldGroup>

                  <Button
                    type="submit"
                    variant="primary"
                    glow
                    className="w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider"
                  >
                    Verify Passcode
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-outline-variant text-center flex justify-between text-2xs uppercase font-mono text-on-surface-variant">
                  <button type="button" className="hover:text-primary">
                    Resend Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveState("login")}
                    className="hover:text-error"
                  >
                    Cancel Uplink
                  </button>
                </div>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Security Footer Notice */}
        <div className="text-center font-mono text-[9px] text-on-surface-variant/40 space-y-1">
          <p>AUTHORIZED CLINICAL ACCESS ONLY • IP WILL BE RECORDED</p>
          <p>© TOKYO NIGHT DIGITAL COOPERATIVE • NODE v2.10.4</p>
        </div>
      </div>

      <StateController
        states={simulatorStates}
        currentState={activeState === "alert" ? "alert" : activeState}
        onStateChange={setActiveState}
        title="Login States"
      />
    </div>
  );
}
