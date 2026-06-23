import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMeeting, getPeopleSuggestions, type PersonSuggestion } from "@/lib/api";
import { MeetingTag, Stakeholder } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, ArrowLeft, Users } from "lucide-react";
import { toast } from "sonner";

export default function ScheduleMeeting() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [tag, setTag] = useState<MeetingTag>("internal");
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [sName, setSName] = useState("");
  const [sEmail, setSEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // People autocomplete (like Google Meet) — suggests team members and people
  // you've invited to past meetings.
  const [suggestions, setSuggestions] = useState<PersonSuggestion[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [peopleQuery, setPeopleQuery] = useState("");
  const suggestTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      const exists = list.some(
        (s) => s.email.toLowerCase() === email.toLowerCase(),
      );
      if (!exists) {
        list.push({ name, email });
      }
    }
    return list;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) {
      toast.error("Please fill in required fields");
      return;
    }

    const name = sName.trim();
    const email = sEmail.trim();
    if ((name && !email) || (!name && email)) {
      toast.error("Enter both name and email for a stakeholder, or leave both empty");
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
        stakeholders: finalStakeholders,
      });

      const sent = result.invites.filter((i) => i.status === "sent" || i.status === "logged").length;
      const failed = result.invites.filter((i) => i.status === "failed").length;

      if (sent > 0) {
        toast.success(`Meeting scheduled — invites sent to ${sent} stakeholder(s).`, { duration: 5000 });
      }
      if (failed > 0) {
        toast.warning(`${failed} invite(s) could not be delivered. Resend from the meeting page.`);
      }

      navigate(`/meetings/${result.meeting.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to schedule meeting";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1 text-muted-foreground -ml-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="aurora-panel rounded-2xl border border-border/60 p-6 shadow-soft">
        <h1 className="text-2xl font-heading font-bold text-gradient">Schedule Meeting</h1>
        <p className="text-muted-foreground text-sm mt-1">Create a new meeting with stakeholders</p>
      </div>

      <Card className="p-6 animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Q1 Production Review" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Meeting agenda and objectives..." rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[15, 30, 45, 60, 90, 120].map((d) => (
                    <SelectItem key={d} value={String(d)}>{d} min</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tag</Label>
              <Select value={tag} onValueChange={(v) => setTag(v as MeetingTag)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Stakeholders *</Label>
            <p className="text-muted-foreground text-xs">
              Each stakeholder receives a calendar invite (.ics) and email with a link to join the meeting in Lyrus Life.
            </p>
            <div className="relative">
              <div className="flex gap-2">
                <Input
                  placeholder="Name"
                  value={sName}
                  onChange={(e) => {
                    setSName(e.target.value);
                    openSuggestions(e.target.value);
                  }}
                  onFocus={() => handlePeopleFocus(sName)}
                  onBlur={handlePeopleBlur}
                  className="flex-1"
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
                  className="flex-1"
                  autoComplete="off"
                />
                <Button type="button" variant="outline" size="icon" onClick={addStakeholder}><Plus className="h-4 w-4" /></Button>
              </div>

              {suggestionsOpen && visibleSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-30 rounded-xl border border-border/60 bg-card shadow-lifted overflow-hidden animate-scale-in">
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
                            {person.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium truncate">{person.name}</span>
                            <span className="block text-xs text-muted-foreground truncate">{person.email}</span>
                          </span>
                          <span className="shrink-0 rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                            {person.source === "team" ? "Team" : "Recent"}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {stakeholders.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {stakeholders.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm">
                    {s.name}
                    <button type="button" onClick={() => removeStakeholder(i)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={submitting} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              {submitting ? "Creating..." : "Schedule Meeting"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
