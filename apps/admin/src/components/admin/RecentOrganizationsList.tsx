import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Eye, ExternalLink } from "lucide-react";
import { OrganizationAvatar } from "@/components/admin/OrganizationAvatar";
import { PlanBadge } from "@/components/admin/billing/PlanBadge";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_PANEL_HEIGHT } from "@/lib/dashboard-types";
import type { OrganizationSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RecentOrganizationsList({
  organizations,
  loading,
  activeRate,
}: {
  organizations: OrganizationSummary[];
  loading?: boolean;
  activeRate: number;
}) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.04)]",
        DASHBOARD_PANEL_HEIGHT,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-900">
            Recent organizations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeRate > 0 ? `${activeRate.toFixed(0)}% active tenants` : "Onboarded tenants only"}
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs" asChild>
          <Link to="/organizations">View all</Link>
        </Button>
      </div>

      {loading ? (
        <div className="min-h-0 flex-1 space-y-2 overflow-hidden p-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : organizations.length === 0 ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200/80">
            <Building2 className="h-7 w-7 text-slate-300" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-slate-900">No organizations yet</p>
          <p className="mt-1 max-w-[240px] text-xs text-slate-500">
            Approved tenants will appear here. Pending signups are in the queue.
          </p>
          <Button size="sm" className="mt-4 rounded-xl bg-blue-600 hover:bg-blue-700" asChild>
            <Link to="/organizations/new">New Organization</Link>
          </Button>
        </div>
      ) : (
        <ul className="min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto overscroll-contain px-2 py-2 [scrollbar-gutter:stable]">
          {organizations.map((org) => (
            <li
              key={org.id}
              className="flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 hover:bg-slate-50"
            >
              <Link to={`/organizations/${org.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                <OrganizationAvatar name={org.name} className="h-10 w-10 text-[11px] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{org.name}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <PlanBadge plan={org.subscriptionPlan} />
                    <StatusBadge status={org.status} />
                    <span className="text-[11px] text-slate-400">
                      {format(new Date(org.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </Link>
              <RowActionsMenu
                actions={[
                  {
                    label: "View organization",
                    icon: <Eye className="h-4 w-4" />,
                    onClick: () => navigate(`/organizations/${org.id}`),
                  },
                  {
                    label: "All organizations",
                    icon: <ExternalLink className="h-4 w-4" />,
                    onClick: () => navigate("/organizations"),
                  },
                ]}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
