import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMeeting,
  updateMeeting,
  generateMOM,
  editMOM,
  approveMOM,
  uploadMeetingAudio,
  completeMeetingWithRecording,
  resendMeetingInvites,
} from "@/lib/api";
import { useMeetingRecorder } from "@/hooks/use-meeting-recorder";
import { ActionItem, Meeting } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, TagBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Clock,
  Users,
  FileText,
  Play,
  CheckCircle2,
  Loader2,
  Video,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Download,
  Eye,
  ShieldCheck,
  PencilLine,
  Mail,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { createMomPdfBlob, downloadMomFile } from "@/lib/mom-export";
import { getCurrentUserDisplayName } from "@/lib/current-user";

function formatDuration(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function transcriptSourceLabel(source?: string) {
  switch (source) {
    case "openai_whisper":
      return "OpenAI Whisper (real audio)";
    case "aws_transcribe":
      return "AWS Transcribe (real audio)";
    case "notes":
      return "From live notes";
    case "mock":
      return "Demo script (configure OpenAI or AWS for real STT)";
    default:
      return source ?? "Unknown";
  }
}

/** Avoid white-screen crashes when API returns partial mom/transcript shapes */
function normalizeMeeting(m: Meeting): Meeting {
  const stakeholders = Array.isArray(m.stakeholders) ? m.stakeholders : [];
  let mom = m.mom;
  if (mom) {
    mom = {
      ...mom,
      keyPoints: Array.isArray(mom.keyPoints) ? mom.keyPoints : [],
      actionItems: Array.isArray(mom.actionItems) ? mom.actionItems : [],
      participants: Array.isArray(mom.participants) ? mom.participants : [],
    };
  }
  let transcript = m.transcript;
  if (transcript) {
    transcript = {
      ...transcript,
      segments: Array.isArray(transcript.segments) ? transcript.segments : [],
    };
  }
  return {
    ...m,
    notes: m.notes ?? "",
    stakeholders,
    mom,
    transcript,
  };
}

function MeetingProcessingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-primary flex flex-col items-center justify-center gap-4 px-6"
    >
      <Loader2 className="h-12 w-12 animate-spin text-secondary" />
      <p className="text-primary-foreground text-center font-medium">
        Uploading recording and generating minutes…
      </p>
      <p className="text-primary-foreground/60 text-sm text-center max-w-md">
        This can take a minute for cloud transcription. Please keep this tab open.
      </p>
    </motion.div>
  );
}

