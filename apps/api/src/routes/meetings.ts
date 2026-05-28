import type { FastifyInstance } from "fastify";
import path from "node:path";
import {
  MeetingStatus,
  MeetingTag,
  PipelineStep,
  TaskStatus,
  prisma,
} from "@lyrus/db";
import { extractMeetingInsights } from "@lyrus/nlu";
import { createMeetingSchema, editMomSchema, updateMeetingSchema } from "@lyrus/shared";
import type { Prisma } from "@lyrus/db";
import { parseActionDeadline } from "../lib/deadline.js";
import {
  extractionToMomPayload,
  formatDateTime,
  mapActionItemToTask,
  mapMeeting,
  mapMom,
  parseScheduledAt,
} from "../lib/mappers.js";
import { logAudit } from "../services/audit.js";
import {
  createTranscriptFromNotes,
  runMeetingPipeline,
  runNluFromExistingTranscript,
  saveUploadedAudio,
} from "../services/pipeline.js";
import { sendAndRecordMeetingInvites } from "../services/invites.js";
import { sendMomToStakeholdersOnApproval } from "../services/mom-share.js";

const meetingInclude = {
  participants: true,
  invites: { orderBy: { sentAt: "desc" as const } },
  transcript: { include: { segments: true } },
  mom: true,
} as const;

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

function mapTag(tag: string): MeetingTag {
  return tag.toUpperCase() as MeetingTag;
}

function mapStatus(status: string): MeetingStatus {
  switch (status) {
    case "ongoing":
      return MeetingStatus.ONGOING;
    case "completed":
      return MeetingStatus.COMPLETED;
    default:
      return MeetingStatus.UPCOMING;
  }
}

