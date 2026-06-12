import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FormSection({
  title,
  description,
  children,
  step,
  icon: Icon,
  id,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  step?: number;
  icon?: LucideIcon;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 overflow-hidden rounded-[22px] border border-slate-200/80 bg-white",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)]",
        className,
      )}
    >
      <div className="flex items-start gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/90 to-blue-50/30 px-6 py-5">
        {step != null ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm shadow-blue-600/25">
            {step}
          </span>
        ) : Icon ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/80">
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight text-slate-900">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="w-full p-6 sm:p-7">{children}</div>
    </section>
  );
}
