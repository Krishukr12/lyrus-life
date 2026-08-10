import { MeetingPlatform, prisma } from "@lyrus/db";
import { calendarImportLockKey } from "../recording-bot/recall.js";
import { scheduleBotForExternalMeeting } from "../recording-bot/index.js";
import type { GoogleMeetCalendarEvent } from "./google.js";

export type CalendarImportUser = {
  id: string;
  name: string | null;
  email: string;
  organizationId?: string | null;
};

function needsRecordingBot(meeting: {
  platform: string;
  externalMeetingUrl: string | null;
  recordingBotId: string | null;
  recordingBotStatus: string | null;
}): boolean {
  if (
    meeting.platform !== MeetingPlatform.GOOGLE_MEET &&
    meeting.platform !== MeetingPlatform.MICROSOFT_TEAMS
  ) {
    return false;
  }
  if (!meeting.externalMeetingUrl) return false;
  if (!meeting.recordingBotId) return true;
  // Earlier schedule attempts can fail (e.g. Recall validation) and leave a dead row.
  return meeting.recordingBotStatus === "failed";
}

/** Best-effort: schedule Recall bot when an imported Meet event has none (or a failed one). */
async function ensureRecordingBotScheduled(meetingId: string): Promise<void> {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: {
      id: true,
      platform: true,
      externalMeetingUrl: true,
      recordingBotId: true,
      recordingBotStatus: true,
    },
  });
  if (!meeting || !needsRecordingBot(meeting)) return;

  try {
    await scheduleBotForExternalMeeting(meeting.id);
  } catch (err) {
    console.warn(
      `[integrations] Could not schedule recording bot for meeting ${meeting.id}:`,
      err instanceof Error ? err.message : err,
    );
  }
}

