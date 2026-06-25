import { MeetingPlatform } from "@lyrus/db";
import type { MeetingPlatformType } from "@lyrus/db";
import type { MeetingPlatformInput } from "@lyrus/shared";
import { createGoogleMeetEvent } from "./google.js";
import { createTeamsMeeting } from "./microsoft.js";

export function mapPlatformInput(platform: MeetingPlatformInput): MeetingPlatformType {
  switch (platform) {
    case "google_meet":
      return MeetingPlatform.GOOGLE_MEET;
    case "microsoft_teams":
      return MeetingPlatform.MICROSOFT_TEAMS;
    default:
      return MeetingPlatform.LYRUS_LIVEKIT;
  }
}

export function mapPlatformToWeb(platform: MeetingPlatformType): MeetingPlatformInput {
  switch (platform) {
    case MeetingPlatform.GOOGLE_MEET:
      return "google_meet";
    case MeetingPlatform.MICROSOFT_TEAMS:
      return "microsoft_teams";
    default:
      return "lyrus";
  }
}

export async function provisionExternalMeeting(input: {
  platform: MeetingPlatformInput;
  userId: string;
  meetingId: string;
  title: string;
  description: string;
  scheduledAt: Date;
  durationMinutes: number;
  attendees: Array<{ email: string; name: string }>;
}): Promise<{
  externalMeetingUrl: string;
  calendarEventId?: string;
  externalMeetingId?: string;
}> {
  if (input.platform === "google_meet") {
    const created = await createGoogleMeetEvent({
      userId: input.userId,
      meetingId: input.meetingId,
      title: input.title,
      description: input.description,
      scheduledAt: input.scheduledAt,
      durationMinutes: input.durationMinutes,
      attendees: input.attendees,
    });
    return {
      externalMeetingUrl: created.joinUrl,
      calendarEventId: created.calendarEventId,
    };
  }

  if (input.platform === "microsoft_teams") {
    const created = await createTeamsMeeting({
      userId: input.userId,
      title: input.title,
      description: input.description,
      scheduledAt: input.scheduledAt,
      durationMinutes: input.durationMinutes,
    });
    return {
      externalMeetingUrl: created.joinUrl,
      externalMeetingId: created.externalMeetingId,
    };
  }

  throw new Error("External meeting provisioning is only supported for Google Meet and Microsoft Teams");
}

export function platformLabel(platform: MeetingPlatformInput): string {
  switch (platform) {
    case "google_meet":
      return "Google Meet";
    case "microsoft_teams":
      return "Microsoft Teams";
    default:
      return "Lyrus Live";
  }
}

export function platformLocation(platform: MeetingPlatformInput): string {
  switch (platform) {
    case "google_meet":
      return "Google Meet (virtual)";
    case "microsoft_teams":
      return "Microsoft Teams (virtual)";
    default:
      return "Lyrus Life (virtual)";
  }
}
