import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createMeeting, getPeopleSuggestions, type PersonSuggestion } from "@/lib/api";
import { getMyIntegrations } from "@/services/integrations-api";
import { MeetingTag, Stakeholder } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Link2,
  Loader2,
  Plus,
  Users,
  Video,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { isWorkspaceLockError } from "@/lib/workspace-access";
import {
  APP_TIMEZONE_LABEL,
  APP_TIMEZONE_LONG,
  addDaysToDateKey,
  formatFriendlyDate,
  formatScheduleDateHeading,
  formatScheduleWhenPreview,
  nextQuarterHourIst,
  todayLocalDateKey,
} from "@/lib/datetime";

type Platform = "lyrus" | "google_meet" | "microsoft_teams";

const PLATFORM_OPTIONS: Array<{
  id: Platform;
  name: string;
  blurb: string;
  icon: typeof Video;
}> = [
  {
    id: "google_meet",
    name: "Google Meet",
    blurb: "Bot joins and records for MOM",
    icon: Video,
  },
  {
    id: "lyrus",
    name: "Meeting Desk AI",
    blurb: "Built-in room + recording",
    icon: Video,
  },
  {
    id: "microsoft_teams",
    name: "Microsoft Teams",
    blurb: "Bot joins and records for MOM",
    icon: Video,
  },
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ScheduleMeeting() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayLocalDateKey());
  const [time, setTime] = useState(nextQuarterHourIst());
  const [duration, setDuration] = useState("60");
  const todayKey = todayLocalDateKey();
  const tomorrowKey = addDaysToDateKey(todayKey, 1);
  const [tag, setTag] = useState<MeetingTag>("internal");
  const [platform, setPlatform] = useState<Platform>("google_meet");
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [sName, setSName] = useState("");
  const [sEmail, setSEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [suggestions, setSuggestions] = useState<PersonSuggestion[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [peopleQuery, setPeopleQuery] = useState("");
  const suggestTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: integrationsData } = useQuery({
    queryKey: ["user", "integrations"],
    queryFn: getMyIntegrations,
  });

  const googleConnected =
    integrationsData?.integrations.find((i) => i.provider === "google")?.connected ?? false;
  const microsoftConnected =
    integrationsData?.integrations.find((i) => i.provider === "microsoft")?.connected ?? false;

  const platformAvailable: Record<Platform, boolean> = {
    lyrus: true,
    google_meet: googleConnected,
    microsoft_teams: microsoftConnected,
  };

  useEffect(() => {
    if (!suggestionsOpen) return;
    if (suggestTimer.current) clearTimeout(suggestTimer.current);
    suggestTimer.current = setTimeout(() => {
      void getPeopleSuggestions(peopleQuery.trim())
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
    }, 200);
    return () => {
      if (suggestTimer.current) clearTimeout(suggestTimer.current);
    };
  }, [peopleQuery, suggestionsOpen]);

  // If Google isn't connected, fall back to built-in once we know.
  useEffect(() => {
    if (integrationsData && platform === "google_meet" && !googleConnected) {
      setPlatform("lyrus");
    }
  }, [integrationsData, googleConnected, platform]);

  const visibleSuggestions = suggestions.filter(
    (sg) => !stakeholders.some((s) => s.email.toLowerCase() === sg.email.toLowerCase()),
  );

  const openSuggestions = (query: string) => {
    setPeopleQuery(query);
    setSuggestionsOpen(true);
  };

  const handlePeopleBlur = () => {
    blurTimer.current = setTimeout(() => setSuggestionsOpen(false), 150);
  };

  const handlePeopleFocus = (query: string) => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    openSuggestions(query);
  };

  const pickSuggestion = (person: PersonSuggestion) => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setStakeholders((prev) =>
      prev.some((s) => s.email.toLowerCase() === person.email.toLowerCase())
        ? prev
        : [...prev, { name: person.name, email: person.email }],
    );
    setSName("");
    setSEmail("");
    setPeopleQuery("");
    setSuggestionsOpen(false);
  };

  const addStakeholder = () => {
    if (!sName.trim() || !sEmail.trim()) return;
    setStakeholders([...stakeholders, { name: sName.trim(), email: sEmail.trim() }]);
    setSName("");
    setSEmail("");
    setSuggestionsOpen(false);
  };

  const removeStakeholder = (i: number) => {
    setStakeholders(stakeholders.filter((_, idx) => idx !== i));
  };

  const buildStakeholderList = (): Stakeholder[] => {
    const list = [...stakeholders];
    const name = sName.trim();
    const email = sEmail.trim();
    if (name && email) {
      const exists = list.some((s) => s.email.toLowerCase() === email.toLowerCase());
      if (!exists) list.push({ name, email });
    }
    return list;
  };

  const previewStakeholders = useMemo(() => buildStakeholderList(), [stakeholders, sName, sEmail]);
  const platformLabel =
    PLATFORM_OPTIONS.find((p) => p.id === platform)?.name ?? "Meeting Desk AI";
  const whenLabel = formatScheduleWhenPreview(date, time, Number(duration) || 60, todayKey);
  const dayChip = formatFriendlyDate(date, todayKey);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) {
      toast.error("Please fill in title, date, and time");
      return;
    }

    const name = sName.trim();
    const email = sEmail.trim();
    if ((name && !email) || (!name && email)) {
      toast.error("Enter both name and email for a stakeholder, or leave both empty");
      return;
    }

    if (!platformAvailable[platform]) {
      toast.error("Connect this platform in Integrations before scheduling");
      return;
    }

    const finalStakeholders = buildStakeholderList();
    if (finalStakeholders.length === 0) {
      toast.error("Add at least one stakeholder — calendar invites are emailed on schedule.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createMeeting({
        title,
        description,
        date,
        time,
        duration: parseInt(duration, 10),
        tag,
        platform,
        stakeholders: finalStakeholders,
      });

      const sent = result.invites.filter((i) => i.status === "sent" || i.status === "logged").length;
      const failed = result.invites.filter((i) => i.status === "failed").length;

      if (sent > 0) {
        toast.success(`Meeting scheduled — invites sent to ${sent} stakeholder(s).`, {
          duration: 5000,
        });
      }
      if (failed > 0) {
        toast.warning(`${failed} invite(s) could not be delivered. Resend from the meeting page.`);
      }

      navigate(`/meetings/${result.meeting.id}`);
    } catch (error) {
      if (isWorkspaceLockError(error)) return;
      const message = error instanceof Error ? error.message : "Failed to schedule meeting";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 page-enter">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="gap-1 text-muted-foreground -ml-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <section className="aurora-panel rounded-2xl border border-border/60 shadow-soft">
        <div className="relative z-[1] flex flex-wrap items-end justify-between gap-4 p-6 md:p-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              New meeting
            </p>
            <h1 className="mt-2 font-heading text-3xl md:text-4xl font-bold tracking-tight">
              <span className="text-gradient">Schedule</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-lg">
              Set the agenda, pick a time, choose where everyone joins, and invite stakeholders.
            </p>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-6 items-start">
        <div className="space-y-5">
          {/* What */}
          <section className="rounded-2xl border border-border/60 bg-card p-5 md:p-6 shadow-soft space-y-4">
            <div>
              <h2 className="font-heading text-base font-semibold">What is this about?</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Title and agenda for the invite</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Q1 Production Review"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Agenda</Label>
              <Textarea
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What will you cover? Goals, decisions, or talking points…"
                rows={3}
              />
            </div>
            <div className="space-y-2 max-w-xs">
              <Label>Type</Label>
              <Select value={tag} onValueChange={(v) => setTag(v as MeetingTag)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* When */}
          <section className="rounded-2xl border border-border/60 bg-card p-5 md:p-6 shadow-soft space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-heading text-base font-semibold">When</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  All times are in {APP_TIMEZONE_LONG}
                </p>
              </div>
              <span className="inline-flex items-center rounded-full border border-secondary/30 bg-secondary/10 px-2.5 py-1 text-[11px] font-semibold text-secondary">
                {APP_TIMEZONE_LABEL}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  { key: todayKey, label: "Today" },
                  { key: tomorrowKey, label: "Tomorrow" },
                ] as const
              ).map((chip) => {
                const selected = date === chip.key;
                return (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => setDate(chip.key)}
                    className={[
                      "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors border",
                      selected
                        ? "border-secondary bg-secondary text-secondary-foreground"
                        : "border-border/70 bg-background text-muted-foreground hover:border-ring/40 hover:text-foreground",
                    ].join(" ")}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-border/50 bg-muted/30 px-3.5 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                You are scheduling for
              </p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                {formatScheduleDateHeading(date, todayKey)}
              </p>
              {dayChip === "Today" || dayChip === "Tomorrow" ? null : (
                <p className="mt-0.5 text-xs text-muted-foreground">{dayChip}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  min={todayKey}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Start time ({APP_TIMEZONE_LABEL}) *</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[15, 30, 45, 60, 90, 120].map((d) => (
                      <SelectItem key={d} value={String(d)}>
                        {d} min
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="text-sm font-medium text-foreground/90 flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-secondary shrink-0" />
              <span>{whenLabel}</span>
            </p>
          </section>

          {/* Where */}
          <section className="rounded-2xl border border-border/60 bg-card p-5 md:p-6 shadow-soft space-y-4">
            <div>
              <h2 className="font-heading text-base font-semibold">Where do people join?</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Google Meet is selected by default when connected
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PLATFORM_OPTIONS.map((opt) => {
                const available = platformAvailable[opt.id];
                const selected = platform === opt.id;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={!available}
                    onClick={() => setPlatform(opt.id)}
                    className={[
                      "relative rounded-xl border p-3.5 text-left transition-all",
                      selected
                        ? "border-secondary bg-accent/60 shadow-soft"
                        : available
                          ? "border-border/70 bg-background hover:border-ring/40 hover:bg-muted/40"
                          : "border-border/40 bg-muted/20 opacity-55 cursor-not-allowed",
                    ].join(" ")}
                  >
                    {selected ? (
                      <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <Check className="h-3 w-3" />
                      </span>
                    ) : null}
                    <Icon className="h-4 w-4 text-secondary mb-2" />
                    <p className="text-sm font-heading font-semibold pr-5">{opt.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                      {available
                        ? opt.blurb
                        : opt.id === "google_meet" || opt.id === "microsoft_teams"
                          ? "Connect in Integrations"
                          : opt.blurb}
                    </p>
                  </button>
                );
              })}
            </div>
            {!googleConnected ? (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-xs text-secondary hover:underline"
                onClick={() => navigate("/settings/integrations")}
              >
                <Link2 className="h-3.5 w-3.5" />
                Connect Google to schedule Meet links
              </button>
            ) : null}
          </section>

          {/* Who */}
          <section className="rounded-2xl border border-border/60 bg-card p-5 md:p-6 shadow-soft space-y-4">
            <div>
              <h2 className="font-heading text-base font-semibold">Who’s invited? *</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Everyone listed gets an email with the join link
              </p>
            </div>

            <div className="relative">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Name"
                  value={sName}
                  onChange={(e) => {
                    setSName(e.target.value);
                    openSuggestions(e.target.value);
                  }}
                  onFocus={() => handlePeopleFocus(sName)}
                  onBlur={handlePeopleBlur}
                  className="flex-1 h-11"
                  autoComplete="off"
                />
                <Input
                  placeholder="Email"
                  value={sEmail}
                  onChange={(e) => {
                    setSEmail(e.target.value);
                    openSuggestions(e.target.value);
                  }}
                  onFocus={() => handlePeopleFocus(sEmail)}
                  onBlur={handlePeopleBlur}
                  className="flex-1 h-11"
                  autoComplete="off"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 gap-1.5 shrink-0"
                  onClick={addStakeholder}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {suggestionsOpen && visibleSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-30 rounded-xl border border-border/60 bg-card shadow-lifted overflow-hidden">
                  <p className="px-3 pt-2.5 pb-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground flex items-center gap-1.5">
                    <Users className="h-3 w-3" /> Suggestions
                  </p>
                  <ul className="max-h-56 overflow-auto py-1">
                    {visibleSuggestions.map((person) => (
                      <li key={person.email}>
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-muted/50"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            pickSuggestion(person);
                          }}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                            {initials(person.name)}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium truncate">{person.name}</span>
                            <span className="block text-xs text-muted-foreground truncate">
                              {person.email}
                            </span>
                          </span>
                          <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                            {person.source === "team" ? "Team" : "Recent"}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {stakeholders.length > 0 ? (
              <ul className="space-y-2">
                {stakeholders.map((s, i) => (
                  <li
                    key={`${s.email}-${i}`}
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary text-xs font-semibold">
                      {initials(s.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium truncate">{s.name}</span>
                      <span className="block text-xs text-muted-foreground truncate">{s.email}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeStakeholder(i)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label={`Remove ${s.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground rounded-xl border border-dashed border-border/70 px-4 py-6 text-center">
                No stakeholders yet — add teammates or paste an email above
              </p>
            )}
          </section>

          <div className="flex gap-3 xl:hidden">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shine flex-1"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating…
                </>
              ) : (
                "Schedule meeting"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </div>

        {/* Live summary */}
        <aside className="xl:sticky xl:top-20 space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card shadow-soft overflow-hidden">
            <div className="border-b border-border/50 bg-muted/30 px-5 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Preview
              </p>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <h3 className="font-heading text-xl font-semibold leading-snug">
                  {title.trim() || "Untitled meeting"}
                </h3>
                {description.trim() ? (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{description}</p>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground/70 italic">No agenda yet</p>
                )}
              </div>

              <dl className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground">When ({APP_TIMEZONE_LABEL})</dt>
                    <dd className="font-medium">{whenLabel}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock3 className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Duration</dt>
                    <dd className="font-medium">{duration} minutes</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Video className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Platform</dt>
                    <dd className="font-medium">{platformLabel}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <dt className="text-xs text-muted-foreground">
                      Stakeholders ({previewStakeholders.length})
                    </dt>
                    <dd className="font-medium mt-1 space-y-1">
                      {previewStakeholders.length === 0 ? (
                        <span className="text-muted-foreground font-normal">None added</span>
                      ) : (
                        previewStakeholders.slice(0, 5).map((s) => (
                          <p key={s.email} className="truncate text-sm">
                            {s.name}
                          </p>
                        ))
                      )}
                      {previewStakeholders.length > 5 ? (
                        <p className="text-xs text-muted-foreground font-normal">
                          +{previewStakeholders.length - 5} more
                        </p>
                      ) : null}
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="hidden xl:flex flex-col gap-2 pt-1">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shine"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating…
                    </>
                  ) : (
                    "Schedule meeting"
                  )}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
