import { MeetingStatus, prisma } from "@lyrus/db";
import {
  clearLiveMeetingNotes,
  emitMeetingAutoEnded,
  emitMeetingStarted,
  getLiveMeetingNotes,
  getLiveRoomParticipantCount,
} from "../socket/live-meeting.js";
import { logTenantAudit } from "./tenant-audit.service.js";

type MeetingLiveFields = {
  status: string;
  liveStartedAt: Date | null;
  liveBroadcastAt: Date | null;
  liveEndedAt: Date | null;
};

/** Host clicked “Start for everyone” — official live broadcast. */
export function isMeetingBroadcasting(meeting: MeetingLiveFields): boolean {
  return Boolean(meeting.liveBroadcastAt && !meeting.liveEndedAt);
}

/** Waiting room or live call is open (someone can still join). */
export function isSessionOpen(meeting: MeetingLiveFields): boolean {
  if (meeting.liveEndedAt) return false;
  return (
    meeting.status === MeetingStatus.ONGOING ||
    (meeting.status === MeetingStatus.UPCOMING && meeting.liveStartedAt != null)
  );
}

/** @deprecated use isMeetingBroadcasting */
export function isMeetingLive(meeting: MeetingLiveFields): boolean {
  return isMeetingBroadcasting(meeting);
}

/** First participant entered the waiting room. */
export async function openWaitingRoom(meetingId: string) {
  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting || meeting.liveEndedAt) return;

  if (meeting.status === MeetingStatus.UPCOMING && !meeting.liveStartedAt) {
    await prisma.meeting.update({
      where: { id: meetingId },
      data: {
        status: MeetingStatus.ONGOING,
        liveStartedAt: new Date(),
      },
    });
    await logTenantAudit({
      organizationId: meeting.organizationId,
      action: "meeting.started",
      metadata: { meetingId, title: meeting.title },
    });
  }
}

export async function markMeetingLive(meetingId: string) {
  await openWaitingRoom(meetingId);
  const existing = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { liveStartedAt: true },
  });
  await prisma.meeting.update({
    where: { id: meetingId },
    data: {
      status: MeetingStatus.ONGOING,
      liveStartedAt: existing?.liveStartedAt ?? new Date(),
      liveBroadcastAt: new Date(),
      liveEndedAt: null,
    },
  });
  emitMeetingStarted(meetingId);
}

export async function endLiveSessionForMeeting(
  meetingId: string,
  options?: { auto?: boolean; reason?: string },
) {
  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  if (!meeting || !isSessionOpen(meeting)) {
    return { ended: false as const, socketNotes: "" };
  }

  if (options?.auto && getLiveRoomParticipantCount(meetingId) > 0) {
    return { ended: false as const, socketNotes: "" };
  }

  const socketNotes = options?.auto
    ? getLiveMeetingNotes(meetingId)
    : clearLiveMeetingNotes(meetingId);

  await prisma.meeting.update({
    where: { id: meetingId },
    data: {
      liveEndedAt: new Date(),
      liveBroadcastAt: null,
    },
  });

  await logTenantAudit({
    organizationId: meeting.organizationId,
    action: "meeting.ended",
    metadata: { meetingId, title: meeting.title, auto: options?.auto ?? false },
  });

  if (options?.auto) {
    const emptyMs = Number(process.env.LIVE_EMPTY_ROOM_MS ?? 3000);
    const waited =
      emptyMs >= 60_000 ? "5 minutes" : emptyMs >= 1000 ? `${Math.round(emptyMs / 1000)} seconds` : "a moment";
    emitMeetingAutoEnded(
      meetingId,
      options.reason ?? "empty_room",
      `Everyone left the meeting. The session ended automatically after ${waited} with no one in the room.`,
    );
  }

  return { ended: true as const, socketNotes };
}
