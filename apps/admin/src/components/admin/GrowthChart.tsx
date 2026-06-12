import { format, subMonths, startOfMonth } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

type OrgPoint = { createdAt: string };

function buildMonthlyCounts(orgs: OrgPoint[], months = 6) {
  const now = new Date();
  const buckets: { label: string; count: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i));
    const label = format(monthStart, "MMM");
    const count = orgs.filter((o) => {
      const d = new Date(o.createdAt);
      return d.getMonth() === monthStart.getMonth() && d.getFullYear() === monthStart.getFullYear();
    }).length;
    buckets.push({ label, count });
  }

  return buckets;
}

export function GrowthChart({
  organizations,
  loading,
}: {
  organizations?: OrgPoint[];
  loading?: boolean;
}) {
  const data = buildMonthlyCounts(organizations ?? []);
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="admin-card-accent h-full flex flex-col">
      <div className="admin-panel-header">
        <div>
          <h2 className="admin-panel-title">Organization growth</h2>
          <p className="text-xs text-slate-500 mt-0.5">New tenants by month</p>
        </div>
      </div>
      <div className="flex-1 p-5">
        {loading ? (
          <Skeleton className="h-48 w-full rounded-lg" />
        ) : (
          <div className="flex h-48 items-end justify-between gap-2">
            {data.map((point) => (
              <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[11px] font-medium text-slate-500 tabular-nums">
                  {point.count}
                </span>
                <div
                  className="w-full max-w-[2.5rem] rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
                  style={{ height: `${Math.max(8, (point.count / max) * 100)}%` }}
                  title={`${point.count} organizations`}
                />
                <span className="text-[11px] text-slate-400">{point.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
