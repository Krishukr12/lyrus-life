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
import { momTemplateService } from "./mom-template.service.js";

function normalizeTranscriptComparable(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function isDuplicateTranscriptContent(existing: string, next: string): boolean {
  const base = normalizeTranscriptComparable(existing);
  const add = normalizeTranscriptComparable(next);
  if (!base || !add) return false;
  if (base === add) return true;
  // Same content already appended (stuck retries) or subsumed by a previous merge.
  if (base.includes(add)) return true;
  return false;
}

function mergeTranscriptText(existing: string | null | undefined, next: string): string {
  const base = (existing ?? "").trim();
  const add = next.trim();
  if (!base) return add;
  if (!add) return base;
  if (isDuplicateTranscriptContent(base, add)) return base;
  return `${base}\n\n---\n\n${add}`;
}

function mergeTranscriptSegments(
  existing: Array<{ speaker: string; startTime: number; endTime: number; text: string; confidence?: number | null }>,
  next: Array<{ speaker: string; startTime: number; endTime: number; text: string; confidence?: number | null }>,
) {
  if (existing.length === 0) return next;
  if (next.length === 0) return existing;

  const existingFingerprint = existing.map((s) => `${s.speaker}|${s.text}`).join("||");
  const nextFingerprint = next.map((s) => `${s.speaker}|${s.text}`).join("||");
  if (
    existingFingerprint === nextFingerprint ||
    existingFingerprint.includes(nextFingerprint)
  ) {
    return existing;
  }

  const lastEnd = Math.max(...existing.map((s) => s.endTime ?? 0));
  const shift = Number.isFinite(lastEnd) ? lastEnd + 1 : 0;
  return [
    ...existing,
    ...next.map((s) => ({
      ...s,
      startTime: (s.startTime ?? 0) + shift,
      endTime: (s.endTime ?? 0) + shift,
    })),
  ];
}

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
    include: {
      participants: true,
      transcript: { include: { segments: { orderBy: { startTime: "asc" } } } },
    },
  });

  if (!meeting?.transcript) {
    throw new Error("Transcript required before NLU");
  }

  const participantNames = meeting.participants.map((p) => p.name);
  const participantLabels = meeting.participants.map((p) =>
    p.email ? `${p.name} <${p.email}>` : p.name,
  );
  const { date, time } = formatDateTime(meeting.scheduledAt);

  const template = await momTemplateService.resolveForMeeting(
    meeting.organizationId,
    meeting.momTemplateId,
  );

  if (template && !meeting.momTemplateId) {
    await prisma.meeting.update({
      where: { id: meetingId },
      data: { momTemplateId: template.id },
    });
  }

  const labeledFromSegments = meeting.transcript.segments
    .map((s) => `${s.speaker}: ${s.text}`.trim())
    .filter((line) => line.length > 3)
    .join("\n");

  const transcriptForNlu =
    labeledFromSegments.length > 40 ? labeledFromSegments : meeting.transcript.fullText;

  const extraction = await extractMeetingInsights({
    transcript: transcriptForNlu,
    participants: participantLabels.length > 0 ? participantLabels : participantNames,
    meetingDateIso: date,
    templateSections: template?.sections.map((s) => ({
      title: s.title,
      aiInstructions: `${s.aiInstructions.trim()} Only use transcript evidence; if the topic was not discussed, return an empty content array.`,
      isRequired: s.isRequired,
    })),
  });

  const momPayload = extractionToMomPayload(meeting, extraction);
  const actionItemsJson = momPayload.actionItems as unknown as Prisma.InputJsonValue;
  const keyPointsJson = momPayload.keyPoints as unknown as Prisma.InputJsonValue;
  const participantsJson = participantNames as unknown as Prisma.InputJsonValue;
  const sectionsJson =
    extraction.sections && extraction.sections.length > 0
      ? (extraction.sections as unknown as Prisma.InputJsonValue)
      : template
        ? (template.sections.map((s) => ({
            title: s.title,
            content: [] as string[],
          })) as unknown as Prisma.InputJsonValue)
        : undefined;

  await prisma.mom.upsert({
    where: { meetingId },
    create: {
      meetingId,
      templateId: template?.id,
      title: meeting.title,
      dateTime: `${date} ${time}`,
      participants: participantsJson,
      keyPoints: keyPointsJson,
      actionItems: actionItemsJson,
      sections: sectionsJson,
    },
    update: {
      templateId: template?.id,
      keyPoints: keyPointsJson,
      actionItems: actionItemsJson,
      sections: sectionsJson,
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

  const existing = await prisma.transcript.findUnique({
    where: { meetingId },
    include: { segments: true },
  });

  // Never merge fabricated notes transcripts into a real recording transcript.
  const reusableExisting =
    existing && existing.source !== "notes" ? existing : null;
  if (existing && !reusableExisting) {
    await prisma.transcriptSegment.deleteMany({ where: { transcriptId: existing.id } });
    await prisma.transcript.delete({ where: { id: existing.id } });
  }

  const combinedFullText = mergeTranscriptText(reusableExisting?.fullText, transcription.fullText);
  const combinedSegments = mergeTranscriptSegments(
    (reusableExisting?.segments ?? []).map((s) => ({
      speaker: s.speaker,
      startTime: s.startTime,
      endTime: s.endTime,
      text: s.text,
      confidence: s.confidence,
    })),
    transcription.segments.map((s) => ({
      speaker: s.speaker,
      startTime: s.startTime,
      endTime: s.endTime,
      text: s.text,
      confidence: s.confidence,
    })),
  );

  await prisma.transcript.upsert({
    where: { meetingId },
    create: {
      meetingId,
      fullText: combinedFullText,
      language: transcription.language,
      source: transcription.source,
      segments: {
        create: combinedSegments.map((s) => ({
          speaker: s.speaker,
          startTime: s.startTime,
          endTime: s.endTime,
          text: s.text,
          confidence: s.confidence ?? undefined,
        })),
      },
    },
    update: {
      fullText: combinedFullText,
      language: transcription.language,
      source: transcription.source,
      segments: {
        deleteMany: {},
        create: combinedSegments.map((s) => ({
          speaker: s.speaker,
          startTime: s.startTime,
          endTime: s.endTime,
          text: s.text,
          confidence: s.confidence ?? undefined,
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
  const transcript = await prisma.transcript.findUnique({ where: { meetingId } });
  if (!transcript) {
    throw new Error("No transcript available for this meeting");
  }
  if (transcript.source === "notes") {
    throw new Error(
      "Notes-based transcripts cannot generate MOM. Upload meeting audio or wait for the recording bot.",
    );
  }
  if (transcript.fullText.trim().length < 40) {
    throw new Error("Transcript is too short to generate a reliable MOM");
  }

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

/** Regenerate MOM from a real recording transcript or uploaded audio — never from fabricated notes. */
export async function regenerateMomForMeeting(meetingId: string) {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: {
      transcript: true,
      audioFiles: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  if (!meeting) throw new Error("Meeting not found");

  const transcript = meeting.transcript;
  const isFakeNotes = transcript?.source === "notes";
  const isRealTranscript =
    Boolean(transcript) &&
    !isFakeNotes &&
    (transcript?.fullText.trim().length ?? 0) >= 40;

  // Legacy notes transcripts must not produce MOM anymore.
  if (isFakeNotes && transcript) {
    await prisma.mom.deleteMany({ where: { meetingId } });
    await prisma.transcriptSegment.deleteMany({ where: { transcriptId: transcript.id } });
    await prisma.transcript.delete({ where: { id: transcript.id } });
  }

  if (!isRealTranscript) {
    const audio = meeting.audioFiles[0];
    if (!audio) {
      throw new Error(
        "No recording available. Wait for the meeting bot to finish uploading, or upload meeting audio — notes-only MOM is disabled.",
      );
    }
    const { materializeAudioForProcessing } = await import("./storage/index.js");
    const resolved = await materializeAudioForProcessing(audio);
    try {
      await runMeetingPipeline(meetingId, {
        filePath: resolved.filePath,
        mimeType: audio.mimeType,
        s3Key: resolved.s3Key,
        s3Bucket: resolved.s3Bucket,
      });
    } finally {
      if (resolved.cleanup) await resolved.cleanup();
    }
    return;
  }

  await runNluFromExistingTranscript(meetingId);
}

