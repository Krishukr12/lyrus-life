import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const ONBOARDING_STEPS = [
  { id: 1, title: "Company", short: "Company" },
  { id: 2, title: "Business", short: "Business" },
  { id: 3, title: "Plan", short: "Plan" },
  { id: 4, title: "Notes", short: "Notes" },
  { id: 5, title: "Admin", short: "Admin" },
  { id: 6, title: "Review", short: "Review" },
] as const;

export function OnboardingStepper({
  currentStep = 1,
  completionPercent,
  onStepClick,
}: {
  currentStep?: number;
  completionPercent?: number;
  onStepClick?: (step: number) => void;
}) {
  const percent =
    completionPercent ?? Math.round(((currentStep - 1) / ONBOARDING_STEPS.length) * 100);

  return (
    <nav aria-label="Onboarding progress" className="mb-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Step {currentStep} of {ONBOARDING_STEPS.length}
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {ONBOARDING_STEPS[currentStep - 1]?.title}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold tabular-nums text-slate-900">{percent}%</span>
            <p className="text-[11px] text-slate-400">complete</p>
          </div>
        </div>

        <div className="relative mb-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${Math.max(percent, 4)}%` }}
          />
        </div>

        <ol className="flex items-center justify-between gap-1">
          {ONBOARDING_STEPS.map((step, index) => {
            const done = step.id < currentStep;
            const current = step.id === currentStep;
            const clickable = done && onStepClick;

            return (
              <li key={step.id} className="flex flex-1 items-center">
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => clickable && onStepClick(step.id)}
                  className={cn(
                    "group flex w-full flex-col items-center gap-1.5",
                    clickable && "cursor-pointer",
                    !clickable && !current && "cursor-default",
                  )}
                  aria-current={current ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-colors sm:h-8 sm:w-8 sm:text-xs",
                      done
                        ? "bg-emerald-500 text-white"
                        : current
                          ? "bg-blue-600 text-white ring-4 ring-blue-100"
                          : "bg-slate-100 text-slate-400",
                      clickable && "group-hover:bg-emerald-600",
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : step.id}
                  </span>
                  <span
                    className={cn(
                      "hidden text-[10px] font-medium sm:block",
                      current ? "text-blue-700" : done ? "text-emerald-700" : "text-slate-400",
                    )}
                  >
                    {step.short}
                  </span>
                </button>
                {index < ONBOARDING_STEPS.length - 1 ? (
                  <div
                    className={cn(
                      "mx-0.5 h-px flex-1 min-w-[8px] sm:mx-1",
                      step.id < currentStep ? "bg-emerald-300" : "bg-slate-200",
                    )}
                    aria-hidden
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export const ONBOARDING_STEP_LABELS = ONBOARDING_STEPS;
