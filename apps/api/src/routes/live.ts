import type { FastifyInstance } from "fastify";
import { MeetingStatus, UserRole, prisma } from "@lyrus/db";
import { assertMeetingAccess, HttpAuthError } from "../lib/meeting-access.js";
import { createLiveKitToken, resolveLiveKitClientUrl } from "../lib/livekit.js";
import {
  assertCanJoinMeeting,
  ensureMeetingJoinSlug,
  loadMeetingJoinContextById,
  loadMeetingJoinContextBySlug,
} from "../lib/meeting-join-access.js";
import { authenticate, requireAuthUser } from "../middleware/authenticate.js";
import { tryAuthenticate } from "../middleware/try-authenticate.js";
import {
  endLiveSessionForMeeting,
  isMeetingBroadcasting,
  isSessionOpen,
  markMeetingLive,
  openWaitingRoom,
} from "../services/live-session.js";
import { getLiveMeetingNotes } from "../socket/live-meeting.js";

function handleJoinAuthError(reply: import("fastify").FastifyReply, err: unknown) {
  if (err instanceof HttpAuthError) {
    return reply.status(err.statusCode).send({ error: err.code, message: err.message });
  }
  throw err;
}

function canEnterWaitingRoom(meeting: { status: string; liveEndedAt: Date | null }): boolean {
  if (meeting.liveEndedAt) return false;
  return meeting.status === MeetingStatus.UPCOMING || meeting.status === MeetingStatus.ONGOING;
}

async function buildLiveSessionResponse(
  meeting: {
    id: string;
    joinSlug: string | null;
    organizerId: string | null;
    liveEndedAt: Date | null;
    liveStartedAt: Date | null;
    status: string;
  },
  user: { id: string; name: string },
  host: string | undefined,
  options: { isHost: boolean; isLive: boolean },
) {
  const joinSlug = meeting.joinSlug ?? (await ensureMeetingJoinSlug(meeting.id));
  const webBase = (process.env.WEB_APP_URL ?? "http://localhost:8080").replace(/\/$/, "");
  const token = await createLiveKitToken({
    roomName: meeting.id,
    participantName: user.name,
    participantIdentity: user.id,
    canEndMeeting: options.isHost,
  });

  const sessionStartedAt =
    meeting.liveStartedAt?.toISOString() ?? new Date().toISOString();

  return {
    joinSlug,
    joinUrl: `${webBase}/join/${joinSlug}`,
    livekitUrl: resolveLiveKitClientUrl(host),
    token,
    roomName: meeting.id,
    isLive: options.isLive,
    isHost: options.isHost,
    sessionStartedAt,
  };
}

