import { parseISO, isValid } from "date-fns";
import {
  MeetingStatus,
  PipelineStep,
  TaskStatus,
  prisma,
} from "@lyrus/db";
import { extractMeetingInsights } from "@lyrus/nlu";
import { transcribeAudio } from "@lyrus/transcription";
import {
  extractionToMomPayload,
  formatDateTime,
  mapPriority,
} from "../lib/mappers.js";
import type { Prisma } from "@lyrus/db";
import { logAudit } from "./audit.js";

function parseDueDate(value: string, fallback: Date): Date | null {
  if (!value || value === "TBD") return null;
  const iso = parseISO(value);
  if (isValid(iso)) return iso;
  const lower = value.toLowerCase();
  const base = new Date(fallback);
  if (lower.includes("friday")) {
    const day = base.getDay();
    const diff = (5 - day + 7) % 7 || 7;
    base.setDate(base.getDate() + diff);
    return base;
  }
  if (lower.includes("wednesday")) {
    const day = base.getDay();
    const diff = (3 - day + 7) % 7 || 7;
    base.setDate(base.getDate() + diff);
    return base;
  }
  return null;
}

async function persistExtraction(meetingId: string, meetingDate: Date) {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: { participants: true, transcript: true },
  });

  if (!meeting?.transcript) {
    throw new Error("Transcript required before NLU");
  }

  const participantNames = meeting.participants.map((p) => p.name);
  const { date, time } = formatDateTime(meeting.scheduledAt);

  const extraction = await extractMeetingInsights({
    transcript: meeting.transcript.fullText,
    participants: participantNames,
    meetingDateIso: date,
  });

  const momPayload = extractionToMomPayload(meeting, extraction);
  const actionItemsJson = momPayload.actionItems as unknown as Prisma.InputJsonValue;
  const keyPointsJson = momPayload.keyPoints as unknown as Prisma.InputJsonValue;
  const participantsJson = participantNames as unknown as Prisma.InputJsonValue;

  await prisma.mom.upsert({
    where: { meetingId },
    create: {
      meetingId,
      title: meeting.title,
      dateTime: `${date} ${time}`,
      participants: participantsJson,
      keyPoints: keyPointsJson,
      actionItems: actionItemsJson,
    },
    update: {
      keyPoints: keyPointsJson,
      actionItems: actionItemsJson,
      approved: false,
      shared: false,
      approvedBy: null,
      approvedAt: null,
    },
  });

  await prisma.summary.upsert({
    where: { meetingId },
    create: {
      meetingId,
      shortSummary: momPayload.summary,
      nextAgenda: momPayload.nextAgenda,
    },
    update: {
      shortSummary: momPayload.summary,
      nextAgenda: momPayload.nextAgenda,
    },
  });

  await prisma.decision.deleteMany({ where: { meetingId } });
  if (extraction.decisions.length > 0) {
    await prisma.decision.createMany({
      data: extraction.decisions.map((text) => ({ meetingId, text })),
    });
  }

  await prisma.actionItem.deleteMany({
    where: { meetingId, status: { in: [TaskStatus.OPEN, TaskStatus.IN_PROGRESS] } },
  });

  await prisma.actionItem.createMany({
    data: extraction.tasks.map((task) => ({
      meetingId,
      description: task.description,
      ownerName: task.owner || "Unassigned",
      dueDate: parseDueDate(task.due_date, meetingDate),
      priority: mapPriority(task.priority),
      status: TaskStatus.OPEN,
    })),
  });

  await logAudit(meetingId, PipelineStep.NLU_COMPLETED, {
    taskCount: extraction.tasks.length,
    decisionCount: extraction.decisions.length,
  });
  await logAudit(meetingId, PipelineStep.MOM_GENERATED);
}

export type PipelineAudioSource = {
  filePath: string;
  mimeType: string;
  s3Key?: string;
  s3Bucket?: string;
};

