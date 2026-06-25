import { MeetingPlatform, MeetingStatus, prisma } from "@lyrus/db";
import { runMeetingPipeline } from "../pipeline.js";
import { saveMeetingRecording } from "../storage/index.js";
import {
  extractMeetingIdFromRecallPayload,
  fetchRecallBotSnapshot,
  isRecordingBotActive,
  resolveMeetingIdFromBotId,
  scheduleRecordingBot,
} from "./recall.js";
import { mapRecallCodeToBotStatus } from "./recording-progress.js";

export type RecallSyncResult = "ingested" | "pending" | "failed" | "none";

const LIVE_BOT_STATUSES = new Set([
  "scheduling",
  "scheduled",
  "joining",
  "waiting_room",
  "in_call",
  "recording",
  "call_ended",
]);

function shouldRefreshLiveBotStatus(status: string | null | undefined): boolean {
  if (!status) return false;
  if (status === "done" || status === "failed" || status === "processing") return false;
  return LIVE_BOT_STATUSES.has(status) || status === "scheduled";
}

/** Pull live Recall status into DB before ingest / UI refresh. */
export async function refreshExternalRecordingLiveStatus(meetingId: string): Promise<void> {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: {
      recordingBotId: true,
      recordingBotStatus: true,
      platform: true,
      status: true,
    },
  });
  if (!meeting?.recordingBotId) return;
  if (
    meeting.platform !== MeetingPlatform.GOOGLE_MEET &&
    meeting.platform !== MeetingPlatform.MICROSOFT_TEAMS
  ) {
    return;
  }
  if (!shouldRefreshLiveBotStatus(meeting.recordingBotStatus)) return;

  const snapshot = await fetchRecallBotSnapshot(meeting.recordingBotId);
  if (!snapshot) return;

  const mapped = mapRecallCodeToBotStatus(snapshot.statusCode);
  const nextBotStatus = mapped ?? meeting.recordingBotStatus;

  const updates: {
    recordingBotStatus?: string;
    status?: MeetingStatus;
  } = {};

  if (nextBotStatus && nextBotStatus !== meeting.recordingBotStatus) {
    updates.recordingBotStatus = nextBotStatus;
  }

  if (
    (snapshot.isCallEnded || nextBotStatus === "call_ended") &&
    meeting.status === MeetingStatus.ONGOING
  ) {
    updates.status = MeetingStatus.PROCESSING;
  }

  if (snapshot.isFatal && !snapshot.isDone) {
    updates.recordingBotStatus = "failed";
    updates.status = MeetingStatus.FAILED;
  }

  if (Object.keys(updates).length > 0) {
    await prisma.meeting.update({
      where: { id: meetingId },
      data: updates,
    });
  }
}

export async function syncExternalRecordingState(meetingId: string): Promise<RecallSyncResult> {
  await refreshExternalRecordingLiveStatus(meetingId);
  return tryIngestRecallRecordingIfReady(meetingId);
}

export function externalMeetingNeedsLiveRefresh(meeting: {
  platform: MeetingPlatform;
  recordingBotId: string | null;
  recordingBotStatus: string | null;
}): boolean {
  if (
    meeting.platform !== MeetingPlatform.GOOGLE_MEET &&
    meeting.platform !== MeetingPlatform.MICROSOFT_TEAMS
  ) {
    return false;
  }
  if (!meeting.recordingBotId) return false;
  return shouldRefreshLiveBotStatus(meeting.recordingBotStatus);
}

/** Mark meeting live without downgrading COMPLETED/PROCESSING (keeps MOM approval valid). */
async function markMeetingLiveIfAllowed(
  meetingId: string,
  options?: { force?: boolean },
): Promise<void> {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { status: true },
  });
  if (!meeting) return;

  if (
    !options?.force &&
    (meeting.status === MeetingStatus.COMPLETED || meeting.status === MeetingStatus.PROCESSING)
  ) {
    return;
  }

  if (meeting.status === MeetingStatus.ONGOING) return;

  await prisma.meeting.update({
    where: { id: meetingId },
    data: { status: MeetingStatus.ONGOING },
  });
}

