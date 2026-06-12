import { useState } from "react";
import { Navigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BarChart3, Lock, Mail, Shield, Target, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/admin/FormFields";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema, type LoginFormValues } from "@/lib/schemas";
import { PORTAL_NAME, PORTAL_TAGLINE } from "@/lib/brand";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=80";

const STATS = [
  { value: "10K+", label: "Meetings Processed", icon: BarChart3 },
  { value: "98%", label: "Decision Accuracy", icon: Target },
  { value: "500+", label: "Teams Enabled", icon: Users },
] as const;

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(values: LoginFormValues) {
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      toast.success("Welcome back");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#eef2f8]">
      {/* Hero panel */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover scale-105 transition-transform duration-[8000ms] ease-out hover:scale-110"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(8, 20, 46, 0.92) 0%, rgba(8, 20, 46, 0.78) 45%, rgba(8, 20, 46, 0.88) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.12),transparent_50%)]" />

        <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-14 text-white">
          <div className="flex items-center gap-3.5 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 shadow-lg shadow-black/20 ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:ring-white/30">
              <Shield className="h-5 w-5 text-blue-300" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">
                {PORTAL_NAME}
              </span>
              <p className="text-[11px] font-medium tracking-wide text-blue-200/70">
                {PORTAL_TAGLINE}
              </p>
            </div>
          </div>

          <div className="max-w-xl animate-in fade-in slide-in-from-left-6 duration-700 delay-150 fill-mode-both">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300/80">
              Enterprise Admin Console
            </p>
            <h1 className="text-4xl font-bold leading-[1.12] tracking-tight xl:text-[2.75rem] xl:leading-[1.1]">
              Turn Meetings Into Actionable Decisions
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-300/90 xl:text-[17px]">
              AI-powered meeting intelligence for teams, organizations, and
              enterprise operations.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-3">
              {STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className="group rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.10] hover:shadow-lg hover:shadow-black/20 animate-in fade-in slide-in-from-bottom-3 fill-mode-both"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <stat.icon className="mb-2.5 h-4 w-4 text-blue-400/80 transition-colors duration-300 group-hover:text-blue-300" />
                  <p className="text-xl font-bold tracking-tight text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-slate-400 transition-colors duration-300 group-hover:text-slate-300">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-500/90 animate-in fade-in duration-700 delay-500 fill-mode-both">
            Internal access only · Authorized personnel
          </p>
        </div>
      </div>

      {/* Login panel */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-6 sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(8,20,46,0.04),transparent_50%)]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(148, 163, 184, 0.18) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#08142e] shadow-md">
              <Shield className="h-4 w-4 text-blue-300" />
            </div>
            <div>
              <span className="font-semibold text-[#08142e]">{PORTAL_NAME}</span>
              <p className="text-[10px] text-slate-500">{PORTAL_TAGLINE}</p>
            </div>
          </div>

          <div
            className="rounded-[24px] border border-white/60 bg-white/65 p-8 text-[#08142e] shadow-[0_8px_40px_rgba(8,20,46,0.08),0_2px_12px_rgba(8,20,46,0.04)] backdrop-blur-2xl transition-all duration-500 hover:border-white/80 hover:shadow-[0_16px_48px_rgba(8,20,46,0.12),0_4px_16px_rgba(8,20,46,0.06)] sm:p-9"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 100%)",
            }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-[#08142e]">
                Sign in
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Super admin credentials required
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                <FormInput
                  control={form.control}
                  name="email"
                  label="Email"
                  type="email"
                  autoComplete="email"
                  startIcon={<Mail className="h-4 w-4" />}
                  labelClassName="shrink-0 text-sm font-semibold leading-snug text-[#08142e]"
                  inputClassName="h-11 rounded-xl border-slate-200/80 bg-white/90 backdrop-blur-sm transition-all duration-200 focus:bg-white hover:border-slate-300"
                />
                <FormInput
                  control={form.control}
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  startIcon={<Lock className="h-4 w-4" />}
                  labelClassName="shrink-0 text-sm font-semibold leading-snug text-[#08142e]"
                  inputClassName="h-11 rounded-xl border-slate-200/80 bg-white/90 backdrop-blur-sm transition-all duration-200 focus:bg-white hover:border-slate-300"
                />
                <Button
                  type="submit"
                  className="group relative mt-1 h-12 w-full overflow-hidden rounded-xl bg-[#08142e] text-sm font-semibold tracking-wide shadow-lg shadow-[#08142e]/25 transition-all duration-300 hover:bg-[#0c1d42] hover:shadow-xl hover:shadow-[#08142e]/30 active:scale-[0.98] disabled:opacity-70"
                  disabled={submitting}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-500/10 to-blue-600/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative">
                    {submitting ? "Signing in…" : "Sign in"}
                  </span>
                </Button>
              </form>
            </Form>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Secured access for platform administrators
          </p>
        </div>
      </div>
    </div>
  );
}