/** Import one Google Calendar event into Meeting Desk AI (idempotent). */
export async function importGoogleCalendarEventForUser(
  user: CalendarImportUser,
  ev: Pick<
    GoogleMeetCalendarEvent,
    | "eventId"
    | "calendarId"
    | "title"
    | "description"
    | "startDateTimeIso"
    | "endDateTimeIso"
    | "joinUrl"
    | "attendees"
  >,
) {
  const calendarKey = `${ev.calendarId}:${ev.eventId}`;
  const hasMeetLink = Boolean(ev.joinUrl);

  const meeting = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${calendarImportLockKey(user.id, calendarKey)})`;

    const existing = await tx.meeting.findFirst({
      where: {
        organizerId: user.id,
        OR: [
          { calendarEventId: calendarKey },
          // Legacy rows may have stored only the raw Google event id.
          { calendarEventId: ev.eventId },
        ],
      },
    });
    // NOTE: Do not match on externalMeetingUrl alone. Recurring Google Meet
    // series reuse the same meet.google.com link for every instance, which made
    // later occurrences look "already present" and never get created.
    if (existing) {
      const data: {
        organizationId?: string;
        externalMeetingUrl?: string;
        platform?: typeof MeetingPlatform.GOOGLE_MEET;
      } = {};

      // Backfill org on older imports that omitted organizationId.
      if (!existing.organizationId && user.organizationId) {
        data.organizationId = user.organizationId;
      }
      // If Meet link arrived after a calendar-hold import, upgrade the meeting.
      if (hasMeetLink && !existing.externalMeetingUrl && ev.joinUrl) {
        data.externalMeetingUrl = ev.joinUrl;
        data.platform = MeetingPlatform.GOOGLE_MEET;
      }

      if (Object.keys(data).length > 0) {
        const updated = await tx.meeting.update({
          where: { id: existing.id },
          data,
        });
        return { meeting: updated, created: false };
      }
      return { meeting: existing, created: false };
    }

    const scheduledAt = new Date(ev.startDateTimeIso);
    const end = new Date(ev.endDateTimeIso);
    const durationMinutes = Math.max(15, Math.round((end.getTime() - scheduledAt.getTime()) / 60000));

    const participants =
      ev.attendees.length > 0
        ? ev.attendees
        : [{ name: user.name ?? "Organizer", email: user.email }];

    const created = await tx.meeting.create({
      data: {
        title: ev.title,
        description: ev.description ?? "",
        scheduledAt,
        durationMinutes,
        tag: "INTERNAL",
        notes: "",
        platform: hasMeetLink ? MeetingPlatform.GOOGLE_MEET : MeetingPlatform.LYRUS_LIVEKIT,
        organizationId: user.organizationId ?? undefined,
        organizerId: user.id,
        calendarEventId: calendarKey,
        externalMeetingUrl: ev.joinUrl ?? null,
        joinSlug: null,
        participants: {
          create: participants.map((p) => ({ name: p.name, email: p.email })),
        },
      },
    });
    return { meeting: created, created: true };
  });

  // Always retry when missing/failed — including re-imports of existing meetings.
  if (hasMeetLink) {
    await ensureRecordingBotScheduled(meeting.meeting.id);
  }

  return meeting;
}

export async function syncGoogleCalendarMeetingsToPlatform(
  user: CalendarImportUser,
  events: GoogleMeetCalendarEvent[],
): Promise<{
  imported: number;
  skipped: number;
  alreadyPresent: number;
  failed: number;
  botsScheduled: number;
  meetingIds: string[];
  errors: string[];
}> {
  let imported = 0;
  let alreadyPresent = 0;
  let failed = 0;
  let botsScheduled = 0;
  const meetingIds: string[] = [];
  const errors: string[] = [];

  // One DB read for the whole batch — skip per-event transactions when already synced.
  const calendarKeys = events.map((ev) => `${ev.calendarId}:${ev.eventId}`);
  const eventIds = events.map((ev) => ev.eventId);
  const existingRows = await prisma.meeting.findMany({
    where: {
      organizerId: user.id,
      OR: [
        { calendarEventId: { in: calendarKeys } },
        { calendarEventId: { in: eventIds } },
      ],
    },
    select: {
      id: true,
      calendarEventId: true,
      platform: true,
      externalMeetingUrl: true,
      recordingBotId: true,
      recordingBotStatus: true,
    },
  });
  const existingKeys = new Set(
    existingRows.map((row) => row.calendarEventId).filter(Boolean) as string[],
  );
  const existingByKey = new Map(
    existingRows
      .filter((row) => row.calendarEventId)
      .map((row) => [row.calendarEventId as string, row]),
  );

  for (const ev of events) {
    const calendarKey = `${ev.calendarId}:${ev.eventId}`;
    const existing =
      existingByKey.get(calendarKey) ?? existingByKey.get(ev.eventId) ?? null;

    if (existing && (existingKeys.has(calendarKey) || existingKeys.has(ev.eventId))) {
      alreadyPresent += 1;
      meetingIds.push(existing.id);

      // Critical: prior syncs that failed Recall scheduling (e.g. activate_after validation)
      // left meetings with no bot. Re-sync must retry, not skip forever.
      if (ev.joinUrl && needsRecordingBot(existing)) {
        const before = existing.recordingBotId;
        await ensureRecordingBotScheduled(existing.id);
        const after = await prisma.meeting.findUnique({
          where: { id: existing.id },
          select: { recordingBotId: true },
        });
        if (after?.recordingBotId && after.recordingBotId !== before) {
          botsScheduled += 1;
          existing.recordingBotId = after.recordingBotId;
          existing.recordingBotStatus = "scheduled";
        }
      }
      continue;
    }

    try {
      const result = await importGoogleCalendarEventForUser(user, ev);
      meetingIds.push(result.meeting.id);
      if (result.created) {
        imported += 1;
        existingKeys.add(calendarKey);
        existingKeys.add(ev.eventId);
        existingByKey.set(calendarKey, {
          id: result.meeting.id,
          calendarEventId: calendarKey,
          platform: result.meeting.platform,
          externalMeetingUrl: result.meeting.externalMeetingUrl,
          recordingBotId: result.meeting.recordingBotId,
          recordingBotStatus: result.meeting.recordingBotStatus,
        });
        if (result.meeting.recordingBotId || ev.joinUrl) {
          // importGoogleCalendarEventForUser schedules bot after create; count if it landed.
          const refreshed = await prisma.meeting.findUnique({
            where: { id: result.meeting.id },
            select: { recordingBotId: true },
          });
          if (refreshed?.recordingBotId) botsScheduled += 1;
        }
      } else {
        alreadyPresent += 1;
      }
    } catch (err) {
      failed += 1;
      const message = err instanceof Error ? err.message : "import_failed";
      if (errors.length < 5) {
        errors.push(`${ev.title}: ${message}`);
      }
      console.warn(
        `[integrations] Failed to import Google event ${ev.calendarId}:${ev.eventId}:`,
        message,
      );
    }
  }

  return {
    imported,
    skipped: alreadyPresent + failed,
    alreadyPresent,
    failed,
    botsScheduled,
    meetingIds,
    errors,
  };
}
