import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Building2,
  CalendarClock,
  ClipboardCheck,
  FlaskConical,
  IndianRupee,
  Users,
  Video,
} from "lucide-react";
import { PageContainer } from "@/components/admin/PageContainer";
import { DashboardHero } from "@/components/admin/DashboardHero";
import {
  BusinessMetricCard,
  ExecutiveMetricCard,
} from "@/components/admin/ExecutiveMetricCard";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { SystemHealthPanel } from "@/components/admin/SystemHealthPanel";
import { ActivityPanel } from "@/components/admin/ActivityTimeline";
import { PendingRequestsPanel } from "@/components/admin/PendingRequestsPanel";
import { RecentOrganizationsList } from "@/components/admin/RecentOrganizationsList";
import { adminApi } from "@/services/api";
import { formatInr } from "@/lib/format-inr";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  const dashboardQuery = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminApi.getDashboard(),
  });

  const data = dashboardQuery.data;

  const activeRate =
    data && data.organizations.total > 0
      ? (data.organizations.active / data.organizations.total) * 100
      : 0;

  return (
    <PageContainer>
      <DashboardHero userName={user?.name} />

      {/* Primary KPIs — one number per domain */}
      <section className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ExecutiveMetricCard
          label="Organizations"
          value={data?.organizations.total ?? "—"}
          trend={data ? data.organizations.growthPercent : undefined}
          trendLabel="vs prior 30 days"
          description={
            data
              ? `${data.organizations.active} active · ${data.organizations.pending} pending`
              : "Total tenants on platform"
          }
          loading={dashboardQuery.isLoading}
          accent="blue"
          icon={Building2}
        />
        <ExecutiveMetricCard
          label="Employees"
          value={data?.users.total ?? "—"}
          trendLabel={
            data
              ? `${data.users.active} active · ${data.users.newLast30Days} new this month`
              : "Across all tenants"
          }
          description="Workforce seats"
          loading={dashboardQuery.isLoading}
          accent="emerald"
          icon={Users}
        />
        <ExecutiveMetricCard
          label="Meetings"
          value={data?.meetings.total ?? "—"}
          trendLabel={
            data
              ? `${data.meetings.today} today · ${data.meetings.liveNow} live now`
              : "Platform-wide"
          }
          description={`${data?.meetings.thisMonth ?? "—"} scheduled this month`}
          loading={dashboardQuery.isLoading}
          accent="violet"
          icon={Video}
        />
        <ExecutiveMetricCard
          label="MRR"
          value={data != null ? formatInr(data.billing.mrrInr) : "—"}
          trendLabel={`${data?.billing.activeSubscriptions ?? 0} paying customers`}
          description={`${data?.billing.trialAccounts ?? "—"} on trial`}
          loading={dashboardQuery.isLoading}
          accent="amber"
          icon={IndianRupee}
        />
      </section>

      {/* Secondary — billing & ops signals not shown above */}
      <section className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <BusinessMetricCard
          label="Pending approvals"
          value={data?.organizations.pending ?? "—"}
          hint="In review queue"
          loading={dashboardQuery.isLoading}
          accent="amber"
          icon={ClipboardCheck}
        />
        <BusinessMetricCard
          label="Renewals due"
          value={data?.billing.upcomingRenewals ?? "—"}
          hint="Next 30 days"
          loading={dashboardQuery.isLoading}
          accent="slate"
          icon={CalendarClock}
        />
        <BusinessMetricCard
          label="Suspended tenants"
          value={data?.organizations.suspended ?? "—"}
          hint="Requires attention"
          loading={dashboardQuery.isLoading}
          accent="blue"
          icon={Building2}
        />
      </section>

      <section className="mb-8 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardCharts
            tenantGrowth={data?.charts.tenantGrowth}
            meetingsByMonth={data?.charts.meetingsByMonth}
            revenueByCustomer={data?.charts.revenueByCustomer}
            loading={dashboardQuery.isLoading}
          />
        </div>
        <SystemHealthPanel
          services={data?.systemHealth.services}
          allOperational={data?.systemHealth.allOperational}
          livekit={data?.livekit}
          loading={dashboardQuery.isLoading}
        />
      </section>

      {/* Three distinct panels — no overlapping content */}
      <section className="grid gap-4 lg:grid-cols-3 lg:items-start">
        <RecentOrganizationsList
          organizations={data?.recentOrganizations ?? []}
          loading={dashboardQuery.isLoading}
          activeRate={activeRate}
        />

        <ActivityPanel
          title="Recent activity"
          items={data?.recentActivity ?? []}
          loading={dashboardQuery.isLoading}
          footer="Full audit history is available under Audit Logs."
          icon={Activity}
        />

        <PendingRequestsPanel
          requests={data?.pendingRequests ?? []}
          loading={dashboardQuery.isLoading}
        />
      </section>
    </PageContainer>
  );
}
