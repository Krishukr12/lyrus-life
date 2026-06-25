import { createHash } from "node:crypto";
import { prisma } from "@lyrus/db";

const RECALL_API_BASE = "https://ap-northeast-1.recall.ai/api/v1";

/** Prevents concurrent duplicate bot creates for the same meeting. */
const scheduleInflight = new Map<string, Promise<{ botId: string }>>();

function recallApiKey(): string {
  const key = process.env.RECALL_API_KEY;
  if (!key) {
    throw new Error("RECALL_API_KEY is not configured — required for automated meeting recording");
  }
  return key;
}

export function isRecallConfigured(): boolean {
  return Boolean(process.env.RECALL_API_KEY);
}

type RecallBotApiResponse = {
  video_url?: string;
  status?: { code?: string };
  status_changes?: Array<{ code?: string }>;
  recordings?: Array<{
    status?: { code?: string };
    media_shortcuts?: { video_mixed?: { data?: { download_url?: string } } };
  }>;
};

function extractDownloadUrlFromBotPayload(data: RecallBotApiResponse): string | null {
  if (data.video_url) return data.video_url;
  for (const recording of data.recordings ?? []) {
    const mixed = recording.media_shortcuts?.video_mixed?.data?.download_url;
    if (mixed) return mixed;
  }
  return null;
}

function extractBotStatusCode(data: RecallBotApiResponse): string | null {
  const fromStatus = data.status?.code;
  if (fromStatus) return fromStatus.toLowerCase();
  const lastChange = data.status_changes?.[data.status_changes.length - 1]?.code;
  if (lastChange) return lastChange.toLowerCase();
  const recordingStatus = data.recordings?.[0]?.status?.code;
  if (recordingStatus) return recordingStatus.toLowerCase();
  return null;
}

export type RecallBotSnapshot = {
  statusCode: string | null;
  downloadUrl: string | null;
  isDone: boolean;
  isFatal: boolean;
  isInCall: boolean;
  isCallEnded: boolean;
};

/** Recall auto-leave: exit soon after everyone else leaves (even if calendar time remains). */
function recallAutomaticLeaveConfig() {
  return {
    everyone_left_timeout: { timeout: 20, activate_after: 45 },
    noone_joined_timeout: 900,
    waiting_room_timeout: 900,
    bot_detection: {
      using_participant_events: { timeout: 45, activate_after: 120 },
      using_participant_names: {
        timeout: 45,
        activate_after: 120,
        matches: [
          "notetaker",
          "recorder",
          "assistant",
          "otter",
          "fireflies",
          "fathom",
          "meeting desk",
        ],
      },
    },
  };
}

export async function fetchRecallBotSnapshot(botId: string): Promise<RecallBotSnapshot | null> {
  const res = await fetch(`${RECALL_API_BASE}/bot/${botId}/`, {
    headers: { Authorization: `Token ${recallApiKey()}` },
  });
  if (!res.ok) return null;

  const data = (await res.json()) as RecallBotApiResponse;
  const statusCode = extractBotStatusCode(data);
  const downloadUrl = extractDownloadUrlFromBotPayload(data);
  const code = statusCode ?? "";
  return {
    statusCode,
    downloadUrl,
    isDone: code === "done" || Boolean(downloadUrl),
    isFatal: code === "fatal" || code === "failed",
    isInCall:
      code === "in_call_recording" ||
      code === "in_call_not_recording" ||
      code === "recording",
    isCallEnded: code === "call_ended",
  };
}

function resolveJoinAt(scheduledAt: Date, joinImmediately: boolean): Date {
  const now = Date.now();
  if (joinImmediately) {
    return new Date(now + 5000);
  }
  // Meeting is now or within 15 minutes — send the bot soon, not at a future calendar time.
  if (scheduledAt.getTime() <= now + 15 * 60_000) {
    return new Date(now + 5000);
  }
  return scheduledAt;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isBotStillActive(botId: string): Promise<boolean> {
  const snapshot = await fetchRecallBotSnapshot(botId);
  if (!snapshot) return true;
  const code = snapshot.statusCode ?? "";
  if (snapshot.isDone || snapshot.isFatal || code === "call_ended") return false;
  return true;
}

export async function isRecordingBotActive(botId: string): Promise<boolean> {
  return isBotStillActive(botId);
}

async function findReusableBotId(meetingId: string): Promise<string | null> {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { recordingBotId: true, recordingBotStatus: true },
  });
  if (!meeting?.recordingBotId) return null;
  if (meeting.recordingBotStatus === "scheduling") return null;
  if (meeting.recordingBotStatus === "processing") return meeting.recordingBotId;
  if (meeting.recordingBotStatus === "done" || meeting.recordingBotStatus === "failed") {
    return null;
  }
  if (await isBotStillActive(meeting.recordingBotId)) {
    return meeting.recordingBotId;
  }
  return null;
}

