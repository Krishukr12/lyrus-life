import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function OnboardingStepShell({
  step,
  title,
  description,
  children,
  className,
}: {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-1 duration-300 rounded-2xl border border-slate-200/80 bg-white shadow-sm",
        className,
      )}
    >
      <div className="border-b border-slate-100 px-6 py-4 sm:px-8 sm:py-5">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
            {step}
          </span>
          <div className="min-w-0 pt-0.5">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-sm leading-relaxed text-slate-500">{description}</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="px-6 py-6 sm:px-8 sm:py-7">{children}</div>
    </div>
  );
}

export function FormSubsection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h3>
      {children}
    </div>
  );
}
