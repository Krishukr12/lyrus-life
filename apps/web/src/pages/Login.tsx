import { useState } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import {
  AtSign,
  Lock,
  ArrowRight,
  MailCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { APP_NAME } from "@/lib/brand";

type Step = "signin" | "forgot-email" | "forgot-reset";

function PasswordInput({
  id,
  label,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
        <Input
          id={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder="••••••••"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={8}
          className="pl-9 pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export default function Login() {
  const { login, requestPasswordReset, resetPassword, isAuthenticated, isLoading } =
    useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const redirectTo =
    searchParams.get("redirect") ??
    (location.state as { from?: string } | null)?.from ??
    "/";

  const [step, setStep] = useState<Step>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await login(email.trim(), password, redirectTo);
      toast.success(`Welcome to ${APP_NAME}`);
    } catch (err) {
      if (err instanceof Error && err.message === "SUPER_ADMIN_REDIRECT") return;
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleForgotEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await requestPasswordReset(email.trim());
      setResetToken(result.resetToken);
      setOtpCode("");
      setNewPassword("");
      setConfirmPassword("");
      setStep("forgot-reset");
    } catch (err) {
      if (err instanceof Error && err.message !== "NO_RESET_TOKEN") {
        toast.error(err.message);
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleForgotReset(e: React.FormEvent) {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast.error("Enter the 6-digit code from your email");
      return;
    }
    setBusy(true);
    try {
      await resetPassword(resetToken, otpCode, newPassword, confirmPassword);
      toast.success(`Password updated. Welcome to ${APP_NAME}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reset password");
    } finally {
      setBusy(false);
    }
  }

  function goToSignIn() {
    setStep("signin");
    setOtpCode("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
  }

  const subtitle =
    step === "signin"
      ? "Sign in with your work email and password"
      : step === "forgot-email"
        ? "Enter your email to receive a reset code"
        : "Enter the code and choose a new password";

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background p-6">
      {/* Animated aurora backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-secondary/15 blur-3xl animate-float" />
        <div className="absolute -bottom-48 -left-32 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
        <div
          className="absolute -bottom-32 -right-24 h-[380px] w-[380px] rounded-full bg-teal-400/10 blur-3xl animate-float"
          style={{ animationDelay: "2.2s" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,hsl(var(--secondary)/0.08),transparent_60%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.6, 0.35, 1] }}
        className="relative w-full max-w-[420px] space-y-8"
      >
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <BrandMark variant="light" iconSize={44} className="justify-center mx-auto" showTagline={false} />
          </motion.div>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <Card className="glass-card border-border/50 shadow-lifted">
          <CardContent className="p-6">
            {step === "signin" && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    Work email
                  </Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="username"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-9"
                    />
                  </div>
                </div>

                <PasswordInput
                  id="password"
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  autoComplete="current-password"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setStep("forgot-email")}
                  >
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={busy}>
                  {busy ? (
                    "Signing in…"
                  ) : (
                    <>
                      Sign in <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {step === "forgot-email" && (
              <form onSubmit={handleForgotEmail} className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We'll email a 6-digit code to reset your password. You will be signed
                  in after you set a new password.
                </p>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="forgot-email"
                    className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    Work email
                  </Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                    <Input
                      id="forgot-email"
                      type="email"
                      autoComplete="username"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-9"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full gap-2" disabled={busy}>
                  {busy ? "Sending…" : "Send reset code"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground"
                  onClick={goToSignIn}
                >
                  Back to sign in
                </Button>
              </form>
            )}

            {step === "forgot-reset" && (
              <form onSubmit={handleForgotReset} className="space-y-5">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-muted/60">
                    <MailCheck className="h-4.5 w-4.5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Code sent to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>

                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <PasswordInput
                  id="newPassword"
                  label="New password"
                  value={newPassword}
                  onChange={setNewPassword}
                  autoComplete="new-password"
                />
                <PasswordInput
                  id="confirmPassword"
                  label="Confirm new password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  autoComplete="new-password"
                />

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={busy || otpCode.length !== 6}
                >
                  {busy ? (
                    "Resetting…"
                  ) : (
                    <>
                      Reset password & sign in <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground"
                  onClick={() => setStep("forgot-email")}
                  disabled={busy}
                >
                  Resend code
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground"
                  onClick={goToSignIn}
                  disabled={busy}
                >
                  Back to sign in
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Access is limited to authorized {APP_NAME} accounts.
        </p>
      </motion.div>
    </div>
  );
}
