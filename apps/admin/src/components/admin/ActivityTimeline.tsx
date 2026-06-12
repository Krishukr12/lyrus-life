import {
  Building2,
  CreditCard,
  LogIn,
  UserPlus,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DASHBOARD_PANEL_HEIGHT } from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";

export type ActivityItem = {
  id: string;
  detail: string;
  action: string;
  time: string;
};

function iconForAction(action: string): { icon: LucideIcon; color: string } {
  if (action.includes("organization"))
    return { icon: Building2, color: "bg-blue-500/10 text-blue-600 ring-blue-500/20" };
  if (action.includes("user") || action.includes("invite"))
    return { icon: UserPlus, color: "bg-violet-500/10 text-violet-600 ring-violet-500/20" };
  if (action.includes("billing"))
    return { icon: CreditCard, color: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20" };
  if (action.includes("meeting"))
    return { icon: Video, color: "bg-amber-500/10 text-amber-600 ring-amber-500/20" };
  if (action.includes("auth") || action.includes("login"))
    return { icon: LogIn, color: "bg-slate-500/10 text-slate-600 ring-slate-500/20" };
  return { icon: Building2, color: "bg-slate-500/10 text-slate-600 ring-slate-500/20" };
}

function formatActionLabel(action: string): string {
  const map: Record<string, string> = {
    "organization.activated": "Activated",
    "organization.suspended": "Suspended",
    "organization.updated": "Updated",
    "user.created": "Invite",
    "user.activated": "User",
    "billing.updated": "Billing",
    "meeting.started": "Live",
    "meeting.ended": "Ended",
  };
  return map[action] ?? action.split(".").pop() ?? action;
}

export function ActivityTimeline({
  items,
  loading,
  footer,
}: {
  items: ActivityItem[];
  loading?: boolean;
  footer?: string;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {loading ? (
        <div className="space-y-4 overflow-hidden p-5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <p className="text-sm font-medium text-slate-700">No recent activity</p>
          <p className="mt-1 text-xs text-slate-500">
            User, meeting, and billing events will appear here.
          </p>
        </div>
      ) : (
        <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-3 py-2 [scrollbar-gutter:stable]">
          {items.map((item, i) => {
            const { icon: ActionIcon, color } = iconForAction(item.action);
            return (
              <li
                key={item.id}
                className="relative flex gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-slate-50/80"
              >
                {i < items.length - 1 ? (
                  <span className="absolute left-[1.35rem] top-11 bottom-0 w-px bg-slate-200" />
                ) : null}
                <div
                  className={cn(
                    "relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1",
                    color,
                  )}
                >
                  <ActionIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900 leading-snug">{item.detail}</p>
                    <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      {formatActionLabel(item.action)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">{item.time}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {footer ? (
        <p className="shrink-0 border-t border-slate-100 px-5 py-2.5 text-xs text-slate-400">
          {footer}
        </p>
      ) : null}
    </div>
  );
}

export function ActivityPanel({
  title,
  items,
  loading,
  footer,
  icon: Icon,
}: {
  title: string;
  items: ActivityItem[];
  loading?: boolean;
  footer?: string;
  icon?: LucideIcon;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.04)]",
        DASHBOARD_PANEL_HEIGHT,
      )}
    >
      <div className="shrink-0 border-b border-slate-100 px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900">
          {Icon ? <Icon className="h-4 w-4 text-slate-400" strokeWidth={1.75} /> : null}
          {title}
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Operational events — not sign-ins or new org signups
        </p>
      </div>
      <ActivityTimeline items={items} loading={loading} footer={footer} />
    </div>
  );
}