function LiveMeetingScreen({
  meeting,
  liveNotes,
  onLiveNotesChange,
  onMeetingEnd,
}: {
  meeting: Meeting;
  liveNotes: string;
  onLiveNotesChange: (value: string) => void;
  onMeetingEnd: (recording: Blob | null) => Promise<void>;
}) {
  const durationSeconds = Math.max(60, meeting.duration * 60);
  const [elapsed, setElapsed] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [ending, setEnding] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const { state: recorderState, startRecording, stopRecording, setMuted } = useMeetingRecorder();

  useEffect(() => {
    void startRecording().catch(() => {
      toast.error("Microphone access is required to record this meeting");
    });
  }, [startRecording]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    setMuted(!micOn);
  }, [micOn, setMuted]);

  const handleEndCall = async () => {
    if (ending) return;
    setEnding(true);
    try {
      const blob = await stopRecording();
      await onMeetingEnd(blob);
    } finally {
      setEnding(false);
    }
  };

  const progress = Math.min(100, (elapsed / durationSeconds) * 100);
  const remaining = Math.max(0, durationSeconds - elapsed);
  const recordedLabel = formatDuration(recorderState.durationSeconds);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-primary flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive" />
          </span>
          <span className="text-primary-foreground font-heading font-semibold text-sm">LIVE</span>
          {recorderState.isRecording && (
            <Badge variant="outline" className="border-destructive/50 text-destructive bg-destructive/10">
              REC • {recordedLabel}
            </Badge>
          )}
          <span className="text-primary-foreground/60 text-sm ml-2">{meeting.title}</span>
        </div>
        <motion.div className="text-primary-foreground/80 font-mono text-sm text-right">
          <div>{formatDuration(remaining)} remaining</div>
          <div className="text-xs opacity-70">Recording uploads when you end</div>
        </motion.div>
      </div>

      {/* Main area - simulated video grid */}
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 max-w-3xl w-full">
          {(meeting.stakeholders ?? []).slice(0, 4).map((s, i) => (
            <div
              key={i}
              className="aspect-video rounded-xl bg-sidebar-accent flex items-center justify-center relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-2xl font-heading font-bold text-secondary">
                {s.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <span className="absolute bottom-3 left-3 text-xs text-primary-foreground/70 bg-primary/60 px-2 py-0.5 rounded">
                {s.name}
              </span>
            </div>
          ))}
          {/* You tile */}
          <div className="aspect-video rounded-xl bg-sidebar-accent flex items-center justify-center relative overflow-hidden border-2 border-secondary/40">
            <div className="w-16 h-16 rounded-full bg-secondary/30 flex items-center justify-center text-2xl font-heading font-bold text-secondary">
              You
            </div>
            <span className="absolute bottom-3 left-3 text-xs text-primary-foreground/70 bg-primary/60 px-2 py-0.5 rounded">
              You (Host)
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-2">
        <Label className="text-primary-foreground/80 text-xs">
          Live notes (backup if transcription fails — use &quot;Name: statement&quot; per line)
        </Label>
        <Textarea
          value={liveNotes}
          onChange={(e) => onLiveNotesChange(e.target.value)}
          placeholder={"Alice: will send budget by Friday\nBob: agreed to postpone pilot to Q3"}
          className="mt-1 min-h-[88px] bg-primary-foreground/10 border-sidebar-border text-primary-foreground placeholder:text-primary-foreground/40"
        />
      </div>

      {/* Progress bar */}
      <div className="px-6">
        <Progress value={progress} className="h-1.5 bg-sidebar-accent [&>div]:bg-secondary" />
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-center gap-4 py-5">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 border-sidebar-border text-primary-foreground hover:bg-sidebar-accent"
          onClick={() => setMicOn(!micOn)}
        >
          {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 border-sidebar-border text-primary-foreground hover:bg-sidebar-accent"
        >
          <Video className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 border-sidebar-border text-primary-foreground hover:bg-sidebar-accent"
        >
          <MonitorUp className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="rounded-full h-12 w-12 bg-destructive hover:bg-destructive/90"
          onClick={handleEndCall}
          disabled={ending}
        >
          {ending ? <Loader2 className="h-5 w-5 animate-spin" /> : <PhoneOff className="h-5 w-5" />}
        </Button>
      </div>
    </motion.div>
  );
}

