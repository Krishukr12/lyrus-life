import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const accentConfig = {
  blue: {
    bar: "from-blue-500 to-indigo-500",
    icon: "bg-blue-500/10 text-blue-600 ring-blue-500/20",
    glow: "group-hover:shadow-blue-500/12",
    wash: "from-blue-500/[0.04] to-transparent",
  },
  emerald: {
    bar: "from-emerald-500 to-teal-500",
    icon: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
    glow: "group-hover:shadow-emerald-500/12",
    wash: "from-emerald-500/[0.04] to-transparent",
  },
  violet: {
    bar: "from-violet-500 to-purple-500",
    icon: "bg-violet-500/10 text-violet-600 ring-violet-500/20",
    glow: "group-hover:shadow-violet-500/12",
    wash: "from-violet-500/[0.04] to-transparent",
  },
  amber: {
    bar: "from-amber-500 to-orange-500",
    icon: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
    glow: "group-hover:shadow-amber-500/12",
    wash: "from-amber-500/[0.04] to-transparent",
  },
} as const;

export function ExecutiveMetricCard({
  label,
  value,
  trend,
  trendLabel,
  description,
  loading,
  accent = "blue",
  icon: Icon,
}: {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  description?: string;
  loading?: boolean;
  accent?: keyof typeof accentConfig;
  icon?: LucideIcon;
}) {
  const styles = accentConfig[accent];
  const positive = trend != null && trend >= 0;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_16px_rgba(15,23,42,0.05)]",
        "transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-xl",
        styles.glow,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-100",
          styles.wash,
        )}
        aria-hidden
      />
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-90 transition-opacity group-hover:opacity-100",
          styles.bar,
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>
          {loading ? (
            <Skeleton className="mt-3 h-11 w-36" />
          ) : (
            <p className="mt-2 text-[2rem] sm:text-[2.25rem] font-bold tracking-tight text-slate-900 tabular-nums leading-none">
              {value}
            </p>
          )}
        </div>
        {Icon ? (
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 shadow-sm",
              styles.icon,
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
        ) : null}
      </div>
      {!loading && (trend != null || trendLabel || description) ? (
        <div className="relative mt-4 flex flex-col gap-1.5">
          {trend != null ? (
            <span
              className={cn(
                "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold",
                positive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600",
              )}
            >
              {positive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {positive ? "↑" : "↓"} {Math.abs(trend).toFixed(0)}%
            </span>
          ) : null}
          {trendLabel ? <p className="text-xs font-medium text-slate-500">{trendLabel}</p> : null}
          {description ? <p className="text-[11px] text-slate-400 leading-snug">{description}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

const businessAccent = {
  slate: { dot: "bg-slate-400", ring: "ring-slate-200/80", bg: "bg-slate-50" },
  emerald: { dot: "bg-emerald-500", ring: "ring-emerald-200/80", bg: "bg-emerald-50/40" },
  amber: { dot: "bg-amber-500", ring: "ring-amber-200/80", bg: "bg-amber-50/40" },
  blue: { dot: "bg-blue-500", ring: "ring-blue-200/80", bg: "bg-blue-50/40" },
} as const;

export function BusinessMetricCard({
  label,
  value,
  hint,
  loading,
  accent = "slate",
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  loading?: boolean;
  accent?: keyof typeof businessAccent;
  icon?: LucideIcon;
}) {
  const styles = businessAccent[accent];

  return (
    <div
      className={cn(
        "group rounded-2xl border border-slate-200/70 px-4 py-4 transition-all duration-200",
        "hover:border-slate-200 hover:bg-white hover:shadow-md",
        styles.bg,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={cn("h-2 w-2 rounded-full shrink-0", styles.dot)} />
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 truncate">
            {label}
          </p>
        </div>
        {Icon ? (
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white ring-1",
              styles.ring,
            )}
          >
            <Icon className="h-4 w-4 text-slate-500" strokeWidth={1.75} />
          </div>
        ) : null}
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-8 w-20" />
      ) : (
        <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
          {value}
        </p>
      )}
      {hint && !loading ? (
        <p className="mt-1 text-[11px] text-slate-400 leading-snug">{hint}</p>
      ) : null}
    </div>
  );
}
