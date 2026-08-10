import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMeetings } from "@/lib/api";
import {
  addDaysToDateKey,
  formatFriendlyDate,
  formatShortWeekday,
  meetingDateKey,
  meetingTimeLabel,
  todayLocalDateKey,
} from "@/lib/datetime";
import { Meeting } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { StatusBadge, TagBadge } from "@/components/StatusBadge";
import { MomStakeholderBadge } from "@/components/MomStakeholderBadge";
import { needsMomStakeholderAction, momEligibilityFromIntegrations } from "@/lib/mom-status";
import { getMyIntegrations } from "@/services/integrations-api";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  Users,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function totalMinutes(list: Meeting[]): number {
  return list.reduce((sum, m) => sum + (m.duration || 0), 0);
}

function formatDurationTotal(mins: number): string {
  if (mins <= 0) return "Nothing booked";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m booked`;
  if (m === 0) return `${h}h booked`;
  return `${h}h ${m}m booked`;
}

export default function Meetings() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const todayStr = todayLocalDateKey();
  const railRef = useRef<HTMLDivElement>(null);

  const dateFromUrl = searchParams.get("date");
  const initialDate =
    dateFromUrl && /^\d{4}-\d{2}-\d{2}$/.test(dateFromUrl) ? dateFromUrl : todayStr;

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [momEligibility, setMomEligibility] = useState(() =>
    momEligibilityFromIntegrations([]),
  );
  const momPendingOnly = searchParams.get("mom") === "pending";

  useEffect(() => {
    Promise.all([getMeetings(), getMyIntegrations().catch(() => null)])
      .then(([m, integrations]) => {
        setMeetings(m);
        if (integrations) {
          setMomEligibility(momEligibilityFromIntegrations(integrations.integrations));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (selectedDate === todayStr) next.delete("date");
    else next.set("date", selectedDate);
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Rolling rail: 3 days back → 10 days ahead (keeps today near the left, easy to scan forward)
  const railDays = useMemo(
    () => Array.from({ length: 14 }, (_, i) => addDaysToDateKey(todayStr, i - 3)),
    [todayStr],
  );

  const countsByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of meetings) {
      const key = meetingDateKey(m);
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [meetings]);

  const dayMeetings = useMemo(() => {
    return meetings
      .filter((m) => meetingDateKey(m) === selectedDate)
      .filter((m) => (momPendingOnly ? needsMomStakeholderAction(m, momEligibility) : true))
      .sort((a, b) => meetingTimeLabel(a).localeCompare(meetingTimeLabel(b)));
  }, [meetings, selectedDate, momPendingOnly, momEligibility]);

  const friendly = formatFriendlyDate(selectedDate, todayStr);
  const longDate = new Date(`${selectedDate}T12:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const el = railRef.current?.querySelector<HTMLElement>(`[data-date="${selectedDate}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-5 page-enter">
        <div className="h-44 rounded-2xl bg-muted animate-pulse" />
        <div className="h-16 rounded-xl bg-muted animate-pulse" />
        <div className="h-28 rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 page-enter">
      {/* Composition header */}
      <section className="aurora-panel rounded-2xl border border-border/60 shadow-soft">
        <div className="relative z-[1] p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Your agenda
              </p>
              <div className="mt-3 flex items-end gap-3 flex-wrap">
                <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight leading-none">
                  <span className="text-gradient">{friendly}</span>
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mb-1 text-muted-foreground"
                  disabled={selectedDate === todayStr}
                  onClick={() => setSelectedDate(todayStr)}
                >
                  {selectedDate === todayStr ? "Current day" : "Back to today"}
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{longDate}</p>
              <p className="mt-3 text-sm text-foreground/80">
                <span className="font-heading font-semibold tabular-nums">
                  {dayMeetings.length}
                </span>{" "}
                meeting{dayMeetings.length === 1 ? "" : "s"}
                <span className="mx-2 text-border">·</span>
                {formatDurationTotal(totalMinutes(dayMeetings))}
              </p>
            </div>

            <div className="flex gap-2 shrink-0">
              <Button
                variant="secondary"
                className="gap-1.5 shine"
                onClick={() => navigate("/schedule")}
              >
                <Plus className="h-4 w-4" />
                New meeting
              </Button>
              <Button variant="outline" className="gap-1.5" onClick={() => navigate("/calendar")}>
                <CalendarDays className="h-4 w-4" />
                Month
              </Button>
            </div>
          </div>

          {momPendingOnly ? (
            <button
              type="button"
              className="mt-5 text-left text-sm text-amber-800 dark:text-amber-200 underline-offset-4 hover:underline"
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                next.delete("mom");
                setSearchParams(next);
              }}
            >
              Filtering by pending MOM approvals — clear filter
            </button>
          ) : null}
        </div>
      </section>

      {/* Day rail */}
      <section className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-xl"
          onClick={() => setSelectedDate((d) => addDaysToDateKey(d, -1))}
          aria-label="Previous day"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div
          ref={railRef}
          className="flex-1 overflow-x-auto scrollbar-thin"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex gap-1 min-w-max px-0.5 py-0.5">
            {railDays.map((dateKey) => {
              const selected = dateKey === selectedDate;
              const isToday = dateKey === todayStr;
              const count = countsByDate.get(dateKey) ?? 0;
              const dayNum = new Date(`${dateKey}T12:00:00`).getDate();

              return (
                <button
                  key={dateKey}
                  type="button"
                  data-date={dateKey}
                  onClick={() => setSelectedDate(dateKey)}
                  className={[
                    "relative flex w-[3.35rem] sm:w-14 flex-col items-center rounded-xl px-1.5 py-2.5 transition-colors",
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted/80",
                  ].join(" ")}
                >
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider ${
                      selected ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {formatShortWeekday(dateKey)}
                  </span>
                  <span className="mt-1 font-heading text-lg font-semibold tabular-nums leading-none">
                    {dayNum}
                  </span>
                  <span
                    className={`mt-1.5 h-1 w-1 rounded-full ${
                      count > 0
                        ? selected
                          ? "bg-secondary"
                          : "bg-secondary"
                        : "bg-transparent"
                    }`}
                  />
                  {isToday && !selected ? (
                    <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-secondary/70" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-xl"
          onClick={() => setSelectedDate((d) => addDaysToDateKey(d, 1))}
          aria-label="Next day"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </section>

      {/* Timeline agenda */}
      <section>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate + String(momPendingOnly)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.21, 0.6, 0.35, 1] }}
          >
            {dayMeetings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/80 bg-card/60 px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="font-heading text-lg font-semibold">Clear day</p>
                <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
                  No meetings on {friendly.toLowerCase()}. Schedule one, or browse another day on the
                  rail above.
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  {selectedDate !== todayStr ? (
                    <Button variant="outline" onClick={() => setSelectedDate(todayStr)}>
                      Today
                    </Button>
                  ) : null}
                  <Button
                    variant="secondary"
                    className="gap-1.5"
                    onClick={() => navigate("/schedule")}
                  >
                    <Plus className="h-4 w-4" />
                    Schedule
                  </Button>
                </div>
              </div>
            ) : (
              <ol className="relative space-y-0">
                {dayMeetings.map((m) => {
                  const isExternal =
                    m.platform === "google_meet" || m.platform === "microsoft_teams";
                  return (
                    <li key={m.id} className="relative flex gap-4 sm:gap-5">
                      {/* Time column + rail */}
                      <div className="flex w-14 sm:w-16 shrink-0 flex-col items-end pt-5">
                        <span className="font-heading text-sm font-semibold tabular-nums text-secondary">
                          {meetingTimeLabel(m)}
                        </span>
                        <span className="mt-0.5 text-[10px] tabular-nums text-muted-foreground">
                          {m.duration}m
                        </span>
                      </div>

                      <div className="relative flex w-4 shrink-0 justify-center">
                        <div className="absolute inset-y-0 w-px bg-border/80" />
                        <div
                          className={`relative z-[1] mt-6 h-2.5 w-2.5 rounded-full border-2 ${
                            m.status === "ongoing"
                              ? "border-secondary bg-secondary"
                              : m.status === "completed"
                                ? "border-muted-foreground/40 bg-muted"
                                : "border-secondary bg-background"
                          }`}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate(`/meetings/${m.id}`)}
                        className="group mb-3 min-w-0 flex-1 rounded-2xl border border-border/60 bg-card p-4 text-left shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-ring/35 hover:shadow-lifted"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-heading text-[15px] font-semibold truncate">
                                {m.title}
                              </h3>
                              {isExternal ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                                  <Video className="h-3 w-3" />
                                  {m.platform === "google_meet" ? "Meet" : "Teams"}
                                </span>
                              ) : null}
                            </div>
                            {m.description ? (
                              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                                {m.description}
                              </p>
                            ) : null}
                          </div>
                          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <StatusBadge status={m.status} />
                          <TagBadge tag={m.tag} />
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            {m.stakeholders.length}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock3 className="h-3.5 w-3.5" />
                            {m.duration} min
                          </span>
                          <MomStakeholderBadge meeting={m} />
                        </div>

                        {m.stakeholders.length > 0 ? (
                          <p className="mt-3 text-xs text-muted-foreground truncate border-t border-border/50 pt-3">
                            {m.stakeholders
                              .slice(0, 3)
                              .map((s) => s.name)
                              .join(" · ")}
                            {m.stakeholders.length > 3
                              ? ` · +${m.stakeholders.length - 3}`
                              : ""}
                          </p>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