export async function scheduleBotForExternalMeeting(meetingId: string): Promise<void> {
  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting?.externalMeetingUrl) return;
  if (
    meeting.platform !== MeetingPlatform.GOOGLE_MEET &&
    meeting.platform !== MeetingPlatform.MICROSOFT_TEAMS
  ) {
    return;
  }

  if (meeting.recordingBotId && meeting.recordingBotStatus !== "done" && meeting.recordingBotStatus !== "failed") {
    if (await isRecordingBotActive(meeting.recordingBotId)) {
      return;
    }
  }

  await scheduleRecordingBot({
    meetingId: meeting.id,
    meetingUrl: meeting.externalMeetingUrl,
    scheduledAt: meeting.scheduledAt,
    meetingTitle: meeting.title,
  });
}

/**
 * Ensure a Recall bot will join the meeting — called when the user clicks Join.
 * Schedules immediately if no active bot exists.
 */
export async function rescheduleBotForExternalMeeting(meetingId: string): Promise<void> {
  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting?.externalMeetingUrl) return;
  if (
    meeting.platform !== MeetingPlatform.GOOGLE_MEET &&
    meeting.platform !== MeetingPlatform.MICROSOFT_TEAMS
  ) {
    return;
  }

  const current = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { recordingBotId: true, recordingBotStatus: true },
  });

  if (current?.recordingBotStatus === "processing" || current?.recordingBotStatus === "scheduling") {
    await markMeetingLiveIfAllowed(meetingId);
    return;
  }

  let needsNewBot = !current?.recordingBotId;

  if (current?.recordingBotId) {
    const active = await isRecordingBotActive(current.recordingBotId);
    if (active) {
      await markMeetingLiveIfAllowed(meetingId, { force: true });
      return;
    }

    const snapshot = await fetchRecallBotSnapshot(current.recordingBotId);
    const code = snapshot?.statusCode ?? "";
    if (snapshot?.isDone || code === "call_ended") {
      await tryIngestRecallRecordingIfReady(meetingId);
    }
    needsNewBot = true;
  }

  if (needsNewBot) {
    await scheduleRecordingBot({
      meetingId: meeting.id,
      meetingUrl: meeting.externalMeetingUrl,
      scheduledAt: new Date(),
      meetingTitle: meeting.title,
      forceNew: Boolean(current?.recordingBotId),
      joinImmediately: true,
    });
    await markMeetingLiveIfAllowed(meetingId, { force: true });
  }
}

export async function tryIngestRecallRecordingIfReady(meetingId: string): Promise<RecallSyncResult> {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { recordingBotId: true, recordingBotStatus: true },
  });
  if (!meeting?.recordingBotId) return "none";
  if (meeting.recordingBotStatus === "done") return "none";
  if (meeting.recordingBotStatus === "processing") return "pending";

  const snapshot = await fetchRecallBotSnapshot(meeting.recordingBotId);
  if (!snapshot) return "failed";

  if (snapshot.isFatal && !snapshot.isDone) {
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { recordingBotStatus: "failed", status: MeetingStatus.FAILED },
    });
    return "failed";
  }

  if (!snapshot.isDone || !snapshot.downloadUrl) {
    if (snapshot.isCallEnded || snapshot.statusCode === "call_ended") {
      await prisma.meeting.update({
        where: { id: meetingId },
        data: {
          recordingBotStatus: "call_ended",
          status: MeetingStatus.PROCESSING,
        },
      });
    }
    return "pending";
  }

  await prisma.meeting.update({
    where: { id: meetingId },
    data: { recordingBotStatus: "processing" },
  });
  await ingestRecallRecording(meetingId, meeting.recordingBotId);
  return "ingested";
}

function extractBotStatus(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  const data = obj.data;
  if (data && typeof data === "object") {
    const inner = (data as Record<string, unknown>).data;
    if (inner && typeof inner === "object") {
      const code = (inner as Record<string, unknown>).code;
      if (typeof code === "string") return code.toLowerCase();
    }
    const status = (data as Record<string, unknown>).status;
    if (typeof status === "string") return status.toLowerCase();
    const bot = (data as Record<string, unknown>).bot;
    if (bot && typeof bot === "object") {
      const botStatus = (bot as Record<string, unknown>).status;
      if (typeof botStatus === "string") return botStatus.toLowerCase();
    }
  }
  const status = obj.status;
  if (typeof status === "string") return status.toLowerCase();
  return null;
}

