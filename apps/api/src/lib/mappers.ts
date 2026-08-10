import type {
  ActionItem,
  Decision,
  Meeting,
  MeetingInvite,
  MeetingParticipant,
  Mom,
  Summary,
  Transcript,
  TranscriptSegment,
  MeetingPlatformType,
} from "@lyrus/db";
import { MeetingPlatform } from "@lyrus/db";
import { buildRecordingProgress, isActiveRecordingBotStatus } from "../services/recording-bot/recording-progress.js";
import type {
  MeetingStatusType,
  MeetingTagType,
  TaskPriorityType,
  TaskStatusType,
} from "../types/enums.js";

type MeetingWithRelations = Meeting & {
  participants: MeetingParticipant[];
  invites?: MeetingInvite[];
  transcript:
    | (Transcript & {
        segments: TranscriptSegment[];
      })
    | null;
  mom: Mom | null;
  actionItems?: ActionItem[];
  decisions?: Decision[];
  summary?: Summary | null;
};

export interface WebStakeholder {
  name: string;
  email: string;
}

export interface WebActionItem {
  task: string;
  assignee: string;
  deadline: string;
}

export interface WebMomSection {
  title: string;
  content: string[];
}

export interface WebMOM {
  id: string;
  meetingId: string;
  title: string;
  dateTime: string;
  participants: string[];
  keyPoints: string[];
  actionItems: WebActionItem[];
  sections?: WebMomSection[];
  createdAt: string;
  shared: boolean;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  lastEditedAt?: string;
}

export interface WebMeeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  /** Absolute start time — clients should prefer this for local date/time display. */
  scheduledAt: string;
  duration: number;
  stakeholders: WebStakeholder[];
  status: "upcoming" | "ongoing" | "completed";
  tag: "internal" | "client" | "vendor";
  notes: string;
  mom?: WebMOM;
  transcript?: {
    id: string;
    fullText: string;
    language: string;
    source?: string;
    segments: Array<{
      speaker: string;
      startTime: number;
      endTime: number;
      text: string;
    }>;
  };
  pipelineStatus?: "processing" | "failed" | null;
  invites?: Array<{
    email: string;
    name: string;
    status: "sent" | "logged" | "failed";
    error?: string;
    sentAt: string;
  }>;
  joinSlug?: string;
  platform?: "lyrus" | "google_meet" | "microsoft_teams";
  externalMeetingUrl?: string;
  calendarEventId?: string;
  recordingBotStatus?: string | null;
  recordingProgress?: {
    phase: string;
    step: number;
    totalSteps: number;
    title: string;
    detail: string;
    isLive: boolean;
    isProcessing: boolean;
  } | null;
}

export interface WebUserTask {
  id: string;
  meetingId: string;
  meetingTitle: string;
  task: string;
  assignee: string;
  deadline: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  createdAt: string;
  remindedAt?: string;
}

function mapDbStatus(status: MeetingStatusType): WebMeeting["status"] {
  switch (status) {
    case "ONGOING":
      return "ongoing";
    case "COMPLETED":
      return "completed";
    case "PROCESSING":
      return "ongoing";
    case "FAILED":
      return "completed";
    default:
      return "upcoming";
  }
}

/**
 * Display status for the UI. Google imports (and other meetings) stay UPCOMING in DB
 * until a pipeline/live session updates them — so past meetings looked "Upcoming".
 * Derive from the schedule when the stored status is still open.
 */
export function resolveMeetingDisplayStatus(
  status: MeetingStatusType,
  scheduledAt: Date,
  durationMinutes: number,
  now = new Date(),
): WebMeeting["status"] {
  if (status === "COMPLETED" || status === "FAILED") {
    return mapDbStatus(status);
  }
  if (status === "PROCESSING") {
    return "ongoing";
  }

  const startMs = scheduledAt.getTime();
  if (Number.isNaN(startMs)) {
    return mapDbStatus(status);
  }
  const endMs = startMs + Math.max(durationMinutes || 60, 1) * 60_000;
  const nowMs = now.getTime();

  if (nowMs < startMs) return "upcoming";
  if (nowMs < endMs) return "ongoing";
  return "completed";
}