export async function runMeetingPipeline(
  meetingId: string,
  audio: PipelineAudioSource | string,
  mimeType?: string,
) {
  const source: PipelineAudioSource =
    typeof audio === "string"
      ? { filePath: audio, mimeType: mimeType ?? "audio/webm" }
      : audio;
  const audioFilePath = source.filePath;
  const audioMimeType = source.mimeType;
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: { participants: true },
  });

  if (!meeting) {
    throw new Error("Meeting not found");
  }

  await prisma.meeting.update({
    where: { id: meetingId },
    data: { status: MeetingStatus.PROCESSING },
  });

  await logAudit(meetingId, PipelineStep.TRANSCRIPTION_STARTED);

  const participantNames = meeting.participants.map((p) => p.name);

  const transcription = await transcribeAudio({
    filePath: audioFilePath,
    mimeType: audioMimeType,
    participants: participantNames,
    meetingNotes: meeting.notes,
    meetingId,
    s3Key: source.s3Key,
    s3Bucket: source.s3Bucket,
  });

  await prisma.transcript.upsert({
    where: { meetingId },
    create: {
      meetingId,
      fullText: transcription.fullText,
      language: transcription.language,
      source: transcription.source,
      segments: {
        create: transcription.segments.map((s) => ({
          speaker: s.speaker,
          startTime: s.startTime,
          endTime: s.endTime,
          text: s.text,
          confidence: s.confidence,
        })),
      },
    },
    update: {
      fullText: transcription.fullText,
      language: transcription.language,
      source: transcription.source,
      segments: {
        deleteMany: {},
        create: transcription.segments.map((s) => ({
          speaker: s.speaker,
          startTime: s.startTime,
          endTime: s.endTime,
          text: s.text,
          confidence: s.confidence,
        })),
      },
    },
  });

  await logAudit(meetingId, PipelineStep.TRANSCRIPTION_COMPLETED, {
    segmentCount: transcription.segments.length,
    source: transcription.source,
  });

  await logAudit(meetingId, PipelineStep.NLU_STARTED);
  await persistExtraction(meetingId, meeting.scheduledAt);

  await prisma.meeting.update({
    where: { id: meetingId },
    data: { status: MeetingStatus.COMPLETED },
  });
}

export async function runNluFromExistingTranscript(meetingId: string) {
  await prisma.meeting.update({
    where: { id: meetingId },
    data: { status: MeetingStatus.PROCESSING },
  });

  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting) throw new Error("Meeting not found");

  await logAudit(meetingId, PipelineStep.NLU_STARTED);
  await persistExtraction(meetingId, meeting.scheduledAt);

  await prisma.meeting.update({
    where: { id: meetingId },
    data: { status: MeetingStatus.COMPLETED },
  });
}

function buildTranscriptLinesFromNotes(
  notes: string,
  participants: Array<{ name: string }>,
): string[] {
  const names = participants.map((p) => p.name);
  const host = names[0] ?? "Host";
  const lines: string[] = [`${host}: Meeting started. Welcome everyone.`];

  const rawLines = notes
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  for (const line of rawLines) {
    const speakerMatch = line.match(/^([^:[\]]+):\s*(.+)$/);
    if (speakerMatch) {
      lines.push(`${speakerMatch[1]!.trim()}: ${speakerMatch[2]!.trim()}`);
      continue;
    }
    const timestampMatch = line.match(/^\[.+?\]\s*(.+)$/);
    if (timestampMatch) {
      lines.push(timestampMatch[1]!.trim());
      continue;
    }
    lines.push(`${host}: ${line}`);
  }

  if (lines.length === 1) {
    lines.push(`${host}: ${notes.trim() || "We reviewed priorities and next steps."}`);
    const guest = names[1] ?? "Participant";
    lines.push(`${guest}: I will follow up with updates by end of week.`);
    lines.push(`${host}: Agreed. We will track action items in Lyrus Life after this meeting.`);
  } else {
    lines.push(`${host}: We will capture action items from this discussion in the minutes.`);
  }

  return lines;
}

export async function createTranscriptFromNotes(meetingId: string) {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: { participants: true },
  });

  if (!meeting) throw new Error("Meeting not found");

  const notes = meeting.notes.trim() || meeting.description.trim() || "General sync and status review.";
  const lines = buildTranscriptLinesFromNotes(notes, meeting.participants);
  const fullText = lines.join("\n");

  await prisma.transcript.upsert({
    where: { meetingId },
    create: {
      meetingId,
      fullText,
      source: "notes",
      segments: {
        create: lines.map((line, index) => {
          const [speaker, ...rest] = line.split(":");
          return {
            speaker: speaker?.trim() ?? "Speaker",
            startTime: index * 15,
            endTime: index * 15 + 14,
            text: rest.join(":").trim() || line,
          };
        }),
      },
    },
    update: {
      fullText,
      source: "notes",
      segments: {
        deleteMany: {},
        create: lines.map((line, index) => {
          const [speaker, ...rest] = line.split(":");
          return {
            speaker: speaker?.trim() ?? "Speaker",
            startTime: index * 15,
            endTime: index * 15 + 14,
            text: rest.join(":").trim() || line,
          };
        }),
      },
    },
  });

  return fullText;
}

