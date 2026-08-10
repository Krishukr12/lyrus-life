import { MeetingPlatform, MeetingStatus, prisma } from "@lyrus/db";
import { runMeetingPipeline, runNluFromExistingTranscript } from "../pipeline.js";
import { saveMeetingRecording } from "../storage/index.js";
import {
  extractMeetingIdFromRecallPayload,
  fetchRecallBotSnapshot,
  deleteRecallBot,
  isRecordingBotActive,
  resolveMeetingIdFromBotId,
  scheduleRecordingBot,
} from "./recall.js";
import { mapRecallCodeToBotStatus, isActiveRecordingBotStatus } from "./recording-progress.js";

export type RecallSyncResult = "ingested" | "pending" | "failed" | "none";

/** How long we wait after call_ended for Recall to publish a download URL. */
const MEDIA_READY_TIMEOUT_MS = 12 * 60_000;
/** Absolute ceiling after scheduled end before we stop claiming "still generating". */
const ABSOLUTE_STUCK_AFTER_SCHEDULED_END_MS = 3 * 60 * 60_000;
/** Allow retry if ingest crashed while status was "processing". */
const PROCESSING_STUCK_MS = 5 * 60_000;
/** Background sweep so stuck meetings recover without a browser tab open. */
const STUCK_RECOVERY_INTERVAL_MS = 2 * 60_000;

/** Prevents concurrent download/transcribe races that duplicate transcript merges. */
const ingestInflight = new Map<string, Promise<RecallSyncResult>>();
let stuckRecoveryTimer: ReturnType<typeof setInterval> | null = null;

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
  // Never promote Recall terminal "done" to local "done" — ingest owns that bit.
  const nextBotStatus =
    mapped === "done" ? "call_ended" : (mapped ?? meeting.recordingBotStatus);

  const updates: {
    recordingBotStatus?: string;
    status?: MeetingStatus;
  } = {};

  if (nextBotStatus && nextBotStatus !== meeting.recordingBotStatus) {
    updates.recordingBotStatus = nextBotStatus;
  }

  if (
    (snapshot.isCallEnded ||
      nextBotStatus === "call_ended" ||
      snapshot.statusCode === "done") &&
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
    // Replace dead/failed bots; first-time schedule when recordingBotId is null.
    forceNew: Boolean(meeting.recordingBotId),
  });
}

