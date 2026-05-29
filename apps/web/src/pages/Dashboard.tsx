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
  Users,
  TrendingUp,
  Target,
  AlertTriangle,
  CircleCheckBig,
  Briefcase,
  Timer,
} from "lucide-react";
import { motion } from "framer-motion";
import { PendingMomAlert } from "@/components/PendingMomAlert";

export default function Dashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    { label: "Today's Meetings", value: todayMeetings.length, icon: CalendarDays, color: "text-secondary", hint: "Live focus" },
    { label: "Upcoming", value: upcoming.length, icon: Clock, color: "text-warning", hint: "Needs preparation" },
    { label: "Completed", value: completed.length, icon: CheckCircle2, color: "text-success", hint: `${completionRate}% completion` },
    { label: "Avg Duration", value: `${avgDuration}m`, icon: Timer, color: "text-primary", hint: "Across all meetings" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="rounded-2xl border bg-gradient-to-r from-secondary/15 via-secondary/5 to-transparent p-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Welcome back to Lyrus Life Meeting Hub</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/schedule")} className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Plus className="h-4 w-4" /> Schedule Meeting
            </Button>
            <Button variant="outline" onClick={() => navigate("/insights")} className="gap-2">
              <TrendingUp className="h-4 w-4" /> Platform Insights
            </Button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-background/70 border p-3">
            <p className="text-xs text-muted-foreground">Meeting Completion</p>
            <p className="text-lg font-heading font-semibold mt-1">{completionRate}%</p>
            <Progress value={completionRate} className="h-1.5 mt-2" />
          </div>
          <div className="rounded-lg bg-background/70 border p-3">
            <p className="text-xs text-muted-foreground">Task Completion</p>
            <p className="text-lg font-heading font-semibold mt-1">{taskCompletionRate}%</p>
            <Progress value={taskCompletionRate} className="h-1.5 mt-2" />
          </div>
          <div className="rounded-lg bg-background/70 border p-3">
            <p className="text-xs text-muted-foreground">Busiest Day (Next 7 Days)</p>
            <p className="text-lg font-heading font-semibold mt-1">{busiest ? `${busiest[0]} (${busiest[1]})` : "No meetings"}</p>
            <p className="text-xs text-muted-foreground mt-1">Use this to pre-allocate resources.</p>
          </div>
        </div>
      </div>

      <PendingMomAlert meetings={meetings} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="stat-card flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-muted ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground/80">{s.hint}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-heading font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-secondary" /> Weekly Planning Insight</h2>
            <span className="text-xs text-muted-foreground">Next 7 days</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border p-3 bg-muted/20">
              <p className="text-xs text-muted-foreground">Meetings Planned</p>
              <p className="text-xl font-heading font-semibold mt-1">{nextSevenDaysMeetings.length}</p>
            </div>
            <div className="rounded-lg border p-3 bg-muted/20">
              <p className="text-xs text-muted-foreground">Participants Impacted</p>
              <p className="text-xl font-heading font-semibold mt-1">{participantsThisWeek}</p>
            </div>
            <div className="rounded-lg border p-3 bg-muted/20">
              <p className="text-xs text-muted-foreground">Active Meetings</p>
              <p className="text-xl font-heading font-semibold mt-1">{ongoing.length}</p>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium">Mix by Meeting Type</p>
            <div className="space-y-3 mt-3">
              {[
                { key: "Internal", value: byTag.internal, color: "bg-secondary" },
                { key: "Client", value: byTag.client, color: "bg-warning" },
                { key: "Vendor", value: byTag.vendor, color: "bg-primary" },
              ].map((row) => (
                <div key={row.key}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>{row.key}</span>
                    <span className="text-muted-foreground">{row.value}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${row.color}`} style={{ width: `${Math.round((row.value / maxTagCount) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <h2 className="text-base font-heading font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-secondary" /> Task Health</h2>
          <div className="space-y-3">
            <div className="rounded-lg border p-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2"><CircleCheckBig className="h-4 w-4 text-success" /> Completed</span>
              <span className="font-semibold">{completedTasks}</span>
            </div>
            <div className="rounded-lg border p-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2"><Briefcase className="h-4 w-4 text-warning" /> Pending/In Progress</span>
              <span className="font-semibold">{pendingTasks}</span>
            </div>
            <div className="rounded-lg border p-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /> Overdue</span>
              <span className="font-semibold">{overdueTasks}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => navigate("/tasks")}>
            Go to Task Board
          </Button>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate("/calendar")} className="gap-2">
          <CalendarDays className="h-4 w-4" /> View Calendar
        </Button>
        <Button variant="outline" onClick={() => navigate("/meetings")} className="gap-2">
          <Users className="h-4 w-4" /> Open Meetings
        </Button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold">Today's Meetings</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/meetings")} className="gap-1 text-muted-foreground">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {todayMeetings.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No meetings scheduled for today</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {todayMeetings.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow flex items-center justify-between"
                  onClick={() => navigate(`/meetings/${m.id}`)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex flex-col">
                      <span className="font-medium truncate">{m.title}</span>
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" /> {m.time} · {m.duration}min
                        <Users className="h-3.5 w-3.5 ml-2" /> {m.stakeholders.length}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <TagBadge tag={m.tag} />
                    <StatusBadge status={m.status} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
