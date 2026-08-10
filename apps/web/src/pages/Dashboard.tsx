import { useEffect, useMemo, useState, type ElementType } from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { getMeetings, getTasks } from "@/lib/api";
import {
  meetingDateKey,
  meetingTimeLabel,
  todayLocalDateKey,
} from "@/lib/datetime";
import { Meeting, UserTask } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, TagBadge } from "@/components/StatusBadge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  CalendarDays,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  ListChecks,
  FileText,
  Timer,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";
import { PendingMomAlert } from "@/components/PendingMomAlert";
import { useAuth } from "@/contexts/AuthContext";
import { filterMeetingsPendingMom, momEligibilityFromIntegrations } from "@/lib/mom-status";
import { getMyIntegrations } from "@/services/integrations-api";

function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function addDays(dateKey: string, days: number): string {
  const d = new Date(`${dateKey}T12:00:00`);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function shortWeekday(dateKey: string): string {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-US", { weekday: "short" });
}

function shortDay(dateKey: string): string {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function meetingSortKey(m: Meeting): number {
  if (m.scheduledAt) {
    const t = Date.parse(m.scheduledAt);
    if (!Number.isNaN(t)) return t;
  }
  const [h = "0", min = "0"] = meetingTimeLabel(m).split(":");
  return (
    Date.parse(
      `${meetingDateKey(m)}T${h.padStart(2, "0")}:${min.padStart(2, "0")}:00`,
    ) || 0
  );
}

const trendConfig = {
  meetings: { label: "Meetings", color: "hsl(var(--secondary))" },
  hours: { label: "Hours", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const loadConfig = {
  meetings: { label: "Meetings", color: "hsl(var(--secondary))" },
} satisfies ChartConfig;

const typeConfig = {
  internal: { label: "Internal", color: "hsl(var(--secondary))" },
  client: { label: "Client", color: "hsl(var(--warning))" },
  vendor: { label: "Vendor", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const taskConfig = {
  completed: { label: "Completed", color: "hsl(var(--success))" },
  in_progress: { label: "In progress", color: "hsl(var(--secondary))" },
  pending: { label: "Pending", color: "hsl(var(--warning))" },
  overdue: { label: "Overdue", color: "hsl(var(--destructive))" },
} satisfies ChartConfig;

export default function Dashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [momEligibility, setMomEligibility] = useState(() =>
    momEligibilityFromIntegrations([]),
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOrgAdmin = user?.role === "ORG_ADMIN";

  useEffect(() => {
    let cancelled = false;
    Promise.all([getMeetings(), getTasks(), getMyIntegrations().catch(() => null)])
      .then(([m, t, integrations]) => {
        if (cancelled) return;
        setMeetings(m);
        setTasks(t);
        if (integrations) {
          setMomEligibility(momEligibilityFromIntegrations(integrations.integrations));
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const today = todayLocalDateKey();

  const metrics = useMemo(() => {
    const todayMeetings = meetings.filter((m) => meetingDateKey(m) === today);
    const upcoming = meetings.filter((m) => m.status === "upcoming");
    const completed = meetings.filter((m) => m.status === "completed");
    const openTasks = tasks.filter((t) => t.status !== "completed");
    const overdueTasks = tasks.filter((t) => t.status === "overdue");
    const pendingMom = filterMeetingsPendingMom(meetings, momEligibility);
    const avgDuration = meetings.length
      ? Math.round(meetings.reduce((sum, m) => sum + m.duration, 0) / meetings.length)
      : 0;
    const momCoverage = meetings.length
      ? Math.round((meetings.filter((m) => m.mom).length / meetings.length) * 100)
      : 0;

    // Last 14 days volume + booked hours (trend only — not shown elsewhere)
    const trend = Array.from({ length: 14 }, (_, i) => {
      const date = addDays(today, i - 13);
      const dayMeetings = meetings.filter((m) => meetingDateKey(m) === date);
      return {
        date,
        label: shortDay(date),
        meetings: dayMeetings.length,
        hours: Math.round((dayMeetings.reduce((s, m) => s + m.duration, 0) / 60) * 10) / 10,
      };
    });

    // Next 7 days load (forward-looking — distinct from past trend)
    const weekLoad = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(today, i);
      return {
        date,
        label: i === 0 ? "Today" : shortWeekday(date),
        meetings: meetings.filter((m) => meetingDateKey(m) === date).length,
      };
    });

    const byTag = [
      {
        key: "internal",
        name: "Internal",
        value: meetings.filter((m) => m.tag === "internal").length,
        fill: "var(--color-internal)",
      },
      {
        key: "client",
        name: "Client",
        value: meetings.filter((m) => m.tag === "client").length,
        fill: "var(--color-client)",
      },
      {
        key: "vendor",
        name: "Vendor",
        value: meetings.filter((m) => m.tag === "vendor").length,
        fill: "var(--color-vendor)",
      },
    ].filter((row) => row.value > 0);

    const byTaskStatus = [
      {
        key: "completed",
        name: "Completed",
        value: tasks.filter((t) => t.status === "completed").length,
        fill: "var(--color-completed)",
      },
      {
        key: "in_progress",
        name: "In progress",
        value: tasks.filter((t) => t.status === "in_progress").length,
        fill: "var(--color-in_progress)",
      },
      {
        key: "pending",
        name: "Pending",
        value: tasks.filter((t) => t.status === "pending").length,
        fill: "var(--color-pending)",
      },
      {
        key: "overdue",
        name: "Overdue",
        value: overdueTasks.length,
        fill: "var(--color-overdue)",
      },
    ].filter((row) => row.value > 0);

    const nextMeetings = meetings
      .filter((m) => meetingDateKey(m) === today && m.status !== "completed")
      .sort((a, b) => meetingSortKey(a) - meetingSortKey(b))
      .slice(0, 6);

    const priorityTasks = tasks
      .filter((t) => t.status === "overdue" || t.status === "pending" || t.status === "in_progress")
      .sort((a, b) => {
        const rank = { overdue: 0, in_progress: 1, pending: 2 } as const;
        return (
          rank[a.status as keyof typeof rank] - rank[b.status as keyof typeof rank] ||
          a.deadline.localeCompare(b.deadline)
        );
      })
      .slice(0, 4);

    const ongoingCount = meetings.filter((m) => m.status === "ongoing").length;
    const uniqueStakeholders = new Set(
      meetings.flatMap((m) => m.stakeholders.map((s) => s.email.toLowerCase())),
    ).size;

    return {
      todayCount: todayMeetings.length,
      upcomingCount: upcoming.length,
      completedCount: completed.length,
      ongoingCount,
      openTaskCount: openTasks.length,
      overdueCount: overdueTasks.length,
      pendingMomCount: pendingMom.length,
      avgDuration,
      momCoverage,
      uniqueStakeholders,
      trend,
      weekLoad,
      byTag,
      byTaskStatus,
      nextMeetings,
      priorityTasks,
      totalMeetings: meetings.length,
      totalTasks: tasks.length,
    };
  }, [meetings, tasks, today, momEligibility]);

  const firstName = user?.name?.split(/\s+/)[0] ?? "there";
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const kpis = [
    {
      label: "Today",
      value: metrics.todayCount,
      hint: "On your calendar",
      icon: CalendarDays,
      tone: "bg-secondary/10 text-secondary",
      href: "/meetings",
    },
    {
      label: "Upcoming",
      value: metrics.upcomingCount,
      hint: "Still to run",
      icon: Clock,
      tone: "bg-warning/10 text-warning",
      href: "/meetings",
    },
    {
      label: "Open tasks",
      value: metrics.openTaskCount,
      hint:
        metrics.overdueCount > 0
          ? `${metrics.overdueCount} overdue`
          : "Action items open",
      icon: ListChecks,
      tone: "bg-primary/10 text-primary",
      href: "/tasks",
    },
    {
      label: "MOM pending",
      value: metrics.pendingMomCount,
      hint: `${metrics.momCoverage}% MOM coverage`,
      icon: FileText,
      tone: "bg-destructive/10 text-destructive",
      href: "/mom",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl">
        <div className="space-y-2">
          <div className="h-3.5 w-40 bg-muted rounded animate-pulse" />
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-80 bg-muted rounded-2xl animate-pulse lg:col-span-2" />
          <div className="h-80 bg-muted rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {todayLabel}
          </p>
          <h1 className="text-[26px] leading-tight font-heading font-bold mt-1">
            {greetingForHour(new Date().getHours())},{" "}
            <span className="text-gradient">{firstName}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {metrics.totalMeetings} meetings tracked · {metrics.totalTasks} tasks · avg{" "}
            {metrics.avgDuration}m
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/schedule")} variant="secondary" className="gap-2 shine">
            <Plus className="h-4 w-4" /> Schedule Meeting
          </Button>
          {isOrgAdmin && (
            <Button variant="outline" onClick={() => navigate("/insights")} className="gap-2">
              <TrendingUp className="h-4 w-4" /> Insights
            </Button>
          )}
        </div>
      </div>

      <PendingMomAlert meetings={meetings} eligibility={momEligibility} />

      {/* KPI strip — top-line counts only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
          >
            <Card
              className="stat-card h-full cursor-pointer transition-colors hover:bg-accent/30"
              onClick={() => navigate(kpi.href)}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(kpi.href);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  {kpi.label}
                </p>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${kpi.tone}`}>
                  <kpi.icon className="h-[18px] w-[18px]" />
                </div>
              </div>
              <p className="text-3xl font-heading font-bold tabular-nums mt-2">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
                {kpi.hint}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts — each panel answers a different question */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <h2 className="text-base font-heading font-semibold">Meeting activity</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Last 14 days — volume and booked hours
              </p>
            </div>
            <span className="text-[11px] text-muted-foreground rounded-full border border-border/60 px-2.5 py-1">
              Trend
            </span>
          </div>
          <ChartContainer config={trendConfig} className="mt-2 aspect-[2/1] w-full">
            <AreaChart data={metrics.trend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="fillMeetings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-meetings)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--color-meetings)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval="preserveStartEnd"
                minTickGap={28}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={28}
                allowDecimals={false}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Area
                type="monotone"
                dataKey="meetings"
                stroke="var(--color-meetings)"
                fill="url(#fillMeetings)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </Card>

        <Card className="p-5">
          <div className="mb-1">
            <h2 className="text-base font-heading font-semibold">Meeting mix</h2>
            <p className="text-xs text-muted-foreground mt-0.5">By audience type</p>
          </div>
          {metrics.byTag.length === 0 ? (
            <EmptyChart label="No meetings yet" />
          ) : (
            <>
              <ChartContainer config={typeConfig} className="mx-auto aspect-square max-h-[220px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                  <Pie
                    data={metrics.byTag}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={84}
                    strokeWidth={3}
                    paddingAngle={2}
                  >
                    {metrics.byTag.map((entry) => (
                      <Cell key={entry.key} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <ul className="mt-1 space-y-2">
                {metrics.byTag.map((row) => (
                  <li key={row.key} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: `var(--color-${row.key})` }}
                      />
                      {row.name}
                    </span>
                    <span className="font-heading font-semibold tabular-nums">{row.value}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="mb-1">
            <h2 className="text-base font-heading font-semibold">Week ahead</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Meetings per day · next 7 days</p>
          </div>
          <ChartContainer config={loadConfig} className="mt-2 aspect-[4/3] w-full">
            <BarChart data={metrics.weekLoad} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={24} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="meetings" fill="var(--color-meetings)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </Card>

        <Card className="p-5">
          <div className="mb-1">
            <h2 className="text-base font-heading font-semibold">Task pipeline</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Where action items sit</p>
          </div>
          {metrics.byTaskStatus.length === 0 ? (
            <EmptyChart label="No tasks yet" />
          ) : (
            <>
              <ChartContainer config={taskConfig} className="mx-auto aspect-square max-h-[200px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                  <Pie
                    data={metrics.byTaskStatus}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={76}
                    strokeWidth={3}
                    paddingAngle={2}
                  >
                    {metrics.byTaskStatus.map((entry) => (
                      <Cell key={entry.key} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <ul className="mt-1 space-y-2">
                {metrics.byTaskStatus.map((row) => (
                  <li key={row.key} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: `var(--color-${row.key})` }}
                      />
                      {row.name}
                    </span>
                    <span className="font-heading font-semibold tabular-nums">{row.value}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        <Card className="p-5 flex flex-col">
          <div className="mb-4">
            <h2 className="text-base font-heading font-semibold">Workspace pulse</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Signals not shown in the charts</p>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <PulseTile
              icon={CheckCircle2}
              label="Completed"
              value={metrics.completedCount}
              tone="bg-success/10 text-success"
            />
            <PulseTile
              icon={Timer}
              label="Avg duration"
              value={`${metrics.avgDuration}m`}
              tone="bg-primary/10 text-primary"
            />
            <PulseTile
              icon={Video}
              label="Live now"
              value={metrics.ongoingCount}
              tone="bg-secondary/10 text-secondary"
            />
            <PulseTile
              icon={Users}
              label="Stakeholders"
              value={metrics.uniqueStakeholders}
              tone="bg-warning/10 text-warning"
            />
          </div>
        </Card>
      </div>

      {/* Compact actionable lists — no metric reprise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-heading font-semibold flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                <Video className="h-3.5 w-3.5" />
              </span>
              Next up for today
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/meetings")}
              className="gap-1 text-muted-foreground"
            >
              Today <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          {metrics.nextMeetings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-center">
              <CalendarDays className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No more meetings today</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 gap-1.5"
                onClick={() => navigate("/schedule")}
              >
                <Plus className="h-3.5 w-3.5" /> Schedule
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {metrics.nextMeetings.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => navigate(`/meetings/${m.id}`)}
                  className="group/row w-full flex items-center gap-3 py-3 text-left rounded-lg px-1.5 -mx-1.5 transition-colors hover:bg-accent/40"
                >
                  <div className="w-14 shrink-0">
                    <p className="text-sm font-heading font-semibold tabular-nums">
                      {meetingTimeLabel(m)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{m.duration}m</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{m.title}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {m.stakeholders.length} participant
                      {m.stakeholders.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <TagBadge tag={m.tag} />
                  <StatusBadge status={m.status} />
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/0 group-hover/row:text-muted-foreground transition-colors" />
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-heading font-semibold flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                <ListChecks className="h-3.5 w-3.5" />
              </span>
              Priority tasks
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/tasks")}
              className="gap-1 text-muted-foreground"
            >
              Board <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          {metrics.priorityTasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-center">
              <ListChecks className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No open action items</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {metrics.priorityTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => navigate(`/meetings/${task.meetingId}`)}
                  className="group/row w-full flex items-start gap-3 py-3 text-left rounded-lg px-1.5 -mx-1.5 transition-colors hover:bg-accent/40"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium leading-snug line-clamp-2">
                      {task.task}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground truncate">
                      {task.meetingTitle}
                    </span>
                  </span>
                  <TaskStatusChip status={task.status} />
                  <ArrowUpRight className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground/0 group-hover/row:text-muted-foreground transition-colors" />
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

function PulseTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: ElementType;
  label: string;
  value: string | number;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 px-3.5 py-3.5">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xl font-heading font-bold tabular-nums mt-3">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function TaskStatusChip({ status }: { status: UserTask["status"] }) {
  const styles: Record<UserTask["status"], string> = {
    overdue: "bg-destructive/10 text-destructive border-destructive/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    in_progress: "bg-secondary/10 text-secondary border-secondary/20",
    completed: "bg-success/10 text-success border-success/20",
  };
  const labels: Record<UserTask["status"], string> = {
    overdue: "Overdue",
    pending: "Pending",
    in_progress: "Active",
    completed: "Done",
  };
  return (
    <span
      className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
