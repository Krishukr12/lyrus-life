import { createReadStream } from "node:fs";
import { Router } from "express";
import { AudioStorageBackend, MeetingPlatform, MeetingStatus, MeetingTag, PipelineStep, TaskStatus, UserRole, UserStatus, prisma } from "@lyrus/db";
import { assertMeetingAccess, meetingsListWhere } from "../lib/meeting-access.js";
import {
  assertOrganizationBillingActive,
  assertOrganizationCanCreateMeeting,
  PlanLimitError,
} from "../lib/plan-limits.js";
import { generateJoinSlug } from "../lib/join-slug.js";
import { requireAuthUser } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { createMeetingSchema, editMomSchema, updateMeetingSchema } from "@lyrus/shared";
import type { Prisma } from "@lyrus/db";
import type { MeetingStatusType, MeetingTagType } from "../types/enums.js";
import { parseActionDeadline } from "../lib/deadline.js";
import {
  formatDateTime,
  mapActionItemToTask,
  mapMeeting,
  mapMom,
  parseScheduledAt,
} from "../lib/mappers.js";
import { logAudit } from "../services/audit.js";
import {
  regenerateMomForMeeting,
  runMeetingPipeline,
} from "../services/pipeline.js";
import {
  getSecureRecordingDownloadUrl,
  materializeAudioForProcessing,
  saveMeetingRecording,
} from "../services/storage/index.js";
import { localFilePath } from "../services/storage/local.js";
import { sendAndRecordMeetingInvites } from "../services/invites.js";
import { assertUserHasIntegration } from "../services/integrations/index.js";
import {
  mapPlatformInput,
  provisionExternalMeeting,
} from "../services/integrations/meeting-platform.js";
import {
  externalMeetingNeedsLiveRefresh,
  refreshExternalRecordingLiveStatus,
  rescheduleBotForExternalMeeting,
  scheduleBotForExternalMeeting,
  syncExternalRecordingState,
} from "../services/recording-bot/index.js";
import { isRecallConfigured } from "../services/recording-bot/recall.js";
import { isActiveRecordingBotStatus } from "../services/recording-bot/recording-progress.js";
import { sendMomToStakeholdersOnApproval } from "../services/mom-share.js";
import { asyncHandler, sendAuthError } from "../lib/http.js";
import { getMultipartFile, requireRouteParam } from "../lib/route-params.js";
import { audioUpload, completeMeetingUpload } from "../lib/upload.js";

const meetingInclude = {
  participants: true,
  invites: { orderBy: { sentAt: "desc" as const } },
  transcript: { include: { segments: true } },
  mom: true,
} as const;

function mapTag(tag: string): MeetingTagType {
  return tag.toUpperCase() as MeetingTagType;
}

function mapStatus(status: string): MeetingStatusType {
  switch (status) {
    case "ongoing":
      return MeetingStatus.ONGOING;
    case "completed":
      return MeetingStatus.COMPLETED;
    default:
      return MeetingStatus.UPCOMING;
  }
}

function sendPlanLimitError(res: import("express").Response, err: unknown): boolean {
  const code =
    err instanceof PlanLimitError
      ? err.code
      : err &&
          typeof err === "object" &&
          "code" in err &&
          typeof (err as { code: unknown }).code === "string"
        ? (err as { code: string }).code
        : null;
  const message =
    err instanceof Error
      ? err.message
      : "Trial period has ended. Upgrade to continue using the platform.";
  const statusCode =
    err instanceof PlanLimitError
      ? err.statusCode
      : err &&
          typeof err === "object" &&
          "statusCode" in err &&
          typeof (err as { statusCode: unknown }).statusCode === "number"
        ? (err as { statusCode: number }).statusCode
        : 403;

  if (
    code === "trial_expired" ||
    code === "billing_overdue" ||
    code === "billing_cancelled" ||
    code === "organization_inactive" ||
    code === "plan_meeting_limit"
  ) {
    res.status(statusCode).json({ error: code, message });
    return true;
  }
  return false;
}

