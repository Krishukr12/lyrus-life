import type { Server as HttpServer } from "node:http";
import type { Server, Socket } from "socket.io";
import { Server as SocketIOServer } from "socket.io";
const meetingNotes = new Map<string, string>();

/** Grace period after last person leaves before auto-ending (default 3s). Set to 300000 for 5 minutes. */
const EMPTY_ROOM_AUTO_END_MS = Number(process.env.LIVE_EMPTY_ROOM_MS ?? 3000);

type LiveParticipant = {
  socketId: string;
  userId: string;
  userName: string;
  joinedAt: number;
};

type LiveRoomState = {
  hostUserId: string;
  hostName: string;
  participants: Map<string, LiveParticipant>;
};

const liveRooms = new Map<string, LiveRoomState>();
const emptyRoomTimers = new Map<string, NodeJS.Timeout>();
let io: Server | null = null;

export function getLiveMeetingNotes(meetingId: string): string {
  return meetingNotes.get(meetingId) ?? "";
}

export function clearLiveMeetingNotes(meetingId: string): string {
  const notes = meetingNotes.get(meetingId) ?? "";
  meetingNotes.delete(meetingId);
  cancelEmptyRoomTimer(meetingId);
  liveRooms.delete(meetingId);
  return notes;
}

function cancelEmptyRoomTimer(meetingId: string) {
  const timer = emptyRoomTimers.get(meetingId);
  if (timer) {
    clearTimeout(timer);
    emptyRoomTimers.delete(meetingId);
  }
}

export function getLiveSessionHost(meetingId: string): { userId: string; name: string } | null {
  const room = liveRooms.get(meetingId);
  if (!room?.hostUserId) return null;
  return { userId: room.hostUserId, name: room.hostName };
}

export function getLiveRoomParticipantCount(meetingId: string): number {
  return liveRooms.get(meetingId)?.participants.size ?? 0;
}

function roomId(meetingId: string) {
  return `meeting:${meetingId}`;
}

function scheduleEmptyRoomAutoEnd(meetingId: string) {
  cancelEmptyRoomTimer(meetingId);
  const timer = setTimeout(() => {
    emptyRoomTimers.delete(meetingId);
    void import("../services/live-session.js").then(({ endLiveSessionForMeeting }) =>
      endLiveSessionForMeeting(meetingId, { auto: true, reason: "empty_room" }),
    );
  }, EMPTY_ROOM_AUTO_END_MS);
  emptyRoomTimers.set(meetingId, timer);
}

function onRoomParticipantChange(meetingId: string) {
  const count = getLiveRoomParticipantCount(meetingId);
  if (count === 0) {
    scheduleEmptyRoomAutoEnd(meetingId);
  } else {
    cancelEmptyRoomTimer(meetingId);
  }
}

export function emitMeetingStarted(meetingId: string) {
  io?.to(roomId(meetingId)).emit("meeting:started", { meetingId });
}

export function emitMeetingAutoEnded(meetingId: string, reason: string, message: string) {
  io?.to(roomId(meetingId)).emit("meeting:auto-ended", {
    meetingId,
    reason,
    message,
  });
}

function broadcastHost(meetingId: string) {
  const room = liveRooms.get(meetingId);
  if (!room || !io) return;
  io.to(roomId(meetingId)).emit("host:sync", {
    hostUserId: room.hostUserId,
    hostName: room.hostName,
  });
}

function broadcastParticipants(meetingId: string) {
  const room = liveRooms.get(meetingId);
  if (!room || !io) return;
  io.to(roomId(meetingId)).emit("participants:sync", {
    participants: [...room.participants.values()].map((p) => ({
      userId: p.userId,
      userName: p.userName,
    })),
  });
}

function electNewHost(meetingId: string, excludingSocketId: string) {
  const room = liveRooms.get(meetingId);
  if (!room) return null;

  const remaining = [...room.participants.values()]
    .filter((p) => p.socketId !== excludingSocketId)
    .sort((a, b) => a.joinedAt - b.joinedAt);

  if (remaining.length === 0) {
    return null;
  }

  const next = remaining[0]!;
  room.hostUserId = next.userId;
  room.hostName = next.userName;
  return next;
}

export function registerLiveMeetingSocket(socketServer: Server) {
  socketServer.on("connection", (socket: Socket) => {
    let meetingId: string | null = null;

    socket.on(
      "meeting:join",
      (payload: { meetingId: string; userId: string; userName: string; claimHost?: boolean }) => {
        if (!payload?.meetingId || !payload.userId) return;

        meetingId = payload.meetingId;
        socket.join(roomId(meetingId));

        let room = liveRooms.get(meetingId);
        if (!room) {
          room = {
            hostUserId: payload.userId,
            hostName: payload.userName,
            participants: new Map(),
          };
          liveRooms.set(meetingId, room);
        } else if (payload.claimHost) {
          room.hostUserId = payload.userId;
          room.hostName = payload.userName;
        }

        room.participants.set(socket.id, {
          socketId: socket.id,
          userId: payload.userId,
          userName: payload.userName,
          joinedAt: Date.now(),
        });

        cancelEmptyRoomTimer(meetingId);

        socket.emit("notes:sync", { text: meetingNotes.get(meetingId) ?? "" });
        broadcastHost(meetingId);
        broadcastParticipants(meetingId);
      },
    );

    socket.on("notes:update", (payload: { text: string }) => {
      if (!meetingId) return;
      meetingNotes.set(meetingId, payload.text ?? "");
      socket.to(roomId(meetingId)).emit("notes:sync", { text: payload.text ?? "" });
    });

    socket.on("disconnect", () => {
      if (!meetingId) return;
      const room = liveRooms.get(meetingId);
      if (!room) return;

      const leaving = room.participants.get(socket.id);
      room.participants.delete(socket.id);

      if (leaving && leaving.userId === room.hostUserId && room.participants.size > 0) {
        const next = electNewHost(meetingId, socket.id);
        if (next) {
          socketServer.to(roomId(meetingId)).emit("host:transferred", {
            hostUserId: next.userId,
            hostName: next.userName,
            previousHostName: leaving.userName,
          });
        }
      }

      if (room.participants.size === 0) {
        liveRooms.delete(meetingId);
        onRoomParticipantChange(meetingId);
      } else {
        broadcastHost(meetingId);
        broadcastParticipants(meetingId);
      }
    });
  });
}

export function attachLiveMeetingSocket(httpServer: HttpServer, corsOrigins: string[]) {
  if (io) return io;
  io = new SocketIOServer(httpServer, {
    path: "/socket.io",
    cors: {
      origin: corsOrigins,
      credentials: true,
    },
  });
  registerLiveMeetingSocket(io);
  return io;
}
