import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  getMeeting,
  updateMeeting,
  generateMOM,
  approveMOM,
  uploadMeetingAudio,
  resendMeetingInvites,
  rescheduleMeetingRecordingBot,
  syncMeetingRecording,
} from "@/lib/api";
import { Meeting, MOM } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, TagBadge } from "@/components/StatusBadge";
import { MomStakeholderBadge } from "@/components/MomStakeholderBadge";
import { ExternalRecordingProgress } from "@/components/ExternalRecordingProgress";
import { MomInlineEditor, type MomInlineEditorHandle } from "@/components/MomInlineEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Mail,
  Send,
  NotebookPen,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { createMomPdfBlob, downloadMomFile } from "@/lib/mom-export";
import { getCurrentUserDisplayName } from "@/lib/current-user";
import { useAuth } from "@/contexts/AuthContext";
import { APP_NAME } from "@/lib/brand";

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

/** Ignore poll payloads that only churn object identity (prevents scroll/draft jumps). */
function meetingPollFingerprint(m: Meeting): string {
  return [
    m.status,
    m.pipelineStatus ?? "",
    m.recordingBotStatus ?? "",
    m.recordingProgress?.phase ?? "",
    String(m.recordingProgress?.step ?? ""),
    m.mom?.id ?? "",
    m.mom?.approved ? "1" : "0",
    m.mom?.shared ? "1" : "0",
    m.mom?.lastEditedAt ?? m.mom?.createdAt ?? "",
    String(Array.isArray(m.mom?.actionItems) ? m.mom.actionItems.length : 0),
    String(Array.isArray(m.mom?.keyPoints) ? m.mom.keyPoints.length : 0),
    String(Array.isArray(m.transcript?.segments) ? m.transcript.segments.length : 0),
    m.notes ?? "",
  ].join("|");
}

