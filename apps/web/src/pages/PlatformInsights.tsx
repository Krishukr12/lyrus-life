import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMeetings, getTasks } from "@/lib/api";
import { Meeting, UserTask } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  CircleDashed,
  FileText,
  RefreshCcw,
  Users,
  Briefcase,
  Gauge,
  ClipboardList,
  CalendarClock,
} from "lucide-react";

function pct(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function toDateTimeValue(date: string, time: string) {
  return new Date(`${date}T${time}`).getTime();
}

function ageInDays(fromISO: string) {
  const created = new Date(fromISO).getTime();
  return Math.max(0, Math.floor((Date.now() - created) / 86400000));
}

function statusColorByScore(score: number) {
  if (score >= 75) return "text-success";
  if (score >= 55) return "text-warning";
  return "text-destructive";
}

export default function PlatformInsights() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    const [meetingData, taskData] = await Promise.all([getMeetings(), getTasks()]);
    setMeetings(meetingData);
    setTasks(taskData);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const insights = useMemo(() => {
    const now = Date.now();
    const totalMeetings = meetings.length;
    const completedMeetings = meetings.filter((m) => m.status === "completed").length;
    const ongoingMeetings = meetings.filter((m) => m.status === "ongoing").length;
    const upcomingMeetings = meetings.filter((m) => m.status === "upcoming").length;
    const momGenerated = meetings.filter((m) => m.mom).length;
    const momShared = meetings.filter((m) => m.mom?.shared).length;
    const meetingsWithNotes = meetings.filter((m) => m.notes.trim().length > 0).length;
    const longMeetings = meetings.filter((m) => m.duration >= 90).length;
    const clientMeetings = meetings.filter((m) => m.tag === "client").length;
    const vendorMeetings = meetings.filter((m) => m.tag === "vendor").length;
    const internalMeetings = meetings.filter((m) => m.tag === "internal").length;
    const avgDuration = totalMeetings ? Math.round(meetings.reduce((sum, m) => sum + m.duration, 0) / totalMeetings) : 0;
    const upcomingWithin72h = meetings.filter((m) => m.status === "upcoming" && toDateTimeValue(m.date, m.time) - now <= 72 * 3600000).length;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const overdueTasks = tasks.filter((t) => t.status === "overdue").length;
    const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
    const pendingTasks = tasks.filter((t) => t.status === "pending").length;
    const openTasks = pendingTasks + inProgressTasks + overdueTasks;
    const dueTodayTasks = tasks.filter((t) => t.deadline === new Date().toISOString().split("T")[0] && t.status !== "completed").length;
    const staleTasks = tasks.filter((t) => t.status !== "completed" && ageInDays(t.createdAt) >= 5).length;

    const completionRate = pct(completedMeetings, totalMeetings);
    const taskCompletionRate = pct(completedTasks, totalTasks);
    const momCoverage = pct(momGenerated, totalMeetings);
    const momShareRate = pct(momShared, momGenerated || 1);
    const overdueRate = pct(overdueTasks, totalTasks);
    const noteCoverage = pct(meetingsWithNotes, totalMeetings);
    const staleRate = pct(staleTasks, openTasks || 1);

    const executionReliability = Math.round(
      0.45 * taskCompletionRate +
        0.25 * (100 - overdueRate) +
        0.2 * momCoverage +
        0.1 * noteCoverage,
    );
    const governanceScore = Math.round(0.5 * momCoverage + 0.3 * momShareRate + 0.2 * noteCoverage);
    const dealRiskScore = Math.min(
      100,
      Math.round(
        0.45 * overdueRate +
          0.25 * staleRate +
          0.2 * (100 - momShareRate) +
          0.1 * (100 - noteCoverage),
      ),
    );

    const stakeholderLoad = meetings.reduce<Record<string, number>>((acc, m) => {
      m.stakeholders.forEach((s) => {
        acc[s.name] = (acc[s.name] || 0) + 1;
      });
      return acc;
    }, {});
    const topStakeholders = Object.entries(stakeholderLoad)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const wentWell: string[] = [];
    const wentWrong: string[] = [];
    const potentialDealLossSignals: string[] = [];
    const managementActions: string[] = [];

    if (executionReliability >= 70) {
      wentWell.push(`Execution reliability is healthy at ${executionReliability}/100 across tasks and documentation.`);
    }
    if (governanceScore >= 70) {
      wentWell.push(`Governance quality is stable at ${governanceScore}/100 with better documentation discipline.`);
    }
    if (completionRate >= 60) {
      wentWell.push(`Meeting throughput remains stable with ${completionRate}% meetings closed.`);
    }
    if (taskCompletionRate >= 55) {
      wentWell.push(`Action closure is performing with ${taskCompletionRate}% task completion.`);
    }
    if (!wentWell.length) {
      wentWell.push("No strong positive trend yet. Continue data capture for two full cycles before benchmark comparison.");
    }

    if (overdueRate >= 25) {
      wentWrong.push(`Execution breach: ${overdueRate}% of tasks are overdue.`);
    }
    if (staleRate >= 35) {
      wentWrong.push(`Follow-up aging risk: ${staleRate}% of open tasks are stale for 5+ days.`);
    }
    if (noteCoverage < 60) {
      wentWrong.push(`Context quality risk: only ${noteCoverage}% meetings have usable notes.`);
    }
    if (momCoverage < 65) {
      wentWrong.push(`Governance gap: MoM coverage is only ${momCoverage}%, reducing audit reliability.`);
    }
    if (!wentWrong.length) {
      wentWrong.push("No critical failure pattern currently detected. Maintain controls and monitor weekly.");
    }

    if (clientMeetings > 0 && overdueRate >= 30) {
      potentialDealLossSignals.push("Client commitments are exposed because execution delays cross acceptable tolerance.");
    }
    if (clientMeetings > 0 && momShareRate < 65) {
      potentialDealLossSignals.push("Client alignment may degrade due to weak MoM sharing discipline.");
    }
    if (longMeetings >= Math.ceil(totalMeetings / 3) && noteCoverage < 65) {
      potentialDealLossSignals.push("High discussion time with low capture indicates scope-decay risk in deals.");
    }
    if (vendorMeetings > 0 && staleRate >= 35) {
      potentialDealLossSignals.push("Vendor delivery confidence may drop because unresolved actions age too long.");
    }
    if (!potentialDealLossSignals.length) {
      potentialDealLossSignals.push("No major deal-loss indicator detected yet. Add deal outcome data to strengthen confidence.");
    }

    if (overdueRate >= 25) {
      managementActions.push("Enforce weekly escalation for overdue tasks and assign clear accountable owner per action.");
    }
    if (momCoverage < 70) {
      managementActions.push("Set MoM completion SLA: 100% draft within 24 hours of meeting closure.");
    }
    if (staleRate >= 30) {
      managementActions.push("Run stale-task burn-down for next 2 weeks before taking new non-critical actions.");
    }
    if (upcomingWithin72h >= 3) {
      managementActions.push("Pre-brief agenda and owner readiness for all meetings in next 72 hours.");
    }
    if (!managementActions.length) {
      managementActions.push("Current operating metrics are stable. Maintain cadence and begin forecasting with 4-week trend windows.");
    }

    return {
      totalMeetings,
      completedMeetings,
      ongoingMeetings,
      upcomingMeetings,
      internalMeetings,
      clientMeetings,
      vendorMeetings,
      totalTasks,
      openTasks,
      overdueTasks,
      pendingTasks,
      inProgressTasks,
      dueTodayTasks,
      avgDuration,
      upcomingWithin72h,
      completionRate,
      taskCompletionRate,
      momCoverage,
      momShareRate,
      noteCoverage,
      overdueRate,
      staleTasks,
      staleRate,
      executionReliability,
      governanceScore,
      dealRiskScore,
      topStakeholders,
      wentWell,
      wentWrong,
      potentialDealLossSignals,
      managementActions,
    };
  }, [meetings, tasks]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-7xl">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Intelligence</p>
          <h1 className="text-[26px] leading-tight font-heading font-bold mt-1">
            Platform <span className="text-gradient">Intelligence Report</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Decision-grade metrics for management review: execution reliability, governance quality, and deal-risk exposure.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-1.5 shine" onClick={() => navigate("/meetings")}>
            <Briefcase className="h-3.5 w-3.5" /> Review Meetings
          </Button>
          <Button variant="outline" className="gap-1.5" onClick={refreshData}>
            <RefreshCcw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* Score strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Execution Reliability Index",
            value: insights.executionReliability,
            tone: statusColorByScore(insights.executionReliability),
            bar: insights.executionReliability >= 75 ? "bg-success" : insights.executionReliability >= 55 ? "bg-warning" : "bg-destructive",
            hint: "Task closure + delay control + MoM hygiene",
            icon: Gauge,
          },
          {
            label: "Governance Score",
            value: insights.governanceScore,
            tone: statusColorByScore(insights.governanceScore),
            bar: insights.governanceScore >= 75 ? "bg-success" : insights.governanceScore >= 55 ? "bg-warning" : "bg-destructive",
            hint: "Documentation quality and communication compliance",
            icon: FileText,
          },
          {
            label: "Deal Risk Score",
            value: insights.dealRiskScore,
            tone: insights.dealRiskScore >= 55 ? "text-destructive" : "text-warning",
            bar: insights.dealRiskScore >= 55 ? "bg-destructive" : "bg-warning",
            hint: "Higher score indicates higher chance of outcome slippage",
            icon: TrendingDown,
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.21, 0.6, 0.35, 1] }}
          >
            <Card className="stat-card h-full">
              <div className="flex items-start justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground pr-3">{s.label}</p>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <s.icon className="h-[18px] w-[18px]" />
                </div>
              </div>
              <p className={`text-3xl font-heading font-bold tabular-nums mt-2 ${s.tone}`}>
                {s.value}<span className="text-base font-semibold text-muted-foreground">/100</span>
              </p>
              <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${s.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${s.value}%` }}
                  transition={{ duration: 0.9, delay: 0.25 + i * 0.08, ease: [0.21, 0.6, 0.35, 1] }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2.5">{s.hint}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* KPI strip */}
      <Card className="px-6 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:divide-x md:divide-border/60">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Meeting Completion</p>
            <p className="text-lg font-heading font-semibold tabular-nums mt-1">{insights.completionRate}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">{insights.completedMeetings}/{insights.totalMeetings} completed</p>
          </div>
          <div className="md:pl-6">
            <p className="text-xs font-medium text-muted-foreground">MoM Compliance</p>
            <p className="text-lg font-heading font-semibold tabular-nums mt-1">{insights.momCoverage}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Share rate {insights.momShareRate}%</p>
          </div>
          <div className="md:pl-6">
            <p className="text-xs font-medium text-muted-foreground">Task Completion</p>
            <p className="text-lg font-heading font-semibold tabular-nums mt-1">{insights.taskCompletionRate}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">{insights.totalTasks} actions tracked</p>
          </div>
          <div className="md:pl-6">
            <p className="text-xs font-medium text-muted-foreground">Overdue Exposure</p>
            <p className={`text-lg font-heading font-semibold tabular-nums mt-1 ${insights.overdueRate >= 25 ? "text-destructive" : "text-success"}`}>{insights.overdueRate}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">{insights.overdueTasks} overdue actions</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <Gauge className="h-3.5 w-3.5" />
            </span>
            Decision Scorecard
          </h2>
          <div className="mt-4 divide-y divide-border/50 text-sm">
            {[
              { label: "Ongoing Meetings", value: insights.ongoingMeetings },
              { label: "Upcoming in 72h", value: insights.upcomingWithin72h },
              { label: "Open Actions", value: insights.openTasks },
              { label: "Stale Open Actions", value: insights.staleTasks },
              { label: "Due Today", value: insights.dueTodayTasks },
              { label: "Average Meeting Duration", value: `${insights.avgDuration} min` },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-heading font-semibold tabular-nums">{row.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <Briefcase className="h-3.5 w-3.5" />
            </span>
            Portfolio Mix
          </h2>
          <div className="mt-4 space-y-4 text-sm">
            {[
              { label: "Internal", value: insights.internalMeetings, bar: "bg-primary" },
              { label: "Client", value: insights.clientMeetings, bar: "bg-secondary" },
              { label: "Vendor", value: insights.vendorMeetings, bar: "bg-warning" },
            ].map((row, idx) => (
              <div key={row.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium">{row.label}</span>
                  <span className="tabular-nums text-muted-foreground">{row.value}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${row.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct(row.value, insights.totalMeetings)}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: [0.21, 0.6, 0.35, 1] }}
                  />
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground border-t border-border/50 mt-4 pt-3">Use this mix to allocate account-management and operations bandwidth.</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <Users className="h-3.5 w-3.5" />
            </span>
            Stakeholder Load
          </h2>
          <div className="mt-4 space-y-1.5 text-sm">
            {insights.topStakeholders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No stakeholder distribution data yet.</p>
            ) : (
              insights.topStakeholders.map((s) => (
                <div key={s.name} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/30 transition-colors">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px] font-semibold">
                    {s.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                  <span className="truncate flex-1">{s.name}</span>
                  <span className="font-heading font-semibold tabular-nums">{s.count}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/10 text-success">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
            What Went Well
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {insights.wentWell.map((item, idx) => (
              <li key={idx} className="rounded-lg border border-success/15 bg-success/[0.07] px-3.5 py-2.5 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <AlertTriangle className="h-3.5 w-3.5" />
            </span>
            What Went Wrong
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {insights.wentWrong.map((item, idx) => (
              <li key={idx} className="rounded-lg border border-warning/20 bg-warning/[0.08] px-3.5 py-2.5 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <TrendingDown className="h-3.5 w-3.5" />
            </span>
            Deal-Loss Signals
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {insights.potentialDealLossSignals.map((item, idx) => (
              <li key={idx} className="rounded-lg border border-destructive/15 bg-destructive/[0.06] px-3.5 py-2.5 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <ClipboardList className="h-3.5 w-3.5" />
            </span>
            Management Actions (Next 7 Days)
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {insights.managementActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 px-3.5 py-2.5 leading-relaxed">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary text-[11px] font-semibold tabular-nums">
                  {idx + 1}
                </span>
                {action}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <FileText className="h-3.5 w-3.5" />
            </span>
            Report Readiness & Data Gaps
          </h2>
          <div className="mt-4 space-y-2 text-sm">
            <p className="rounded-lg border border-border/60 bg-muted/20 px-3.5 py-2.5 leading-relaxed">
              Current report quality is strong for operational control, but deal outcomes are still inferred.
            </p>
            <p className="rounded-lg border border-border/60 bg-muted/20 px-3.5 py-2.5 leading-relaxed">
              Add explicit fields next: deal outcome, outcome value, loss reason category, and customer sentiment.
            </p>
            <p className="rounded-lg border border-border/60 bg-muted/20 px-3.5 py-2.5 flex items-start gap-2 leading-relaxed">
              <CalendarClock className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              Once outcomes are logged per meeting, this page can produce board-level monthly trend reports.
            </p>
            <p className="rounded-lg border border-border/60 bg-muted/20 px-3.5 py-2.5 flex items-start gap-2 leading-relaxed">
              <CircleDashed className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              Current analysis runs from meetings, MoM, and task execution signals only.
            </p>
          </div>
        </Card>
      </div>

      <Card className="px-6 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:divide-x md:divide-border/60">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Backlog Pressure</p>
            <p className="text-lg font-heading font-semibold tabular-nums mt-1">{insights.pendingTasks}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Pending tasks awaiting start</p>
          </div>
          <div className="md:pl-6">
            <p className="text-xs font-medium text-muted-foreground">Execution in Motion</p>
            <p className="text-lg font-heading font-semibold tabular-nums mt-1">{insights.inProgressTasks}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Tasks currently in progress</p>
          </div>
          <div className="md:pl-6">
            <p className="text-xs font-medium text-muted-foreground">Stale Open Rate</p>
            <p className={`text-lg font-heading font-semibold tabular-nums mt-1 ${insights.staleRate >= 35 ? "text-destructive" : "text-success"}`}>{insights.staleRate}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Open tasks older than 5 days</p>
          </div>
          <div className="md:pl-6">
            <p className="text-xs font-medium text-muted-foreground">Upcoming Meetings</p>
            <p className="text-lg font-heading font-semibold tabular-nums mt-1">{insights.upcomingMeetings}</p>
            <p className="text-xs text-muted-foreground mt-0.5">With {insights.upcomingWithin72h} in next 72h</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
