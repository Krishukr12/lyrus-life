import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const ONBOARDING_STEPS = [
  { id: 1, title: "Company Information", short: "Company" },
  { id: 2, title: "Business Details", short: "Business" },
  { id: 3, title: "Subscription Plan", short: "Plan" },
  { id: 4, title: "Meeting Notes Configuration", short: "Notes" },
  { id: 5, title: "Admin Account", short: "Admin" },
] as const;

export function OnboardingStepper({
  activeStep = 1,
  completionPercent,
}: {
  activeStep?: number;
  completionPercent?: number;
}) {
  const percent =
    completionPercent ?? Math.round(((activeStep - 1) / ONBOARDING_STEPS.length) * 100);

  return (
    <nav aria-label="Onboarding progress" className="mb-8">
      <div className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_4px_24px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Onboarding progress
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-700">
              Step {activeStep} of {ONBOARDING_STEPS.length} ·{" "}
              {ONBOARDING_STEPS[activeStep - 1]?.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tabular-nums text-slate-900">{percent}%</span>
            <span className="text-xs text-slate-500">complete</span>
          </div>
        </div>

        <div className="relative mb-6 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${Math.max(percent, 8)}%` }}
          />
        </div>

        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ONBOARDING_STEPS.map((step) => {
            const done = step.id < activeStep;
            const current = step.id === activeStep;

            return (
              <li
                key={step.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-300",
                  done
                    ? "border-emerald-200/80 bg-emerald-50/50"
                    : current
                      ? "border-blue-200 bg-blue-50/40 shadow-sm ring-1 ring-blue-500/10"
                      : "border-slate-100 bg-slate-50/40",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    done
                      ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                      : current
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                        : "bg-white text-slate-400 ring-1 ring-slate-200",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : step.id}
                </span>
                <div className="min-w-0 hidden md:block">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Step {step.id}
                  </p>
                  <p
                    className={cn(
                      "truncate text-sm font-semibold",
                      done ? "text-emerald-800" : current ? "text-slate-900" : "text-slate-500",
                    )}
                  >
                    {step.title}
                  </p>
                </div>
                <p className="truncate text-xs font-semibold text-slate-700 md:hidden">{step.short}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export const ONBOARDING_STEP_LABELS = ONBOARDING_STEPS;