/**
 * Ensure a Recall bot will join the meeting — called when the user clicks Join.
 * If a bot is only scheduled for a future calendar time (e.g. tomorrow), replace it
 * with an ad-hoc bot that joins immediately so early Meets are still recorded.
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
  let forceNew = false;

  if (current?.recordingBotId) {
    const snapshot = await fetchRecallBotSnapshot(current.recordingBotId);
    const code = snapshot?.statusCode ?? "";

    if (snapshot?.isJoiningOrInCall) {
      await markMeetingLiveIfAllowed(meetingId, { force: true });
      return;
    }

    if (snapshot?.isDone || code === "call_ended") {
      await tryIngestRecallRecordingIfReady(meetingId);
    }

    // Future-scheduled bots look "active" but will not join an early Meet today.
    needsNewBot = true;
    forceNew = true;
    await deleteRecallBot(current.recordingBotId);
  }

  if (needsNewBot) {
    await scheduleRecordingBot({
      meetingId: meeting.id,
      meetingUrl: meeting.externalMeetingUrl,
      scheduledAt: new Date(),
      meetingTitle: meeting.title,
      forceNew: forceNew || Boolean(current?.recordingBotId),
      joinImmediately: true,
    });
    await markMeetingLiveIfAllowed(meetingId, { force: true });
  }
}

export async function tryIngestRecallRecordingIfReady(meetingId: string): Promise<RecallSyncResult> {
  const existing = ingestInflight.get(meetingId);
  if (existing) return existing;

  const run = doTryIngestRecallRecordingIfReady(meetingId).finally(() => {
    ingestInflight.delete(meetingId);
  });
  ingestInflight.set(meetingId, run);
  return run;
}

async function doTryIngestRecallRecordingIfReady(meetingId: string): Promise<RecallSyncResult> {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: {
      recordingBotId: true,
      recordingBotStatus: true,
      recordingUrl: true,
      updatedAt: true,
      status: true,
      scheduledAt: true,
      durationMinutes: true,
      mom: { select: { id: true } },
      transcript: { select: { id: true } },
      _count: { select: { audioFiles: true } },
    },
  });
  if (!meeting) return "none";

  const hasTranscript = Boolean(meeting.transcript);
  const hasMom = Boolean(meeting.mom);
  const hasAudio = Boolean(meeting.recordingUrl) || meeting._count.audioFiles > 0;

  // Draft from a prior session — do not re-ingest, but never kill a bot that rejoined.
  if (hasMom) {
    if (isActiveRecordingBotStatus(meeting.recordingBotStatus)) {
      return "none";
    }
    if (
      meeting.recordingBotStatus !== "done" ||
      meeting.status !== MeetingStatus.COMPLETED
    ) {
      await prisma.meeting.update({
        where: { id: meetingId },
        data: {
          recordingBotStatus: "done",
          status: MeetingStatus.COMPLETED,
        },
      });
    }
    return "none";
  }

  if (!meeting.recordingBotId) return "none";

  // Fully finished — never re-ingest (avoids appending the same transcript again).
  if (meeting.recordingBotStatus === "done" && hasTranscript) {
    try {
      await runNluFromExistingTranscript(meetingId);
    } catch {
      /* leave for manual regenerate */
    }
    return "none";
  }

  if (meeting.recordingBotStatus === "processing") {
    const ageMs = Date.now() - meeting.updatedAt.getTime();
    if (ageMs < PROCESSING_STUCK_MS) return "pending";
    // Fall through and retry ingest after a stuck processing lock.
  }

  // "done" without transcript was the stuck false-done case — recover once.
  // If audio already exists, only re-run pipeline (do not download again).
  if (meeting.recordingBotStatus === "done" && !hasTranscript && hasAudio) {
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { recordingBotStatus: "processing", status: MeetingStatus.PROCESSING },
    });
    const audio = await prisma.audioFile.findFirst({
      where: { meetingId },
      orderBy: { createdAt: "desc" },
    });
    if (audio) {
      const { materializeAudioForProcessing } = await import("../storage/index.js");
      const resolved = await materializeAudioForProcessing(audio);
      await runMeetingPipeline(meetingId, {
        filePath: resolved.filePath,
        mimeType: audio.mimeType,
        s3Key: resolved.s3Key,
        s3Bucket: resolved.s3Bucket,
      });
      if (resolved.cleanup) await resolved.cleanup();
      await prisma.meeting.update({
        where: { id: meetingId },
        data: { recordingBotStatus: "done" },
      });
      return "ingested";
    }
  }

  if (meeting.recordingBotStatus === "done" && !hasTranscript && !hasAudio) {
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { recordingBotStatus: "call_ended", status: MeetingStatus.PROCESSING },
    });
  }

  const snapshot = await fetchRecallBotSnapshot(meeting.recordingBotId);
  if (!snapshot) {
    // Bot gone / Recall API error — don't leave the UI spinning for hours.
    const ageMs = Date.now() - meeting.updatedAt.getTime();
    const pastScheduledEnd =
      Date.now() - meeting.scheduledAt.getTime() >
      (Math.max(meeting.durationMinutes || 60, 1) * 60_000 + ABSOLUTE_STUCK_AFTER_SCHEDULED_END_MS);
    if (
      (meeting.recordingBotStatus === "call_ended" ||
        meeting.recordingBotStatus === "processing") &&
      (ageMs >= MEDIA_READY_TIMEOUT_MS || pastScheduledEnd)
    ) {
      await prisma.meeting.update({
        where: { id: meetingId },
        data: { recordingBotStatus: "failed", status: MeetingStatus.FAILED },
      });
      return "failed";
    }
    return "failed";
  }

  if (snapshot.isFatal && !snapshot.isDone) {
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { recordingBotStatus: "failed", status: MeetingStatus.FAILED },
    });
    return "failed";
  }

  if (!snapshot.isDone || !snapshot.downloadUrl) {
    const ending =
      snapshot.isCallEnded ||
      snapshot.statusCode === "call_ended" ||
      snapshot.statusCode === "done";
    if (ending) {
      const alreadyEnding = meeting.recordingBotStatus === "call_ended";
      const ageMs = Date.now() - meeting.updatedAt.getTime();
      const pastScheduledEnd =
        Date.now() - meeting.scheduledAt.getTime() >
        (Math.max(meeting.durationMinutes || 60, 1) * 60_000 + ABSOLUTE_STUCK_AFTER_SCHEDULED_END_MS);
      // Fail if media never appears — do not spin "Generating MOM" for hours.
      if (
        alreadyEnding &&
        !snapshot.downloadUrl &&
        (ageMs >= MEDIA_READY_TIMEOUT_MS || pastScheduledEnd)
      ) {
        await prisma.meeting.update({
          where: { id: meetingId },
          data: { recordingBotStatus: "failed", status: MeetingStatus.FAILED },
        });
        return "failed";
      }
      if (!alreadyEnding) {
        await prisma.meeting.update({
          where: { id: meetingId },
          data: {
            recordingBotStatus: "call_ended",
            status: MeetingStatus.PROCESSING,
          },
        });
      }
    }
    return "pending";
  }

  // Media ready but we already transcribed this meeting — do not merge another copy.
  if (hasTranscript) {
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { recordingBotStatus: "done" },
    });
    if (!hasMom) {
      try {
        await runNluFromExistingTranscript(meetingId);
      } catch {
        /* ignore */
      }
    }
    return "none";
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
      return;
    }
    // Re-run sync so stuck "done"/"processing" without media can recover or fail cleanly.
    if (isDoneEvent(eventType, status) || mappedLooksLikeCallEnded(status)) {
      await syncExternalRecordingState(meetingId);
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

function mappedLooksLikeCallEnded(status: string | null): boolean {
  if (!status) return false;
  const mapped = mapRecallCodeToBotStatus(status);
  return mapped === "call_ended" || status.toLowerCase() === "call_ended";
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
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: {
      id: true,
      transcript: { select: { id: true } },
      mom: { select: { id: true } },
    },
  });
  if (!meeting) return;

  // Another concurrent path already transcribed — do not append a second copy.
  if (meeting.transcript) {
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { recordingBotStatus: "done" },
    });
    if (!meeting.mom) {
      try {
        await runNluFromExistingTranscript(meetingId);
      } catch {
        /* leave for manual regenerate */
      }
    }
    return;
  }

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

  try {
    // Keep status as "processing" until transcription finishes — marking "done" early
    // caused recovery polls to re-download and merge duplicate transcripts.
    await runMeetingPipeline(meetingId, {
      filePath: saved.filePath,
      mimeType: contentType,
      s3Key: saved.s3Key,
      s3Bucket: saved.s3Bucket,
    });
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { recordingBotStatus: "done" },
    });
    if (saved.cleanup) await saved.cleanup();
  } catch (err) {
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { recordingBotStatus: "failed", status: MeetingStatus.FAILED },
    });
    throw err;
  }
}

