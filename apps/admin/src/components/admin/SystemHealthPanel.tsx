import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Database,
  HardDrive,
  Mail,
  Radio,
  Server,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DASHBOARD_INSIGHT_HEIGHT,
  type DashboardHealthService,
  type DashboardPayload,
  type HealthStatus,
} from "@/lib/dashboard-types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  API: Server,
  Database: Database,
  LiveKit: Radio,
  Jobs: Activity,
  Storage: HardDrive,
  Email: Mail,
};

const statusStyles: Record<
  HealthStatus,
  { dot: string; pill: string; icon: string }
> = {
  healthy: {
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-600",
    icon: "bg-emerald-50 text-emerald-600",
  },
  monitoring: {
    dot: "bg-amber-400",
    pill: "bg-amber-50 text-amber-600",
    icon: "bg-amber-50 text-amber-600",
  },
  down: {
    dot: "bg-red-500",
    pill: "bg-red-50 text-red-600",
    icon: "bg-red-50 text-red-600",
  },
};

function HealthServiceRow({ service }: { service: DashboardHealthService }) {
  const Icon = ICONS[service.name] ?? Server;
  const styles = statusStyles[service.status];

  return (
    <li className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          styles.icon,
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{service.name}</p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", styles.dot)} />
          <span className="truncate text-xs text-slate-500">{service.label}</span>
        </div>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize",
          styles.pill,
        )}
      >
        {service.status === "healthy" ? "Healthy" : service.status}
      </span>
    </li>
  );
}

function LiveKitMetrics({ livekit }: { livekit: NonNullable<DashboardPayload["livekit"]> }) {
  const metrics = [
    { label: "Rooms", value: livekit.activeRooms },
    { label: "Participants", value: livekit.activeParticipants },
    { label: "Ongoing", value: livekit.ongoingMeetings },
    { label: "Webhooks", value: livekit.webhookConfigured ? "On" : "Off" },
  ];

  return (
    <div className="mt-4 rounded-2xl bg-[#3B82F6] p-4 text-white">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
            <Radio className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-semibold">LiveKit</p>
        </div>
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
          {livekit.configured ? "Connected" : "Not configured"}
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl bg-white/15 px-3 py-2.5 backdrop-blur-sm"
          >
            <dt className="text-[10px] font-medium uppercase tracking-wide text-white/70">
              {metric.label}
            </dt>
            <dd className="mt-0.5 text-lg font-bold tabular-nums leading-none">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

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
  const serviceList = services ?? [];
  const healthyCount = serviceList.filter((s) => s.status === "healthy").length;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[28px] border border-slate-100/80 bg-white",
        "shadow-[0_4px_24px_rgba(15,23,42,0.06)]",
        DASHBOARD_INSIGHT_HEIGHT,
      )}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 px-6 py-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold tracking-tight text-slate-900">
              Platform health
            </h2>
            {!loading && serviceList.length > 0 ? (
              <p className="mt-0.5 text-xs text-slate-400">
                {healthyCount} of {serviceList.length} services healthy
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!loading ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                operational
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600",
              )}
            >
              {operational ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Operational
                </>
              ) : (
                <>
                  <TrendingUp className="h-3 w-3 rotate-180" />
                  Check status
                </>
              )}
            </span>
          ) : null}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="min-h-0 flex-1 space-y-3 overflow-hidden px-6 pb-6">
          <Skeleton className="h-14 w-full rounded-2xl" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 [scrollbar-gutter:stable]">
          {operational ? (
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-emerald-800">All systems operational</p>
                <p className="text-xs text-emerald-600/80">No incidents reported</p>
              </div>
            </div>
          ) : (
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <Activity className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-amber-800">Attention needed</p>
                <p className="text-xs text-amber-600/80">Review services below</p>
              </div>
            </div>
          )}

          <ul className="divide-y divide-slate-100">
            {serviceList.map((service) => (
              <HealthServiceRow key={service.name} service={service} />
            ))}
          </ul>

          {livekit ? <LiveKitMetrics livekit={livekit} /> : null}
        </div>
      )}
    </div>
  );
}
