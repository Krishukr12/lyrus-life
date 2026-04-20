import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMeetings, getTasks } from "@/lib/api";
import { Meeting, UserTask } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartNoAxesCombined,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
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
    <div className="space-y-6 max-w-7xl">
      <div className="rounded-2xl border bg-gradient-to-r from-secondary/15 via-secondary/5 to-transparent p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
              <ChartNoAxesCombined className="h-6 w-6 text-secondary" />
              Platform Intelligence Report
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Decision-grade metrics for management review: execution reliability, governance quality, and deal-risk exposure.
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={() => navigate("/meetings")}>
              <Briefcase className="h-3.5 w-3.5" /> Review Meetings
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={refreshData}>
              <RefreshCcw className="h-3.5 w-3.5" /> Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Execution Reliability Index</p>
          <p className={`text-2xl font-heading font-bold mt-1 ${statusColorByScore(insights.executionReliability)}`}>{insights.executionReliability}/100</p>
          <p className="text-xs text-muted-foreground mt-1">Task closure + delay control + MoM hygiene</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Governance Score</p>
          <p className={`text-2xl font-heading font-bold mt-1 ${statusColorByScore(insights.governanceScore)}`}>{insights.governanceScore}/100</p>
          <p className="text-xs text-muted-foreground mt-1">Documentation quality and communication compliance</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Deal Risk Score</p>
          <p className={`text-2xl font-heading font-bold mt-1 ${insights.dealRiskScore >= 55 ? "text-destructive" : "text-warning"}`}>{insights.dealRiskScore}/100</p>
          <p className="text-xs text-muted-foreground mt-1">Higher score indicates higher chance of outcome slippage</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Meeting Completion</p>
          <p className="text-2xl font-heading font-bold mt-1">{insights.completionRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">{insights.completedMeetings}/{insights.totalMeetings} completed</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">MoM Compliance</p>
          <p className="text-2xl font-heading font-bold mt-1">{insights.momCoverage}%</p>
          <p className="text-xs text-muted-foreground mt-1">Share rate {insights.momShareRate}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Task Completion</p>
          <p className="text-2xl font-heading font-bold mt-1">{insights.taskCompletionRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">{insights.totalTasks} actions tracked</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Overdue Exposure</p>
          <p className={`text-2xl font-heading font-bold mt-1 ${insights.overdueRate >= 25 ? "text-destructive" : "text-success"}`}>{insights.overdueRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">{insights.overdueTasks} overdue actions</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <Gauge className="h-4 w-4 text-secondary" />
            Decision Scorecard
          </h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="rounded-md border p-2 flex justify-between"><span>Ongoing Meetings</span><span className="font-medium">{insights.ongoingMeetings}</span></div>
            <div className="rounded-md border p-2 flex justify-between"><span>Upcoming in 72h</span><span className="font-medium">{insights.upcomingWithin72h}</span></div>
            <div className="rounded-md border p-2 flex justify-between"><span>Open Actions</span><span className="font-medium">{insights.openTasks}</span></div>
            <div className="rounded-md border p-2 flex justify-between"><span>Stale Open Actions</span><span className="font-medium">{insights.staleTasks}</span></div>
            <div className="rounded-md border p-2 flex justify-between"><span>Due Today</span><span className="font-medium">{insights.dueTodayTasks}</span></div>
            <div className="rounded-md border p-2 flex justify-between"><span>Average Meeting Duration</span><span className="font-medium">{insights.avgDuration} min</span></div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-secondary" />
            Portfolio Mix
          </h2>
          <div className="mt-3 space-y-3 text-sm">
            <div>
              <div className="flex justify-between text-xs mb-1"><span>Internal</span><span>{insights.internalMeetings}</span></div>
              <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${pct(insights.internalMeetings, insights.totalMeetings)}%` }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span>Client</span><span>{insights.clientMeetings}</span></div>
              <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-secondary" style={{ width: `${pct(insights.clientMeetings, insights.totalMeetings)}%` }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span>Vendor</span><span>{insights.vendorMeetings}</span></div>
              <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-warning" style={{ width: `${pct(insights.vendorMeetings, insights.totalMeetings)}%` }} /></div>
            </div>
            <p className="text-xs text-muted-foreground pt-1">Use this mix to allocate account-management and operations bandwidth.</p>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-secondary" />
            Stakeholder Load
          </h2>
          <div className="mt-3 space-y-2 text-sm">
            {insights.topStakeholders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No stakeholder distribution data yet.</p>
            ) : (
              insights.topStakeholders.map((s) => (
                <div key={s.name} className="rounded-md border p-2 flex justify-between">
                  <span className="truncate pr-3">{s.name}</span>
                  <span className="font-medium">{s.count}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            What Went Well
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {insights.wentWell.map((item, idx) => (
              <li key={idx} className="rounded-md bg-success/10 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            What Went Wrong
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {insights.wentWrong.map((item, idx) => (
              <li key={idx} className="rounded-md bg-warning/15 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-destructive" />
            Deal-Loss Signals
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {insights.potentialDealLossSignals.map((item, idx) => (
              <li key={idx} className="rounded-md bg-destructive/10 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-secondary" />
            Management Actions (Next 7 Days)
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {insights.managementActions.map((action, idx) => (
              <li key={idx} className="rounded-md bg-muted/40 px-3 py-2">{action}</li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="font-heading font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-secondary" />
            Report Readiness & Data Gaps
          </h2>
          <div className="mt-3 space-y-2 text-sm">
            <p className="rounded-md bg-muted/40 px-3 py-2">
              Current report quality is strong for operational control, but deal outcomes are still inferred.
            </p>
            <p className="rounded-md bg-muted/40 px-3 py-2">
              Add explicit fields next: deal outcome, outcome value, loss reason category, and customer sentiment.
            </p>
            <p className="rounded-md bg-muted/40 px-3 py-2 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              Once outcomes are logged per meeting, this page can produce board-level monthly trend reports.
            </p>
            <p className="rounded-md bg-muted/40 px-3 py-2 flex items-center gap-2">
              <CircleDashed className="h-4 w-4 text-muted-foreground" />
              Current analysis runs from meetings, MoM, and task execution signals only.
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Backlog Pressure</p>
          <p className="text-xl font-heading font-bold mt-1">{insights.pendingTasks}</p>
          <p className="text-xs text-muted-foreground mt-1">Pending tasks awaiting start</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Execution in Motion</p>
          <p className="text-xl font-heading font-bold mt-1">{insights.inProgressTasks}</p>
          <p className="text-xs text-muted-foreground mt-1">Tasks currently in progress</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Stale Open Rate</p>
          <p className={`text-xl font-heading font-bold mt-1 ${insights.staleRate >= 35 ? "text-destructive" : "text-success"}`}>{insights.staleRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">Open tasks older than 5 days</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Upcoming Meetings</p>
          <p className="text-xl font-heading font-bold mt-1">{insights.upcomingMeetings}</p>
          <p className="text-xs text-muted-foreground mt-1">With {insights.upcomingWithin72h} in next 72h</p>
        </Card>
      </div>
    </div>
  );
}