/** Reuse an active bot already scheduled for the same Meet/Teams URL by this organizer. */
async function findSharedActiveBotId(input: {
  meetingId: string;
  organizerId: string;
  meetingUrl: string;
}): Promise<string | null> {
  const siblings = await prisma.meeting.findMany({
    where: {
      organizerId: input.organizerId,
      externalMeetingUrl: input.meetingUrl,
      recordingBotId: { not: null },
      id: { not: input.meetingId },
      recordingBotStatus: { in: ["scheduled", "processing", "scheduling"] },
    },
    select: { recordingBotId: true },
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  for (const sibling of siblings) {
    if (!sibling.recordingBotId) continue;
    if (await isBotStillActive(sibling.recordingBotId)) {
      return sibling.recordingBotId;
    }
  }
  return null;
}

async function waitForScheduledBot(meetingId: string, attempts = 40): Promise<string | null> {
  for (let i = 0; i < attempts; i++) {
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      select: { recordingBotId: true, recordingBotStatus: true },
    });
    if (meeting?.recordingBotId && meeting.recordingBotStatus !== "scheduling") {
      return meeting.recordingBotId;
    }
    if (meeting?.recordingBotStatus !== "scheduling") {
      return null;
    }
    await sleep(250);
  }
  return null;
}

async function clearStaleSchedulingLock(meetingId: string): Promise<void> {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { recordingBotStatus: true, recordingBotId: true, updatedAt: true },
  });
  if (meeting?.recordingBotStatus !== "scheduling") return;
  const ageMs = Date.now() - meeting.updatedAt.getTime();
  if (ageMs < 45_000 && !meeting.recordingBotId) return;
  await prisma.meeting.updateMany({
    where: { id: meetingId, recordingBotStatus: "scheduling" },
    data: { recordingBotStatus: meeting.recordingBotId ? "scheduled" : null },
  });
}

async function claimBotScheduleSlot(meetingId: string, forceNew: boolean): Promise<"claimed" | "exists"> {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { recordingBotId: true, recordingBotStatus: true },
  });
  if (!meeting) throw new Error("Meeting not found");

  if (meeting.recordingBotStatus === "scheduling") {
    const waited = await waitForScheduledBot(meetingId);
    if (waited) return "exists";
    await clearStaleSchedulingLock(meetingId);
  }

  if (!forceNew) {
    const reusable = await findReusableBotId(meetingId);
    if (reusable) return "exists";

    const claimed = await prisma.meeting.updateMany({
      where: {
        id: meetingId,
        recordingBotId: null,
        NOT: { recordingBotStatus: "scheduling" },
      },
      data: { recordingBotStatus: "scheduling" },
    });
    if (claimed.count > 0) return "claimed";

    const waited = await waitForScheduledBot(meetingId);
    if (waited) return "exists";
    const reusableAfterWait = await findReusableBotId(meetingId);
    if (reusableAfterWait) return "exists";
    return "claimed";
  }

  // forceNew — replace bot after prior session ended (status may still be "scheduled").
  let mayReplace = false;
  if (!meeting.recordingBotId) {
    mayReplace = true;
  } else if (meeting.recordingBotStatus === "done" || meeting.recordingBotStatus === "failed") {
    mayReplace = true;
  } else if (!(await isBotStillActive(meeting.recordingBotId))) {
    mayReplace = true;
  }

  if (!mayReplace) {
    const reusable = await findReusableBotId(meetingId);
    if (reusable) return "exists";
    return "exists";
  }

  const claimed = await prisma.meeting.updateMany({
    where: {
      id: meetingId,
      NOT: { recordingBotStatus: "scheduling" },
    },
    data: { recordingBotStatus: "scheduling", recordingBotId: null },
  });
  if (claimed.count > 0) return "claimed";

  const waited = await waitForScheduledBot(meetingId);
  if (waited) return "exists";
  await clearStaleSchedulingLock(meetingId);

  await prisma.meeting.update({
    where: { id: meetingId },
    data: { recordingBotStatus: "scheduling", recordingBotId: null },
  });
  return "claimed";
}