/**
 * Server-side sweep for meetings stuck in call_ended/processing without MOM.
 * Client polling alone is not enough — if nobody keeps the meeting page open
 * (and webhooks are missing), generation can hang for hours.
 */
export async function recoverStuckExternalRecordings(): Promise<{
  checked: number;
  recovered: number;
  failed: number;
}> {
  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60_000);
  const candidates = await prisma.meeting.findMany({
    where: {
      platform: { in: [MeetingPlatform.GOOGLE_MEET, MeetingPlatform.MICROSOFT_TEAMS] },
      recordingBotId: { not: null },
      mom: { is: null },
      createdAt: { gte: cutoff },
      OR: [
        { recordingBotStatus: { in: ["call_ended", "processing"] } },
        {
          status: MeetingStatus.PROCESSING,
          recordingBotStatus: { notIn: ["done", "failed"] },
        },
        {
          // Bot left waiting room forever (never admitted)
          recordingBotStatus: "waiting_room",
          updatedAt: { lt: new Date(Date.now() - 2 * 60 * 60_000) },
        },
      ],
    },
    select: { id: true },
    take: 25,
    orderBy: { updatedAt: "asc" },
  });

  let recovered = 0;
  let failed = 0;
  for (const row of candidates) {
    try {
      const result = await syncExternalRecordingState(row.id);
      if (result === "ingested") recovered += 1;
      if (result === "failed") failed += 1;

      const after = await prisma.meeting.findUnique({
        where: { id: row.id },
        select: {
          recordingBotStatus: true,
          status: true,
          scheduledAt: true,
          durationMinutes: true,
          updatedAt: true,
          mom: { select: { id: true } },
          transcript: { select: { id: true } },
        },
      });
      if (!after || after.mom) continue;

      const pastScheduledEnd =
        Date.now() - after.scheduledAt.getTime() >
        Math.max(after.durationMinutes || 60, 1) * 60_000 + ABSOLUTE_STUCK_AFTER_SCHEDULED_END_MS;
      const staleEnding =
        (after.recordingBotStatus === "call_ended" ||
          after.recordingBotStatus === "processing" ||
          after.recordingBotStatus === "waiting_room") &&
        (Date.now() - after.updatedAt.getTime() >= MEDIA_READY_TIMEOUT_MS || pastScheduledEnd);

      if (staleEnding && !after.transcript) {
        await prisma.meeting.update({
          where: { id: row.id },
          data: { recordingBotStatus: "failed", status: MeetingStatus.FAILED },
        });
        failed += 1;
      }
    } catch (err) {
      console.warn("[recording-bot] stuck recovery failed", row.id, err);
    }
  }

  return { checked: candidates.length, recovered, failed };
}

export function startStuckRecordingRecoveryLoop(): void {
  if (stuckRecoveryTimer) return;
  const tick = () => {
    void recoverStuckExternalRecordings()
      .then((stats) => {
        if (stats.checked > 0) {
          console.log(
            `[recording-bot] stuck recovery checked=${stats.checked} recovered=${stats.recovered} failed=${stats.failed}`,
          );
        }
      })
      .catch((err) => console.warn("[recording-bot] stuck recovery tick failed", err));
  };
  // First pass shortly after boot, then every few minutes.
  setTimeout(tick, 15_000).unref?.();
  stuckRecoveryTimer = setInterval(tick, STUCK_RECOVERY_INTERVAL_MS);
  stuckRecoveryTimer.unref?.();
}

