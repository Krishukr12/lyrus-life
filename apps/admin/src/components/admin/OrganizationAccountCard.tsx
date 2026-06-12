import { format } from "date-fns";
import { Building2, Calendar, Globe, IndianRupee, MapPin } from "lucide-react";
import { OrganizationAvatar } from "@/components/admin/OrganizationAvatar";
import { PlanBadge } from "@/components/admin/billing/PlanBadge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatInr } from "@/lib/format-inr";
import type { OrganizationSummary } from "@/lib/types";
import type { OrganizationDetail } from "@/lib/org-types";
import { cn } from "@/lib/utils";

function CompactStat({
  label,
  value,
  icon: Icon,
  accent = "slate",
}: {
  label: string;
  value: string;
  icon?: typeof IndianRupee;
  accent?: "blue" | "emerald" | "slate" | "violet";
}) {
  const accentStyles = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-50 text-slate-500",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-100/80 bg-slate-50/40 px-3 py-2">
      {Icon ? (
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
            accentStyles[accent],
          )}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
        </div>
      ) : null}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold tabular-nums text-slate-900">{value}</p>
        <p className="truncate text-[10px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}

export function OrganizationAccountCard({
  org,
  subscription,
}: {
  org: OrganizationSummary;
  usage?: { totalEmployees: number; activeEmployees: number; totalMeetings: number };
  subscription?: OrganizationDetail["subscription"];
}) {
  const location = [org.city, org.state, org.country].filter(Boolean).join(", ");
  const mrr = subscription?.monthlyAmountInr;

  return (
    <div className="mb-6 overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-sm">
      <div className="p-5 sm:p-6">
        <div className="flex min-w-0 gap-3.5 sm:gap-4">
          <OrganizationAvatar
            name={org.name}
            className="h-11 w-11 shrink-0 rounded-xl text-sm shadow-sm sm:h-12 sm:w-12"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                {org.name}
              </h1>
              <StatusBadge status={org.status} />
              <PlanBadge plan={org.subscriptionPlan} />
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {org.code ? `${org.code} · ` : ""}
              {org.slug}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
              {org.country ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {org.country}
                </span>
              ) : null}
              {org.timezone ? (
                <span className="inline-flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  {org.timezone}
                </span>
              ) : null}
              {org.industry ? (
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  {org.industry}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Since {format(new Date(org.createdAt), "MMM d, yyyy")}
              </span>
            </div>
            {location ? <p className="mt-1.5 text-xs text-slate-400">{location}</p> : null}
          </div>
        </div>
      </div>

      {subscription ? (
        <div className="grid grid-cols-2 gap-2 border-t border-slate-100 bg-slate-50/30 p-4 sm:grid-cols-3 sm:gap-3">
          <CompactStat
            label="Monthly revenue"
            value={mrr != null ? formatInr(mrr) : "—"}
            icon={IndianRupee}
            accent="blue"
          />
          <CompactStat
            label="Billing status"
            value={subscription.billingStatus}
            accent="emerald"
          />
          <CompactStat
            label="Billing cycle"
            value={subscription.billingCycle}
            accent="slate"
          />
        </div>
      ) : null}
    </div>
  );
}
