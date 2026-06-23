import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getTasks, updateTask, getTasksDueReminders } from "@/lib/api";
import { UserTask } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format, isToday, isTomorrow, isPast, isValid, parseISO } from "date-fns";
import { CheckCircle2, Clock, AlertTriangle, Play, ListChecks, Bell, CalendarClock, TrendingUp, Target, FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-warning/15 text-warning border-warning/30" },
  in_progress: { label: "In Progress", icon: Play, className: "bg-secondary/15 text-secondary border-secondary/30" },
  completed: { label: "Completed", icon: CheckCircle2, className: "bg-success/15 text-success border-success/30" },
  overdue: { label: "Overdue", icon: AlertTriangle, className: "bg-destructive/15 text-destructive border-destructive/30" },
};

function parseDeadline(deadline: string): Date | null {
  if (!deadline?.trim()) return null;
  const d = parseISO(deadline);
  return isValid(d) ? d : null;
}

function DeadlineLabel({ deadline }: { deadline: string }) {
  const d = parseDeadline(deadline);
  if (!d) return <span className="text-muted-foreground">No due date</span>;
  if (isToday(d)) return <span className="text-warning font-medium">Due Today</span>;
  if (isTomorrow(d)) return <span className="text-secondary font-medium">Due Tomorrow</span>;
  if (isPast(d)) return <span className="text-destructive font-medium">Overdue — {format(d, "MMM d")}</span>;
  return <span className="text-muted-foreground">{format(d, "MMM d, yyyy")}</span>;
}

