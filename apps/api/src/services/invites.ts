import { InviteStatus, MeetingPlatform, PipelineStep, prisma } from "@lyrus/db";
import { getOrganizerEmail, sendMeetingInvites, type InviteResult } from "@lyrus/notifications";
import { webAppJoinUrl } from "@lyrus/shared";
import { ensureMeetingJoinSlug } from "../lib/meeting-join-access.js";
import {
  mapPlatformToWeb,
  platformLabel,
  platformLocation,
} from "./integrations/meeting-platform.js";
import { logAudit } from "./audit.js";

export async function sendAndRecordMeetingInvites(meetingId: string): Promise<InviteResult[]> {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: { participants: true, organizer: true },
  });

  if (!meeting) {
    throw new Error("Meeting not found");
  }

  if (meeting.participants.length === 0) {
    return [];
  }

  const organizerName = meeting.organizer?.name ?? "Lyrus Life Host";
  const organizerEmail = meeting.organizer?.email ?? getOrganizerEmail();

  const isExternal =
    meeting.platform === MeetingPlatform.GOOGLE_MEET ||
    meeting.platform === MeetingPlatform.MICROSOFT_TEAMS;

  const joinSlug =
    !isExternal && meeting.joinSlug
      ? meeting.joinSlug
      : !isExternal
        ? await ensureMeetingJoinSlug(meeting.id)
        : undefined;

  const platform = mapPlatformToWeb(meeting.platform);
  const joinUrl = isExternal
    ? (meeting.externalMeetingUrl ?? "")
    : webAppJoinUrl(joinSlug!);

  if (!joinUrl) {
    throw new Error("Meeting join URL is missing");
  }

  const results = await sendMeetingInvites({
    meetingId: meeting.id,
    joinUrl,
    joinSlug,
    platformLabel: platformLabel(platform),
    locationLabel: platformLocation(platform),
    title: meeting.title,
    description: meeting.description,
    scheduledAt: meeting.scheduledAt,
    durationMinutes: meeting.durationMinutes,
    organizerName,
    organizerEmail,
    attendees: meeting.participants.map((p) => ({
      name: p.name,
      email: p.email,
    })),
  });

  await prisma.meetingInvite.deleteMany({ where: { meetingId } });

  await prisma.meetingInvite.createMany({
    data: results.map((r) => ({
      meetingId,
      email: r.email,
      name: r.name,
      status:
        r.status === "sent"
          ? InviteStatus.SENT
          : r.status === "logged"
            ? InviteStatus.LOGGED
            : InviteStatus.FAILED,
      error: r.error,
    })),
  });

  await logAudit(meetingId, PipelineStep.INVITES_SENT, {
    sent: results.filter((r) => r.status === "sent" || r.status === "logged").length,
    failed: results.filter((r) => r.status === "failed").length,
    recipients: results.map((r) => r.email),
    platform: meeting.platform,
    joinUrl,
  });

  return results;
}
