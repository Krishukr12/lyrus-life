import { useMemo, useState } from "react";
import { BarChart3, LineChart, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_INSIGHT_HEIGHT } from "@/lib/dashboard-types";
import type { DashboardChartPoint, DashboardRevenueRow } from "@/lib/dashboard-types";
import { formatInr } from "@/lib/format-inr";

type ChartTab = "tenants" | "revenue" | "meetings";

function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center px-4 text-center">
      <BarChart3 className="mb-2 h-8 w-8 text-slate-300" strokeWidth={1.5} />
      <p className="text-sm font-medium text-slate-700">No data yet</p>
      <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">{message}</p>
    </div>
  );
}

function BarChartView({
  data,
  emptyMessage = "Charts will populate as organizations begin using the platform.",
  valueFormatter = (v: number) => String(v),
}: {
  data: DashboardChartPoint[];
  emptyMessage?: string;
  valueFormatter?: (value: number) => string;
}) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const max = Math.max(1, ...data.map((d) => d.count));
  const highlightIndex = useMemo(() => {
    if (data.length === 0) return -1;
    let best = 0;
    for (let i = 1; i < data.length; i++) {
      if (data[i].count > data[best].count) best = i;
    }
    return best;
  }, [data]);

  if (total === 0) {
    return <ChartEmptyState message={emptyMessage} />;
  }

  return (
    <div className="flex h-full min-h-[220px] items-end justify-between gap-2 px-1 pt-10">
      {data.map((point, index) => {
        const isHighlight = index === highlightIndex;
        const barHeight = Math.max(12, (point.count / max) * 100);

        return (
          <div key={point.label} className="relative flex min-w-0 flex-1 flex-col items-center">
            {isHighlight ? (
              <div className="absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap">
                <div className="relative rounded-full bg-[#3B82F6] px-3 py-1 text-[11px] font-semibold text-white shadow-md">
                  {valueFormatter(point.count)}
                  <span
                    className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#3B82F6]"
                    aria-hidden
                  />
                </div>
              </div>
            ) : null}

            <div className="flex h-40 w-full max-w-12 items-end justify-center">
              <div className="relative flex h-full w-full max-w-9 items-end justify-center rounded-full bg-slate-100/90">
                <div
                  className={cn(
                    "w-full max-w-9 rounded-full transition-all duration-300",
                    isHighlight
                      ? "bg-[length:8px_8px] bg-[repeating-linear-gradient(135deg,#3B82F6_0,#3B82F6_4px,#60A5FA_4px,#60A5FA_8px)]"
                      : "bg-[#1A1F36]",
                  )}
                  style={{ height: `${barHeight}%` }}
                />
              </div>
            </div>

            <span
              className={cn(
                "mt-3 text-[11px] font-medium",
                isHighlight ? "font-semibold text-slate-700" : "text-slate-400",
              )}
            >
              {point.label}
            </span>
          </div>
        );
      })}
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
  const highlightIndex = items.reduce(
    (best, row, i) => (row.amountInr > items[best].amountInr ? i : best),
    0,
  );

  return (
    <div className="space-y-4 px-1 pt-2">
      {items.map((row, index) => {
        const isHighlight = index === highlightIndex;
        const barWidth = Math.max(8, (row.amountInr / max) * 100);

        return (
          <div key={row.organizationId} className="space-y-2">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="truncate font-semibold text-slate-800">{row.organizationName}</span>
              <span
                className={cn(
                  "shrink-0 tabular-nums font-semibold",
                  isHighlight ? "text-[#3B82F6]" : "text-slate-600",
                )}
              >
                {formatInr(row.amountInr)}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  isHighlight
                    ? "bg-[length:8px_8px] bg-[repeating-linear-gradient(135deg,#3B82F6_0,#3B82F6_4px,#60A5FA_4px,#60A5FA_8px)]"
                    : "bg-[#1A1F36]",
                )}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const TABS: { id: ChartTab; label: string; icon: typeof BarChart3 }[] = [
  { id: "tenants", label: "Tenants", icon: TrendingUp },
  { id: "revenue", label: "Revenue", icon: LineChart },
  { id: "meetings", label: "Meetings", icon: BarChart3 },
];

const TAB_TITLES: Record<ChartTab, string> = {
  tenants: "Tenant growth",
  revenue: "Revenue by customer",
  meetings: "Meetings by month",
};

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

  const chartTrend = useMemo(() => {
    const data =
      tab === "tenants"
        ? tenantGrowth
        : tab === "meetings"
          ? meetingsByMonth
          : undefined;
    if (!data || data.length < 2) return null;
    const first = data[0].count;
    const last = data[data.length - 1].count;
    if (first === 0) return last > 0 ? 100 : 0;
    return ((last - first) / first) * 100;
  }, [tab, tenantGrowth, meetingsByMonth]);

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[28px] border border-slate-100/80 bg-white",
        "shadow-[0_4px_24px_rgba(15,23,42,0.06)]",
        DASHBOARD_INSIGHT_HEIGHT,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 px-6 py-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <BarChart3 className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <h2 className="truncate text-base font-semibold tracking-tight text-slate-900">
            {TAB_TITLES[tab]}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {chartTrend != null && !loading ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                chartTrend >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600",
              )}
            >
              <TrendingUp className={cn("h-3 w-3", chartTrend < 0 && "rotate-180")} />
              {chartTrend >= 0 ? "+" : ""}
              {chartTrend.toFixed(2)}%
            </span>
          ) : null}
          <div className="flex gap-0.5 rounded-full bg-slate-100 p-0.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all",
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
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 [scrollbar-gutter:stable]">
        {loading ? (
          <Skeleton className="h-48 w-full rounded-2xl" />
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
