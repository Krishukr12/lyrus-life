import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Inbox,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { approveMOM, generateMOM, getMeetings } from "@/lib/api";
import { formatFriendlyDate, meetingDateKey, meetingTimeLabel } from "@/lib/datetime";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  filterMeetingsPendingMom,
  getMomStakeholderStatus,
  momEligibilityFromIntegrations,
  momStakeholderStatusLabel,
  type MomStakeholderStatus,
} from "@/lib/mom-status";
import type { Meeting } from "@/lib/types";
import { getMyIntegrations } from "@/services/integrations-api";
import { cn } from "@/lib/utils";

type FilterTab = "all" | Exclude<MomStakeholderStatus, "shared">;

const PAGE_SIZE = 10;

const STAGES: {
  id: Exclude<MomStakeholderStatus, "shared">;
  label: string;
  step: string;
  hint: string;
  accent: string;
  soft: string;
  bar: string;
}[] = [
  {
    id: "none",
    label: "Generate",
    step: "01",
    hint: "Draft missing",
    accent: "text-warning",
    soft: "bg-warning/10 border-warning/25",
    bar: "bg-warning",
  },
  {
    id: "awaiting_approval",
    label: "Approve",
    step: "02",
    hint: "Needs review",
    accent: "text-amber-700 dark:text-amber-300",
    soft: "bg-amber-500/10 border-amber-500/25",
    bar: "bg-amber-500",
  },
  {
    id: "not_shared",
    label: "Send",
    step: "03",
    hint: "Ready for stakeholders",
    accent: "text-orange-700 dark:text-orange-300",
    soft: "bg-orange-500/10 border-orange-500/25",
    bar: "bg-orange-500",
  },
];

function stageMeta(status: MomStakeholderStatus) {
  return STAGES.find((s) => s.id === status) ?? STAGES[0];
}

function canInlineApprove(meeting: Meeting): boolean {
  const status = getMomStakeholderStatus(meeting);
  return (
    Boolean(meeting.mom) &&
    meeting.status === "completed" &&
    (status === "awaiting_approval" || status === "not_shared")
  );
}

function canInlineGenerate(meeting: Meeting): boolean {
  return getMomStakeholderStatus(meeting) === "none" && meeting.status === "completed";
}

function nextActionCopy(meeting: Meeting): { label: string; detail: string } {
  const status = getMomStakeholderStatus(meeting);
  if (status === "none") {
    if (meeting.status !== "completed") {
      return {
        label: "Waiting on meeting",
        detail: "Finish the call first, then generate the draft.",
      };
    }
    return {
      label: "Generate draft",
      detail: "Create minutes from the meeting recording.",
    };
  }
  if (status === "awaiting_approval") {
    return {
      label: "Approve & send",
      detail: "Review the draft, then email stakeholders.",
    };
  }
  if (status === "not_shared") {
    return {
      label: "Send to stakeholders",
      detail: "Approved — deliver the MOM PDF.",
    };
  }
  return { label: "Open MOM", detail: "View the shared minutes." };
}

