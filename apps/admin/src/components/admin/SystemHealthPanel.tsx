import type { LucideIcon } from "lucide-react";
import { Activity, Database, HardDrive, Mail, Radio, Server } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DASHBOARD_INSIGHT_HEIGHT,
  type DashboardHealthService,
  type DashboardPayload,
} from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";

type HealthStatus = "healthy" | "monitoring" | "down";

const ICONS: Record<string, LucideIcon> = {
  API: Server,
  Database: Database,
  LiveKit: Radio,
  Jobs: Activity,
  Storage: HardDrive,
  Email: Mail,
};

const statusDot: Record<HealthStatus, string> = {
  healthy: "bg-emerald-500",
  monitoring: "bg-amber-400",
  down: "bg-red-500",
};

const statusText: Record<HealthStatus, string> = {
  healthy: "text-emerald-700",
  monitoring: "text-amber-700",
  down: "text-red-700",
};

export function SystemHealthPanel({
  services,
  allOperational,
  livekit,
  loading,
}: {
  services?: DashboardHealthService[];
  allOperational?: boolean;
  livekit?: DashboardPayload["livekit"];
  loading?: boolean;
}) {
  const operational = allOperational ?? false;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        DASHBOARD_INSIGHT_HEIGHT,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight text-slate-900">Platform health</h2>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
            operational
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700",
          )}
        >
          {operational ? "Operational" : "Check status"}
        </span>
      </div>

      {loading ? (
        <div className="min-h-0 flex-1 space-y-2 overflow-hidden p-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 [scrollbar-gutter:stable]">
          <ul className="space-y-1.5">
            {(services ?? []).map((s) => {
              const Icon = ICONS[s.name] ?? Server;
              return (
                <li
                  key={s.name}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2.5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200/80">
                    <Icon className="h-4 w-4 text-slate-500" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-900">{s.name}</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", statusDot[s.status])} />
                      <span className={cn("truncate text-[11px] font-medium", statusText[s.status])}>
                        {s.label}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {livekit ? (
            <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                LiveKit
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Rooms</dt>
                  <dd className="font-semibold tabular-nums text-slate-900">{livekit.activeRooms}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Participants</dt>
                  <dd className="font-semibold tabular-nums text-slate-900">
                    {livekit.activeParticipants}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Ongoing</dt>
                  <dd className="font-semibold tabular-nums text-slate-900">
                    {livekit.ongoingMeetings}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500">Webhooks</dt>
                  <dd className="font-semibold text-slate-900">
                    {livekit.webhookConfigured ? "On" : "Off"}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