export async function scheduleRecordingBot(input: {
  meetingId: string;
  meetingUrl: string;
  scheduledAt: Date;
  meetingTitle: string;
  forceNew?: boolean;
  /** When true, bot joins in ~5s regardless of calendar scheduled time. */
  joinImmediately?: boolean;
}): Promise<{ botId: string }> {
  const inflight = scheduleInflight.get(input.meetingId);
  if (inflight) return inflight;

  const work = (async (): Promise<{ botId: string }> => {
    const meeting = await prisma.meeting.findUnique({
      where: { id: input.meetingId },
      select: { organizerId: true, externalMeetingUrl: true },
    });
    if (!meeting) throw new Error("Meeting not found");

    if (!input.forceNew) {
      const reusable = await findReusableBotId(input.meetingId);
      if (reusable) return { botId: reusable };

      if (meeting.organizerId) {
        const shared = await findSharedActiveBotId({
          meetingId: input.meetingId,
          organizerId: meeting.organizerId,
          meetingUrl: input.meetingUrl,
        });
        if (shared) {
          await prisma.meeting.update({
            where: { id: input.meetingId },
            data: { recordingBotId: shared, recordingBotStatus: "scheduled" },
          });
          return { botId: shared };
        }
      }
    }

    const claim = await claimBotScheduleSlot(input.meetingId, Boolean(input.forceNew));
    if (claim === "exists") {
      const botId =
        (await waitForScheduledBot(input.meetingId, 40)) ??
        (await findReusableBotId(input.meetingId));
      if (botId) return { botId };
    }

    try {
      const joinAtDate = resolveJoinAt(input.scheduledAt, Boolean(input.joinImmediately));
      const body: Record<string, unknown> = {
        meeting_url: input.meetingUrl,
        bot_name: "Meeting Desk AI",
        join_at: joinAtDate.toISOString(),
        metadata: { meetingId: input.meetingId },
        automatic_leave: recallAutomaticLeaveConfig(),
      };

      const res = await fetch(`${RECALL_API_BASE}/bot/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${recallApiKey()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to schedule recording bot: ${text}`);
      }

      const data = (await res.json()) as { id?: string };
      if (!data.id) {
        throw new Error("Recording bot response missing id");
      }

      await prisma.meeting.update({
        where: { id: input.meetingId },
        data: {
          recordingBotId: data.id,
          recordingBotStatus: "scheduled",
        },
      });

      return { botId: data.id };
    } catch (err) {
      await prisma.meeting.updateMany({
        where: { id: input.meetingId, recordingBotStatus: "scheduling" },
        data: { recordingBotStatus: null },
      });
      throw err;
    }
  })();

  scheduleInflight.set(input.meetingId, work);
  try {
    return await work;
  } finally {
    if (scheduleInflight.get(input.meetingId) === work) {
      scheduleInflight.delete(input.meetingId);
    }
  }
}

export function calendarImportLockKey(organizerId: string, calendarKey: string): bigint {
  const digest = createHash("sha256").update(`${organizerId}:${calendarKey}`).digest();
  return digest.readBigInt64BE(0);
}

export async function fetchRecallRecordingDownloadUrl(botId: string): Promise<string | null> {
  const snapshot = await fetchRecallBotSnapshot(botId);
  return snapshot?.downloadUrl ?? null;
}

export function extractMeetingIdFromRecallPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;

  const metadata = obj.metadata;
  if (metadata && typeof metadata === "object") {
    const meetingId = (metadata as Record<string, unknown>).meetingId;
    if (typeof meetingId === "string") return meetingId;
  }

  const data = obj.data;
  if (data && typeof data === "object") {
    const bot = (data as Record<string, unknown>).bot;
    if (bot && typeof bot === "object") {
      const botMetadata = (bot as Record<string, unknown>).metadata;
      if (botMetadata && typeof botMetadata === "object") {
        const meetingId = (botMetadata as Record<string, unknown>).meetingId;
        if (typeof meetingId === "string") return meetingId;
      }
    }
  }

  return null;
}

export async function resolveMeetingIdFromBotId(botId: string): Promise<string | null> {
  const meeting = await prisma.meeting.findFirst({
    where: { recordingBotId: botId },
    select: { id: true },
  });
  return meeting?.id ?? null;
}
