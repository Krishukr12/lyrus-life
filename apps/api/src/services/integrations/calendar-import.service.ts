import { MeetingPlatform, prisma } from "@lyrus/db";
import { calendarImportLockKey } from "../recording-bot/recall.js";
import { scheduleBotForExternalMeeting } from "../recording-bot/index.js";
import type { GoogleMeetCalendarEvent } from "./google.js";

export type CalendarImportUser = {
  id: string;
  name: string | null;
  email: string;
};

/** Import one Google Calendar Meet event into Meeting Desk AI (idempotent). */
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
  if (!ev.joinUrl) {
    throw new Error("This calendar event does not have a Google Meet link to track.");
  }

  const calendarKey = `${ev.calendarId}:${ev.eventId}`;

  const meeting = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${calendarImportLockKey(user.id, calendarKey)})`;

    const existing = await tx.meeting.findFirst({
      where: {
        organizerId: user.id,
        OR: [
          { calendarEventId: calendarKey },
          { calendarEventId: ev.eventId },
          { externalMeetingUrl: ev.joinUrl },
        ],
      },
    });
    if (existing) return { meeting: existing, created: false };

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
        platform: MeetingPlatform.GOOGLE_MEET,
        organizerId: user.id,
        calendarEventId: calendarKey,
        externalMeetingUrl: ev.joinUrl,
        joinSlug: null,
        participants: {
          create: participants.map((p) => ({ name: p.name, email: p.email })),
        },
      },
    });
    return { meeting: created, created: true };
  });

  if (!meeting.meeting.recordingBotId) {
    await scheduleBotForExternalMeeting(meeting.meeting.id);
  }

  return meeting;
}

export async function syncGoogleCalendarMeetingsToPlatform(
  user: CalendarImportUser,
  events: GoogleMeetCalendarEvent[],
): Promise<{ imported: number; skipped: number; meetingIds: string[] }> {
  let imported = 0;
  let skipped = 0;
  const meetingIds: string[] = [];

  for (const ev of events) {
    if (!ev.importable || !ev.joinUrl) {
      skipped += 1;
      continue;
    }
    try {
      const result = await importGoogleCalendarEventForUser(user, ev);
      meetingIds.push(result.meeting.id);
      if (result.created) imported += 1;
      else skipped += 1;
    } catch {
      skipped += 1;
    }
  }

  return { imported, skipped, meetingIds };
}