export default function MomInbox() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { data: meetings = [], isLoading, isError, error } = useQuery({
    queryKey: ["meetings"],
    queryFn: getMeetings,
    refetchInterval: 15000,
  });

  const { data: integrationsData } = useQuery({
    queryKey: ["integrations"],
    queryFn: getMyIntegrations,
    staleTime: 60_000,
  });

  const momEligibility = useMemo(
    () => momEligibilityFromIntegrations(integrationsData?.integrations ?? []),
    [integrationsData],
  );

  const pending = useMemo(
    () => filterMeetingsPendingMom(meetings, momEligibility),
    [meetings, momEligibility],
  );

  const counts = useMemo(() => {
    const base = { all: pending.length, none: 0, awaiting_approval: 0, not_shared: 0 };
    for (const m of pending) {
      const status = getMomStakeholderStatus(m);
      if (status === "none" || status === "awaiting_approval" || status === "not_shared") {
        base[status] += 1;
      }
    }
    return base;
  }, [pending]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pending.filter((m) => {
      if (tab !== "all" && getMomStakeholderStatus(m) !== tab) return false;
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.stakeholders.some(
          (s) =>
            s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q),
        )
      );
    });
  }, [pending, tab, search]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [tab, search]);

  const visible = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );
  const hasMore = visibleCount < filtered.length;
  const remaining = Math.max(filtered.length - visibleCount, 0);
  const nextBatch = Math.min(PAGE_SIZE, remaining);

  const grouped = useMemo(() => {
    if (tab !== "all") return null;
    return STAGES.map((stage) => ({
      stage,
      items: visible.filter((m) => getMomStakeholderStatus(m) === stage.id),
    })).filter((g) => g.items.length > 0);
  }, [visible, tab]);

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ["meetings"] });
  };

  const generateMutation = useMutation({
    mutationFn: (meetingId: string) => generateMOM(meetingId),
    onSuccess: async () => {
      toast.success("MOM draft generated");
      await refresh();
    },
    onError: (err: Error) => toast.error(err.message || "Failed to generate MOM"),
    onSettled: () => setBusyId(null),
  });

  const approveMutation = useMutation({
    mutationFn: (meetingId: string) => approveMOM(meetingId),
    onSuccess: async () => {
      toast.success("MOM approved and sent to stakeholders");
      await refresh();
    },
    onError: (err: Error) => toast.error(err.message || "Failed to approve MOM"),
    onSettled: () => setBusyId(null),
  });

  const handlePrimary = (meeting: Meeting) => {
    if (canInlineGenerate(meeting)) {
      setBusyId(meeting.id);
      generateMutation.mutate(meeting.id);
      return;
    }
    if (canInlineApprove(meeting)) {
      setBusyId(meeting.id);
      approveMutation.mutate(meeting.id);
      return;
    }
    navigate(`/meetings/${meeting.id}#mom`);
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-5 page-enter">
        <div className="h-44 rounded-2xl bg-muted animate-pulse" />
        <div className="h-20 rounded-xl bg-muted animate-pulse" />
        <div className="h-36 rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-6xl page-enter">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load meetings"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 page-enter">
      <section className="aurora-panel rounded-2xl border border-border/60 shadow-soft">
        <div className="relative z-[1] p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="min-w-0 max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Stakeholder delivery
              </p>
              <h1 className="mt-3 font-heading text-4xl md:text-5xl font-bold tracking-tight leading-none">
                <span className="text-gradient">MOM inbox</span>
              </h1>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Generate, approve, and send minutes to stakeholders.
              </p>
              <p className="mt-4 text-sm text-foreground/80">
                <span className="font-heading font-semibold tabular-nums">{pending.length}</span>{" "}
                waiting
                <span className="mx-2 text-border">·</span>
                <span className="font-heading font-semibold tabular-nums">{counts.none}</span> to
                generate
                <span className="mx-2 text-border">·</span>
                <span className="font-heading font-semibold tabular-nums">
                  {counts.awaiting_approval + counts.not_shared}
                </span>{" "}
                to approve or send
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <Button variant="outline" className="gap-1.5" onClick={() => navigate("/meetings")}>
                Meetings
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline stages */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {STAGES.map((stage) => {
          const active = tab === stage.id;
          const count = counts[stage.id];
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setTab(active ? "all" : stage.id)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all",
                active
                  ? "border-primary/30 bg-primary text-primary-foreground shadow-soft"
                  : "border-border/60 bg-card/80 hover:bg-muted/40",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-[0.14em]",
                      active ? "text-primary-foreground/65" : "text-muted-foreground",
                    )}
                  >
                    Step {stage.step}
                  </p>
                  <p className="mt-1 font-heading text-lg font-semibold tracking-tight">
                    {stage.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-xs",
                      active ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    {stage.hint}
                  </p>
                </div>
                <span
                  className={cn(
                    "font-heading text-2xl font-bold tabular-nums",
                    active ? "text-primary-foreground" : stage.accent,
                  )}
                >
                  {count}
                </span>
              </div>
              {!active && (
                <span
                  className={cn("absolute inset-x-0 bottom-0 h-0.5 opacity-70", stage.bar)}
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </section>

      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meetings or people…"
            className="h-11 rounded-xl border-border/60 bg-card/80 pl-9"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {tab !== "all" ? (
            <button
              type="button"
              onClick={() => setTab("all")}
              className="rounded-lg border border-border/60 px-2.5 py-1.5 hover:bg-muted/50"
            >
              Showing {momStakeholderStatusLabel(tab).toLowerCase()} · clear filter
            </button>
          ) : (
            <span>Grouped by next action</span>
          )}
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-border/70 bg-card/40 px-6 py-16 text-center">
          <div
            className={cn(
              "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl",
              pending.length === 0
                ? "bg-success/10 text-success"
                : "bg-muted text-muted-foreground",
            )}
          >
            {pending.length === 0 ? (
              <CheckCircle2 className="h-7 w-7" />
            ) : (
              <Inbox className="h-7 w-7" />
            )}
          </div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            {pending.length === 0 ? "Inbox is clear" : "Nothing in this view"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
            {pending.length === 0
              ? "Every meeting that needed a MOM has been generated, approved, and sent."
              : "Try another stage or clear search to see the rest of the queue."}
          </p>
          {pending.length === 0 ? (
            <Button
              variant="secondary"
              size="sm"
              className="mt-5 gap-1.5 shine"
              onClick={() => navigate("/meetings")}
            >
              Back to meetings <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="mt-5" onClick={() => { setTab("all"); setSearch(""); }}>
              Reset filters
            </Button>
          )}
        </section>
      ) : tab === "all" && grouped ? (
        <div className="space-y-7">
          {grouped.map(({ stage, items }) => (
            <section key={stage.id} className="space-y-3">
              <div className="flex items-center gap-3 px-0.5">
                <span className={cn("h-2 w-2 rounded-full", stage.bar)} />
                <h2 className="font-heading text-sm font-semibold tracking-tight">
                  {stage.label}
                </h2>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {items.length}
                </span>
                <div className="h-px flex-1 bg-border/60" />
              </div>
              <ul className="space-y-2.5">
                <AnimatePresence initial={false}>
                  {items.map((meeting, index) => (
                    <MomQueueRow
                      key={meeting.id}
                      meeting={meeting}
                      busy={busyId === meeting.id}
                      index={index}
                      onOpen={() => navigate(`/meetings/${meeting.id}#mom`)}
                      onPrimary={() => handlePrimary(meeting)}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <ul className="space-y-2.5">
          <AnimatePresence initial={false}>
            {visible.map((meeting, index) => (
              <MomQueueRow
                key={meeting.id}
                meeting={meeting}
                busy={busyId === meeting.id}
                index={index}
                onOpen={() => navigate(`/meetings/${meeting.id}#mom`)}
                onPrimary={() => handlePrimary(meeting)}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}

      {filtered.length > 0 && (
        <div className="flex flex-col items-center gap-2 pt-1 pb-2">
          <p className="text-xs text-muted-foreground tabular-nums">
            Showing {visible.length} of {filtered.length}
          </p>
          {hasMore ? (
            <Button
              variant="outline"
              className="min-w-[12rem] rounded-xl"
              onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            >
              Show {nextBatch} more
            </Button>
          ) : filtered.length > PAGE_SIZE ? (
            <p className="text-xs text-muted-foreground">You are at the end of the queue</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function MomQueueRow({
  meeting,
  busy,
  index,
  onOpen,
  onPrimary,
}: {
  meeting: Meeting;
  busy: boolean;
  index: number;
  onOpen: () => void;
  onPrimary: () => void;
}) {
  const status = getMomStakeholderStatus(meeting);
  const stage = stageMeta(status);
  const action = nextActionCopy(meeting);
  const showPrimary = canInlineGenerate(meeting) || canInlineApprove(meeting);
  const dateKey = meetingDateKey(meeting);
  const time = meetingTimeLabel(meeting);
  const keyPoints = meeting.mom?.keyPoints?.length ?? 0;
  const actions = meeting.mom?.actionItems?.length ?? 0;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ delay: Math.min(index * 0.03, 0.18), duration: 0.28 }}
    >
      <article className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/90 shadow-soft transition-colors hover:bg-card">
        <span className={cn("absolute inset-y-0 left-0 w-1", stage.bar)} aria-hidden />
        <div className="flex flex-col gap-4 p-4 pl-5 sm:flex-row sm:items-center sm:justify-between sm:p-5 sm:pl-6">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-heading text-base font-semibold tracking-tight">
                {meeting.title}
              </h3>
              <span
                className={cn(
                  "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium",
                  stage.soft,
                  stage.accent,
                )}
              >
                {momStakeholderStatusLabel(status)}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>
                {formatFriendlyDate(dateKey)} · {time}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" />
                {meeting.stakeholders.length} stakeholder
                {meeting.stakeholders.length === 1 ? "" : "s"}
              </span>
              {meeting.mom ? (
                <span className="inline-flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {keyPoints} points · {actions} actions
                </span>
              ) : null}
            </div>

            <p className="mt-2 text-sm text-foreground/75">{action.detail}</p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={onOpen}>
              {meeting.mom ? "Review" : "Open"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
            {showPrimary ? (
              <Button
                size="sm"
                className="gap-1.5 rounded-xl shine"
                variant="secondary"
                disabled={busy}
                onClick={onPrimary}
              >
                {busy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : status === "none" ? (
                  <Sparkles className="h-3.5 w-3.5" />
                ) : (
                  <ShieldCheck className="h-3.5 w-3.5" />
                )}
                {action.label}
              </Button>
            ) : null}
          </div>
        </div>
      </article>
    </motion.li>
  );
}
