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
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-heading font-bold">Calendar</h1>
        <p className="text-muted-foreground text-sm mt-1">Monthly planning with quick day agenda and upcoming focus list</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-5">
        <Card className="p-5 md:p-6">
          <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-5 w-5" /></Button>
              <h2 className="text-lg font-heading font-semibold min-w-[180px] text-center">{MONTH_NAMES[month]} {year}</h2>
              <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-5 w-5" /></Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={jumpToCurrentMonth} className="gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" /> Today
              </Button>
              <Button size="sm" className="gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={() => navigate("/schedule")}>
                <Plus className="h-3.5 w-3.5" /> Schedule
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
            <div className="rounded-lg border p-3 bg-muted/20">
              <p className="text-xs text-muted-foreground">Meetings this month</p>
              <p className="text-lg font-heading font-semibold mt-1">{monthMeetingCount}</p>
            </div>
            <div className="rounded-lg border p-3 bg-muted/20">
              <p className="text-xs text-muted-foreground">Busy days</p>
              <p className="text-lg font-heading font-semibold mt-1">{monthDaysWithMeetings}</p>
            </div>
            <div className="rounded-lg border p-3 bg-muted/20">
              <p className="text-xs text-muted-foreground">Selected date</p>
              <p className="text-sm font-medium mt-1">{formatDate(selectedDateValue)}</p>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {DAY_NAMES.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
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
                  className={`relative p-2 h-16 rounded-xl text-sm transition-all border
                    ${isSelected ? "bg-secondary text-secondary-foreground font-bold border-secondary" : "border-transparent"}
                    ${isToday && !isSelected ? "bg-primary/10 font-semibold border-primary/30" : ""}
                    ${!isSelected && !isToday ? "hover:bg-muted hover:border-border" : ""}
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
                <ListFilter className="h-4 w-4 text-secondary" />
                Day Agenda
              </h3>
              <p className="text-xs text-muted-foreground mb-3">{formatDate(selectedDateValue)}</p>
              {selectedMeetings.length === 0 ? (
                <p className="text-muted-foreground text-sm">No meetings on this date</p>
              ) : (
                <div className="space-y-2.5">
                  {selectedMeetings
                    .slice()
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((m) => (
                      <div
                        key={m.id}
                        className="p-3 rounded-lg bg-muted/40 cursor-pointer hover:bg-muted transition-colors border"
                        onClick={() => navigate(`/meetings/${m.id}`)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-sm">{m.title}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" /> {m.time} · {m.duration} min
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Users className="h-3 w-3" /> {m.stakeholders.length} attendees
                            </p>
                          </div>
                          <StatusBadge status={m.status} />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </motion.div>

          <Card className="p-5">
            <h3 className="font-heading font-semibold mb-1">Upcoming Meetings</h3>
            <p className="text-xs text-muted-foreground mb-3">Next 5 upcoming slots</p>
            {upcomingMeetings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming meetings available.</p>
            ) : (
              <div className="space-y-2.5">
                {upcomingMeetings.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => navigate(`/meetings/${m.id}`)}
                    className="w-full text-left rounded-lg border p-3 hover:bg-muted/40 transition-colors"
                  >
                    <p className="font-medium text-sm truncate">{m.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(m.date)} · {m.time}</p>
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
