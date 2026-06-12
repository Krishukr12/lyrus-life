import { useState } from "react";
import { BarChart3, LineChart, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_INSIGHT_HEIGHT } from "@/lib/dashboard-types";
import type { DashboardChartPoint, DashboardRevenueRow } from "@/lib/dashboard-types";
import { formatInr } from "@/lib/format-inr";

type ChartTab = "tenants" | "revenue" | "meetings";

function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[140px] flex-col items-center justify-center px-4 text-center">
      <BarChart3 className="mb-2 h-8 w-8 text-slate-300" strokeWidth={1.5} />
      <p className="text-sm font-medium text-slate-700">No data yet</p>
      <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">{message}</p>
    </div>
  );
}

function BarChartView({
  data,
  emptyMessage = "Charts will populate as organizations begin using the platform.",
}: {
  data: DashboardChartPoint[];
  emptyMessage?: string;
}) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) {
    return <ChartEmptyState message={emptyMessage} />;
  }

  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="flex h-full min-h-[140px] items-end justify-between gap-1.5 px-0.5">
      {data.map((point) => (
        <div key={point.label} className="flex min-w-0 flex-1 flex-col items-center gap-1">
          <span className="text-[10px] font-semibold text-slate-600 tabular-nums">{point.count}</span>
          <div className="flex h-24 w-full max-w-10 items-end justify-center">
            <div
              className="w-full max-w-8 rounded-t-md bg-blue-500 transition-colors hover:bg-blue-600"
              style={{ height: `${Math.max(8, (point.count / max) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-medium text-slate-400">{point.label}</span>
        </div>
      ))}
    </div>
  );
}

function RevenueSnapshot({ items }: { items: DashboardRevenueRow[] }) {
  if (items.length === 0) {
    return (
      <ChartEmptyState message="Revenue appears when customers have active subscriptions." />
    );
  }

  const max = Math.max(1, ...items.map((r) => r.amountInr));

  return (
    <div className="space-y-2.5">
      <p className="sticky top-0 z-[1] bg-white pb-1 text-[11px] text-slate-500">
        Active customers · monthly (INR)
      </p>
      {items.map((row) => (
        <div key={row.organizationId} className="space-y-1">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="truncate font-medium text-slate-700">{row.organizationName}</span>
            <span className="shrink-0 tabular-nums font-medium text-slate-600">
              {formatInr(row.amountInr)}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${(row.amountInr / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const TABS: { id: ChartTab; label: string; icon: typeof BarChart3 }[] = [
  { id: "tenants", label: "Tenants", icon: TrendingUp },
  { id: "revenue", label: "Revenue", icon: LineChart },
  { id: "meetings", label: "Meetings", icon: BarChart3 },
];

export function DashboardCharts({
  tenantGrowth,
  meetingsByMonth,
  revenueByCustomer,
  loading,
}: {
  tenantGrowth?: DashboardChartPoint[];
  meetingsByMonth?: DashboardChartPoint[];
  revenueByCustomer?: DashboardRevenueRow[];
  loading?: boolean;
}) {
  const [tab, setTab] = useState<ChartTab>("tenants");

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        DASHBOARD_INSIGHT_HEIGHT,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight text-slate-900">Platform analytics</h2>
        <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all",
                tab === t.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              <t.icon className="h-3 w-3" strokeWidth={1.75} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 [scrollbar-gutter:stable]">
        {loading ? (
          <Skeleton className="h-32 w-full rounded-lg" />
        ) : tab === "tenants" ? (
          <BarChartView data={tenantGrowth ?? []} />
        ) : tab === "revenue" ? (
          <RevenueSnapshot items={revenueByCustomer ?? []} />
        ) : (
          <BarChartView
            data={meetingsByMonth ?? []}
            emptyMessage="Meeting activity will appear as sessions are scheduled."
          />
        )}
      </div>
    </div>
  );
}