function isDoneEvent(eventType: string, status: string | null): boolean {
  const e = eventType.toLowerCase();
  if (e === "bot.done" || e.endsWith(".done")) return true;
  if (status && ["done", "completed", "complete", "finished", "ended"].includes(status)) {
    return true;
  }
  return (
    e.includes("done") ||
    e.includes("completed") ||
    e.includes("finished") ||
    e.includes("recording.ready") ||
    e.includes("recording_done") ||
    e.includes("recording.done")
  );
}

function isFailureEvent(eventType: string, status: string | null): boolean {
  const e = eventType.toLowerCase();
  if (e === "bot.fatal" || e.endsWith(".fatal") || e.endsWith(".failed")) return true;
  if (status && ["failed", "fatal", "error"].includes(status)) return true;
  return e.includes("failed") || e.includes("fatal") || e.includes("error");
}

export async function processRecallWebhook(payload: unknown): Promise<void> {
  const eventType =
    payload && typeof payload === "object"
      ? String((payload as Record<string, unknown>).event ?? "")
      : "";

  const botId =
    payload && typeof payload === "object"
      ? extractBotId(payload as Record<string, unknown>)
      : null;

  const meetingId =
    extractMeetingIdFromRecallPayload(payload) ??
    (botId ? await resolveMeetingIdFromBotId(botId) : null);

  if (!meetingId) return;

  const status = extractBotStatus(payload);
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { recordingBotStatus: true, recordingBotId: true },
  });

  if (botId && meeting?.recordingBotId && meeting.recordingBotId !== botId) {
    return;
  }

  if (meeting?.recordingBotStatus === "done" || meeting?.recordingBotStatus === "processing") {
    if (isFailureEvent(eventType, status) && meeting?.recordingBotStatus !== "done") {
      await prisma.meeting.update({
        where: { id: meetingId },
        data: { recordingBotStatus: "failed", status: MeetingStatus.FAILED },
      });
    }
    return;
  }

  if (isFailureEvent(eventType, status)) {
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { recordingBotStatus: "failed", status: MeetingStatus.FAILED },
    });
    return;
  }

  const mapped = mapRecallCodeToBotStatus(status);
  if (mapped === "call_ended") {
    await syncExternalRecordingState(meetingId);
    return;
  }

  if (isDoneEvent(eventType, status)) {
    await syncExternalRecordingState(meetingId);
    return;
  }

  if (mapped && mapped !== meeting?.recordingBotStatus) {
    await prisma.meeting.update({
      where: { id: meetingId },
      data: {
        recordingBotStatus: mapped,
      },
    });
  }
}

function extractBotId(payload: Record<string, unknown>): string | null {
  const data = payload.data;
  if (data && typeof data === "object") {
    const bot = (data as Record<string, unknown>).bot;
    if (bot && typeof bot === "object") {
      const id = (bot as Record<string, unknown>).id;
      if (typeof id === "string") return id;
    }
    const id = (data as Record<string, unknown>).id;
    if (typeof id === "string") return id;
  }
  const bot = payload.bot;
  if (bot && typeof bot === "object") {
    const id = (bot as Record<string, unknown>).id;
    if (typeof id === "string") return id;
  }
  return null;
}

async function ingestRecallRecording(meetingId: string, botId: string): Promise<void> {
  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting) return;

  const snapshot = await fetchRecallBotSnapshot(botId);
  const downloadUrl = snapshot?.downloadUrl;
  if (!downloadUrl) {
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { recordingBotStatus: "failed", status: MeetingStatus.FAILED },
    });
    return;
  }

  const res = await fetch(downloadUrl);
  if (!res.ok) {
    throw new Error(`Failed to download recording for meeting ${meetingId}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") ?? "video/mp4";
  const ext = contentType.includes("webm") ? "webm" : "mp4";

  const saved = await saveMeetingRecording(
    meetingId,
    buffer,
    `recall-${botId}.${ext}`,
    contentType,
  );

  await prisma.meeting.update({
    where: { id: meetingId },
    data: { recordingBotStatus: "done" },
  });

  try {
    await runMeetingPipeline(meetingId, {
      filePath: saved.filePath,
      mimeType: contentType,
      s3Key: saved.s3Key,
      s3Bucket: saved.s3Bucket,
    });
    if (saved.cleanup) await saved.cleanup();
  } catch (err) {
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { status: MeetingStatus.FAILED },
    });
    throw err;
  }
}
