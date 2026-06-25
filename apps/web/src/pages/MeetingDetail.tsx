import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMeeting,
  updateMeeting,
  generateMOM,
  editMOM,
  approveMOM,
  uploadMeetingAudio,
  resendMeetingInvites,
  rescheduleMeetingRecordingBot,
  syncMeetingRecording,
} from "@/lib/api";
import { ActionItem, Meeting } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, TagBadge } from "@/components/StatusBadge";
import { MomStakeholderBadge } from "@/components/MomStakeholderBadge";
import { ExternalRecordingProgress } from "@/components/ExternalRecordingProgress";
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

export default function MeetingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [generatingMom, setGeneratingMom] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<"docx" | "pdf" | "txt" | "json" | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [editingMom, setEditingMom] = useState(false);
  const [approvingMom, setApprovingMom] = useState(false);
  const [momKeyPointsDraft, setMomKeyPointsDraft] = useState("");
  const [momActionItemsDraft, setMomActionItemsDraft] = useState("");
  const [uploadingAudio, setUploadingAudio] = useState(false);
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

  // Poll Recall for live status + MOM pipeline (local dev often has no webhook URL).
  useEffect(() => {
    if (!id || !meeting) return;
    const external =
      meeting.platform === "google_meet" || meeting.platform === "microsoft_teams";
    if (!external) return;

    const botStatus = meeting.recordingBotStatus;
    const shouldPoll =
      Boolean(meeting.recordingProgress?.isLive) ||
      Boolean(meeting.recordingProgress?.isProcessing) ||
      botStatus === "scheduled" ||
      botStatus === "scheduling" ||
      botStatus === "joining" ||
      botStatus === "waiting_room" ||
      botStatus === "in_call" ||
      botStatus === "recording" ||
      botStatus === "call_ended" ||
      (botStatus === "processing" && meeting.pipelineStatus !== "processing") ||
      meeting.pipelineStatus === "processing";

    if (!shouldPoll) return;

    const poll = () => {
      void syncMeetingRecording(id)
        .then(({ meeting: updated }) => setMeeting(normalizeMeeting(updated)))
        .catch(() => {
          // ignore transient poll errors
        });
    };

    poll();
    const interval = setInterval(poll, meeting.recordingProgress?.isLive ? 5000 : 8000);
    return () => clearInterval(interval);
  }, [
    id,
    meeting?.platform,
    meeting?.recordingBotStatus,
    meeting?.pipelineStatus,
    meeting?.recordingProgress?.isLive,
    meeting?.recordingProgress?.isProcessing,
    meeting?.recordingProgress?.phase,
  ]);

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

  const handleJoin = () => {
    if (!meeting) return;
    const external =
      meeting.platform === "google_meet" || meeting.platform === "microsoft_teams";
    if (meeting.externalMeetingUrl && external) {
      window.open(meeting.externalMeetingUrl, "_blank", "noopener,noreferrer");
      // Server is idempotent: reuses bot on first join, schedules a new one only after prior session ended.
      void rescheduleMeetingRecordingBot(meeting.id)
        .then((updated) => setMeeting(normalizeMeeting(updated)))
        .catch((err) => {
          toast.error(err instanceof Error ? err.message : "Could not schedule recording bot");
        });
      return;
    }
    if (meeting.externalMeetingUrl) {
      window.open(meeting.externalMeetingUrl, "_blank", "noopener,noreferrer");
      return;
    }
    // Never route external-platform meetings into the in-built LiveKit room.
    // If the external join URL is missing, it means provisioning failed or the meeting wasn't refreshed.
    if (meeting.platform === "google_meet" || meeting.platform === "microsoft_teams") {
      toast.loading("Recreating external meeting link…", { id: "reprovision" });
      void import("@/lib/api")
        .then(({ reprovisionExternalMeeting }) => reprovisionExternalMeeting(meeting.id))
        .then((updated) => {
          toast.dismiss("reprovision");
          setMeeting(updated);
          if (updated.externalMeetingUrl) {
            window.open(updated.externalMeetingUrl, "_blank", "noopener,noreferrer");
          } else {
            toast.error("Could not generate external meeting link. Please try again.");
          }
        })
        .catch((err) => {
          toast.dismiss("reprovision");
          toast.error(err instanceof Error ? err.message : "Could not recreate external meeting link");
        });
      return;
    }
    if (meeting.joinSlug) {
      navigate(`/join/${meeting.joinSlug}`);
    } else {
      navigate(`/meetings/${meeting.id}/live`);
    }
  };

  const isExternalPlatform =
    meeting?.platform === "google_meet" || meeting?.platform === "microsoft_teams";
  const platformLabel =
    meeting?.platform === "google_meet"
      ? "Google Meet"
      : meeting?.platform === "microsoft_teams"
        ? "Microsoft Teams"
        : "Lyrus Live";

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

  const canApproveMom =
    Boolean(meeting?.mom) &&
    !meeting?.mom?.approved &&
    meeting?.status === "completed";

  const handleApproveMom = async () => {
    if (!meeting?.mom) return;
    if (meeting.status !== "completed") {
      toast.error("Meeting must finish before MOM can be approved and shared.");
      return;
    }
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
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1 text-muted-foreground -ml-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="aurora-panel p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-heading font-bold text-gradient">{meeting.title}</h1>
                <p className="text-muted-foreground text-sm mt-1">{meeting.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <TagBadge tag={meeting.tag} />
                  <StatusBadge status={meeting.status} />
                </div>
                <MomStakeholderBadge meeting={meeting} />
              </div>
            </div>

            <div className="flex gap-6 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {meeting.date} at {meeting.time}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {meeting.duration} min</span>
              <Badge variant="outline" className="text-[10px]">{platformLabel}</Badge>
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
              {(isExternalPlatform || meeting.status !== "completed") && (
                <Button onClick={handleJoin} variant="secondary" className="gap-2 shine" size="sm">
                  <Video className="h-3.5 w-3.5" />
                  {isExternalPlatform ? `Join on ${platformLabel}` : "Join Meeting"}
                </Button>
              )}
              {meeting.status === "upcoming" && !isExternalPlatform && (
                <Button onClick={handleStart} variant="outline" size="sm" className="gap-2">
                  <Play className="h-3.5 w-3.5" /> Start Meeting
                </Button>
              )}
              {meeting.status !== "completed" && !isExternalPlatform && (
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

        {isExternalPlatform && meeting.recordingProgress && !meeting.mom && (
          <ExternalRecordingProgress meeting={meeting} />
        )}

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-heading font-semibold">Meeting Notes</h2>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add meeting notes here..." rows={5} />
          <Button variant="outline" size="sm" onClick={saveNotes}>Save Notes</Button>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-heading font-semibold">Recording</h2>
          {isExternalPlatform ? (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                A recording bot joins your {platformLabel} call automatically. When everyone leaves,
                the bot exits on its own — even if time remains on the calendar — then MOM is generated.
              </p>
            </div>
          ) : (
            <>
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
            </>
          )}
          {meeting.transcript && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border bg-muted/20 p-4">
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
                        Awaiting approval
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
                          <h3 className="font-heading text-sm font-semibold">Review & approve</h3>
                          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                            Stakeholders only receive this MOM after a reviewer approves it. Approval emails the
                            MOM PDF to everyone listed on this meeting.
                          </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-muted-foreground text-sm">
                            {meeting.status !== "completed" ? (
                              <>
                                Approval unlocks when the meeting ends and MOM generation finishes.
                              </>
                            ) : (
                              <>
                                Approving as{" "}
                                <span className="font-medium text-foreground">{getCurrentUserDisplayName()}</span>
                              </>
                            )}
                          </p>
                          <Button
                            size="sm"
                            onClick={handleApproveMom}
                            disabled={approvingMom || !canApproveMom}
                            className="gap-2 shrink-0 sm:h-10"
                          >
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
                    {(meeting.mom.sections ?? []).length > 0 && (
                      <div className="space-y-3">
                        {(meeting.mom.sections ?? []).map((section, i) => (
                          <div key={i}>
                            <p className="font-medium text-muted-foreground">{section.title}</p>
                            <ul className="mt-1 list-inside list-disc space-y-1">
                              {(section.content ?? []).map((line, j) => (
                                <li key={j}>{line}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
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

        {isExternalPlatform && !meeting.mom && !meeting.recordingProgress && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden border-dashed">
              <div className="space-y-3 p-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-secondary" />
                  <h2 className="text-lg font-heading font-semibold">Minutes of Meeting</h2>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  After your {platformLabel} call ends, the recording is transcribed and a draft MOM is created
                  automatically — same workflow as Lyrus Live: edit the draft, approve it, then export or email
                  stakeholders. Nothing is sent until you approve.
                </p>
                {(meeting.pipelineStatus === "processing" ||
                  meeting.recordingBotStatus === "processing" ||
                  meeting.recordingBotStatus === "scheduling") && (
                  <Badge variant="outline" className="gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Generating MOM from recording…
                  </Badge>
                )}
                {meeting.recordingBotStatus === "done" && meeting.pipelineStatus !== "processing" && (
                  <Button variant="outline" size="sm" className="gap-2" onClick={handleGenerateMOM} disabled={generatingMom}>
                    {generatingMom ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                    Generate MOM now
                  </Button>
                )}
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
