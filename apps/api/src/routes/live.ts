import { resolveWebAppUrl } from "@lyrus/shared";
import { Router } from "express";
import { MeetingStatus, UserRole, prisma } from "@lyrus/db";
import { assertMeetingAccess } from "../lib/meeting-access.js";
import { createLiveKitToken, resolveLiveKitClientUrl } from "../lib/livekit.js";
import {
  assertCanJoinMeeting,
  ensureMeetingJoinSlug,
  isEmailInvitedToMeeting,
  loadMeetingJoinContextById,
  loadMeetingJoinContextBySlug,
  normalizeEmail,
} from "../lib/meeting-join-access.js";
import { asyncHandler, handleJoinAuthError } from "../lib/http.js";
import { requireRouteParam } from "../lib/route-params.js";
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
  const webBase = resolveWebAppUrl();
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

export function createLiveRouter(): Router {
  const router = Router();

  router.get(
    "/meetings/join/:slug",
    asyncHandler(async (req, res) => {
      const user = await tryAuthenticate(req);
      if (!user) {
        res.status(401).json({
          error: "unauthorized",
          message: "Sign in required",
          requiresLogin: true,
        });
        return;
      }

      const meeting = await loadMeetingJoinContextBySlug(requireRouteParam(req.params.slug, 'slug')!);
      if (!meeting) {
        res.status(404).json({ error: "not_found", message: "Meeting not found" });
        return;
      }

      try {
        const { isHost } = assertCanJoinMeeting(meeting, user);
        const live = isMeetingBroadcasting(meeting);
        res.json({
          meetingId: meeting.id,
          title: meeting.title,
          status: meeting.status,
          isLive: live,
          canJoin: true,
          isHost,
          joinPath: `/meetings/${meeting.id}/live`,
          waitingRoomPath: `/meetings/${meeting.id}/live`,
        });
      } catch (err) {
        handleJoinAuthError(res, err);
      }
    }),
  );

  // Public: lightweight meeting preview for the join page (no login required).
  router.get(
    "/meetings/join/:slug/preview",
    asyncHandler(async (req, res) => {
      const meeting = await loadMeetingJoinContextBySlug(requireRouteParam(req.params.slug, "slug")!);
      if (!meeting) {
        res.status(404).json({ error: "not_found", message: "Meeting not found" });
        return;
      }

      res.json({
        meetingId: meeting.id,
        title: meeting.title,
        status: meeting.status,
        isLive: isMeetingBroadcasting(meeting),
        canJoin: canEnterWaitingRoom(meeting),
      });
    }),
  );

  // Public: guest join for invited people without a platform account.
  // The email must be on the meeting's invite list — nobody else can get a token.
  router.post(
    "/meetings/join/:slug/guest",
    asyncHandler(async (req, res) => {
      const body = (req.body ?? {}) as { name?: unknown; email?: unknown };
      const name = typeof body.name === "string" ? body.name.trim() : "";
      const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";

      if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({
          error: "invalid_request",
          message: "Enter your name and the email address that received the invite.",
        });
        return;
      }

      const meeting = await loadMeetingJoinContextBySlug(requireRouteParam(req.params.slug, "slug")!);
      if (!meeting) {
        res.status(404).json({ error: "not_found", message: "Meeting not found" });
        return;
      }

      if (!isEmailInvitedToMeeting(meeting, email)) {
        res.status(403).json({
          error: "not_invited",
          message: "This email is not on the invite list for this meeting. Ask the host to add you.",
        });
        return;
      }

      if (!canEnterWaitingRoom(meeting)) {
        res.status(400).json({
          error: "not_available",
          message: "This meeting is no longer available to join.",
        });
        return;
      }

      await openWaitingRoom(meeting.id);
      const refreshed = await loadMeetingJoinContextBySlug(requireRouteParam(req.params.slug, "slug")!);
      const ctx = refreshed ?? meeting;

      const token = await createLiveKitToken({
        roomName: ctx.id,
        participantName: name,
        participantIdentity: `guest:${email}`,
        canEndMeeting: false,
      });

      res.json({
        meetingId: ctx.id,
        title: ctx.title,
        livekitUrl: resolveLiveKitClientUrl(req.headers.host),
        token,
        roomName: ctx.id,
        isLive: isMeetingBroadcasting(ctx),
        sessionStartedAt: ctx.liveStartedAt?.toISOString() ?? new Date().toISOString(),
      });
    }),
  );

  router.post(
    "/meetings/join/:slug/token",
    authenticate,
    asyncHandler(async (req, res) => {
      const user = requireAuthUser(req);
      const meeting = await loadMeetingJoinContextBySlug(requireRouteParam(req.params.slug, 'slug')!);
      if (!meeting) {
        res.status(404).json({ error: "not_found", message: "Meeting not found" });
        return;
      }

      try {
        assertCanJoinMeeting(meeting, user);
      } catch (err) {
        handleJoinAuthError(res, err);
        return;
      }

      if (!canEnterWaitingRoom(meeting)) {
        res.status(400).json({
          error: "not_available",
          message: "This meeting is no longer available to join.",
        });
        return;
      }

      const { isHost } = assertCanJoinMeeting(meeting, user);
      await openWaitingRoom(meeting.id);
      const refreshed = await loadMeetingJoinContextBySlug(requireRouteParam(req.params.slug, 'slug')!);
      const ctx = refreshed ?? meeting;
      res.json(
        await buildLiveSessionResponse(ctx, user, req.headers.host, {
          isHost,
          isLive: isMeetingBroadcasting(ctx),
        }),
      );
    }),
  );

  const protectedLive = Router();
  protectedLive.use(authenticate);

  protectedLive.post(
    "/meetings/:id/live/start",
    asyncHandler(async (req, res) => {
      const user = requireAuthUser(req);
      try {
        await assertMeetingAccess(user, requireRouteParam(req.params.id, 'id')!);
      } catch (err) {
        handleJoinAuthError(res, err);
        return;
      }

      const meeting = await prisma.meeting.findUnique({
        where: { id: requireRouteParam(req.params.id, 'id') },
      });
      if (!meeting) {
        res.status(404).json({ error: "Meeting not found" });
        return;
      }

      const canOverrideHost =
        user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ORG_ADMIN;
      if (meeting.organizerId && meeting.organizerId !== user.id && !canOverrideHost) {
        res.status(403).json({
          error: "not_host",
          message: "Only the meeting host can start the meeting for everyone.",
        });
        return;
      }

      const joinSlug = meeting.joinSlug ?? (await ensureMeetingJoinSlug(meeting.id));
      await markMeetingLive(meeting.id);

      const updated = await prisma.meeting.findUnique({ where: { id: meeting.id } });
      res.json(
        await buildLiveSessionResponse(
          {
            ...meeting,
            joinSlug,
            liveEndedAt: null,
            liveStartedAt: updated?.liveStartedAt ?? new Date(),
            status: MeetingStatus.ONGOING,
          },
          user,
          req.headers.host,
          { isHost: true, isLive: true },
        ),
      );
    }),
  );

  protectedLive.post(
    "/meetings/:id/live/join",
    asyncHandler(async (req, res) => {
      const user = requireAuthUser(req);
      const meeting = await loadMeetingJoinContextById(requireRouteParam(req.params.id, 'id')!);
      if (!meeting) {
        res.status(404).json({ error: "Meeting not found" });
        return;
      }

      try {
        const { isHost } = assertCanJoinMeeting(meeting, user);
        if (!canEnterWaitingRoom(meeting)) {
          res.status(400).json({
            error: "not_available",
            message: "This meeting is no longer available to join.",
          });
          return;
        }

        await openWaitingRoom(meeting.id);
        const refreshed = await loadMeetingJoinContextById(meeting.id);
        const ctx = refreshed ?? meeting;

        res.json(
          await buildLiveSessionResponse(ctx, user, req.headers.host, {
            isHost,
            isLive: isMeetingBroadcasting(ctx),
          }),
        );
      } catch (err) {
        handleJoinAuthError(res, err);
      }
    }),
  );

  protectedLive.post(
    "/meetings/:id/live/token",
    asyncHandler(async (req, res) => {
      const user = requireAuthUser(req);
      const meeting = await loadMeetingJoinContextById(requireRouteParam(req.params.id, 'id')!);
      if (!meeting) {
        res.status(404).json({ error: "Meeting not found" });
        return;
      }

      try {
        const { isHost } = assertCanJoinMeeting(meeting, user);
        if (!canEnterWaitingRoom(meeting)) {
          res.status(400).json({
            error: "not_available",
            message: "Meeting is not available",
          });
          return;
        }

        await openWaitingRoom(meeting.id);
        const refreshed = await loadMeetingJoinContextById(meeting.id);
        const ctx = refreshed ?? meeting;

        const session = await buildLiveSessionResponse(ctx, user, req.headers.host, {
          isHost,
          isLive: isMeetingBroadcasting(ctx),
        });
        res.json({
          livekitUrl: session.livekitUrl,
          token: session.token,
          roomName: session.roomName,
          isLive: session.isLive,
        });
      } catch (err) {
        handleJoinAuthError(res, err);
      }
    }),
  );

  protectedLive.get(
    "/meetings/:id/live/status",
    asyncHandler(async (req, res) => {
      const user = requireAuthUser(req);
      const meeting = await loadMeetingJoinContextById(requireRouteParam(req.params.id, 'id')!);
      if (!meeting) {
        res.status(404).json({ error: "Meeting not found" });
        return;
      }

      try {
        assertCanJoinMeeting(meeting, user);
      } catch (err) {
        handleJoinAuthError(res, err);
        return;
      }

      res.json({
        isLive: isMeetingBroadcasting(meeting),
        sessionOpen: isSessionOpen(meeting),
        status: meeting.status,
      });
    }),
  );

  protectedLive.get(
    "/meetings/:id/live/notes",
    asyncHandler(async (req, res) => {
      const user = requireAuthUser(req);
      try {
        await assertMeetingAccess(user, requireRouteParam(req.params.id, 'id')!);
      } catch (err) {
        handleJoinAuthError(res, err);
        return;
      }
      res.json({ notes: getLiveMeetingNotes(requireRouteParam(req.params.id, 'id')!) });
    }),
  );

  protectedLive.post(
    "/meetings/:id/live/end",
    asyncHandler(async (req, res) => {
      const user = requireAuthUser(req);
      try {
        await assertMeetingAccess(user, requireRouteParam(req.params.id, 'id')!);
      } catch (err) {
        handleJoinAuthError(res, err);
        return;
      }

      const meeting = await prisma.meeting.findUnique({ where: { id: requireRouteParam(req.params.id, 'id') } });
      if (!meeting) {
        res.status(404).json({ error: "Meeting not found" });
        return;
      }

      const { getLiveSessionHost } = await import("../socket/live-meeting.js");
      const sessionHost = getLiveSessionHost(meeting.id);
      const isSessionHost = sessionHost?.userId === user.id;
      const isOrganizer = meeting.organizerId === user.id;
      const canOverrideHost =
        user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ORG_ADMIN;
      if (!isOrganizer && !isSessionHost && !canOverrideHost) {
        res.status(403).json({
          error: "not_host",
          message: "Only the meeting host can end the meeting for everyone.",
        });
        return;
      }

      if (!isSessionOpen(meeting)) {
        res.status(400).json({
          error: "not_live",
          message: "This meeting session is already closed.",
        });
        return;
      }

      const result = await endLiveSessionForMeeting(meeting.id);
      if (!result.ended) {
        res.status(400).json({
          error: "not_live",
          message: "Could not end the meeting session.",
        });
        return;
      }

      res.json({
        ok: true,
        socketNotes: result.socketNotes,
        message: "Live session ended. Upload recording to complete MOM generation.",
      });
    }),
  );

  router.use(protectedLive);

  return router;
}
