import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError, getMeetings } from "@/lib/api";
import {
  APP_TIMEZONE_LABEL,
  formatScheduleDateHeading,
  meetingDateKey,
  meetingTimeLabel,
  toLocalDateKey,
  toLocalTime,
  todayLocalDateKey,
} from "@/lib/datetime";
import { Meeting } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import {
  importGoogleCalendarMeetEvent,
  listGoogleCalendarMeetEvents,
  type CalendarMeetEvent,
} from "@/services/integrations-api";
import { getMyIntegrations } from "@/services/integrations-api";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarDays,
  ListFilter,
  Plus,
  Users,
  RefreshCw,
  Video,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDate(dateStr: string) {
  return formatScheduleDateHeading(dateStr);
}

type CalendarGoogleEvent = CalendarMeetEvent & {
  date: string;
  time: string;
  imported: boolean;
};

export default function CalendarView() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [importingEventId, setImportingEventId] = useState<string | null>(null);
  const importInFlightRef = useRef<Set<string>>(new Set());
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: integrationsData, refetch: refetchIntegrations } = useQuery({
    queryKey: ["user", "integrations"],
    queryFn: getMyIntegrations,
  });

  const googleConnected =
    integrationsData?.integrations.find((i) => i.provider === "google")
      ?.connected ?? false;

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  const {
    data: googleData,
    isLoading: googleLoading,
    refetch: refetchGoogle,
    error: googleError,
  } = useQuery({
    queryKey: ["user", "calendar", "google", "events", "calendar-view", monthKey],
    queryFn: () => listGoogleCalendarMeetEvents({ month: monthKey }),
    enabled: googleConnected,
    retry: false,
  });

  useEffect(() => {
    if (!(googleError instanceof ApiError)) return;
    if (googleError.code === "google_not_connected" || googleError.status === 409) {
      void refetchIntegrations();
    }
  }, [googleError, refetchIntegrations]);

  const refreshMeetings = useCallback(async () => {
    try {
      const m = await getMeetings();
      setMeetings(m);
      return m;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load meetings",
      );
      return null;
    }
  }, []);

  useEffect(() => {
    void refreshMeetings().finally(() => setLoading(false));
  }, [refreshMeetings]);

  useEffect(() => {
    if (!googleData?.syncSummary) return;
    const { imported, alreadyPresent, failed } = googleData.syncSummary as {
      imported: number;
      alreadyPresent?: number;
      failed?: number;
      skipped?: number;
    };
    // Always reload platform meetings after a sync attempt (including "already present").
    void refreshMeetings();
    if (imported > 0) {
      toast.success(
        imported === 1
          ? "1 Google Calendar meeting added to Meeting Desk AI"
          : `${imported} Google Calendar meetings added to Meeting Desk AI`,
      );
    } else if ((failed ?? 0) > 0) {
      toast.error("Some Google Calendar events could not be synced. Try Sync Google again.");
    } else if ((alreadyPresent ?? googleData.syncSummary.skipped) > 0) {
      toast.message("Google Calendar is up to date");
    }
  }, [googleData?.syncSummary, refreshMeetings]);

  const importedKeys = useMemo(() => {
    const calendarKeys = new Set<string>();
    for (const m of meetings) {
      if (!m.calendarEventId) continue;
      calendarKeys.add(m.calendarEventId);
      // Support both "calendarId:eventId" and bare eventId storage formats.
      const colon = m.calendarEventId.indexOf(":");
      if (colon >= 0) calendarKeys.add(m.calendarEventId.slice(colon + 1));
    }
    return calendarKeys;
  }, [meetings]);

  const googleEvents: CalendarGoogleEvent[] = useMemo(() => {
    return (googleData?.events ?? []).map((ev) => {
      const calendarKey = `${ev.calendarId}:${ev.eventId}`;
      // Match by instance calendar event id only — Meet join URLs are reused across
      // recurring series and must not hide later occurrences from the calendar.
      const imported =
        importedKeys.has(calendarKey) || importedKeys.has(ev.eventId);
      return {
        ...ev,
        date: toLocalDateKey(ev.startDateTimeIso),
        time: toLocalTime(ev.startDateTimeIso),
        imported,
      };
    });
  }, [googleData?.events, importedKeys]);

  const googleNotImported = googleEvents.filter((e) => !e.imported);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const meetingsByDate = meetings.reduce<Record<string, Meeting[]>>(
    (acc, m) => {
      const key = meetingDateKey(m);
      (acc[key] = acc[key] || []).push(m);
      return acc;
    },
    {},
  );

  const googleByDate = googleNotImported.reduce<
    Record<string, CalendarGoogleEvent[]>
  >((acc, ev) => {
    (acc[ev.date] = acc[ev.date] || []).push(ev);
    return acc;
  }, {});

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
    setSelectedDate(null);
  };
  const jumpToCurrentMonth = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDate(todayLocalDateKey());
  };

  const todayStr = todayLocalDateKey();
  const selectedDateValue = selectedDate ?? todayStr;
  const selectedMeetings = meetingsByDate[selectedDateValue] || [];
  const selectedGoogleEvents = (googleByDate[selectedDateValue] || []).filter(
    (e) => !e.imported,
  );
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthMeetings = meetings.filter((m) =>
    meetingDateKey(m).startsWith(monthPrefix),
  );
  const monthGoogleEvents = googleNotImported.filter((e) =>
    e.date.startsWith(monthPrefix),
  );
  const monthMeetingCount = monthMeetings.length + monthGoogleEvents.length;
  const monthDaysWithMeetings = new Set([
    ...monthMeetings.map((m) => meetingDateKey(m)),
    ...monthGoogleEvents.map((e) => e.date),
  ]).size;

  const upcomingMeetings = meetings
    .filter((m) => meetingDateKey(m) >= todayStr)
    .sort((a, b) =>
      `${meetingDateKey(a)}T${meetingTimeLabel(a)}`.localeCompare(
        `${meetingDateKey(b)}T${meetingTimeLabel(b)}`,
      ),
    )
    .slice(0, 5);

  const handleImportGoogleEvent = async (ev: CalendarGoogleEvent) => {
    const importKey = `${ev.calendarId}:${ev.eventId}`;
    if (importInFlightRef.current.has(importKey)) return;
    importInFlightRef.current.add(importKey);
    setImportingEventId(ev.eventId);
    try {
      const result = await importGoogleCalendarMeetEvent(
        ev.eventId,
        ev.calendarId,
      );
      const meeting = result.meeting as { id?: string };
      if (!meeting?.id) {
        toast.error("Import succeeded but meeting id is missing");
        return;
      }
      toast.success(
        ev.importable
          ? "Google event imported — recording bot scheduled when available"
          : "Google Calendar event imported into Meeting Desk AI",
      );
      await refreshMeetings();
      void refetchGoogle();
      navigate(`/meetings/${meeting.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to import meeting",
      );
    } finally {
      importInFlightRef.current.delete(importKey);
      setImportingEventId(null);
    }
  };

  if (loading)
    return <div className="h-96 bg-muted rounded-xl animate-pulse" />;

  return (
    <div className="space-y-7 max-w-6xl">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Planning
          </p>
          <h1 className="text-[26px] leading-tight font-heading font-bold mt-1">
            <span className="text-gradient">Calendar</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Times shown in {APP_TIMEZONE_LABEL}. Platform meetings plus Google Meet events from{" "}
            {googleData?.connectedAccountEmail ?? "your connected account"}
          </p>
        </div>
        <div className="flex gap-2">
          {googleConnected && (
            <Button
              variant="outline"
              className="gap-1.5"
              disabled={googleLoading}
              onClick={() => void refetchGoogle()}
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Sync Google
            </Button>
          )}
          <Button
            variant="secondary"
            className="gap-1.5 shine"
            onClick={() => navigate("/schedule")}
          >
            <Plus className="h-4 w-4" /> Schedule Meeting
          </Button>
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={jumpToCurrentMonth}
          >
            <CalendarDays className="h-4 w-4" /> Today
          </Button>
        </div>
      </div>

      {googleConnected && googleError && (
        <Card className="p-4 border-amber-500/30 bg-amber-500/5 text-sm text-amber-800 dark:text-amber-200 space-y-3">
          <p>
            Could not load Google Calendar:{" "}
            {googleError instanceof Error ? googleError.message : "Unknown error"}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate("/settings/integrations")}
            >
              Reconnect Google
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                void queryClient.invalidateQueries({ queryKey: ["user", "integrations"] });
                void refetchGoogle();
              }}
            >
              Retry sync
            </Button>
          </div>
        </Card>
      )}

      {!googleConnected && (
        <Card className="p-4 border-amber-500/30 bg-amber-500/5 text-sm text-amber-800 dark:text-amber-200 space-y-3">
          <p>
            Google is not connected. Connect your Google account to pull today&apos;s calendar
            meetings into Meeting Desk AI.
          </p>
          <Button size="sm" variant="secondary" onClick={() => navigate("/settings/integrations")}>
            Open Integrations
          </Button>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-5">
        <Card className="p-5 md:p-6 animate-fade-in-up">
          <div className="flex items-center justify-between gap-2 mb-5 flex-wrap">
            <div className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/30 p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={prevMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-base font-heading font-semibold min-w-[160px] text-center">
                {MONTH_NAMES[month]} {year}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={nextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground rounded-full border border-border/60 px-3 py-1.5">
              {formatDate(selectedDateValue)}
            </p>
          </div>

          <div className="mb-5 grid grid-cols-2 sm:grid-cols-3 divide-x divide-border/60 rounded-xl border border-border/60 bg-muted/20">
            <div className="px-4 py-3">
              <p className="text-[11px] text-muted-foreground">
                Meetings this month
              </p>
              <p className="text-xl font-heading font-semibold tabular-nums mt-0.5">
                {monthMeetingCount}
              </p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[11px] text-muted-foreground">Busy days</p>
              <p className="text-xl font-heading font-semibold tabular-nums mt-0.5">
                {monthDaysWithMeetings}
              </p>
            </div>
            <div className="px-4 py-3 hidden sm:block">
              <p className="text-[11px] text-muted-foreground">
                Google (not imported)
              </p>
              <p className="text-xl font-heading font-semibold tabular-nums mt-0.5">
                {googleNotImported.length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {DAY_NAMES.map((d) => (
              <div
                key={d}
                className="text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground py-2"
              >
                {d}
              </div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayMeetings = meetingsByDate[dateStr] || [];
              const dayGoogle = googleByDate[dateStr] || [];
              const totalCount = dayMeetings.length + dayGoogle.length;
              const hasMeetings = totalCount > 0;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDateValue;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`relative p-2 h-16 rounded-xl text-sm transition-all duration-200 border
                    ${isSelected ? "bg-gradient-to-br from-secondary to-secondary/85 text-secondary-foreground font-bold border-secondary shadow-md shadow-secondary/25 scale-[1.02]" : "border-transparent"}
                    ${isToday && !isSelected ? "bg-primary/10 font-semibold border-primary/30" : ""}
                    ${!isSelected && !isToday ? "hover:bg-muted hover:border-border hover:-translate-y-0.5" : ""}
                  `}
                >
                  <div className="text-left">{day}</div>
                  {hasMeetings && (
                    <div
                      className={`mt-1 text-[10px] leading-tight truncate ${isSelected ? "text-secondary-foreground/90" : "text-muted-foreground"}`}
                    >
                      {totalCount} item{totalCount > 1 ? "s" : ""}
                    </div>
                  )}
                  {hasMeetings && (
                    <span
                      className={`absolute bottom-1.5 right-1.5 flex gap-0.5`}
                    >
                      {dayMeetings.length > 0 && (
                        <span
                          className={`w-2 h-2 rounded-full ${isSelected ? "bg-secondary-foreground" : "bg-secondary"}`}
                        />
                      )}
                      {dayGoogle.length > 0 && (
                        <span
                          className={`w-2 h-2 rounded-full border ${isSelected ? "border-secondary-foreground" : "border-primary bg-primary/30"}`}
                        />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-5">
              <h3 className="font-heading font-semibold mb-1 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <ListFilter className="h-3.5 w-3.5" />
                </span>
                Day Agenda
              </h3>
              <p className="text-xs text-muted-foreground mb-3 mt-1">
                {formatDate(selectedDateValue)}
              </p>
              {selectedMeetings.length === 0 &&
              selectedGoogleEvents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/70 py-8 text-center">
                  <CalendarDays className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                  <p className="text-muted-foreground text-sm">
                    No meetings on this date
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedMeetings
                    .slice()
                    .sort((a, b) =>
                      meetingTimeLabel(a).localeCompare(meetingTimeLabel(b)),
                    )
                    .map((m, idx) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group flex items-start gap-3 p-3 rounded-xl cursor-pointer hover:bg-muted/40 transition-colors border border-transparent hover:border-border/60"
                        onClick={() => navigate(`/meetings/${m.id}`)}
                      >
                        <div className="flex flex-col items-center pt-0.5">
                          <span className="text-xs font-heading font-semibold tabular-nums text-secondary">
                            {meetingTimeLabel(m)}
                            <span className="block text-[10px] font-medium text-muted-foreground">
                              {APP_TIMEZONE_LABEL}
                            </span>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-medium text-sm truncate">
                              {m.title}
                            </p>
                            <StatusBadge status={m.status} />
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {m.duration} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />{" "}
                              {m.stakeholders.length} attendees
                            </span>
                          </p>
                        </div>
                      </motion.div>
                    ))}

                  {selectedGoogleEvents
                    .slice()
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((ev, idx) => (
                      <div
                        key={`${ev.calendarId}:${ev.eventId}`}
                        className="flex items-start gap-3 p-3 rounded-xl border border-dashed border-primary/40 bg-primary/5"
                      >
                        <div className="flex flex-col items-center pt-0.5">
                          <span className="text-xs font-heading font-semibold tabular-nums text-primary">
                            {ev.time}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm truncate">
                              {ev.title}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-[10px] shrink-0"
                            >
                              {ev.importable ? "Google Meet" : "Calendar"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {ev.calendarName}
                          </p>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="mt-2 h-7 gap-1 text-xs"
                            disabled={importingEventId === ev.eventId}
                            onClick={() => void handleImportGoogleEvent(ev)}
                          >
                            {importingEventId === ev.eventId ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Video className="h-3 w-3" />
                            )}
                            {ev.importable ? "Import & track" : "Import event"}
                          </Button>
                          {!ev.importable ? (
                            <p className="text-[11px] text-muted-foreground mt-1">
                              No Google Meet link — imported without recording bot
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </motion.div>

          <Card className="p-5">
            <h3 className="font-heading font-semibold mb-1 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarDays className="h-3.5 w-3.5" />
              </span>
              Upcoming (platform)
            </h3>
            <p className="text-xs text-muted-foreground mb-3 mt-1">
              Imported meetings in Meeting Desk AI
            </p>
            {upcomingMeetings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No upcoming imported meetings.
              </p>
            ) : (
              <div className="space-y-2">
                {upcomingMeetings.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => navigate(`/meetings/${m.id}`)}
                    className="group/up w-full text-left rounded-xl border border-border/60 p-3 hover:bg-muted/40 hover:border-ring/30 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">{m.title}</p>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover/up:opacity-100 group-hover/up:translate-x-0" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                      {formatDate(meetingDateKey(m))} · {meetingTimeLabel(m)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