export function createMeetingsRouter(): Router {
  const router = Router();
  router.get("/meetings", asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    if (user.organizationId) {
      try {
        await assertOrganizationBillingActive(user.organizationId);
      } catch (err) {
        if (sendPlanLimitError(res, err)) return;
        throw err;
      }
    }
    const meetings = await prisma.meeting.findMany({
      where: meetingsListWhere(user),
      include: meetingInclude,
      orderBy: { scheduledAt: "desc" },
    });
    res.json(meetings.map(mapMeeting));
  }));

  router.get("/people/suggestions", asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

    const textFilter = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [orgUsers, pastParticipants] = await Promise.all([
      user.organizationId
        ? prisma.user.findMany({
            where: {
              organizationId: user.organizationId,
              status: UserStatus.ACTIVE,
              ...textFilter,
            },
            select: { name: true, email: true },
            orderBy: { name: "asc" },
            take: 50,
          })
        : Promise.resolve([] as Array<{ name: string; email: string }>),
      prisma.meetingParticipant.findMany({
        where: { meeting: meetingsListWhere(user), ...textFilter },
        select: { name: true, email: true },
        orderBy: { id: "desc" },
        take: 200,
      }),
    ]);

    const seen = new Set<string>([user.email.toLowerCase()]);
    const suggestions: Array<{ name: string; email: string; source: "team" | "recent" }> = [];

    for (const member of orgUsers) {
      const key = member.email.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      suggestions.push({ name: member.name, email: member.email, source: "team" });
    }
    for (const person of pastParticipants) {
      const key = person.email.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      suggestions.push({ name: person.name, email: person.email, source: "recent" });
    }

    res.json(suggestions.slice(0, 8));
  }));

  router.get("/meetings/:id", asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    try {
      await assertMeetingAccess(user, requireRouteParam(req.params.id, "id"));
    } catch (err) {
      sendAuthError(res, err); return;
    }

    const meeting = await prisma.meeting.findUnique({
      where: { id: requireRouteParam(req.params.id, 'id') },
      include: meetingInclude,
    });
    if (!meeting) {
      res.status(404).json({ error: "Meeting not found" });
        return;
    }

    // Seal sticky "Everyone has left" only when a draft exists and no one has rejoined.
    if (
      meeting.mom &&
      !isActiveRecordingBotStatus(meeting.recordingBotStatus) &&
      (meeting.recordingBotStatus !== "done" || meeting.status !== MeetingStatus.COMPLETED)
    ) {
      await prisma.meeting.update({
        where: { id: meeting.id },
        data: {
          recordingBotStatus: "done",
          status: MeetingStatus.COMPLETED,
        },
      });
      meeting.recordingBotStatus = "done";
      meeting.status = MeetingStatus.COMPLETED;
    }

    if (isRecallConfigured() && externalMeetingNeedsLiveRefresh(meeting)) {
      await refreshExternalRecordingLiveStatus(meeting.id);
      const refreshed = await prisma.meeting.findUnique({
        where: { id: meeting.id },
        include: meetingInclude,
      });
      res.json(mapMeeting(refreshed ?? meeting));
      return;
    }

    res.json(mapMeeting(meeting));
  }));

  router.post("/meetings", asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    if (user.role === "VIEWER") {
      res.status(403).json({
        error: "forbidden",
        message: "Viewers cannot create meetings",
      });
      return;
    }
    const parsed = createMeetingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
        return;
    }

    const data = parsed.data;
    const scheduledAt = parseScheduledAt(data.date, data.time);

    if (user.organizationId) {
      try {
        await assertOrganizationCanCreateMeeting(user.organizationId);
      } catch (err) {
        if (err instanceof PlanLimitError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }

    const platform = data.platform ?? "lyrus";
    const dbPlatform = mapPlatformInput(platform);
    const isExternal = platform === "google_meet" || platform === "microsoft_teams";

    if (isExternal) {
      await assertUserHasIntegration(user.id, platform);
      if (!isRecallConfigured()) {
        res.status(503).json({
          error: "recording_not_configured",
          message:
            "Automated recording is not configured (RECALL_API_KEY). Contact your administrator.",
        });
        return;
      }
    }

    const meeting = await prisma.meeting.create({
      data: {
        title: data.title,
        description: data.description,
        scheduledAt,
        durationMinutes: data.duration,
        tag: mapTag(data.tag),
        notes: data.notes,
        platform: dbPlatform,
        organizationId: user.organizationId ?? undefined,
        organizerId: user.id,
        joinSlug: isExternal ? null : generateJoinSlug(),
        participants: {
          create: data.stakeholders.map((s) => ({
            name: s.name,
            email: s.email,
          })),
        },
      },
      include: meetingInclude,
    });

    if (isExternal) {
      const external = await provisionExternalMeeting({
        platform,
        userId: user.id,
        meetingId: meeting.id,
        title: data.title,
        description: data.description,
        scheduledAt,
        durationMinutes: data.duration,
        attendees: data.stakeholders,
      });

      await prisma.meeting.update({
        where: { id: meeting.id },
        data: {
          externalMeetingUrl: external.externalMeetingUrl,
          calendarEventId: external.calendarEventId ?? null,
          externalMeetingId: external.externalMeetingId ?? null,
        },
      });

      await scheduleBotForExternalMeeting(meeting.id);
    }

    await logAudit(meeting.id, PipelineStep.USER_EDIT, { action: "create_meeting", platform }, user.id);

    const inviteResults = await sendAndRecordMeetingInvites(meeting.id);
    const refreshed = await prisma.meeting.findUnique({
      where: { id: meeting.id },
      include: meetingInclude,
    });

    res.json({
      meeting: mapMeeting(refreshed ?? meeting),
      invites: inviteResults.map((r) => ({
        email: r.email,
        name: r.name,
        status: r.status,
        error: r.error,
      })),
    });
  }));

  // External meeting link can be re-provisioned (Google Meet / Teams) if missing or expired.
  router.post("/meetings/:id/external/reprovision", asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    const meetingId = requireRouteParam(req.params.id, "id");
    try {
      await assertMeetingAccess(user, meetingId);
    } catch (err) {
      sendAuthError(res, err);
      return;
    }

    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: { participants: true },
    });
    if (!meeting) {
      res.status(404).json({ error: "Meeting not found" });
      return;
    }

    const platform =
      meeting.platform === MeetingPlatform.GOOGLE_MEET
        ? "google_meet"
        : meeting.platform === MeetingPlatform.MICROSOFT_TEAMS
          ? "microsoft_teams"
          : "lyrus";

    if (platform === "lyrus") {
      res.status(400).json({
        error: "not_external",
        message: "This meeting is not a Google Meet or Microsoft Teams meeting.",
      });
      return;
    }

    await assertUserHasIntegration(user.id, platform);
    if (!isRecallConfigured()) {
      res.status(503).json({
        error: "recording_not_configured",
        message:
          "Automated recording is not configured (RECALL_API_KEY). Contact your administrator.",
      });
      return;
    }

    const external = await provisionExternalMeeting({
      platform,
      userId: user.id,
      meetingId: meeting.id,
      title: meeting.title,
      description: meeting.description,
      scheduledAt: meeting.scheduledAt,
      durationMinutes: meeting.durationMinutes,
      attendees: meeting.participants.map((p) => ({ email: p.email, name: p.name })),
    });

    await prisma.meeting.update({
      where: { id: meeting.id },
      data: {
        externalMeetingUrl: external.externalMeetingUrl,
        calendarEventId: external.calendarEventId ?? meeting.calendarEventId ?? null,
        externalMeetingId: external.externalMeetingId ?? meeting.externalMeetingId ?? null,
      },
    });

    await scheduleBotForExternalMeeting(meeting.id);
    const refreshed = await prisma.meeting.findUnique({
      where: { id: meeting.id },
      include: meetingInclude,
    });
    res.json(mapMeeting(refreshed ?? (meeting as any)));
  }));

  // Poll Recall for a finished recording and run the MOM pipeline (works without webhooks).
  router.post("/meetings/:id/recording/sync", asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    const meetingId = requireRouteParam(req.params.id, "id");
    try {
      await assertMeetingAccess(user, meetingId);
    } catch (err) {
      sendAuthError(res, err);
      return;
    }

    if (!isRecallConfigured()) {
      res.status(503).json({
        error: "recording_not_configured",
        message: "Automated recording is not configured (RECALL_API_KEY).",
      });
      return;
    }

    const result = await syncExternalRecordingState(meetingId);
    const refreshed = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: meetingInclude,
    });
    res.json({ result, meeting: mapMeeting(refreshed!) });
  }));

  // Schedule a new Recall bot when rejoining an external meeting.
  router.post("/meetings/:id/recording/bot", asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    const meetingId = requireRouteParam(req.params.id, "id");
    try {
      await assertMeetingAccess(user, meetingId);
    } catch (err) {
      sendAuthError(res, err);
      return;
    }

    const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
    if (!meeting) {
      res.status(404).json({ error: "not_found" });
      return;
    }

    if (
      meeting.platform !== MeetingPlatform.GOOGLE_MEET &&
      meeting.platform !== MeetingPlatform.MICROSOFT_TEAMS
    ) {
      res.status(400).json({ error: "not_external" });
      return;
    }

    if (!isRecallConfigured()) {
      res.status(503).json({
        error: "recording_not_configured",
        message: "Automated recording is not configured (RECALL_API_KEY).",
      });
      return;
    }

    await rescheduleBotForExternalMeeting(meetingId);
    const refreshed = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: meetingInclude,
    });
    res.json(mapMeeting(refreshed!));
  }));

  router.post("/meetings/:id/invites/resend", asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    try {
      await assertMeetingAccess(user, requireRouteParam(req.params.id, "id"));
    } catch (err) {
      sendAuthError(res, err); return;
    }

    const meeting = await prisma.meeting.findUnique({
      where: { id: requireRouteParam(req.params.id, 'id') },
      include: { participants: true },
    });
    if (!meeting) {
      res.status(404).json({ error: "Meeting not found" });
        return;
    }
    if (meeting.participants.length === 0) {
      res.status(400).json({ error: "No stakeholders to invite" });
        return;
    }

    const inviteResults = await sendAndRecordMeetingInvites(meeting.id);
    const refreshed = await prisma.meeting.findUnique({
      where: { id: meeting.id },
      include: meetingInclude,
    });

    res.json({
      meeting: mapMeeting(refreshed!),
      invites: inviteResults,
    });
  }));

  router.patch("/meetings/:id", asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    try {
      await assertMeetingAccess(user, requireRouteParam(req.params.id, "id"));
    } catch (err) {
      sendAuthError(res, err); return;
    }

    const parsed = updateMeetingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
        return;
    }

    const existing = await prisma.meeting.findUnique({
      where: { id: requireRouteParam(req.params.id, 'id') },
    });
    if (!existing) {
      res.status(404).json({ error: "Meeting not found" });
        return;
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
      where: { id: requireRouteParam(req.params.id, 'id') },
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

    res.json(mapMeeting(meeting));
  }));

  router.post("/meetings/:id/audio", audioUpload, asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    try {
      await assertMeetingAccess(user, requireRouteParam(req.params.id, "id"));
    } catch (err) {
      sendAuthError(res, err); return;
    }

    const meeting = await prisma.meeting.findUnique({
      where: { id: requireRouteParam(req.params.id, 'id') },
    });
    if (!meeting) {
      res.status(404).json({ error: "Meeting not found" });
        return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No audio file uploaded" });
      return;
    }
    const saved = await saveMeetingRecording(
      meeting.id,
      file.buffer,
      file.originalname || "recording.webm",
      file.mimetype || "audio/webm",
    );

    const autoProcess = req.query.process !== "false";

    try {
      if (autoProcess) {
        try {
          await runMeetingPipeline(meeting.id, {
            filePath: saved.filePath,
            mimeType: file.mimetype || "audio/webm",
            s3Key: saved.s3Key,
            s3Bucket: saved.s3Bucket,
          });
          const refreshed = await prisma.meeting.findUnique({
            where: { id: meeting.id },
            include: meetingInclude,
          });
          res.json({
            ok: true,
            message: "Recording transcribed and MOM generated",
            meeting: mapMeeting(refreshed!),
          });
          return;
        } catch (err) {
          console.error("Pipeline failed", err);
          await prisma.meeting.update({
            where: { id: meeting.id },
            data: { status: MeetingStatus.FAILED },
          });
          res.status(500).json({
            error: err instanceof Error ? err.message : "Processing failed",
          });
        return;
        }
      }

      res.json({ ok: true, message: "Recording saved. Call /process to generate MOM." });
    } finally {
      await saved.cleanup?.();
    }
  }));

  router.get("/meetings/:id/recording/download", asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    try {
      await assertMeetingAccess(user, requireRouteParam(req.params.id, "id"));
    } catch (err) {
      sendAuthError(res, err); return;
    }

    const latestAudio = await prisma.audioFile.findFirst({
      where: { meetingId: requireRouteParam(req.params.id, 'id') },
      orderBy: { createdAt: "desc" },
    });

    if (!latestAudio) {
      res.status(404).json({ error: "No recording for this meeting" });
        return;
    }

    const presigned = await getSecureRecordingDownloadUrl(latestAudio);
    if (presigned) {
      res.json({
        mode: "presigned",
        url: presigned.url,
        expiresInSeconds: presigned.expiresInSeconds,
      });
      return;
    }

    const filePath = localFilePath(latestAudio.storageKey);
    try {
      res.setHeader("Content-Type", latestAudio.mimeType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="meeting-${requireRouteParam(req.params.id, 'id')}.webm"`,
      );
      createReadStream(filePath).pipe(res);
      return;
    } catch {
      res.status(404).json({ error: "Recording file not found on server" });
        return;
    }
  }));

  router.post("/meetings/:id/complete", completeMeetingUpload, asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    try {
      await assertMeetingAccess(user, requireRouteParam(req.params.id, "id"));
    } catch (err) {
      sendAuthError(res, err); return;
    }

    const meeting = await prisma.meeting.findUnique({
      where: { id: requireRouteParam(req.params.id, 'id') },
      include: { participants: true, transcript: true },
    });
    if (!meeting) {
      res.status(404).json({ error: "Meeting not found" });
        return;
    }

    let notes = meeting.notes;
    let savedAudio: Awaited<ReturnType<typeof saveMeetingRecording>> | null = null;
    let mimeType = "audio/webm";

    const recordingFile = getMultipartFile(req.files, "recording");
    const notesField = typeof req.body?.notes === "string" ? req.body.notes : undefined;

    if (recordingFile && "buffer" in recordingFile) {
      savedAudio = await saveMeetingRecording(
        meeting.id,
        recordingFile.buffer,
        recordingFile.originalname || "meeting-recording.webm",
        recordingFile.mimetype || "audio/webm",
      );
      mimeType = recordingFile.mimetype || "audio/webm";
    }
    if (notesField !== undefined) {
      notes = notesField;
    }

    await prisma.meeting.update({
      where: { id: meeting.id },
      data: { notes, status: MeetingStatus.COMPLETED },
    });

    if (!savedAudio) {
      res.status(400).json({
        error:
          "A recording is required to generate MOM. Notes-only MOM is disabled.",
      });
      return;
    }

    try {
      try {
        await runMeetingPipeline(meeting.id, {
          filePath: savedAudio.filePath,
          mimeType,
          s3Key: savedAudio.s3Key,
          s3Bucket: savedAudio.s3Bucket,
        });
      } finally {
        await savedAudio.cleanup?.();
      }

      const refreshed = await prisma.meeting.findUnique({
        where: { id: meeting.id },
        include: meetingInclude,
      });

      await prisma.meeting.update({
        where: { id: meeting.id },
        data: { status: MeetingStatus.COMPLETED },
      });

      res.json({
        ok: true,
        meeting: mapMeeting(refreshed!),
        transcriptSource: refreshed?.transcript?.source ?? null,
      });
    } catch (err) {
      console.error("Complete meeting pipeline failed", err);
      await prisma.meeting.update({
        where: { id: meeting.id },
        data: { status: MeetingStatus.FAILED },
      });
      res.status(500).json({
        error: err instanceof Error ? err.message : "Processing failed",
      });
        return;
    }
  }));

  router.post("/meetings/:id/process", asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    try {
      await assertMeetingAccess(user, requireRouteParam(req.params.id, "id"));
    } catch (err) {
      sendAuthError(res, err); return;
    }

    const meeting = await prisma.meeting.findUnique({
      where: { id: requireRouteParam(req.params.id, 'id') },
      include: { transcript: true },
    });
    if (!meeting) {
      res.status(404).json({ error: "Meeting not found" });
        return;
    }

    const latestAudio = await prisma.audioFile.findFirst({
      where: { meetingId: meeting.id },
      orderBy: { createdAt: "desc" },
    });

    try {
      if (!latestAudio) {
        // Prefer regenerate so a real prior transcript (not notes) can still be used.
        await regenerateMomForMeeting(meeting.id);
        res.json({ ok: true, message: "MOM generated from recording transcript" });
        return;
      }

      const materialized = await materializeAudioForProcessing(latestAudio);
      try {
        await runMeetingPipeline(meeting.id, {
          filePath: materialized.filePath,
          mimeType: latestAudio.mimeType,
          s3Key: materialized.s3Key,
          s3Bucket:
            materialized.storageBackend === AudioStorageBackend.S3
              ? materialized.s3Bucket
              : undefined,
        });
      } finally {
        await materialized.cleanup?.();
      }
      res.json({ ok: true, message: "MOM generated from audio" });
      return;
    } catch (err) {
      console.error("Pipeline failed", err);
      await prisma.meeting.update({
        where: { id: meeting.id },
        data: { status: MeetingStatus.FAILED },
      });
      await logAudit(meeting.id, PipelineStep.ERROR, {
        message: err instanceof Error ? err.message : "Unknown error",
      });
      res.status(500).json({
        error: err instanceof Error ? err.message : "Processing failed",
      });
        return;
    }
  }));

  router.post("/meetings/:id/mom/generate", asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    try {
      await assertMeetingAccess(user, requireRouteParam(req.params.id, "id"));
    } catch (err) {
      sendAuthError(res, err); return;
    }

    const meetingId = requireRouteParam(req.params.id, "id");
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: { mom: true },
    });
    if (!meeting) {
      res.status(404).json({ error: "Meeting not found" });
        return;
    }

    try {
      await regenerateMomForMeeting(meetingId);
    } catch (err) {
      res.status(500).json({
        error: err instanceof Error ? err.message : "MOM generation failed",
      });
      return;
    }

    const mom = await prisma.mom.findUnique({ where: { meetingId } });
    if (!mom) {
      res.status(500).json({ error: "MOM was not created" });
      return;
    }

    res.json(mapMom(mom));
  }));

  router.patch("/meetings/:id/mom", asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    try {
      await assertMeetingAccess(user, requireRouteParam(req.params.id, "id"));
    } catch (err) {
      sendAuthError(res, err); return;
    }

    const parsed = editMomSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
        return;
    }

    const mom = await prisma.mom.findUnique({
      where: { meetingId: requireRouteParam(req.params.id, 'id') },
    });
    if (!mom) {
      res.status(404).json({ error: "MOM not found" });
        return;
    }

    const updated = await prisma.mom.update({
      where: { meetingId: requireRouteParam(req.params.id, 'id') },
      data: {
        keyPoints: parsed.data.keyPoints as unknown as Prisma.InputJsonValue,
        actionItems: parsed.data.actionItems as unknown as Prisma.InputJsonValue,
        ...(parsed.data.sections !== undefined
          ? { sections: parsed.data.sections as unknown as Prisma.InputJsonValue }
          : {}),
        approved: false,
        shared: false,
        approvedBy: null,
        approvedAt: null,
        lastEditedAt: new Date(),
      },
    });

    await logAudit(requireRouteParam(req.params.id, 'id'), PipelineStep.USER_EDIT, { action: "edit_mom" });
    res.json(mapMom(updated));
  }));

  router.post("/meetings/:id/mom/approve", asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    try {
      await assertMeetingAccess(user, requireRouteParam(req.params.id, "id"));
    } catch (err) {
      sendAuthError(res, err); return;
    }

    const meeting = await prisma.meeting.findUnique({
      where: { id: requireRouteParam(req.params.id, 'id') },
      include: { mom: true, participants: true },
    });
    if (!meeting?.mom) {
      res.status(404).json({ error: "MOM not found" });
        return;
    }

    // MOM exists ⇒ treat as finishable. Sync polls previously left PROCESSING and blocked approve.
    if (meeting.status !== MeetingStatus.COMPLETED) {
      await prisma.meeting.update({
        where: { id: meeting.id },
        data: { status: MeetingStatus.COMPLETED },
      });
    }

    const approvedBy = user.name;

    let shareResults: Awaited<ReturnType<typeof sendMomToStakeholdersOnApproval>> = [];
    if (!meeting.mom.shared && meeting.participants.length > 0) {
      try {
        shareResults = await sendMomToStakeholdersOnApproval(meeting.id, approvedBy);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to send MOM";
        res.status(500).json({ error: message });
        return;
      }

      const delivered = shareResults.filter(
        (r) => r.status === "sent" || r.status === "logged",
      );
      if (delivered.length === 0) {
        res.status(502).json({
          error: "Could not deliver MOM to any stakeholder",
          shareResults,
        });
        return;
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

    res.json({
      ...mapMom(mom),
      shareResults: shareResults.length > 0 ? shareResults : undefined,
    });
  }));

  router.get("/tasks", asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    if (user.organizationId) {
      try {
        await assertOrganizationBillingActive(user.organizationId);
      } catch (err) {
        if (sendPlanLimitError(res, err)) return;
        throw err;
      }
    }
    const meetingFilter = meetingsListWhere(user);
    const items = await prisma.actionItem.findMany({
      where: {
        meeting: meetingFilter,
      },
      include: { meeting: true },
      orderBy: { createdAt: "desc" },
    });

    const today = new Date().toISOString().split("T")[0]!;

    res.json(
      items.map((item) => {
        const task = mapActionItemToTask(item, item.meeting.title);
        if (item.status !== "COMPLETED" && item.dueDate) {
          const due = item.dueDate.toISOString().split("T")[0]!;
          if (due < today) {
            task.status = "overdue";
          }
        }
        return task;
      }),
    );
  }));

  router.patch("/tasks/:id", asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    const body = req.body as { status?: string };
    const existing = await prisma.actionItem.findUnique({
      where: { id: requireRouteParam(req.params.id, 'id') },
      include: { meeting: true },
    });
    if (!existing) {
      res.status(404).json({ error: "Task not found" });
        return;
    }

    try {
      await assertMeetingAccess(user, existing.meetingId);
    } catch (err) {
      sendAuthError(res, err); return;
    }

    let status = existing.status;
    if (body.status === "in_progress") status = TaskStatus.IN_PROGRESS;
    if (body.status === "completed") status = TaskStatus.COMPLETED;
    if (body.status === "pending") status = TaskStatus.OPEN;
    if (body.status === "overdue") status = TaskStatus.OVERDUE;

    const updated = await prisma.actionItem.update({
      where: { id: requireRouteParam(req.params.id, 'id') },
      data: { status },
      include: { meeting: true },
    });

    res.json(mapActionItemToTask(updated, updated.meeting.title));
  }));

  router.get("/insights", authorize([UserRole.ORG_ADMIN]), asyncHandler(async (req, res) => {
    const user = requireAuthUser(req);
    const meetingFilter = meetingsListWhere(user);
    const [meetingCount, taskCount, completedTasks, overdueTasks, recentMeetings] =
      await Promise.all([
        prisma.meeting.count({ where: meetingFilter }),
        prisma.actionItem.count({ where: { meeting: meetingFilter } }),
        prisma.actionItem.count({
          where: { status: TaskStatus.COMPLETED, meeting: meetingFilter },
        }),
        prisma.actionItem.count({
          where: { status: TaskStatus.OVERDUE, meeting: meetingFilter },
        }),
        prisma.meeting.findMany({
          where: meetingFilter,
          take: 5,
          orderBy: { scheduledAt: "desc" },
          include: { mom: true, actionItems: true },
        }),
      ]);

    const completionRate =
      taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

    res.json({
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
    });
  }));

  return router;
}