function mapDbTag(tag: MeetingTagType): WebMeeting["tag"] {
  return tag.toLowerCase() as WebMeeting["tag"];
}

function mapTaskStatus(status: TaskStatusType): WebUserTask["status"] {
  switch (status) {
    case "IN_PROGRESS":
      return "in_progress";
    case "COMPLETED":
      return "completed";
    case "OVERDUE":
      return "overdue";
    default:
      return "pending";
  }
}

export function formatDateTime(scheduledAt: Date): { date: string; time: string } {
  // Always present India wall-clock time (product timezone), not the API server's local TZ.
  const dtf = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const map = Object.fromEntries(
    dtf
      .formatToParts(scheduledAt)
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, p.value]),
  );
  return {
    date: `${map.year}-${map.month}-${map.day}`,
    time: `${map.hour}:${map.minute}`,
  };
}

/** Interpret date (YYYY-MM-DD) + time (HH:mm) as Asia/Kolkata wall clock. */
export function parseScheduledAt(date: string, time: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  if ([y, m, d, hh, mm].some((n) => Number.isNaN(n))) {
    return new Date(NaN);
  }
  // IST = UTC+05:30 (no daylight saving).
  const utcMillis = Date.UTC(y, m - 1, d, hh, mm, 0) - (5 * 60 + 30) * 60_000;
  return new Date(utcMillis);
}

export function mapMom(mom: Mom): WebMOM {
  const keyPoints = Array.isArray(mom.keyPoints) ? (mom.keyPoints as string[]) : [];
  const actionItems = Array.isArray(mom.actionItems)
    ? (mom.actionItems as unknown as WebActionItem[])
    : [];
  const sections = Array.isArray(mom.sections)
    ? (mom.sections as unknown as WebMomSection[])
    : undefined;

  return {
    id: mom.id,
    meetingId: mom.meetingId,
    title: mom.title,
    dateTime: mom.dateTime,
    participants: Array.isArray(mom.participants) ? (mom.participants as string[]) : [],
    keyPoints,
    actionItems,
    sections,
    createdAt: mom.createdAt.toISOString(),
    shared: mom.shared,
    approved: mom.approved,
    approvedBy: mom.approvedBy ?? undefined,
    approvedAt: mom.approvedAt?.toISOString(),
    lastEditedAt: mom.lastEditedAt?.toISOString(),
  };
}

function mapDbPlatform(platform: MeetingPlatformType): WebMeeting["platform"] {
  switch (platform) {
    case "GOOGLE_MEET":
      return "google_meet";
    case "MICROSOFT_TEAMS":
      return "microsoft_teams";
    default:
      return "lyrus";
  }
}

