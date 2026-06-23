import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMeetings } from "@/lib/api";
import { Meeting } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { ChevronLeft, ChevronRight, Clock, CalendarDays, ListFilter, Plus, Users } from "lucide-react";
import { motion } from "framer-motion";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function CalendarView() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    getMeetings().then((m) => {
      setMeetings(m);
      setLoading(false);
    });
  }, []);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const meetingsByDate = meetings.reduce<Record<string, Meeting[]>>((acc, m) => {
    (acc[m.date] = acc[m.date] || []).push(m);
    return acc;
  }, {});

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); setSelectedDate(null); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); setSelectedDate(null); };
  const jumpToCurrentMonth = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDate(today.toISOString().split("T")[0]);
  };

  const todayStr = today.toISOString().split("T")[0];
  const selectedDateValue = selectedDate ?? todayStr;
  const selectedMeetings = meetingsByDate[selectedDateValue] || [];
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthMeetings = meetings.filter((m) => m.date.startsWith(monthPrefix));
  const monthMeetingCount = monthMeetings.length;
  const monthDaysWithMeetings = new Set(monthMeetings.map((m) => m.date)).size;
  const upcomingMeetings = meetings
    .filter((m) => m.date >= todayStr)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    .slice(0, 5);

  if (loading) return <div className="h-96 bg-muted rounded-xl animate-pulse" />;

  return (
    <div className="space-y-7 max-w-6xl">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Planning</p>
          <h1 className="text-[26px] leading-tight font-heading font-bold mt-1">
            <span className="text-gradient">Calendar</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Monthly planning with quick day agenda and upcoming focus list</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-1.5 shine" onClick={() => navigate("/schedule")}>
            <Plus className="h-4 w-4" /> Schedule Meeting
          </Button>
          <Button variant="outline" className="gap-1.5" onClick={jumpToCurrentMonth}>
            <CalendarDays className="h-4 w-4" /> Today
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-5">
        <Card className="p-5 md:p-6 animate-fade-in-up">
          <div className="flex items-center justify-between gap-2 mb-5 flex-wrap">
            <div className="flex items-center gap-1 rounded-full border border-border/60 bg-muted/30 p-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
              <h2 className="text-base font-heading font-semibold min-w-[160px] text-center">{MONTH_NAMES[month]} {year}</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <p className="text-xs text-muted-foreground rounded-full border border-border/60 px-3 py-1.5">
              {formatDate(selectedDateValue)}
            </p>
          </div>

          <div className="mb-5 grid grid-cols-2 sm:grid-cols-3 divide-x divide-border/60 rounded-xl border border-border/60 bg-muted/20">
            <div className="px-4 py-3">
              <p className="text-[11px] text-muted-foreground">Meetings this month</p>
              <p className="text-xl font-heading font-semibold tabular-nums mt-0.5">{monthMeetingCount}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[11px] text-muted-foreground">Busy days</p>
              <p className="text-xl font-heading font-semibold tabular-nums mt-0.5">{monthDaysWithMeetings}</p>
            </div>
            <div className="px-4 py-3 hidden sm:block">
              <p className="text-[11px] text-muted-foreground">Selected date</p>
              <p className="text-sm font-medium mt-1.5">{formatDate(selectedDateValue)}</p>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {DAY_NAMES.map((d) => (
              <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground py-2">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayMeetings = meetingsByDate[dateStr] || [];
              const hasMeetings = dayMeetings.length > 0;
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
                    <div className={`mt-1 text-[10px] leading-tight truncate ${isSelected ? "text-secondary-foreground/90" : "text-muted-foreground"}`}>
                      {dayMeetings.length} meeting{dayMeetings.length > 1 ? "s" : ""}
                    </div>
                  )}
                  {hasMeetings && (
                    <span className={`absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full ${isSelected ? "bg-secondary-foreground" : "bg-secondary"}`} />
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-5">
              <h3 className="font-heading font-semibold mb-1 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <ListFilter className="h-3.5 w-3.5" />
                </span>
                Day Agenda
              </h3>
              <p className="text-xs text-muted-foreground mb-3 mt-1">{formatDate(selectedDateValue)}</p>
              {selectedMeetings.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/70 py-8 text-center">
                  <CalendarDays className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                  <p className="text-muted-foreground text-sm">No meetings on this date</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedMeetings
                    .slice()
                    .sort((a, b) => a.time.localeCompare(b.time))
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
                          <span className="text-xs font-heading font-semibold tabular-nums text-secondary">{m.time}</span>
                          <span className="mt-1.5 h-full w-px bg-border/60 group-last:hidden" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-medium text-sm truncate">{m.title}</p>
                            <StatusBadge status={m.status} />
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {m.duration} min</span>
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {m.stakeholders.length} attendees</span>
                          </p>
                        </div>
                      </motion.div>
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
              Upcoming Meetings
            </h3>
            <p className="text-xs text-muted-foreground mb-3 mt-1">Next 5 upcoming slots</p>
            {upcomingMeetings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming meetings available.</p>
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
                    <p className="text-xs text-muted-foreground mt-1 tabular-nums">{formatDate(m.date)} · {m.time}</p>
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
