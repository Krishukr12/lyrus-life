import { Building2, CalendarClock, FlaskConical, IndianRupee } from "lucide-react";
import { ExecutiveMetricCard } from "@/components/admin/ExecutiveMetricCard";
import type { CustomerBillingRow } from "@/lib/billing-types";
import { formatInr } from "@/lib/format-inr";
import { computeRevenueSummary } from "@/lib/revenue-summary";

export { computeRevenueSummary };

export function RevenueSummaryCards({
  items,
  loading,
}: {
  items: CustomerBillingRow[];
  loading?: boolean;
}) {
  const stats = computeRevenueSummary(items);

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <ExecutiveMetricCard
        label="Total MRR (INR)"
        value={loading ? "—" : formatInr(stats.mrr)}
        trendLabel="Active subscriptions"
        loading={loading}
        accent="blue"
        featured
        icon={IndianRupee}
      />
      <ExecutiveMetricCard
        label="Active customers"
        value={loading ? "—" : stats.activeCustomers}
        trendLabel="Paying tenants"
        loading={loading}
        accent="emerald"
        icon={Building2}
      />
      <ExecutiveMetricCard
        label="Trial customers"
        value={loading ? "—" : stats.trialCustomers}
        trendLabel="On free trial"
        loading={loading}
        accent="violet"
        icon={FlaskConical}
      />
      <ExecutiveMetricCard
        label="Expected next billing (INR)"
        value={loading ? "—" : formatInr(stats.expectedNextBilling)}
        trendLabel="Next 30 days"
        loading={loading}
        accent="amber"
        icon={CalendarClock}
      />
    </div>
  );
}
