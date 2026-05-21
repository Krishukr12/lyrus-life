import type {
  ActionItem,
  Decision,
  Meeting,
  MeetingInvite,
  MeetingParticipant,
  MeetingStatus,
  MeetingTag,
  Mom,
  Summary,
  TaskPriority,
  TaskStatus,
  Transcript,
  TranscriptSegment,
} from "@lyrus/db";

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

export interface WebMOM {
  id: string;
  meetingId: string;
  title: string;
  dateTime: string;
  participants: string[];
  keyPoints: string[];
  actionItems: WebActionItem[];
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

function mapDbStatus(status: MeetingStatus): WebMeeting["status"] {
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

function mapDbTag(tag: MeetingTag): WebMeeting["tag"] {
  return tag.toLowerCase() as WebMeeting["tag"];
}

function mapTaskStatus(status: TaskStatus): WebUserTask["status"] {
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
  const date = scheduledAt.toISOString().split("T")[0]!;
  const hours = scheduledAt.getHours().toString().padStart(2, "0");
  const minutes = scheduledAt.getMinutes().toString().padStart(2, "0");
  return { date, time: `${hours}:${minutes}` };
}

export function parseScheduledAt(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`);
}

export function mapMom(mom: Mom): WebMOM {
  const keyPoints = Array.isArray(mom.keyPoints) ? (mom.keyPoints as string[]) : [];
  const actionItems = Array.isArray(mom.actionItems)
    ? (mom.actionItems as unknown as WebActionItem[])
    : [];

  return {
    id: mom.id,
    meetingId: mom.meetingId,
    title: mom.title,
    dateTime: mom.dateTime,
    participants: Array.isArray(mom.participants) ? (mom.participants as string[]) : [],
    keyPoints,
    actionItems,
    createdAt: mom.createdAt.toISOString(),
    shared: mom.shared,
    approved: mom.approved,
    approvedBy: mom.approvedBy ?? undefined,
    approvedAt: mom.approvedAt?.toISOString(),
    lastEditedAt: mom.lastEditedAt?.toISOString(),
  };
}

export function mapMeeting(meeting: MeetingWithRelations): WebMeeting {
  const { date, time } = formatDateTime(meeting.scheduledAt);

  const web: WebMeeting = {
    id: meeting.id,
    title: meeting.title,
    description: meeting.description,
    date,
    time,
    duration: meeting.durationMinutes,
    stakeholders: meeting.participants.map((p) => ({
      name: p.name,
      email: p.email,
    })),
    status: mapDbStatus(meeting.status),
    tag: mapDbTag(meeting.tag),
    notes: meeting.notes,
  };

  if (meeting.status === "PROCESSING") {
    web.pipelineStatus = "processing";
  }
  if (meeting.status === "FAILED") {
    web.pipelineStatus = "failed";
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

export function mapPriority(priority?: string): TaskPriority {
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
  ].filter(Boolean);

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
