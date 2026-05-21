import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMeeting } from "@/lib/api";
import { MeetingTag, Stakeholder } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, ArrowLeft } from "lucide-react";
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

  const addStakeholder = () => {
    if (!sName.trim() || !sEmail.trim()) return;
    setStakeholders([...stakeholders, { name: sName.trim(), email: sEmail.trim() }]);
    setSName("");
    setSEmail("");
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

      <div>
        <h1 className="text-2xl font-heading font-bold">Schedule Meeting</h1>
        <p className="text-muted-foreground text-sm mt-1">Create a new meeting with stakeholders</p>
      </div>

      <Card className="p-6">
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
            <div className="flex gap-2">
              <Input placeholder="Name" value={sName} onChange={(e) => setSName(e.target.value)} className="flex-1" />
              <Input placeholder="Email" value={sEmail} onChange={(e) => setSEmail(e.target.value)} className="flex-1" />
              <Button type="button" variant="outline" size="icon" onClick={addStakeholder}><Plus className="h-4 w-4" /></Button>
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