export function mapMeeting(meeting: MeetingWithRelations): WebMeeting {
  const { date, time } = formatDateTime(meeting.scheduledAt);

  const web: WebMeeting = {
    id: meeting.id,
    title: meeting.title,
    description: meeting.description,
    date,
    time,
    scheduledAt: meeting.scheduledAt.toISOString(),
    duration: meeting.durationMinutes,
    stakeholders: meeting.participants.map((p) => ({
      name: p.name,
      email: p.email,
    })),
    // MOM draft means the meeting is done for approval UX — don't map PROCESSING → "ongoing".
    status: meeting.mom && meeting.status !== "FAILED"
      ? "completed"
      : resolveMeetingDisplayStatus(
          meeting.status,
          meeting.scheduledAt,
          meeting.durationMinutes,
        ),
    tag: mapDbTag(meeting.tag),
    notes: meeting.notes,
    joinSlug: meeting.joinSlug ?? undefined,
    platform: mapDbPlatform(meeting.platform),
    externalMeetingUrl: meeting.externalMeetingUrl ?? undefined,
    calendarEventId: meeting.calendarEventId ?? undefined,
    recordingBotStatus: meeting.recordingBotStatus ?? undefined,
  };

  if (meeting.status === "PROCESSING" && !meeting.mom) {
    web.pipelineStatus = "processing";
  }
  if (meeting.status === "FAILED") {
    web.pipelineStatus = "failed";
  }

  const isExternal =
    meeting.platform === MeetingPlatform.GOOGLE_MEET ||
    meeting.platform === MeetingPlatform.MICROSOFT_TEAMS;
  if (isExternal) {
    const hasMom = Boolean(meeting.mom);
    const midSession = isActiveRecordingBotStatus(meeting.recordingBotStatus);
    // Show bot chrome while live (including a rejoin after MOM exists); hide once ready.
    if (!hasMom || midSession) {
      const progress = buildRecordingProgress({
        recordingBotStatus: meeting.recordingBotStatus,
        pipelineStatus: web.pipelineStatus ?? null,
        meetingStatus: meeting.status,
        hasMom,
        hasTranscript: Boolean(meeting.transcript),
      });
      if (progress && progress.phase !== "ready") {
        web.recordingProgress = progress;
      }
    }
  }

  if (meeting.mom) {
    web.mom = mapMom(meeting.mom);
  }

  if (meeting.invites && meeting.invites.length > 0) {
    web.invites = meeting.invites.map((inv) => ({
      email: inv.email,
      name: inv.name,
      status: inv.status.toLowerCase() as "sent" | "logged" | "failed",
      error: inv.error ?? undefined,
      sentAt: inv.sentAt.toISOString(),
    }));
  }

  if (meeting.transcript) {
    web.transcript = {
      id: meeting.transcript.id,
      fullText: meeting.transcript.fullText,
      language: meeting.transcript.language,
      source: meeting.transcript.source,
      segments: meeting.transcript.segments.map((s) => ({
        speaker: s.speaker,
        startTime: s.startTime,
        endTime: s.endTime,
        text: s.text,
      })),
    };
  }

  return web;
}

export function mapActionItemToTask(
  item: ActionItem,
  meetingTitle: string,
): WebUserTask {
  return {
    id: item.id,
    meetingId: item.meetingId,
    meetingTitle,
    task: item.description,
    assignee: item.ownerName ?? "Unassigned",
    deadline: item.dueDate ? item.dueDate.toISOString().split("T")[0]! : "",
    status: mapTaskStatus(item.status),
    createdAt: item.createdAt.toISOString(),
  };
}

export function mapPriority(priority?: string): TaskPriorityType {
  switch (priority?.toLowerCase()) {
    case "high":
      return "HIGH";
    case "medium":
      return "MEDIUM";
    case "low":
      return "LOW";
    default:
      return "UNSPECIFIED";
  }
}

export function decisionsToKeyPoints(decisions: string[]): string[] {
  return decisions.map((d) => `Decision: ${d}`);
}

export function extractionToMomPayload(
  _meeting: Pick<Meeting, "id" | "title">,
  extraction: {
    summary: string;
    decisions: string[];
    tasks: Array<{
      description: string;
      owner: string;
      due_date: string;
      priority?: string;
    }>;
    next_meeting_agenda?: string[];
  },
): {
  keyPoints: string[];
  actionItems: WebActionItem[];
  summary: string;
  nextAgenda: string[];
} {
  const keyPoints = [
    extraction.summary,
    ...extraction.decisions.map((d) => `Decision: ${d}`),
    ...(extraction.next_meeting_agenda ?? []).map((t) => `Follow-up: ${t}`),
  ]
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    // Never surface hard-coded platform fluff that slipped through older paths.
    .filter((p) => !/\blyrus\s+(life|live)\b/i.test(p));

  const actionItems: WebActionItem[] = extraction.tasks.map((t) => ({
    task: t.description,
    assignee: t.owner || "Unassigned",
    deadline: t.due_date || "TBD",
  }));

  return {
    keyPoints,
    actionItems,
    summary: extraction.summary,
    nextAgenda: extraction.next_meeting_agenda ?? [],
  };
}