export default function MeetingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [generatingMom, setGeneratingMom] = useState(false);
  const [inLiveMeeting, setInLiveMeeting] = useState(false);
  const [postMeetingProcessing, setPostMeetingProcessing] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<"docx" | "pdf" | "txt" | "json" | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [editingMom, setEditingMom] = useState(false);
  const [approvingMom, setApprovingMom] = useState(false);
  const [momKeyPointsDraft, setMomKeyPointsDraft] = useState("");
  const [momActionItemsDraft, setMomActionItemsDraft] = useState("");
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [liveNotes, setLiveNotes] = useState("");
  const [resendingInvites, setResendingInvites] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const refreshMeeting = useCallback(async () => {
    if (!id) return;
    const m = await getMeeting(id);
    if (!m) return undefined;
    const normalized = normalizeMeeting(m);
    setMeeting(normalized);
    setNotes(normalized.notes);
    return normalized;
  }, [id]);

  useEffect(() => {
    if (!id) return;
    refreshMeeting().finally(() => setLoading(false));
  }, [id, refreshMeeting]);

  useEffect(() => {
    if (!meeting?.pipelineStatus || meeting.pipelineStatus !== "processing") return;
    const interval = setInterval(() => {
      void refreshMeeting();
    }, 3000);
    return () => clearInterval(interval);
  }, [meeting?.pipelineStatus, refreshMeeting]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!meeting?.mom) {
      setMomKeyPointsDraft("");
      setMomActionItemsDraft("");
      return;
    }

    const keyPoints = Array.isArray(meeting.mom.keyPoints) ? meeting.mom.keyPoints : [];
    const actionItems = Array.isArray(meeting.mom.actionItems) ? meeting.mom.actionItems : [];
    setMomKeyPointsDraft(keyPoints.join("\n"));
    setMomActionItemsDraft(
      actionItems
        .map((item) => `${item.task ?? ""} | ${item.assignee ?? ""} | ${item.deadline ?? ""}`)
        .join("\n"),
    );
  }, [meeting?.mom]);

  const saveNotes = async () => {
    if (!meeting) return;
    const updated = await updateMeeting(meeting.id, { notes });
    setMeeting(updated);
    toast.success("Notes saved");
  };

  const handleStart = async () => {
    if (!meeting) return;
    const updated = await updateMeeting(meeting.id, { status: "ongoing" });
    setMeeting(updated);
    toast.success("Meeting started");
  };

  const handleJoin = async () => {
    if (!meeting) return;
    await updateMeeting(meeting.id, { status: "ongoing" });
    if (!liveNotes.trim() && meeting.description.trim()) {
      setLiveNotes(`Host: ${meeting.description.trim()}`);
    }
    setInLiveMeeting(true);
    toast.success("You joined the meeting — add live notes for better MOM quality");
  };

  const handleMeetingEnd = useCallback(
    async (recording: Blob | null) => {
      if (!meeting) return;
      setPostMeetingProcessing(true);

      const combinedNotes = [notes.trim(), liveNotes.trim()].filter(Boolean).join("\n");

      toast.loading("Uploading recording and generating MOM...", { id: "mom-gen" });
      try {
        const result = await completeMeetingWithRecording(
          meeting.id,
          recording,
          combinedNotes,
        );
        const updated = normalizeMeeting(result.meeting);
        setMeeting(updated);
        setNotes(updated.notes);
        toast.dismiss("mom-gen");

        const source = result.transcriptSource ?? updated.transcript?.source;
        if (recording && recording.size > 5000) {
          toast.success(`Recording processed (${transcriptSourceLabel(source)})`);
        } else if (updated.mom) {
          toast.success("MOM generated from notes");
        }

        if (updated.mom) {
          toast.info("Review and approve the MOM below before sharing.");
        } else {
          toast.warning("No MOM produced. Add notes or check OPENAI_API_KEY in .env");
        }
      } catch (error) {
        toast.dismiss("mom-gen");
        const message = error instanceof Error ? error.message : "Processing failed";
        toast.error(message);
        await refreshMeeting();
      } finally {
        setInLiveMeeting(false);
        setPostMeetingProcessing(false);
      }
    },
    [meeting, notes, liveNotes, refreshMeeting],
  );

  const handleResendInvites = async () => {
    if (!meeting) return;
    setResendingInvites(true);
    try {
      const result = await resendMeetingInvites(meeting.id);
      setMeeting(result.meeting);
      const sent = result.invites.filter((i) => i.status === "sent" || i.status === "logged").length;
      toast.success(`Invites sent to ${sent} stakeholder(s)`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend invites");
    } finally {
      setResendingInvites(false);
    }
  };

  const handleAudioUpload = async (file: File) => {
    if (!meeting) return;
    setUploadingAudio(true);
    try {
      await uploadMeetingAudio(meeting.id, file);
      toast.success("Audio uploaded — STT and NLU pipeline started");
      await refreshMeeting();
    } catch {
      toast.error("Failed to upload audio");
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleComplete = async () => {
    if (!meeting) return;
    const updated = await updateMeeting(meeting.id, { status: "completed" });
    setMeeting(updated);
    toast.success("Meeting marked as completed");
  };

  const handleGenerateMOM = async () => {
    if (!meeting) return;
    setGeneratingMom(true);
    await generateMOM(meeting.id);
    const updated = await getMeeting(meeting.id);
    if (updated) setMeeting(updated);
    setGeneratingMom(false);
    toast.success("MOM generated successfully!");
  };

  const parseActionItemsDraft = (): ActionItem[] => {
    return momActionItemsDraft
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [task = "", assignee = "", deadline = ""] = line.split("|").map((part) => part.trim());
        return { task, assignee, deadline };
      })
      .filter((item) => item.task);
  };

  const handleSaveMomEdits = async () => {
    if (!meeting?.mom) return;
    const keyPoints = momKeyPointsDraft.split("\n").map((p) => p.trim()).filter(Boolean);
    const actionItems = parseActionItemsDraft();

    if (keyPoints.length === 0) {
      toast.error("Add at least one key discussion point.");
      return;
    }

    if (actionItems.length === 0) {
      toast.error("Add at least one action item.");
      return;
    }

    setEditingMom(true);
    try {
      await editMOM(meeting.id, { keyPoints, actionItems });
      const updated = await getMeeting(meeting.id);
      if (updated) setMeeting(updated);
      toast.success("MOM updated. Re-approval is required before sharing.");
    } catch {
      toast.error("Failed to save MOM edits");
    } finally {
      setEditingMom(false);
    }
  };

  const handleApproveMom = async () => {
    if (!meeting?.mom) return;
    setApprovingMom(true);
    try {
      await approveMOM(meeting.id);
      const updated = await getMeeting(meeting.id);
      if (updated) setMeeting(updated);
      const names = meeting.stakeholders.map((s) => s.name).join(", ");
      toast.success(
        names
          ? `MOM approved and sent to stakeholders: ${names}`
          : "MOM approved and sent to stakeholders.",
        { duration: 6000 },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to approve MOM";
      toast.error(message);
    } finally {
      setApprovingMom(false);
    }
  };

  const handleDownloadFormat = async (format: "docx" | "pdf" | "txt" | "json") => {
    if (!meeting?.mom) return;
    setDownloadingFormat(format);
    try {
      await downloadMomFile(meeting, meeting.mom, format);
      toast.success(`MOM downloaded as ${format.toUpperCase()}`);
    } catch {
      toast.error(`Failed to download ${format.toUpperCase()} file`);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handlePreviewPdf = async () => {
    if (!meeting?.mom) return;
    setPreviewLoading(true);
    try {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const pdfBlob = await createMomPdfBlob(meeting, meeting.mom);
      const url = URL.createObjectURL(pdfBlob);
      setPreviewUrl(url);
      setPreviewOpen(true);
    } catch {
      toast.error("Failed to generate PDF preview");
    } finally {
      setPreviewLoading(false);
    }
  };

  if (loading) {
    return <div className="space-y-4">{[1, 2].map((i) => <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />)}</div>;
  }

  if (!meeting) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Meeting not found</p>
        <Button variant="outline" onClick={() => navigate("/meetings")} className="mt-4">Back to Meetings</Button>
      </div>
    );
  }

  return (
    <>
      {postMeetingProcessing && <MeetingProcessingOverlay />}
      {inLiveMeeting && !postMeetingProcessing && (
        <LiveMeetingScreen
          meeting={meeting}
          liveNotes={liveNotes}
          onLiveNotesChange={setLiveNotes}
          onMeetingEnd={handleMeetingEnd}
        />
      )}

      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1 text-muted-foreground -ml-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-heading font-bold">{meeting.title}</h1>
                <p className="text-muted-foreground text-sm mt-1">{meeting.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <TagBadge tag={meeting.tag} />
                <StatusBadge status={meeting.status} />
              </div>
            </div>

            <div className="flex gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {meeting.date} at {meeting.time}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {meeting.duration} min</span>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5"><Users className="h-4 w-4" /> Stakeholders</h3>
              <div className="flex flex-wrap gap-2">
                {(meeting.stakeholders ?? []).map((s, i) => (
                  <span key={i} className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm">
                    {s.name} <span className="text-muted-foreground ml-1 text-xs">({s.email})</span>
                  </span>
                ))}
                {meeting.stakeholders.length === 0 && <span className="text-muted-foreground text-sm">No stakeholders added</span>}
              </div>
              {meeting.stakeholders.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    disabled={resendingInvites}
                    onClick={handleResendInvites}
                  >
                    {resendingInvites ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    Resend invites
                  </Button>
      </div>
              )}
              {meeting.invites && meeting.invites.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> Invite delivery
                  </p>
                  {meeting.invites.map((inv) => (
                    <div key={inv.email} className="text-xs flex items-center gap-2">
                      <span>{inv.name}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {inv.status === "logged" ? "saved (dev)" : inv.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {meeting.status !== "completed" && (
                <Button onClick={handleJoin} className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90" size="sm">
                  <Video className="h-3.5 w-3.5" /> Join Meeting
                </Button>
              )}
              {meeting.status === "upcoming" && (
                <Button onClick={handleStart} variant="outline" size="sm" className="gap-2">
                  <Play className="h-3.5 w-3.5" /> Start Meeting
                </Button>
              )}
              {meeting.status !== "completed" && (
                <Button onClick={handleComplete} variant="outline" size="sm" className="gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Mark Completed
                </Button>
              )}
              <Button onClick={handleGenerateMOM} variant="outline" size="sm" className="gap-2" disabled={generatingMom}>
                {generatingMom ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                Generate MOM
              </Button>
            </div>
          </Card>
        </motion.div>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-heading font-semibold">Meeting Notes</h2>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add meeting notes here..." rows={5} />
          <Button variant="outline" size="sm" onClick={saveNotes}>Save Notes</Button>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-heading font-semibold">Recording &amp; Transcript</h2>
          <p className="text-muted-foreground text-sm">
            Upload meeting audio for speech-to-text with speaker segments, then AI extracts tasks and decisions.
          </p>
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*,video/webm"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleAudioUpload(file);
              e.target.value = "";
            }}
          />
          <motion.div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={uploadingAudio}
              onClick={() => audioInputRef.current?.click()}
            >
              {uploadingAudio ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mic className="h-3.5 w-3.5" />}
              Upload audio
            </Button>
            {meeting.pipelineStatus === "processing" && (
              <Badge variant="outline" className="gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Processing…
              </Badge>
            )}
          </motion.div>
          {meeting.transcript && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 rounded-lg border bg-muted/20 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">Transcript</p>
                {meeting.transcript.source && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    {transcriptSourceLabel(meeting.transcript.source)}
                  </Badge>
                )}
              </div>
              <motion.div className="max-h-64 space-y-2 overflow-y-auto text-sm">
                {(meeting.transcript.segments ?? []).map((seg, i) => (
                  <p key={i}>
                    <span className="font-medium text-secondary">{seg.speaker}:</span> {seg.text}
                  </p>
                ))}
              </motion.div>
            </motion.div>
          )}
        </Card>

        {meeting.mom && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden border-ring/30 shadow-sm">
              <div className="relative border-b bg-gradient-to-br from-secondary/12 via-secondary/5 to-background px-6 py-5">
                <div className="absolute left-0 top-0 h-full w-1 bg-secondary" aria-hidden />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1.5 pl-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-heading font-semibold tracking-tight">Minutes of Meeting</h2>
                        <p className="text-muted-foreground text-sm">
                          Refine the draft, then approve — stakeholders are notified automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    {meeting.mom.shared ? (
                      <Badge variant="secondary" className="gap-1 border border-success/20 bg-success/10 text-success">
                        <CheckCircle2 className="h-3 w-3" /> Sent to stakeholders
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 border-warning/30 bg-warning/10 text-warning">
                        Awaiting Lyrus approval
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div className="rounded-xl border bg-muted/30 p-4 md:p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium">
                    <PencilLine className="h-4 w-4 text-secondary" />
                    Prepare draft
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="mom-key-points">Key discussion points</Label>
                      <p className="text-muted-foreground text-xs">One bullet per line. This text appears in PDF and exports.</p>
                      <Textarea
                        id="mom-key-points"
                        value={momKeyPointsDraft}
                        onChange={(e) => setMomKeyPointsDraft(e.target.value)}
                        rows={5}
                        className="min-h-[120px] resize-y font-mono text-sm"
                        placeholder="e.g. Agreed on Q2 roadmap&#10;Budget review deferred to next week"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mom-actions">Action items</Label>
                      <p className="text-muted-foreground text-xs">One row per item: Task | Owner | Deadline</p>
                      <Textarea
                        id="mom-actions"
                        value={momActionItemsDraft}
                        onChange={(e) => setMomActionItemsDraft(e.target.value)}
                        rows={5}
                        className="min-h-[120px] resize-y font-mono text-sm"
                        placeholder="e.g. Send revised scope | Alex | Next Friday"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-muted-foreground text-xs">
                      Saving updates the live MOM and resets approval if it was already approved.
                    </p>
                    <Button variant="secondary" size="sm" onClick={handleSaveMomEdits} disabled={editingMom} className="shrink-0 gap-2">
                      {editingMom ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      Save draft
                    </Button>
                  </div>
                </div>

                {!meeting.mom.approved && (
                  <div className="rounded-xl border border-secondary/25 bg-gradient-to-br from-secondary/8 to-transparent p-4 md:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-4">
                        <div>
                          <h3 className="font-heading text-sm font-semibold">Lyrus Life approval</h3>
                          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                            Stakeholders only receive this MOM after a Lyrus Life reviewer approves it. Approval sends it
                            to everyone listed on this meeting immediately.
                          </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-muted-foreground text-sm">
                            Approving as{" "}
                            <span className="font-medium text-foreground">{getCurrentUserDisplayName()}</span>
                          </p>
                          <Button size="sm" onClick={handleApproveMom} disabled={approvingMom} className="gap-2 shrink-0 sm:h-10">
                            {approvingMom ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                            Approve & send
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {meeting.mom.approved && (
                  <div className="flex items-start gap-3 rounded-lg border border-success/20 bg-success/5 px-4 py-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Approved by {meeting.mom.approvedBy || "Lyrus Life"}</p>
                      {meeting.mom.approvedAt && (
                        <p className="text-muted-foreground text-xs">{new Date(meeting.mom.approvedAt).toLocaleString()}</p>
                      )}
                      {meeting.mom.shared && (
                        <p className="text-muted-foreground text-xs">Stakeholders were notified automatically when this was approved.</p>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                <div>
                  <p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wide">Export</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={handlePreviewPdf}
                      disabled={previewLoading}
                    >
                      {previewLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
                      View PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleDownloadFormat("docx")}
                      disabled={downloadingFormat !== null}
                    >
                      {downloadingFormat === "docx" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                      DOCX
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleDownloadFormat("pdf")}
                      disabled={downloadingFormat !== null}
                    >
                      {downloadingFormat === "pdf" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                      PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleDownloadFormat("txt")}
                      disabled={downloadingFormat !== null}
                    >
                      {downloadingFormat === "txt" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                      TXT
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleDownloadFormat("json")}
                      disabled={downloadingFormat !== null}
                    >
                      {downloadingFormat === "json" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                      JSON
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wide">Current version</p>
                  <div className="space-y-4 rounded-lg border bg-card/50 p-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Date & Time</p>
                      <p>{meeting.mom.dateTime}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Participants</p>
                      <p>{(meeting.mom.participants ?? []).join(", ")}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Key Discussion Points</p>
                      <ul className="mt-1 list-inside list-disc space-y-1">
                        {(meeting.mom.keyPoints ?? []).map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Action Items</p>
                      <div className="mt-2 overflow-hidden rounded-lg border">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="p-2 text-left font-medium">Task</th>
                              <th className="p-2 text-left font-medium">Assignee</th>
                              <th className="p-2 text-left font-medium">Deadline</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(meeting.mom.actionItems ?? []).map((a, i) => (
                              <tr key={i} className="border-t">
                                <td className="p-2">{a.task}</td>
                                <td className="p-2">{a.assignee}</td>
                                <td className="p-2">{a.deadline}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl h-[85vh]">
          <DialogHeader>
            <DialogTitle>MOM PDF Preview</DialogTitle>
          </DialogHeader>
          {previewUrl ? (
            <iframe title="MOM PDF Preview" src={previewUrl} className="w-full h-full rounded-md border" />
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No preview available</div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
