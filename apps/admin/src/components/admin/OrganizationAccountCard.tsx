import { format } from "date-fns";
import {
  Building2,
  Calendar,
  Globe,
  HardDrive,
  IndianRupee,
  MapPin,
  Sparkles,
  UserCheck,
  Users,
  Video,
} from "lucide-react";
import { OrganizationAvatar } from "@/components/admin/OrganizationAvatar";
import { PlanBadge } from "@/components/admin/billing/PlanBadge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  BusinessMetricCard,
  ExecutiveMetricCard,
} from "@/components/admin/ExecutiveMetricCard";
import { formatInr } from "@/lib/format-inr";
import type { OrganizationSummary } from "@/lib/types";
import type { OrganizationDetail } from "@/lib/org-types";

export function OrganizationAccountCard({
  org,
  usage,
  subscription,
}: {
  org: OrganizationSummary;
  usage?: { totalEmployees: number; activeEmployees: number; totalMeetings: number };
  subscription?: OrganizationDetail["subscription"];
}) {
  const location = [org.city, org.state, org.country].filter(Boolean).join(", ");
  const employees = usage?.totalEmployees ?? org.counts?.users ?? 0;
  const activeUsers = usage?.activeEmployees ?? 0;
  const meetings = usage?.totalMeetings ?? org.counts?.meetings ?? 0;
  const mrr = subscription?.monthlyAmountInr;

  return (
    <div className="mb-8 space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_40px_rgba(15,23,42,0.07)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.05),transparent_50%)]" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-5">
              <OrganizationAvatar
                name={org.name}
                className="h-16 w-16 rounded-[20px] text-lg shadow-md ring-4 ring-white"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.75rem]">
                    {org.name}
                  </h1>
                  <StatusBadge status={org.status} />
                  <PlanBadge plan={org.subscriptionPlan} />
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {org.code ? `${org.code} · ` : ""}
                  {org.slug}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                  {org.country ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {org.country}
                    </span>
                  ) : null}
                  {org.timezone ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Globe className="h-4 w-4 text-slate-400" />
                      {org.timezone}
                    </span>
                  ) : null}
                  {org.industry ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      {org.industry}
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    Created {format(new Date(org.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                {location ? (
                  <p className="mt-2 text-xs text-slate-500">{location}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <ExecutiveMetricCard
          label="Employees"
          value={employees}
          icon={Users}
          accent="blue"
        />
        <ExecutiveMetricCard
          label="Active Users"
          value={activeUsers}
          icon={UserCheck}
          accent="emerald"
        />
        <ExecutiveMetricCard
          label="Meetings"
          value={meetings}
          icon={Video}
          accent="violet"
        />
        <ExecutiveMetricCard
          label="Storage Used"
          value="—"
          description="Storage metrics coming soon"
          icon={HardDrive}
          accent="amber"
        />
        <ExecutiveMetricCard
          label="Monthly Revenue"
          value={mrr != null ? formatInr(mrr) : "—"}
          icon={IndianRupee}
          accent="emerald"
        />
        <ExecutiveMetricCard
          label="AI Usage"
          value={meetings > 0 ? `${meetings}` : "—"}
          description="Meetings processed by AI"
          icon={Sparkles}
          accent="violet"
        />
      </div>

      {/* Compact secondary metrics */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <BusinessMetricCard label="Plan tier" value={org.subscriptionPlan} accent="blue" />
        <BusinessMetricCard
          label="Billing status"
          value={subscription?.billingStatus ?? "—"}
          accent="emerald"
        />
        <BusinessMetricCard
          label="User limit"
          value={subscription?.userLimit != null ? String(subscription.userLimit) : "Unlimited"}
          accent="slate"
        />
        <BusinessMetricCard label="Country" value={org.country ?? "—"} accent="amber" />
      </div>
    </div>
  );
}
