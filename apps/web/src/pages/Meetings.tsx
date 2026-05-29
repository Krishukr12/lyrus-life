import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMeetings } from "@/lib/api";
import { Meeting, MeetingStatus, MeetingTag } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge, TagBadge } from "@/components/StatusBadge";
import { MomStakeholderBadge } from "@/components/MomStakeholderBadge";
import { PendingMomAlert } from "@/components/PendingMomAlert";
import { filterMeetingsPendingMom, needsMomStakeholderAction } from "@/lib/mom-status";
import { Clock, Users, Search, CalendarDays, Plus, Sparkles, CheckCircle2, Timer, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const momFilter = searchParams.get("mom") === "pending" ? "pending" : "all";

  useEffect(() => {
    getMeetings().then((m) => { setMeetings(m); setLoading(false); });
  }, []);

  useEffect(() => {
    if (searchParams.get("mom") === "pending") {
      setStatusFilter("all");
    }
  }, [searchParams]);

  const pendingMomCount = useMemo(() => filterMeetingsPendingMom(meetings).length, [meetings]);

  const filtered = meetings.filter((m) => {
    if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    if (tagFilter !== "all" && m.tag !== tagFilter) return false;
    if (momFilter === "pending" && !needsMomStakeholderAction(m)) return false;
    return true;
  }).sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  const todayStr = new Date().toISOString().split("T")[0];
  const upcoming = meetings.filter((m) => m.status === "upcoming");
  const ongoing = meetings.filter((m) => m.status === "ongoing");
  const completed = meetings.filter((m) => m.status === "completed");
  const completionRate = meetings.length ? Math.round((completed.length / meetings.length) * 100) : 0;
  const upcomingThisWeek = meetings.filter((m) => m.date >= todayStr && m.date <= new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]).length;
  const momGenerated = meetings.filter((m) => m.mom).length;
  const momCoverage = meetings.length ? Math.round((momGenerated / meetings.length) * 100) : 0;
  const totalParticipants = meetings.reduce((sum, m) => sum + m.stakeholders.length, 0);

  const statusConfig: Record<MeetingStatus, { rank: number }> = {
    ongoing: { rank: 0 },
    upcoming: { rank: 1 },
    completed: { rank: 2 },
  };

  const featuredMeetings = filtered
    .slice()
    .sort((a, b) => {
      const statusPriority = statusConfig[a.status].rank - statusConfig[b.status].rank;
      if (statusPriority !== 0) return statusPriority;
      return `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`);
    })
    .slice(0, 3);

  if (loading) {
    return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="rounded-2xl border bg-gradient-to-r from-secondary/15 via-secondary/5 to-transparent p-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-heading font-bold">Meetings</h1>
            <p className="text-muted-foreground text-sm mt-1">A focused view of all meetings with planning and execution insights</p>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={() => navigate("/schedule")}>
              <Plus className="h-4 w-4" /> New Meeting
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => navigate("/calendar")}>
              <CalendarDays className="h-4 w-4" /> Calendar
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="rounded-lg border bg-background/70 p-3">
            <p className="text-xs text-muted-foreground">Total Meetings</p>
            <p className="text-xl font-heading font-semibold mt-1">{meetings.length}</p>
          </div>
          <div className="rounded-lg border bg-background/70 p-3">
            <p className="text-xs text-muted-foreground">Completion Rate</p>
            <p className="text-xl font-heading font-semibold mt-1">{completionRate}%</p>
          </div>
          <div className="rounded-lg border bg-background/70 p-3">
            <p className="text-xs text-muted-foreground">MoM Coverage</p>
            <p className="text-xl font-heading font-semibold mt-1">{momCoverage}%</p>
          </div>
          <div className="rounded-lg border bg-background/70 p-3">
            <p className="text-xs text-muted-foreground">Participants Impacted</p>
            <p className="text-xl font-heading font-semibold mt-1">{totalParticipants}</p>
          </div>
        </div>
      </div>

      <PendingMomAlert meetings={meetings} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { label: "Upcoming", value: upcoming.length, icon: Timer, tone: "text-warning", hint: `${upcomingThisWeek} this week` },
          { label: "Ongoing", value: ongoing.length, icon: Sparkles, tone: "text-secondary", hint: "Needs active follow-up" },
          { label: "Completed", value: completed.length, icon: CheckCircle2, tone: "text-success", hint: "Archived outcomes" },
          { label: "All Meetings", value: meetings.length, icon: CalendarDays, tone: "text-primary", hint: "Across all tags" },
        ].map((item) => (
          <Card key={item.label} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-heading font-bold mt-1">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.hint}</p>
              </div>
              <item.icon className={`h-5 w-5 ${item.tone}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search meetings..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Tag" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
            <SelectItem value="client">Client</SelectItem>
            <SelectItem value="vendor">Vendor</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={momFilter}
          onValueChange={(v) => {
            if (v === "pending") setSearchParams({ mom: "pending" });
            else setSearchParams({});
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="MOM" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All MOM status</SelectItem>
            <SelectItem value="pending">
              Pending for stakeholders{pendingMomCount > 0 ? ` (${pendingMomCount})` : ""}
            </SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2" onClick={() => {
          setSearch("");
          setStatusFilter("all");
          setTagFilter("all");
          setSearchParams({});
        }}>
          Reset Filters
        </Button>
      </div>

      {featuredMeetings.length > 0 && (
        <Card className="p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-heading font-semibold">Priority Meetings</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground gap-1" onClick={() => navigate("/calendar")}>
              Open Calendar <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {featuredMeetings.map((m) => (
              <button
                key={m.id}
                onClick={() => navigate(`/meetings/${m.id}`)}
                className="text-left rounded-lg border p-3 hover:bg-muted/30 transition-colors"
              >
                <p className="font-medium truncate">{m.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.date} · {m.time}</p>
                <div className="flex items-center gap-2 mt-2">
                  <TagBadge tag={m.tag} />
                  <StatusBadge status={m.status} />
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {filtered.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No meetings found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className="p-4 cursor-pointer hover:shadow-md transition-all" onClick={() => navigate(`/meetings/${m.id}`)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-medium truncate">{m.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{m.description}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {m.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {m.time} · {m.duration}min</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {m.stakeholders.length}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                    <div className="flex items-center gap-2">
                      <TagBadge tag={m.tag} />
                      <StatusBadge status={m.status} />
                    </div>
                    <MomStakeholderBadge meeting={m} />
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {m.stakeholders.length} stakeholder{m.stakeholders.length === 1 ? "" : "s"}
                  </span>
                  <span>{m.stakeholders[0]?.name ?? "—"}{m.stakeholders.length > 1 ? ` +${m.stakeholders.length - 1}` : ""}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