export default function MeetingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { organization } = useAuth();
  const momBranding = {
    brandName: organization?.name?.trim() || APP_NAME,
  };
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [generatingMom, setGeneratingMom] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<"docx" | "txt" | "json" | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [approvingMom, setApprovingMom] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [resendingInvites, setResendingInvites] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const momEditorRef = useRef<MomInlineEditorHandle>(null);
  const didScrollToMom = useRef(false);
  const [detailTab, setDetailTab] = useState<"overview" | "capture" | "mom">("overview");
  const [showAllStakeholders, setShowAllStakeholders] = useState(false);

  const applyMeetingUpdate = useCallback((updated: Meeting) => {
    const normalized = normalizeMeeting(updated);
    setMeeting((prev) => {
      let next = normalized;
      // Once a MOM draft exists, never let sync polls downgrade status to "ongoing"
      // (PROCESSING maps to ongoing) — that was flapping Approve & send.
      if (
        prev?.mom &&
        next.mom &&
        prev.status === "completed" &&
        next.status !== "completed" &&
        next.status !== "failed"
      ) {
        next = { ...next, status: "completed", pipelineStatus: undefined };
      }
      if (prev && meetingPollFingerprint(prev) === meetingPollFingerprint(next)) {
        return prev;
      }
      return next;
    });
    return normalized;
  }, []);

  const refreshMeeting = useCallback(async () => {
    if (!id) return;
    const m = await getMeeting(id);
    if (!m) return undefined;
    const normalized = applyMeetingUpdate(m);
    setNotes((prev) => (prev === normalized.notes ? prev : normalized.notes));
    return normalized;
  }, [id, applyMeetingUpdate]);

  useEffect(() => {
    didScrollToMom.current = false;
  }, [id]);

  useEffect(() => {
    if (!id) return;
    refreshMeeting().finally(() => setLoading(false));
  }, [id, refreshMeeting]);

  // Early Google Meet / Teams start: if a bot is only booked for later (e.g. tomorrow),
  // opening the meeting page (or clicking Join) replaces it with an immediate join bot.
  useEffect(() => {
    if (!id || !meeting) return;
    const external =
      meeting.platform === "google_meet" || meeting.platform === "microsoft_teams";
    if (!external || !meeting.externalMeetingUrl) return;
    if (meeting.status === "completed" || meeting.status === "failed") return;
    if (
      meeting.recordingBotStatus === "processing" ||
      meeting.recordingBotStatus === "done" ||
      meeting.recordingBotStatus === "call_ended" ||
      meeting.recordingBotStatus === "failed"
    ) {
      return;
    }
    if (meeting.mom) return;

    const scheduledMs = new Date(meeting.scheduledAt).getTime();
    if (Number.isNaN(scheduledMs)) return;
    const now = Date.now();
    // Allow joining up to 48h early; ignore far-future calendar browsing.
    const earlyWindowStart = scheduledMs - 48 * 60 * 60 * 1000;
    const meetingEnd = scheduledMs + meeting.duration * 60_000 + 60 * 60_000;
    if (now < earlyWindowStart || now > meetingEnd) return;

    void rescheduleMeetingRecordingBot(id)
      .then((updated) => applyMeetingUpdate(updated))
      .catch(() => {
        /* Join button still retries; ignore first-pass failures while browsing */
      });
    // Intentionally once per meeting id load — not on every status poll.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- kick early-join only when meeting identity loads
  }, [id, meeting?.platform, meeting?.externalMeetingUrl]);

  useEffect(() => {
    if (meeting?.mom) return;
    if (!meeting?.pipelineStatus || meeting.pipelineStatus !== "processing") return;
    const interval = setInterval(() => {
      void refreshMeeting();
    }, 3000);
    return () => clearInterval(interval);
  }, [meeting?.pipelineStatus, meeting?.mom?.id, refreshMeeting]);

  // Poll Recall for live status + MOM pipeline (local dev often has no webhook URL).
  useEffect(() => {
    if (!id || !meeting) return;
    const external =
      meeting.platform === "google_meet" || meeting.platform === "microsoft_teams";
    if (!external) return;

    const botStatus = meeting.recordingBotStatus;
    // Stop Recall churn once MOM is ready — unless the bot was sent back for a rejoin.
    const rejoined =
      botStatus === "joining" ||
      botStatus === "waiting_room" ||
      botStatus === "in_call" ||
      botStatus === "recording" ||
      botStatus === "scheduling" ||
      botStatus === "scheduled";
    if (meeting.mom && !rejoined) {
      return;
    }

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
        .then(({ meeting: updated }) => applyMeetingUpdate(updated))
        .catch(() => {
          // ignore transient poll errors
        });
    };

    poll();
    const interval = setInterval(poll, meeting.recordingProgress?.isLive ? 5000 : 8000);
    return () => clearInterval(interval);
  }, [
    id,
    applyMeetingUpdate,
    meeting?.platform,
    meeting?.recordingBotStatus,
    meeting?.pipelineStatus,
    meeting?.mom?.id,
    meeting?.recordingProgress?.isLive,
    meeting?.recordingProgress?.isProcessing,
    meeting?.recordingProgress?.phase,
  ]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl.split("#")[0] ?? previewUrl);
    };
  }, [previewUrl]);

  // Deep-link /Mom pending → open MOM tab once (no long-page scroll needed).
  useEffect(() => {
    if (loading || !meeting || didScrollToMom.current) return;
    if (location.hash === "#mom" || (meeting.mom && !meeting.mom.approved)) {
      setDetailTab("mom");
      didScrollToMom.current = true;
    }
  }, [loading, meeting?.id, location.hash, meeting?.mom?.id, meeting?.mom?.approved]);

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
        .then((updated) => applyMeetingUpdate(updated))
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
        : APP_NAME;

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

  const handleMomSaved = useCallback((savedMom: MOM) => {
    setMeeting((prev) => {
      if (!prev) return prev;
      return normalizeMeeting({
        ...prev,
        // Keep status completed so Approve stays stable across sync polls.
        status: prev.status === "failed" ? prev.status : "completed",
        mom: {
          ...prev.mom!,
          ...savedMom,
          keyPoints: Array.isArray(savedMom.keyPoints) ? savedMom.keyPoints : [],
          actionItems: Array.isArray(savedMom.actionItems) ? savedMom.actionItems : [],
          participants: Array.isArray(savedMom.participants)
            ? savedMom.participants
            : prev.mom?.participants ?? [],
          sections: Array.isArray(savedMom.sections)
            ? savedMom.sections
            : prev.mom?.sections,
        },
      });
    });
  }, []);

  // MOM draft ready => approval eligible. Do not depend on transient sync status.
  const canApproveMom = Boolean(meeting?.mom) && !meeting?.mom?.approved;

  const handleApproveMom = async () => {
    if (!meeting?.mom) return;
    setApprovingMom(true);
    try {
      // Flush pending inline edits so Approve never races with autosave/sync.
      const saved = await momEditorRef.current?.flushSave();
      if (!saved && momEditorRef.current?.isBusy()) {
        toast.error("Could not save your latest MOM edits. Try again.");
        return;
      }
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

  const resolveMomForExport = async (): Promise<MOM | null> => {
    if (!meeting?.mom) return null;
    // Flush so server/state catch up, but always prefer live editor snapshot for export.
    await momEditorRef.current?.flushSave().catch(() => null);
    return momEditorRef.current?.getSnapshot() ?? meeting.mom;
  };

  const handleDownloadFormat = async (format: "docx" | "txt" | "json") => {
    if (!meeting?.mom) return;
    setDownloadingFormat(format);
    try {
      const momForExport = await resolveMomForExport();
      if (!momForExport) return;
      await downloadMomFile(meeting, momForExport, format, momBranding);
      toast.success(`Downloaded ${format.toUpperCase()} (local only — not sent to stakeholders)`);
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
      const momForExport = await resolveMomForExport();
      if (!momForExport) return;
      if (previewUrl) URL.revokeObjectURL(previewUrl.split("#")[0] ?? previewUrl);
      const pdfBlob = await createMomPdfBlob(meeting, momForExport, momBranding);
      // Prefer inline preview; fragment helps some browsers show the viewer chrome.
      const objectUrl = URL.createObjectURL(pdfBlob);
      setPreviewUrl(`${objectUrl}#toolbar=1&navpanes=0`);
      setPreviewOpen(true);
    } catch {
      toast.error("Failed to open PDF preview");
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

  const showRecordingProgress =
    isExternalPlatform &&
    meeting.recordingProgress &&
    meeting.recordingProgress.phase !== "ready" &&
    (!meeting.mom ||
      meeting.recordingProgress.isLive ||
      meeting.recordingProgress.isProcessing);

  const visibleStakeholders = showAllStakeholders
    ? meeting.stakeholders
    : meeting.stakeholders.slice(0, 4);
  const hiddenStakeholderCount = Math.max(0, meeting.stakeholders.length - 4);

  return (
    <>
      <div className="mx-auto max-w-5xl space-y-4 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1 text-muted-foreground -ml-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            {(isExternalPlatform || meeting.status !== "completed") && (
              <Button onClick={handleJoin} variant="secondary" className="gap-2" size="sm">
                <Video className="h-3.5 w-3.5" />
                {isExternalPlatform ? `Join on ${platformLabel}` : "Join Meeting"}
              </Button>
            )}
            {meeting.mom && !meeting.mom.approved && (
              <Button
                size="sm"
                onClick={handleApproveMom}
                disabled={approvingMom || !canApproveMom}
                className="gap-2"
              >
                {approvingMom ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                Approve & send
              </Button>
            )}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden">
            <div className="border-b bg-gradient-to-br from-secondary/10 via-background to-background px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <h1 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">{meeting.title}</h1>
                  {meeting.description ? (
                    <p className="text-muted-foreground line-clamp-2 text-sm">{meeting.description}</p>
                  ) : null}
                  <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs sm:text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {meeting.date} · {meeting.time} · {meeting.duration} min
                    </span>
                    <Badge variant="outline" className="text-[10px]">{platformLabel}</Badge>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                  <TagBadge tag={meeting.tag} />
                  <StatusBadge status={meeting.status} />
                  <MomStakeholderBadge meeting={meeting} />
                </div>
              </div>
            </div>

            {showRecordingProgress ? (
              <div className="border-b px-4 py-3 sm:px-5">
                <ExternalRecordingProgress meeting={meeting} />
              </div>
            ) : null}

            <div className="px-4 py-3 sm:px-5">
              <Tabs
                value={detailTab}
                onValueChange={(value) => setDetailTab(value as "overview" | "capture" | "mom")}
                className="space-y-4"
              >
                <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-xl p-1 sm:inline-flex sm:w-auto">
                  <TabsTrigger value="overview" className="rounded-lg px-3 py-2 text-xs sm:text-sm">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="capture" className="gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm">
                    <NotebookPen className="hidden h-3.5 w-3.5 sm:block" />
                    Notes & recording
                  </TabsTrigger>
                  <TabsTrigger value="mom" className="gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm">
                    <FileText className="hidden h-3.5 w-3.5 sm:block" />
                    MOM
                    {meeting.mom && !meeting.mom.approved ? (
                      <span className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-warning" aria-label="Needs approval" />
                    ) : null}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-0 space-y-4 focus-visible:outline-none">
                  <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-3 rounded-xl border p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="flex items-center gap-1.5 text-sm font-medium">
                          <Users className="h-4 w-4" /> Stakeholders
                        </h2>
                        {meeting.stakeholders.length > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5"
                            disabled={resendingInvites}
                            onClick={handleResendInvites}
                          >
                            {resendingInvites ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                            Resend invites
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {visibleStakeholders.map((s, i) => (
                          <span
                            key={`${s.email}-${i}`}
                            className="bg-accent text-accent-foreground inline-flex max-w-full items-center truncate rounded-full px-3 py-1 text-xs sm:text-sm"
                            title={`${s.name} (${s.email})`}
                          >
                            {s.name}
                            <span className="text-muted-foreground ml-1 hidden truncate text-[11px] sm:inline">
                              {s.email}
                            </span>
                          </span>
                        ))}
                        {meeting.stakeholders.length === 0 && (
                          <span className="text-muted-foreground text-sm">No stakeholders added</span>
                        )}
                      </div>
                      {hiddenStakeholderCount > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1 px-2"
                          onClick={() => setShowAllStakeholders((v) => !v)}
                        >
                          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAllStakeholders ? "rotate-180" : ""}`} />
                          {showAllStakeholders ? "Show less" : `Show ${hiddenStakeholderCount} more`}
                        </Button>
                      )}
                      {meeting.invites && meeting.invites.length > 0 && (
                        <div className="border-t pt-3">
                          <p className="text-muted-foreground mb-2 flex items-center gap-1 text-xs font-medium">
                            <Mail className="h-3.5 w-3.5" /> Invite delivery
                          </p>
                          <div className="grid max-h-28 gap-1 overflow-y-auto pr-1">
                            {meeting.invites.map((inv) => (
                              <div key={inv.email} className="flex items-center justify-between gap-2 text-xs">
                                <span className="truncate">{inv.name}</span>
                                <Badge variant="outline" className="shrink-0 text-[10px]">
                                  {inv.status === "logged" ? "saved (dev)" : inv.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 rounded-xl border p-4">
                      <h2 className="text-sm font-medium">Quick actions</h2>
                      <div className="flex flex-col gap-2">
                        {meeting.status === "upcoming" && !isExternalPlatform && (
                          <Button onClick={handleStart} variant="outline" size="sm" className="justify-start gap-2">
                            <Play className="h-3.5 w-3.5" /> Start Meeting
                          </Button>
                        )}
                        {meeting.status !== "completed" && !isExternalPlatform && (
                          <Button onClick={handleComplete} variant="outline" size="sm" className="justify-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Mark Completed
                          </Button>
                        )}
                        <Button
                          onClick={() => {
                            setDetailTab("mom");
                            void handleGenerateMOM();
                          }}
                          variant="outline"
                          size="sm"
                          className="justify-start gap-2"
                          disabled={generatingMom}
                        >
                          {generatingMom ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                          {meeting.mom ? "Regenerate MOM" : "Generate MOM"}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="justify-start gap-2"
                          onClick={() => setDetailTab("mom")}
                        >
                          <FileText className="h-3.5 w-3.5" />
                          {meeting.mom ? "Open MOM editor" : "Go to MOM"}
                        </Button>
                        <Button variant="ghost" size="sm" className="justify-start gap-2" onClick={() => navigate("/mom")}>
                          MOM inbox
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="capture" className="mt-0 space-y-4 focus-visible:outline-none">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-3 rounded-xl border p-4">
                      <h2 className="text-sm font-medium">Meeting notes</h2>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Capture notes during or after the call…"
                        rows={8}
                        className="min-h-[180px] resize-y"
                      />
                      <Button variant="outline" size="sm" onClick={saveNotes}>
                        Save notes
                      </Button>
                    </div>

                    <div className="space-y-3 rounded-xl border p-4">
                      <h2 className="text-sm font-medium">Recording</h2>
                      {isExternalPlatform ? (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          A recording bot joins your {platformLabel} call automatically. When everyone leaves,
                          the bot exits and MOM generation starts.
                        </p>
                      ) : (
                        <>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            Upload meeting audio for transcription and AI extraction.
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
                          <div className="flex flex-wrap gap-2">
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
                          </div>
                        </>
                      )}

                      {meeting.transcript ? (
                        <div className="rounded-lg border bg-muted/20 p-3">
                          <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
                            Transcript
                          </p>
                          <div className="max-h-56 space-y-2 overflow-y-auto text-sm">
                            {(meeting.transcript.segments ?? []).map((seg, i) => (
                              <p key={i}>
                                <span className="font-medium text-secondary">{seg.speaker}:</span> {seg.text}
                              </p>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-xs">
                          Transcript appears here after recording or audio upload is processed.
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mom" id="mom" className="mt-0 scroll-mt-6 space-y-4 focus-visible:outline-none">
                  {meeting.mom ? (
                    <>
                      <div className="sticky top-0 z-10 -mx-1 flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-background/95 px-3 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">Minutes of Meeting</p>
                          <p className="text-muted-foreground truncate text-xs">
                            {meeting.mom.dateTime}
                            {(meeting.mom.participants ?? []).length > 0
                              ? ` · ${(meeting.mom.participants ?? []).slice(0, 3).join(", ")}`
                              : ""}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {meeting.mom.shared ? (
                            <Badge variant="secondary" className="gap-1 border border-success/20 bg-success/10 text-success">
                              <CheckCircle2 className="h-3 w-3" /> Sent
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1 border-warning/30 bg-warning/10 text-warning">
                              Awaiting approval
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={handlePreviewPdf}
                            disabled={previewLoading}
                          >
                            {previewLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
                            View PDF
                          </Button>
                          {!meeting.mom.approved && (
                            <Button
                              size="sm"
                              onClick={handleApproveMom}
                              disabled={approvingMom || !canApproveMom}
                              className="gap-1.5"
                            >
                              {approvingMom ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                              Approve & send
                            </Button>
                          )}
                          {meeting.mom.approved && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5"
                              onClick={() => handleDownloadFormat("docx")}
                              disabled={downloadingFormat !== null}
                            >
                              {downloadingFormat === "docx" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                              DOCX
                            </Button>
                          )}
                        </div>
                      </div>

                      {!meeting.mom.approved && (
                        <p className="text-muted-foreground rounded-lg border border-dashed px-3 py-2 text-xs">
                          Viewing the PDF does not email anyone. Stakeholders receive the MOM only after you click{" "}
                          <span className="font-medium text-foreground">Approve & send</span>.
                        </p>
                      )}

                      {meeting.mom.approved && (
                        <div className="flex items-start gap-3 rounded-lg border border-success/20 bg-success/5 px-4 py-3 text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              Approved by {meeting.mom.approvedBy || organization?.name || APP_NAME}
                            </p>
                            {meeting.mom.approvedAt && (
                              <p className="text-muted-foreground text-xs">
                                {new Date(meeting.mom.approvedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="rounded-xl border p-3 sm:p-4">
                        <MomInlineEditor
                          ref={momEditorRef}
                          meetingId={meeting.id}
                          mom={meeting.mom}
                          participantNames={[
                            ...meeting.stakeholders.map((s) => s.name),
                            ...(meeting.mom.participants ?? []),
                          ]}
                          onMomSaved={handleMomSaved}
                        />
                      </div>

                      {meeting.mom.approved && (
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-muted-foreground mr-1 text-xs">Local export:</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={handlePreviewPdf}
                            disabled={previewLoading}
                          >
                            {previewLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
                            View PDF
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => handleDownloadFormat("docx")}
                            disabled={downloadingFormat !== null}
                          >
                            {downloadingFormat === "docx" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                            DOCX
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => handleDownloadFormat("txt")}
                            disabled={downloadingFormat !== null}
                          >
                            {downloadingFormat === "txt" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                            TXT
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5"
                            onClick={() => handleDownloadFormat("json")}
                            disabled={downloadingFormat !== null}
                          >
                            {downloadingFormat === "json" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                            JSON
                          </Button>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1.5"
                          onClick={handleGenerateMOM}
                          disabled={generatingMom}
                        >
                          {generatingMom ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                          Regenerate
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-xl border border-dashed p-6">
                      <div className="mx-auto max-w-lg space-y-3 text-center">
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                          <FileText className="h-5 w-5" />
                        </div>
                        <h2 className="font-heading text-lg font-semibold">No MOM draft yet</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {meeting.status === "failed" || meeting.recordingBotStatus === "failed"
                            ? "Recording/MOM generation failed or no audio was available from the bot. Upload the meeting recording — MOM is only created from real audio, not notes."
                            : isExternalPlatform
                              ? `After your ${platformLabel} call ends, transcription creates a draft automatically. Keep this page open briefly after the call, or come back and open MOM — generation continues on the server.`
                              : "MOM is generated from the meeting recording only. Upload audio if the bot did not capture it, then generate."}
                        </p>
                        {(meeting.status === "failed" || meeting.recordingBotStatus === "failed") && (
                          <Badge variant="outline" className="gap-1 border-destructive/30 text-destructive">
                            Recording failed
                          </Badge>
                        )}
                        {(meeting.pipelineStatus === "processing" ||
                          meeting.recordingBotStatus === "processing" ||
                          meeting.recordingBotStatus === "call_ended" ||
                          meeting.recordingBotStatus === "scheduling") &&
                          meeting.status !== "failed" &&
                          meeting.recordingBotStatus !== "failed" && (
                          <Badge variant="outline" className="gap-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            {meeting.recordingBotStatus === "call_ended"
                              ? "Finishing recording upload…"
                              : "Generating MOM from recording…"}
                          </Badge>
                        )}
                        <div className="flex flex-wrap justify-center gap-2 pt-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2"
                            onClick={handleGenerateMOM}
                            disabled={generatingMom}
                          >
                            {generatingMom ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                            Generate MOM
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setDetailTab("capture")}>
                            Upload audio
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </motion.div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="flex h-[85vh] max-w-5xl flex-col gap-3">
          <DialogHeader>
            <DialogTitle>MOM PDF preview</DialogTitle>
            <p className="text-muted-foreground text-sm font-normal">
              {meeting?.mom?.approved
                ? "This is an in-app preview of the approved minutes."
                : "Preview only — stakeholders are not emailed until you Approve & send."}
            </p>
          </DialogHeader>
          {previewUrl ? (
            <iframe
              title="MOM PDF Preview"
              src={previewUrl}
              className="min-h-0 w-full flex-1 rounded-md border bg-muted/20"
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
              No preview available
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
