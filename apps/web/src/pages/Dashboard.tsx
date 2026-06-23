import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMeetings, getTasks } from "@/lib/api";
import { Meeting, UserTask } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, TagBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Users,
  TrendingUp,
  Target,
  AlertTriangle,
  CircleCheckBig,
  Briefcase,
  Timer,
  Video,
} from "lucide-react";
import { motion } from "framer-motion";
import { PendingMomAlert } from "@/components/PendingMomAlert";
import { useAuth } from "@/contexts/AuthContext";

function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** Compact SVG completion ring for the task health panel. */
function CompletionRing({ value }: { value: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;

  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 84 84" className="h-full w-full -rotate-90">
        <circle cx="42" cy="42" r={radius} fill="none" strokeWidth="8" className="stroke-muted" />
        <motion.circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className="stroke-secondary"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.21, 0.6, 0.35, 1], delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-heading font-bold tabular-nums leading-none">{value}%</span>
        <span className="text-[10px] text-muted-foreground mt-0.5">done</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOrgAdmin = user?.role === "ORG_ADMIN";

  useEffect(() => {
    Promise.all([getMeetings(), getTasks()]).then(([m, t]) => {
      setMeetings(m);
      setTasks(t);
      setLoading(false);
    });
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const nextWeekDate = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
  const todayMeetings = meetings.filter((m) => m.date === today);
  const nextSevenDaysMeetings = meetings.filter((m) => m.date >= today && m.date <= nextWeekDate);
  const upcoming = meetings.filter((m) => m.status === "upcoming");
  const completed = meetings.filter((m) => m.status === "completed");
  const ongoing = meetings.filter((m) => m.status === "ongoing");
  const completionRate = meetings.length ? Math.round((completed.length / meetings.length) * 100) : 0;
  const avgDuration = meetings.length ? Math.round(meetings.reduce((sum, m) => sum + m.duration, 0) / meetings.length) : 0;
  const participantsThisWeek = nextSevenDaysMeetings.reduce((sum, m) => sum + m.stakeholders.length, 0);

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending" || t.status === "in_progress").length;
  const overdueTasks = tasks.filter((t) => t.status === "overdue").length;
  const taskCompletionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const byTag = {
    internal: meetings.filter((m) => m.tag === "internal").length,
    client: meetings.filter((m) => m.tag === "client").length,
    vendor: meetings.filter((m) => m.tag === "vendor").length,
  };
  const maxTagCount = Math.max(byTag.internal, byTag.client, byTag.vendor, 1);
  const highLoadDays = nextSevenDaysMeetings.reduce<Record<string, number>>((acc, meeting) => {
    acc[meeting.date] = (acc[meeting.date] ?? 0) + 1;
    return acc;
  }, {});
  const busiest = Object.entries(highLoadDays).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    {
      label: "Today's Meetings",
      value: todayMeetings.length,
      icon: CalendarDays,
      iconBg: "bg-secondary/10 text-secondary",
      hint: "Live focus",
    },
    {
      label: "Upcoming",
      value: upcoming.length,
      icon: Clock,
      iconBg: "bg-warning/10 text-warning",
      hint: "Needs preparation",
    },
    {
      label: "Completed",
      value: completed.length,
      icon: CheckCircle2,
      iconBg: "bg-success/10 text-success",
      hint: `${completionRate}% completion`,
    },
    {
      label: "Avg Duration",
      value: `${avgDuration}m`,
      icon: Timer,
      iconBg: "bg-primary/10 text-primary",
      hint: "Across all meetings",
    },
  ];

  const firstName = user?.name?.split(/\s+/)[0] ?? "there";
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl">
        <div className="space-y-2">
          <div className="h-3.5 w-40 bg-muted rounded animate-pulse" />
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-72 bg-muted rounded-2xl animate-pulse lg:col-span-2" />
          <div className="h-72 bg-muted rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-6xl">
      {/* Greeting header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{todayLabel}</p>
          <h1 className="text-[26px] leading-tight font-heading font-bold mt-1">
            {greetingForHour(new Date().getHours())}, <span className="text-gradient">{firstName}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {todayMeetings.length > 0
              ? `You have ${todayMeetings.length} meeting${todayMeetings.length === 1 ? "" : "s"} today and ${pendingTasks} open task${pendingTasks === 1 ? "" : "s"}.`
              : `No meetings today — ${pendingTasks} open task${pendingTasks === 1 ? "" : "s"} to follow up on.`}
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

      <PendingMomAlert meetings={meetings} />

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.21, 0.6, 0.35, 1] }}
          >
            <Card className="stat-card h-full">
              <div className="flex items-start justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{s.label}</p>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.iconBg}`}>
                  <s.icon className="h-[18px] w-[18px]" />
                </div>
              </div>
              <p className="text-3xl font-heading font-bold tabular-nums mt-2">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">{s.hint}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Performance strip */}
      <Card className="px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:divide-x md:divide-border/60">
          <div>
            <div className="flex items-baseline justify-between">
              <p className="text-xs font-medium text-muted-foreground">Meeting Completion</p>
              <p className="text-lg font-heading font-semibold tabular-nums">{completionRate}%</p>
            </div>
            <Progress value={completionRate} className="h-1.5 mt-3" />
          </div>
          <div className="md:pl-6">
            <div className="flex items-baseline justify-between">
              <p className="text-xs font-medium text-muted-foreground">Task Completion</p>
              <p className="text-lg font-heading font-semibold tabular-nums">{taskCompletionRate}%</p>
            </div>
            <Progress value={taskCompletionRate} className="h-1.5 mt-3" />
          </div>
          <div className="md:pl-6">
            <p className="text-xs font-medium text-muted-foreground">Busiest Day · Next 7 Days</p>
            <p className="text-lg font-heading font-semibold mt-1">
              {busiest ? busiest[0] : "No meetings"}
              {busiest && (
                <span className="ml-2 align-middle inline-flex items-center rounded-full bg-secondary/10 text-secondary text-xs font-semibold px-2 py-0.5">
                  {busiest[1]} meeting{busiest[1] === 1 ? "" : "s"}
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Use this to pre-allocate resources.</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-heading font-semibold flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <TrendingUp className="h-3.5 w-3.5" />
                </span>
                Weekly Planning Insight
              </h2>
              <span className="text-xs text-muted-foreground rounded-full border border-border/60 px-2.5 py-1">Next 7 days</span>
            </div>

            <div className="mt-5 grid grid-cols-3 divide-x divide-border/60 rounded-xl border border-border/60 bg-muted/20">
              <div className="px-4 py-3.5">
                <p className="text-[11px] text-muted-foreground">Meetings Planned</p>
                <p className="text-2xl font-heading font-semibold tabular-nums mt-0.5">{nextSevenDaysMeetings.length}</p>
              </div>
              <div className="px-4 py-3.5">
                <p className="text-[11px] text-muted-foreground">Participants Impacted</p>
                <p className="text-2xl font-heading font-semibold tabular-nums mt-0.5">{participantsThisWeek}</p>
              </div>
              <div className="px-4 py-3.5">
                <p className="text-[11px] text-muted-foreground">Active Meetings</p>
                <p className="text-2xl font-heading font-semibold tabular-nums mt-0.5">{ongoing.length}</p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium">Mix by Meeting Type</p>
              <div className="space-y-3.5 mt-4">
                {[
                  { key: "Internal", value: byTag.internal, color: "bg-secondary" },
                  { key: "Client", value: byTag.client, color: "bg-warning" },
                  { key: "Vendor", value: byTag.vendor, color: "bg-primary" },
                ].map((row, i) => (
                  <div key={row.key}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium">{row.key}</span>
                      <span className="text-muted-foreground tabular-nums">{row.value}</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${row.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round((row.value / maxTagCount) * 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: [0.21, 0.6, 0.35, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Today's schedule */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-heading font-semibold flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <Video className="h-3.5 w-3.5" />
                </span>
                Today's Meetings
              </h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/meetings")} className="gap-1 text-muted-foreground">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {todayMeetings.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">
                <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No meetings scheduled for today</p>
                <Button variant="outline" size="sm" className="mt-4 gap-1.5" onClick={() => navigate("/schedule")}>
                  <Plus className="h-3.5 w-3.5" /> Schedule one
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {todayMeetings.map((m, i) => (
                  <motion.button
                    key={m.id}
                    type="button"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group/row w-full flex items-center gap-4 py-3.5 text-left rounded-lg px-2 -mx-2 transition-colors hover:bg-accent/40"
                    onClick={() => navigate(`/meetings/${m.id}`)}
                  >
                    <div className="w-14 shrink-0 text-center">
                      <p className="text-sm font-heading font-semibold tabular-nums">{m.time}</p>
                      <p className="text-[10px] text-muted-foreground">{m.duration}min</p>
                    </div>
                    <div className="w-px self-stretch bg-border/70 group-hover/row:bg-secondary/50 transition-colors" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{m.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Users className="h-3 w-3" /> {m.stakeholders.length} participant{m.stakeholders.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <TagBadge tag={m.tag} />
                      <StatusBadge status={m.status} />
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/0 group-hover/row:text-muted-foreground transition-colors" />
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-base font-heading font-semibold flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                <Target className="h-3.5 w-3.5" />
              </span>
              Task Health
            </h2>

            <div className="flex items-center gap-5 mt-5">
              <CompletionRing value={taskCompletionRate} />
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {completedTasks} of {tasks.length || 0} tasks done
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Action items extracted from meeting MOMs across your workspace.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 mt-5">
              {[
                { label: "Completed", value: completedTasks, icon: CircleCheckBig, tone: "bg-success/10 text-success" },
                { label: "Pending / In Progress", value: pendingTasks, icon: Briefcase, tone: "bg-warning/10 text-warning" },
                { label: "Overdue", value: overdueTasks, icon: AlertTriangle, tone: "bg-destructive/10 text-destructive" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="rounded-xl border border-border/60 px-3.5 py-2.5 flex items-center justify-between transition-colors hover:bg-muted/30"
                >
                  <span className="text-sm text-muted-foreground flex items-center gap-2.5">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${row.tone}`}>
                      <row.icon className="h-3.5 w-3.5" />
                    </span>
                    {row.label}
                  </span>
                  <span className="font-heading font-semibold tabular-nums">{row.value}</span>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-5 gap-1.5" onClick={() => navigate("/tasks")}>
              Go to Task Board <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Card>

          <Card className="p-2">
            {[
              { label: "View Calendar", desc: "Plan the week ahead", icon: CalendarDays, to: "/calendar" },
              { label: "Open Meetings", desc: "Browse all meetings", icon: Users, to: "/meetings" },
              ...(isOrgAdmin
                ? [{ label: "Platform Insights", desc: "Execution analytics", icon: TrendingUp, to: "/insights" }]
                : []),
            ].map((item) => (
              <button
                key={item.to}
                type="button"
                onClick={() => navigate(item.to)}
                className="group/link w-full flex items-center gap-3 rounded-lg px-3.5 py-3 text-left transition-colors hover:bg-accent/50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover/link:bg-secondary/10 group-hover/link:text-secondary">
                  <item.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="block text-xs text-muted-foreground">{item.desc}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover/link:text-secondary group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </button>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
