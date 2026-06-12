import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const accentConfig = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600",
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
  featured,
}: {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  description?: string;
  loading?: boolean;
  accent?: keyof typeof accentConfig;
  icon?: LucideIcon;
  featured?: boolean;
}) {
  const styles = accentConfig[accent];
  const isFeatured = featured ?? false;
  const positive = trend != null && trend >= 0;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[28px] p-6",
        "shadow-[0_4px_24px_rgba(15,23,42,0.06)] transition-all duration-300",
        isFeatured
          ? "bg-[#3B82F6] text-white"
          : "border border-slate-100/80 bg-white hover:shadow-[0_8px_32px_rgba(15,23,42,0.08)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          {Icon ? (
            <div
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                isFeatured ? "bg-white/20 text-white" : styles.icon,
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
          ) : null}
          {!loading && trend != null ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                isFeatured
                  ? "bg-white text-[#3B82F6]"
                  : positive
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600",
              )}
            >
              {positive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {positive ? "+" : "-"}
              {Math.abs(trend).toFixed(2)}%
            </span>
          ) : null}
        </div>
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
            isFeatured
              ? "bg-white/15 text-white hover:bg-white/25"
              : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600",
          )}
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="mt-5">
        {loading ? (
          <Skeleton
            className={cn("h-10 w-32", isFeatured && "bg-white/20")}
          />
        ) : (
          <p
            className={cn(
              "text-[2rem] font-bold leading-none tracking-tight tabular-nums sm:text-[2.25rem]",
              isFeatured ? "text-white" : "text-slate-900",
            )}
          >
            {value}
          </p>
        )}
        <p
          className={cn(
            "mt-2 text-sm font-medium",
            isFeatured ? "text-white/80" : "text-slate-400",
          )}
        >
          {label}
        </p>
        {!loading && (trendLabel || description) ? (
          <p
            className={cn(
              "mt-1 text-xs leading-snug",
              isFeatured ? "text-white/60" : "text-slate-400",
            )}
          >
            {[trendLabel, description].filter(Boolean).join(" · ")}
          </p>
        ) : null}
      </div>
    </div>
  );
}

const businessAccent = {
  slate: { icon: "bg-slate-50 text-slate-500" },
  emerald: { icon: "bg-emerald-50 text-emerald-600" },
  amber: { icon: "bg-amber-50 text-amber-600" },
  blue: { icon: "bg-blue-50 text-blue-600" },
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
        "group rounded-[24px] border border-slate-100/80 bg-white p-5",
        "shadow-[0_4px_24px_rgba(15,23,42,0.05)] transition-all duration-300",
        "hover:shadow-[0_8px_32px_rgba(15,23,42,0.08)]",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {Icon ? (
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                styles.icon,
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </div>
          ) : null}
          <p className="truncate text-sm font-medium text-slate-400">{label}</p>
        </div>
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400"
        >
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
      {loading ? (
        <Skeleton className="mt-4 h-8 w-20" />
      ) : (
        <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
          {value}
        </p>
      )}
      {hint && !loading ? (
        <p className="mt-1 text-xs text-slate-400 leading-snug">{hint}</p>
      ) : null}
    </div>
  );
}
