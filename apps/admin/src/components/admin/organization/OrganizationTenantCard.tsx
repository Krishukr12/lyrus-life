import { format } from "date-fns";
import {
  Building2,
  Calendar,
  CreditCard,
  Edit3,
  Eye,
  IndianRupee,
  PauseCircle,
  Users,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";
import { OrganizationAvatar } from "@/components/admin/OrganizationAvatar";
import { PlanBadge } from "@/components/admin/billing/PlanBadge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatInr } from "@/lib/format-inr";
import type { OrganizationSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

type OrganizationTenantCardProps = {
  org: OrganizationSummary;
  monthlyRevenueInr?: number | null;
  onSuspend: () => void;
  onActivate: () => void;
};

export function OrganizationTenantCard({
  org,
  monthlyRevenueInr,
  onSuspend,
  onActivate,
}: OrganizationTenantCardProps) {
  const employees = org.counts?.users ?? 0;
  const meetings = org.counts?.meetings ?? 0;
  const isSuspended = org.status === "SUSPENDED";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[22px] border border-slate-200/80 bg-white",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]",
        "transition-all duration-300 hover:-translate-y-1 hover:border-slate-300/90",
        "hover:shadow-[0_12px_40px_rgba(15,23,42,0.10)]",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500/80 via-indigo-500/80 to-violet-500/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <Link to={`/organizations/${org.id}`} className="flex min-w-0 flex-1 items-start gap-4">
            <OrganizationAvatar
              name={org.name}
              className="h-12 w-12 rounded-2xl text-sm shadow-sm ring-2 ring-white transition-transform duration-300 group-hover:scale-105"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-base font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
                  {org.name}
                </h3>
                <StatusBadge status={org.status} />
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-500">{org.slug}</p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <PlanBadge plan={org.subscriptionPlan} />
                {org.industry ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                    <Building2 className="h-3 w-3" />
                    {org.industry}
                  </span>
                ) : null}
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCell icon={Users} label="Employees" value={String(employees)} />
          <MetricCell icon={Video} label="Meetings" value={String(meetings)} />
          <MetricCell
            icon={IndianRupee}
            label="MRR"
            value={monthlyRevenueInr != null ? formatInr(monthlyRevenueInr) : "—"}
          />
          <MetricCell
            icon={Calendar}
            label="Created"
            value={format(new Date(org.createdAt), "MMM d, yyyy")}
            compact
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-xl border-slate-200/80 text-xs font-medium hover:border-blue-200 hover:bg-blue-50/50"
            asChild
          >
            <Link to={`/organizations/${org.id}`}>
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              View
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-xl border-slate-200/80 text-xs font-medium hover:border-slate-300 hover:bg-slate-50"
            asChild
          >
            <Link to={`/organizations/${org.id}?tab=settings`}>
              <Edit3 className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={cn(
              "h-8 rounded-xl text-xs font-medium",
              isSuspended
                ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                : "border-amber-200 text-amber-700 hover:bg-amber-50",
            )}
            onClick={isSuspended ? onActivate : onSuspend}
          >
            <PauseCircle className="mr-1.5 h-3.5 w-3.5" />
            {isSuspended ? "Activate" : "Suspend"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-xl border-slate-200/80 text-xs font-medium hover:border-violet-200 hover:bg-violet-50/50"
            asChild
          >
            <Link to={`/organizations/${org.id}?tab=subscription`}>
              <CreditCard className="mr-1.5 h-3.5 w-3.5" />
              Billing
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function MetricCell({
  icon: Icon,
  label,
  value,
  compact,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5 transition-colors duration-200 group-hover:bg-slate-50">
      <div className="flex items-center gap-1.5 text-slate-400">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
        <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p
        className={cn(
          "mt-1 font-semibold tabular-nums text-slate-900",
          compact ? "text-xs" : "text-sm",
        )}
      >
        {value}
      </p>
    </div>
  );
}
