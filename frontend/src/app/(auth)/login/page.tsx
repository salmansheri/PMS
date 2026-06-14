"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { postAuthRegister } from "@/client";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { StateController } from "@/components/ui/state-controller";
import { SystemAlertBanner } from "@/components/ui/system-alert-banner";
import { useUser } from "@/context/UserContext";

const simulatorStates = [
  { value: "login", label: "Sign In", icon: "login" },
  { value: "signup", label: "Sign Up", icon: "person_add" },
  { value: "loading", label: "Loading State", icon: "refresh" },
  { value: "alert", label: "Invalid Key Error", icon: "error" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const [activeState, setActiveState] = useState<string>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [alertText, setAlertText] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setActiveState("loading");
    try {
      await login(email, password);
    } catch (err) {
      const error = err as Error;
      setAlertText(
        error.message ||
          "CREDENTIAL DECRYPTION ERROR: SECURE AUTHENTICATION KEY INVALID",
      );
      setActiveState("alert");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setActiveState("loading");
    try {
      // Direct registration call (Note: Requires ADMIN role context, will fail if not authorized)
      await postAuthRegister({
        body: {
          username: email,
          password,
          role: "ROLE_DOCTOR",
          fullName: name,
        },
        throwOnError: true,
      });
      alert("Staff node registration complete! Please log in.");
      setActiveState("login");
    } catch (err) {
      const error = err as Error;
      setAlertText(
        error.message ||
          "REGISTRATION REJECTED: AUTHORIZATION BOUNDARIES ENFORCED",
      );
      setActiveState("alert");
    }
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveState("loading");
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

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
                <form onSubmit={handleSignIn} className="space-y-5">
                  <Input
                    id="email"
                    label="OPERATOR EMAIL"
                    type="email"
                    placeholder="e.g. sato@tokyoclinic.net"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label
                        htmlFor="password"
                        className="block font-label-caps text-on-surface-variant uppercase text-xs"
                      >
                        OPERATOR KEYCODE
                      </label>
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
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

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
                <form onSubmit={handleSignUp} className="space-y-5">
                  <Input
                    id="name"
                    label="OPERATOR NAME"
                    type="text"
                    placeholder="e.g. Kenji Sato"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    id="email-signup"
                    label="EMAIL ADDRESS"
                    type="email"
                    placeholder="sato@tokyoclinic.net"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    id="password-signup"
                    label="CREATE ACCESS KEYCODE"
                    type="password"
                    placeholder="••••••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

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

                <form onSubmit={handleMfaSubmit} className="space-y-6">
                  <div className="flex justify-center gap-3">
                    <Input
                      id="mfaCode"
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 123456"
                      required
                      className="text-center tracking-[0.75em] text-lg font-mono placeholder:tracking-normal placeholder:font-sans py-3"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                    />
                  </div>

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