export async function liveRoutes(app: FastifyInstance) {
  app.get<{ Params: { slug: string } }>("/meetings/join/:slug", async (request, reply) => {
    const user = await tryAuthenticate(request);
    if (!user) {
      return reply.status(401).send({
        error: "unauthorized",
        message: "Sign in required",
        requiresLogin: true,
      });
    }

    const meeting = await loadMeetingJoinContextBySlug(request.params.slug);
    if (!meeting) {
      return reply.status(404).send({ error: "not_found", message: "Meeting not found" });
    }

    try {
      const { isHost } = assertCanJoinMeeting(meeting, user);
      const live = isMeetingBroadcasting(meeting);
      return {
        meetingId: meeting.id,
        title: meeting.title,
        status: meeting.status,
        isLive: live,
        canJoin: true,
        isHost,
        joinPath: `/meetings/${meeting.id}/live`,
        waitingRoomPath: `/meetings/${meeting.id}/live`,
      };
    } catch (err) {
      return handleJoinAuthError(reply, err);
    }
  });

  app.post<{ Params: { slug: string } }>("/meetings/join/:slug/token", async (request, reply) => {
    await authenticate(request, reply);
    if (reply.sent) return;

    const user = requireAuthUser(request);
    const meeting = await loadMeetingJoinContextBySlug(request.params.slug);
    if (!meeting) {
      return reply.status(404).send({ error: "not_found", message: "Meeting not found" });
    }

    try {
      assertCanJoinMeeting(meeting, user);
    } catch (err) {
      return handleJoinAuthError(reply, err);
    }

    if (!canEnterWaitingRoom(meeting)) {
      return reply.status(400).send({
        error: "not_available",
        message: "This meeting is no longer available to join.",
      });
    }

    const { isHost } = assertCanJoinMeeting(meeting, user);
    await openWaitingRoom(meeting.id);
    const refreshed = await loadMeetingJoinContextBySlug(request.params.slug);
    const ctx = refreshed ?? meeting;
    return buildLiveSessionResponse(ctx, user, request.headers.host, {
      isHost,
      isLive: isMeetingBroadcasting(ctx),
    });
  });

  await app.register(async (protectedLive) => {
    protectedLive.addHook("onRequest", authenticate);

    protectedLive.post<{ Params: { id: string } }>("/meetings/:id/live/start", async (request, reply) => {
      const user = requireAuthUser(request);
      try {
        await assertMeetingAccess(user, request.params.id);
      } catch (err) {
        return handleJoinAuthError(reply, err);
      }

      const meeting = await prisma.meeting.findUnique({
        where: { id: request.params.id },
      });
      if (!meeting) {
        return reply.status(404).send({ error: "Meeting not found" });
      }

      if (meeting.organizerId && meeting.organizerId !== user.id && user.role !== UserRole.ADMIN) {
        return reply.status(403).send({
          error: "not_host",
          message: "Only the meeting host can start the meeting for everyone.",
        });
      }

      const joinSlug = meeting.joinSlug ?? (await ensureMeetingJoinSlug(meeting.id));
      await markMeetingLive(meeting.id);

      const updated = await prisma.meeting.findUnique({ where: { id: meeting.id } });
      return buildLiveSessionResponse(
        {
          ...meeting,
          joinSlug,
          liveEndedAt: null,
          liveStartedAt: updated?.liveStartedAt ?? new Date(),
          status: MeetingStatus.ONGOING,
        },
        user,
        request.headers.host,
        { isHost: true, isLive: true },
      );
    });

    protectedLive.post<{ Params: { id: string } }>("/meetings/:id/live/join", async (request, reply) => {
      const user = requireAuthUser(request);
      const meeting = await loadMeetingJoinContextById(request.params.id);
      if (!meeting) {
        return reply.status(404).send({ error: "Meeting not found" });
      }

      try {
        const { isHost } = assertCanJoinMeeting(meeting, user);
        if (!canEnterWaitingRoom(meeting)) {
          return reply.status(400).send({
            error: "not_available",
            message: "This meeting is no longer available to join.",
          });
        }

        await openWaitingRoom(meeting.id);
        const refreshed = await loadMeetingJoinContextById(meeting.id);
        const ctx = refreshed ?? meeting;

        return buildLiveSessionResponse(ctx, user, request.headers.host, {
          isHost,
          isLive: isMeetingBroadcasting(ctx),
        });
      } catch (err) {
        return handleJoinAuthError(reply, err);
      }
    });

    protectedLive.post<{ Params: { id: string } }>("/meetings/:id/live/token", async (request, reply) => {
      const user = requireAuthUser(request);
      const meeting = await loadMeetingJoinContextById(request.params.id);
      if (!meeting) {
        return reply.status(404).send({ error: "Meeting not found" });
      }

      try {
        const { isHost } = assertCanJoinMeeting(meeting, user);
        if (!canEnterWaitingRoom(meeting)) {
          return reply.status(400).send({
            error: "not_available",
            message: "Meeting is not available",
          });
        }

        await openWaitingRoom(meeting.id);
        const refreshed = await loadMeetingJoinContextById(meeting.id);
        const ctx = refreshed ?? meeting;

        const session = await buildLiveSessionResponse(ctx, user, request.headers.host, {
          isHost,
          isLive: isMeetingBroadcasting(ctx),
        });
        return {
          livekitUrl: session.livekitUrl,
          token: session.token,
          roomName: session.roomName,
          isLive: session.isLive,
        };
      } catch (err) {
        return handleJoinAuthError(reply, err);
      }
    });

    protectedLive.get<{ Params: { id: string } }>("/meetings/:id/live/status", async (request, reply) => {
      const user = requireAuthUser(request);
      const meeting = await loadMeetingJoinContextById(request.params.id);
      if (!meeting) {
        return reply.status(404).send({ error: "Meeting not found" });
      }

      try {
        assertCanJoinMeeting(meeting, user);
      } catch (err) {
        return handleJoinAuthError(reply, err);
      }

      return {
        isLive: isMeetingBroadcasting(meeting),
        sessionOpen: isSessionOpen(meeting),
        status: meeting.status,
      };
    });

    protectedLive.get<{ Params: { id: string } }>("/meetings/:id/live/notes", async (request, reply) => {
      const user = requireAuthUser(request);
      try {
        await assertMeetingAccess(user, request.params.id);
      } catch (err) {
        return handleJoinAuthError(reply, err);
      }
      return { notes: getLiveMeetingNotes(request.params.id) };
    });

    protectedLive.post<{ Params: { id: string } }>("/meetings/:id/live/end", async (request, reply) => {
      const user = requireAuthUser(request);
      try {
        await assertMeetingAccess(user, request.params.id);
      } catch (err) {
        return handleJoinAuthError(reply, err);
      }

      const meeting = await prisma.meeting.findUnique({ where: { id: request.params.id } });
      if (!meeting) {
        return reply.status(404).send({ error: "Meeting not found" });
      }

      const { getLiveSessionHost } = await import("../socket/live-meeting.js");
      const sessionHost = getLiveSessionHost(meeting.id);
      const isSessionHost = sessionHost?.userId === user.id;
      const isOrganizer = meeting.organizerId === user.id;
      if (!isOrganizer && !isSessionHost && user.role !== UserRole.ADMIN) {
        return reply.status(403).send({
          error: "not_host",
          message: "Only the meeting host can end the meeting for everyone.",
        });
      }

      if (!isSessionOpen(meeting)) {
        return reply.status(400).send({
          error: "not_live",
          message: "This meeting session is already closed.",
        });
      }

      const result = await endLiveSessionForMeeting(meeting.id);
      if (!result.ended) {
        return reply.status(400).send({
          error: "not_live",
          message: "Could not end the meeting session.",
        });
      }

      return {
        ok: true,
        socketNotes: result.socketNotes,
        message: "Live session ended. Upload recording to complete MOM generation.",
      };
    });
  });
}
