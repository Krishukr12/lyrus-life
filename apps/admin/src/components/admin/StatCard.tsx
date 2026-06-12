import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  loading,
  accent = "default",
}: {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: { label: string; positive?: boolean };
  loading?: boolean;
  accent?: "default" | "success" | "warning" | "danger" | "accent";
}) {
  const iconBg = {
    default: "bg-slate-100 text-slate-600",
    success: "bg-green-50 text-admin-success",
    warning: "bg-amber-50 text-admin-warning",
    danger: "bg-red-50 text-admin-danger",
    accent: "bg-blue-50 text-admin-accent",
  }[accent];

  return (
    <div className="admin-card p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          {loading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-2xl font-semibold text-admin-primary tabular-nums">{value}</p>
          )}
          {subtext && !loading ? (
            <p className="text-xs text-slate-400">{subtext}</p>
          ) : null}
          {trend && !loading ? (
            <p
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-admin-success" : "text-slate-500",
              )}
            >
              {trend.label}
            </p>
          ) : null}
        </div>
        <div className={cn("rounded-lg p-2.5", iconBg)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