export default function Tasks() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: tasks = [], isLoading, isError, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    refetchInterval: 10000,
  });
  const [remindersShown, setRemindersShown] = useState(false);
  const [search, setSearch] = useState("");

  const mutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<UserTask> }) => updateTask(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // Reminder system
  useEffect(() => {
    if (remindersShown) return;
    const due = getTasksDueReminders();
    if (due.length > 0) {
      setRemindersShown(true);
      due.forEach((t, i) => {
        setTimeout(() => {
          const d = parseDeadline(t.deadline);
          if (!d) return;
          const label = isToday(d) ? "today" : "tomorrow";
          toast.warning(`⏰ Reminder: "${t.task}" is due ${label}`, {
            description: `Assigned to ${t.assignee} from "${t.meetingTitle}"`,
            duration: 6000,
          });
          // Mark as reminded
          const today = new Date().toISOString().split("T")[0];
          updateTask(t.id, { remindedAt: today });
        }, i * 1500);
      });
    }
  }, [tasks, remindersShown]);

  const pending = tasks.filter((t) => t.status === "pending" || t.status === "overdue");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const completed = tasks.filter((t) => t.status === "completed");
  const overdue = tasks.filter((t) => t.status === "overdue");
  const dueToday = tasks.filter((t) => {
    const d = parseDeadline(t.deadline);
    return d != null && isToday(d) && t.status !== "completed";
  });
  const completionRate = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0;
  const searchQuery = search.trim().toLowerCase();
  const matchesSearch = (task: UserTask) =>
    !searchQuery ||
    task.task.toLowerCase().includes(searchQuery) ||
    task.assignee.toLowerCase().includes(searchQuery) ||
    task.meetingTitle.toLowerCase().includes(searchQuery);

  const pendingFiltered = pending.filter(matchesSearch);
  const inProgressFiltered = inProgress.filter(matchesSearch);
  const completedFiltered = completed.filter(matchesSearch);
  const activeFiltered = [...pendingFiltered, ...inProgressFiltered];

  const handleStatusChange = (task: UserTask, newStatus: UserTask["status"]) => {
    mutation.mutate({ id: task.id, updates: { status: newStatus } });
    if (newStatus === "completed") toast.success(`"${task.task}" marked as completed!`);
    if (newStatus === "in_progress") toast.info(`Started working on "${task.task}"`);
  };

  const accentByStatus: Record<string, string> = {
    pending: "before:bg-warning",
    in_progress: "before:bg-secondary",
    completed: "before:bg-success",
    overdue: "before:bg-destructive",
  };

  const TaskCard = ({ task }: { task: UserTask }) => {
    const config = statusConfig[task.status] ?? statusConfig.pending;
    const Icon = config.icon;
    return (
      <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
        <Card
          className={`relative overflow-hidden hover-lift before:absolute before:inset-y-0 before:left-0 before:w-1 ${accentByStatus[task.status] ?? "before:bg-warning"}`}
        >
          <CardContent className="p-4 pl-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-foreground leading-snug">{task.task}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  From: <span className="text-foreground/80">{task.meetingTitle}</span>
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                  <span className="text-muted-foreground">Assigned to: <span className="font-medium text-foreground/80">{task.assignee}</span></span>
                  <span className="text-muted-foreground">•</span>
                  <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                  <DeadlineLabel deadline={task.deadline} />
                </div>
              </div>
              <Badge variant="outline" className={`${config.className} shrink-0 gap-1`}>
                <Icon className="h-3 w-3" />
                {config.label}
              </Badge>
            </div>
            {task.status !== "completed" && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                {task.status !== "in_progress" && (
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => handleStatusChange(task, "in_progress")}>
                    <Play className="h-3 w-3" /> Start
                  </Button>
                )}
                <Button size="sm" className="gap-1.5 text-xs bg-success hover:bg-success/90 text-success-foreground shadow-sm shadow-success/25" onClick={() => handleStatusChange(task, "completed")}>
                  <CheckCircle2 className="h-3 w-3" /> Complete
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (isError) {
    return (
      <motion.div className="p-6 max-w-4xl mx-auto">
        <Card className="p-6 text-center">
          <AlertTriangle className="h-10 w-10 mx-auto mb-2 text-destructive" />
          <p className="font-medium">Could not load tasks</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error ? error.message : "Check that the API is running."}
          </p>
        </Card>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-7">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Execution</p>
          <h1 className="text-[26px] leading-tight font-heading font-bold mt-1">
            <span className="text-gradient">My Tasks</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Action items assigned from meeting MOMs with execution tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-1.5 shine" onClick={() => {
            setRemindersShown(false);
            toast.info("Checking for reminders...");
          }}>
            <Bell className="h-3.5 w-3.5" /> Check Reminders
          </Button>
          <Button variant="outline" className="gap-1.5" onClick={() => navigate("/meetings")}>
            <CalendarClock className="h-3.5 w-3.5" /> Open Meetings
          </Button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: tasks.length, icon: ListChecks, iconBg: "bg-primary/10 text-primary", hint: "All tracked actions" },
          { label: "Pending", value: pending.length, icon: Clock, iconBg: "bg-warning/10 text-warning", hint: `${overdue.length} overdue` },
          { label: "In Progress", value: inProgress.length, icon: Play, iconBg: "bg-secondary/10 text-secondary", hint: "Currently moving" },
          { label: "Completed", value: completed.length, icon: CheckCircle2, iconBg: "bg-success/10 text-success", hint: `${completionRate}% completion` },
        ].map((s, i) => (
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:divide-x md:divide-border/60">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Task Completion</p>
            <p className="text-lg font-heading font-semibold tabular-nums mt-1">{completionRate}%</p>
          </div>
          <div className="md:pl-6">
            <p className="text-xs font-medium text-muted-foreground">Due Today</p>
            <p className="text-lg font-heading font-semibold tabular-nums mt-1">{dueToday.length}</p>
          </div>
          <div className="md:pl-6">
            <p className="text-xs font-medium text-muted-foreground">Overdue</p>
            <p className={`text-lg font-heading font-semibold tabular-nums mt-1 ${overdue.length > 0 ? "text-destructive" : ""}`}>{overdue.length}</p>
          </div>
          <div className="md:pl-6">
            <p className="text-xs font-medium text-muted-foreground">In Progress</p>
            <p className="text-lg font-heading font-semibold tabular-nums mt-1">{inProgress.length}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-heading font-semibold flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                <TrendingUp className="h-3.5 w-3.5" />
              </span>
              Execution Snapshot
            </h2>
            <span className="text-xs text-muted-foreground rounded-full border border-border/60 px-2.5 py-1">Live</span>
          </div>
          <div className="mt-4 grid grid-cols-3 divide-x divide-border/60 rounded-xl border border-border/60 bg-muted/20">
            <div className="px-4 py-3.5">
              <p className="text-[11px] text-muted-foreground">Active Pipeline</p>
              <p className="text-2xl font-heading font-semibold tabular-nums mt-0.5">{pending.length + inProgress.length}</p>
            </div>
            <div className="px-4 py-3.5">
              <p className="text-[11px] text-muted-foreground">High Risk (Overdue)</p>
              <p className="text-2xl font-heading font-semibold tabular-nums mt-0.5">{overdue.length}</p>
            </div>
            <div className="px-4 py-3.5">
              <p className="text-[11px] text-muted-foreground">Due in 24 Hours</p>
              <p className="text-2xl font-heading font-semibold tabular-nums mt-0.5">{dueToday.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-base font-heading font-semibold flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <Target className="h-3.5 w-3.5" />
            </span>
            Focus Tip
          </h2>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            Prioritize overdue tasks first, then close all "Due Today" items before starting new work.
          </p>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            Keeping overdue near zero improves delivery confidence for meeting commitments.
          </p>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search by task, assignee, or meeting..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xl"
        />
        <Button variant="outline" onClick={() => setSearch("")} className="gap-1.5">
          <FilterX className="h-3.5 w-3.5" /> Clear
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({activeFiltered.length})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({inProgressFiltered.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedFiltered.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 space-y-3">
          <AnimatePresence>
            {activeFiltered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ListChecks className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p>{searchQuery ? "No active tasks match your search." : "No active tasks. Complete a meeting to see action items here."}</p>
              </div>
            ) : (
              activeFiltered.map((t) => <TaskCard key={t.id} task={t} />)
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="in_progress" className="mt-4 space-y-3">
          <AnimatePresence>
            {inProgressFiltered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Play className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p>{searchQuery ? "No in-progress tasks match your search." : "No tasks in progress."}</p>
              </div>
            ) : (
              inProgressFiltered.map((t) => <TaskCard key={t.id} task={t} />)
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-3">
          <AnimatePresence>
            {completedFiltered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p>{searchQuery ? "No completed tasks match your search." : "No completed tasks yet."}</p>
              </div>
            ) : (
              completedFiltered.map((t) => <TaskCard key={t.id} task={t} />)
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}
