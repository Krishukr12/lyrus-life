import { Link } from "react-router-dom";
import { Check, ClipboardList, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlanBadge } from "@/components/admin/billing/PlanBadge";
import { OrganizationAvatar } from "@/components/admin/OrganizationAvatar";
import { DASHBOARD_PANEL_HEIGHT } from "@/lib/dashboard-types";
import type { DashboardPendingRequest } from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";

export function PendingRequestsPanel({
  requests,
  loading,
}: {
  requests: DashboardPendingRequest[];
  loading?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_16px_rgba(15,23,42,0.05)]",
        DASHBOARD_PANEL_HEIGHT,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-amber-50/50 to-white px-5 py-4">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900">
            <ClipboardList className="h-4 w-4 text-amber-600" strokeWidth={1.75} />
            Pending approvals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Awaiting admin review</p>
        </div>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 tabular-nums">
          {loading ? "—" : requests.length}
        </span>
      </div>

      {loading ? (
        <div className="min-h-0 flex-1 space-y-2 overflow-hidden px-3 py-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <p className="text-sm font-medium text-slate-700">No pending approvals</p>
          <p className="mt-1 text-xs text-slate-500">
            New signup requests will appear here for review.
          </p>
        </div>
      ) : (
        <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-3 py-3 [scrollbar-gutter:stable]">
          {requests.map((req) => (
            <li
              key={req.id}
              className="rounded-xl border border-slate-100 bg-slate-50/30 p-3 transition-colors hover:border-slate-200 hover:bg-white"
            >
              <div className="flex items-start gap-3">
                <OrganizationAvatar name={req.org} className="h-9 w-9 shrink-0 text-[10px]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{req.org}</p>
                  <p className="truncate text-xs text-slate-500">{req.email}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <PlanBadge plan={req.plan} />
                    <span className="text-[11px] text-slate-400">{req.submitted}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Button
                  size="sm"
                  className="h-8 flex-1 rounded-lg bg-emerald-600 text-xs font-semibold hover:bg-emerald-700"
                  asChild
                >
                  <Link to={`/organizations/${req.id}`}>
                    <Check className="mr-1 h-3.5 w-3.5" />
                    Review
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 rounded-lg px-3 text-xs text-slate-600"
                  asChild
                >
                  <Link to={`/organizations/${req.id}`} title="View details">
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="shrink-0 border-t border-slate-100 bg-slate-50/30 px-4 py-3">
        <Button variant="ghost" size="sm" className="h-9 w-full rounded-xl font-medium text-slate-600" asChild>
          <Link to="/organizations?status=PENDING">View approval queue</Link>
        </Button>
      </div>
    </div>
  );
}
