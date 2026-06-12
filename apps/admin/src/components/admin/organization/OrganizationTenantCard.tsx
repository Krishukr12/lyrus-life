import { format } from "date-fns";
import {
  ArrowUpRight,
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
        "group relative overflow-hidden rounded-[28px] border border-slate-100/80 bg-white p-6",
        "shadow-[0_4px_24px_rgba(15,23,42,0.06)] transition-all duration-300",
        "hover:shadow-[0_8px_32px_rgba(15,23,42,0.08)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Link to={`/organizations/${org.id}`} className="flex min-w-0 flex-1 items-start gap-3">
          <OrganizationAvatar
            name={org.name}
            className="h-11 w-11 rounded-2xl text-sm shadow-sm"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
                {org.name}
              </h3>
              <StatusBadge status={org.status} />
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-400">{org.slug}</p>
          </div>
        </Link>
        <Link
          to={`/organizations/${org.id}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PlanBadge plan={org.subscriptionPlan} />
        {org.industry ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
            <Building2 className="h-3 w-3" />
            {org.industry}
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCell icon={Users} label="Employees" value={String(employees)} accent="blue" />
        <MetricCell icon={Video} label="Meetings" value={String(meetings)} accent="violet" />
        <MetricCell
          icon={IndianRupee}
          label="MRR"
          value={monthlyRevenueInr != null ? formatInr(monthlyRevenueInr) : "—"}
          accent="emerald"
        />
        <MetricCell
          icon={Calendar}
          label="Created"
          value={format(new Date(org.createdAt), "MMM d, yyyy")}
          accent="slate"
          compact
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        <Button
          size="sm"
          variant="outline"
          className="h-8 rounded-full border-slate-200/80 px-3 text-xs font-medium hover:border-blue-200 hover:bg-blue-50/50"
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
          className="h-8 rounded-full border-slate-200/80 px-3 text-xs font-medium hover:border-slate-300 hover:bg-slate-50"
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
            "h-8 rounded-full px-3 text-xs font-medium",
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
          className="h-8 rounded-full border-slate-200/80 px-3 text-xs font-medium hover:border-violet-200 hover:bg-violet-50/50"
          asChild
        >
          <Link to={`/organizations/${org.id}?tab=subscription`}>
            <CreditCard className="mr-1.5 h-3.5 w-3.5" />
            Billing
          </Link>
        </Button>
      </div>
    </article>
  );
}

const metricAccent = {
  blue: "bg-blue-50 text-blue-600",
  violet: "bg-violet-50 text-violet-600",
  emerald: "bg-emerald-50 text-emerald-600",
  slate: "bg-slate-50 text-slate-500",
} as const;

function MetricCell({
  icon: Icon,
  label,
  value,
  accent = "slate",
  compact,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  accent?: keyof typeof metricAccent;
  compact?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-100/80 bg-white px-3 py-3 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-xl",
          metricAccent[accent],
        )}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      </div>
      <p
        className={cn(
          "mt-2 font-bold tabular-nums text-slate-900",
          compact ? "text-xs" : "text-sm",
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[10px] font-medium text-slate-400">{label}</p>
    </div>
  );
}