export async function meetingRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({ ok: true, service: "lyrus-api" }));

  app.get("/meetings", async () => {
    const meetings = await prisma.meeting.findMany({
      include: meetingInclude,
      orderBy: { scheduledAt: "desc" },
    });
    return meetings.map(mapMeeting);
  });

  app.get<{ Params: { id: string } }>("/meetings/:id", async (request, reply) => {
    const meeting = await prisma.meeting.findUnique({
      where: { id: request.params.id },
      include: meetingInclude,
    });
    if (!meeting) {
      return reply.status(404).send({ error: "Meeting not found" });
    }
    return mapMeeting(meeting);
  });

  app.post("/meetings", async (request, reply) => {
    const parsed = createMeetingSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }

    const data = parsed.data;
    const scheduledAt = parseScheduledAt(data.date, data.time);

    const meeting = await prisma.meeting.create({
      data: {
        title: data.title,
        description: data.description,
        scheduledAt,
        durationMinutes: data.duration,
        tag: mapTag(data.tag),
        notes: data.notes,
        participants: {
          create: data.stakeholders.map((s) => ({
            name: s.name,
            email: s.email,
          })),
        },
      },
      include: meetingInclude,
    });

    await logAudit(meeting.id, PipelineStep.USER_EDIT, { action: "create_meeting" });

    const inviteResults = await sendAndRecordMeetingInvites(meeting.id);
    const refreshed = await prisma.meeting.findUnique({
      where: { id: meeting.id },
      include: meetingInclude,
    });

    return {
      meeting: mapMeeting(refreshed ?? meeting),
      invites: inviteResults.map((r) => ({
        email: r.email,
        name: r.name,
        status: r.status,
        error: r.error,
      })),
    };
  });

  app.post<{ Params: { id: string } }>("/meetings/:id/invites/resend", async (request, reply) => {
    const meeting = await prisma.meeting.findUnique({
      where: { id: request.params.id },
      include: { participants: true },
    });
    if (!meeting) {
      return reply.status(404).send({ error: "Meeting not found" });
    }
    if (meeting.participants.length === 0) {
      return reply.status(400).send({ error: "No stakeholders to invite" });
    }

    const inviteResults = await sendAndRecordMeetingInvites(meeting.id);
    const refreshed = await prisma.meeting.findUnique({
      where: { id: meeting.id },
      include: meetingInclude,
    });

    return {
      meeting: mapMeeting(refreshed!),
      invites: inviteResults,
    };
  });

  app.patch<{ Params: { id: string } }>("/meetings/:id", async (request, reply) => {
    const parsed = updateMeetingSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }

    const existing = await prisma.meeting.findUnique({
      where: { id: request.params.id },
    });
    if (!existing) {
      return reply.status(404).send({ error: "Meeting not found" });
    }

    const updates = parsed.data;
    let scheduledAt = existing.scheduledAt;
    if (updates.date && updates.time) {
      scheduledAt = parseScheduledAt(updates.date, updates.time);
    } else if (updates.date) {
      const { time } = formatDateTime(existing.scheduledAt);
      scheduledAt = parseScheduledAt(updates.date, time);
    }

    const meeting = await prisma.meeting.update({
      where: { id: request.params.id },
      data: {
        title: updates.title,
        description: updates.description,
        scheduledAt,
        durationMinutes: updates.duration,
        status: updates.status ? mapStatus(updates.status) : undefined,
        tag: updates.tag ? mapTag(updates.tag) : undefined,
        notes: updates.notes,
      },
      include: meetingInclude,
    });

    return mapMeeting(meeting);
  });

  app.post<{ Params: { id: string } }>("/meetings/:id/audio", async (request, reply) => {
    const meeting = await prisma.meeting.findUnique({
      where: { id: request.params.id },
    });
    if (!meeting) {
      return reply.status(404).send({ error: "Meeting not found" });
    }

    const file = await request.file();
    if (!file) {
      return reply.status(400).send({ error: "No audio file uploaded" });
    }

    const buffer = await file.toBuffer();
    const { filePath } = await saveUploadedAudio(
      meeting.id,
      buffer,
      file.filename || "recording.webm",
      file.mimetype,
    );

    const autoProcess = (request.query as { process?: string }).process !== "false";

    if (autoProcess) {
      try {
        await runMeetingPipeline(meeting.id, filePath, file.mimetype);
        const refreshed = await prisma.meeting.findUnique({
          where: { id: meeting.id },
          include: meetingInclude,
        });
        return {
          ok: true,
          message: "Recording transcribed and MOM generated",
          meeting: mapMeeting(refreshed!),
        };
      } catch (err) {
        request.log.error(err, "Pipeline failed");
        await prisma.meeting.update({
          where: { id: meeting.id },
          data: { status: MeetingStatus.FAILED },
        });
        return reply.status(500).send({
          error: err instanceof Error ? err.message : "Processing failed",
        });
      }
    }

    return { ok: true, message: "Recording saved. Call /process to generate MOM." };
  });

  app.post<{ Params: { id: string } }>("/meetings/:id/complete", async (request, reply) => {
    const meeting = await prisma.meeting.findUnique({
      where: { id: request.params.id },
      include: { participants: true, transcript: true },
    });
    if (!meeting) {
      return reply.status(404).send({ error: "Meeting not found" });
    }

    let notes = meeting.notes;
    let filePath: string | null = null;
    let mimeType = "audio/webm";

    const parts = request.parts();
    for await (const part of parts) {
      if (part.type === "file" && part.fieldname === "recording") {
        const buffer = await part.toBuffer();
        const saved = await saveUploadedAudio(
          meeting.id,
          buffer,
          part.filename || "meeting-recording.webm",
          part.mimetype || "audio/webm",
        );
        filePath = saved.filePath;
        mimeType = part.mimetype || "audio/webm";
      } else if (part.type === "field" && part.fieldname === "notes") {
        notes = String(part.value);
      }
    }

    await prisma.meeting.update({
      where: { id: meeting.id },
      data: { notes, status: MeetingStatus.COMPLETED },
    });

    try {
      if (filePath) {
        try {
          await runMeetingPipeline(meeting.id, filePath, mimeType);
        } catch (pipelineErr) {
          request.log.warn(
            pipelineErr,
            "Audio pipeline failed — falling back to notes transcript",
          );
          await createTranscriptFromNotes(meeting.id);
          await runNluFromExistingTranscript(meeting.id);
        }
      } else {
        if (!meeting.transcript) {
          await createTranscriptFromNotes(meeting.id);
        }
        await runNluFromExistingTranscript(meeting.id);
      }

      const refreshed = await prisma.meeting.findUnique({
        where: { id: meeting.id },
        include: meetingInclude,
      });

      await prisma.meeting.update({
        where: { id: meeting.id },
        data: { status: MeetingStatus.COMPLETED },
      });

      return {
        ok: true,
        meeting: mapMeeting(refreshed!),
        transcriptSource: refreshed?.transcript?.source ?? "notes",
      };
    } catch (err) {
      request.log.error(err, "Complete meeting pipeline failed");
      await prisma.meeting.update({
        where: { id: meeting.id },
        data: { status: MeetingStatus.FAILED },
      });
      return reply.status(500).send({
        error: err instanceof Error ? err.message : "Processing failed",
      });
    }
  });

  app.post<{ Params: { id: string } }>("/meetings/:id/process", async (request, reply) => {
    const meeting = await prisma.meeting.findUnique({
      where: { id: request.params.id },
      include: { transcript: true },
    });
    if (!meeting) {
      return reply.status(404).send({ error: "Meeting not found" });
    }

    const latestAudio = await prisma.audioFile.findFirst({
      where: { meetingId: meeting.id },
      orderBy: { createdAt: "desc" },
    });

    try {
      if (latestAudio) {
        const filePath = path.join(UPLOAD_DIR, latestAudio.storageKey);
        await runMeetingPipeline(meeting.id, filePath, latestAudio.mimeType);
        return { ok: true, message: "MOM generated from audio" };
      }

      if (!meeting.transcript) {
        await createTranscriptFromNotes(meeting.id);
      }

      await runNluFromExistingTranscript(meeting.id);
      return { ok: true, message: "MOM generated from meeting notes" };
    } catch (err) {
      request.log.error(err, "Pipeline failed");
      await prisma.meeting.update({
        where: { id: meeting.id },
        data: { status: MeetingStatus.FAILED },
      });
      await logAudit(meeting.id, PipelineStep.ERROR, {
        message: err instanceof Error ? err.message : "Unknown error",
      });
      return reply.status(500).send({
        error: err instanceof Error ? err.message : "Processing failed",
      });
    }
  });

  app.post<{ Params: { id: string } }>("/meetings/:id/mom/generate", async (request, reply) => {
    const meeting = await prisma.meeting.findUnique({
      where: { id: request.params.id },
      include: { participants: true, transcript: true },
    });
    if (!meeting) {
      return reply.status(404).send({ error: "Meeting not found" });
    }

    const transcriptText =
      meeting.transcript?.fullText ||
      meeting.notes ||
      "No transcript available. Please upload meeting audio.";

    const extraction = await extractMeetingInsights({
      transcript: transcriptText,
      participants: meeting.participants.map((p) => p.name),
      meetingDateIso: formatDateTime(meeting.scheduledAt).date,
    });

    const momPayload = extractionToMomPayload(meeting, extraction);
    const { date, time } = formatDateTime(meeting.scheduledAt);
    const participantNames = meeting.participants.map((p) => p.name);

    const mom = await prisma.mom.upsert({
      where: { meetingId: meeting.id },
      create: {
        meetingId: meeting.id,
        title: meeting.title,
        dateTime: `${date} ${time}`,
        participants: participantNames as unknown as Prisma.InputJsonValue,
        keyPoints: momPayload.keyPoints as unknown as Prisma.InputJsonValue,
        actionItems: momPayload.actionItems as unknown as Prisma.InputJsonValue,
      },
      update: {
        keyPoints: momPayload.keyPoints as unknown as Prisma.InputJsonValue,
        actionItems: momPayload.actionItems as unknown as Prisma.InputJsonValue,
        approved: false,
        shared: false,
      },
    });

    await logAudit(meeting.id, PipelineStep.MOM_GENERATED);
    return mapMom(mom);
  });

  app.patch<{ Params: { id: string } }>("/meetings/:id/mom", async (request, reply) => {
    const parsed = editMomSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: parsed.error.flatten() });
    }

    const mom = await prisma.mom.findUnique({
      where: { meetingId: request.params.id },
    });
    if (!mom) {
      return reply.status(404).send({ error: "MOM not found" });
    }

    const updated = await prisma.mom.update({
      where: { meetingId: request.params.id },
      data: {
        keyPoints: parsed.data.keyPoints as unknown as Prisma.InputJsonValue,
        actionItems: parsed.data.actionItems as unknown as Prisma.InputJsonValue,
        approved: false,
        shared: false,
        approvedBy: null,
        approvedAt: null,
        lastEditedAt: new Date(),
      },
    });

    await logAudit(request.params.id, PipelineStep.USER_EDIT, { action: "edit_mom" });
    return mapMom(updated);
  });

  app.post<{ Params: { id: string } }>("/meetings/:id/mom/approve", async (request, reply) => {
    const meeting = await prisma.meeting.findUnique({
      where: { id: request.params.id },
      include: { mom: true, participants: true },
    });
    if (!meeting?.mom) {
      return reply.status(404).send({ error: "MOM not found" });
    }

    if (meeting.status !== MeetingStatus.COMPLETED) {
      return reply.status(400).send({
        error: "Meeting must be finished before MOM can be approved and shared",
      });
    }

    const approvedBy =
      (request.body as { approvedBy?: string } | undefined)?.approvedBy ?? "Lyrus Life Admin";

    let shareResults: Awaited<ReturnType<typeof sendMomToStakeholdersOnApproval>> = [];
    if (!meeting.mom.shared && meeting.participants.length > 0) {
      try {
        shareResults = await sendMomToStakeholdersOnApproval(meeting.id, approvedBy);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to send MOM";
        return reply.status(500).send({ error: message });
      }

      const delivered = shareResults.filter(
        (r) => r.status === "sent" || r.status === "logged",
      );
      if (delivered.length === 0) {
        return reply.status(502).send({
          error: "Could not deliver MOM to any stakeholder",
          shareResults,
        });
      }
    }

    const mom = await prisma.mom.update({
      where: { meetingId: meeting.id },
      data: {
        approved: true,
        approvedBy,
        approvedAt: new Date(),
        shared: true,
      },
    });

    const actionItems = Array.isArray(mom.actionItems)
      ? (mom.actionItems as Array<{ task: string; assignee: string; deadline: string }>)
      : [];

    await prisma.actionItem.deleteMany({ where: { meetingId: meeting.id } });
    await prisma.actionItem.createMany({
      data: actionItems.map((item) => ({
        meetingId: meeting.id,
        description: item.task,
        ownerName: item.assignee,
        dueDate: parseActionDeadline(item.deadline, meeting.scheduledAt),
        status: TaskStatus.OPEN,
      })),
    });

    await logAudit(meeting.id, PipelineStep.TASKS_CREATED, { count: actionItems.length });

    return {
      ...mapMom(mom),
      shareResults: shareResults.length > 0 ? shareResults : undefined,
    };
  });

  app.get("/tasks", async () => {
    const items = await prisma.actionItem.findMany({
      include: { meeting: true },
      orderBy: { createdAt: "desc" },
    });

    const today = new Date().toISOString().split("T")[0]!;

    return items.map((item) => {
      const task = mapActionItemToTask(item, item.meeting.title);
      if (item.status !== "COMPLETED" && item.dueDate) {
        const due = item.dueDate.toISOString().split("T")[0]!;
        if (due < today) {
          task.status = "overdue";
        }
      }
      return task;
    });
  });

  app.patch<{ Params: { id: string } }>("/tasks/:id", async (request, reply) => {
    const body = request.body as { status?: string };
    const existing = await prisma.actionItem.findUnique({
      where: { id: request.params.id },
      include: { meeting: true },
    });
    if (!existing) {
      return reply.status(404).send({ error: "Task not found" });
    }

    let status = existing.status;
    if (body.status === "in_progress") status = TaskStatus.IN_PROGRESS;
    if (body.status === "completed") status = TaskStatus.COMPLETED;
    if (body.status === "pending") status = TaskStatus.OPEN;
    if (body.status === "overdue") status = TaskStatus.OVERDUE;

    const updated = await prisma.actionItem.update({
      where: { id: request.params.id },
      data: { status },
      include: { meeting: true },
    });

    return mapActionItemToTask(updated, updated.meeting.title);
  });

  app.get("/insights", async () => {
    const [meetingCount, taskCount, completedTasks, overdueTasks, recentMeetings] =
      await Promise.all([
        prisma.meeting.count(),
        prisma.actionItem.count(),
        prisma.actionItem.count({ where: { status: TaskStatus.COMPLETED } }),
        prisma.actionItem.count({ where: { status: TaskStatus.OVERDUE } }),
        prisma.meeting.findMany({
          take: 5,
          orderBy: { scheduledAt: "desc" },
          include: { mom: true, actionItems: true },
        }),
      ]);

    const completionRate =
      taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

    return {
      meetingCount,
      taskCount,
      completedTasks,
      overdueTasks,
      completionRate,
      recentMeetings: recentMeetings.map((m) => ({
        id: m.id,
        title: m.title,
        hasMom: Boolean(m.mom),
        openTasks: m.actionItems.filter((t) => t.status !== "COMPLETED").length,
      })),
    };
  });
}
