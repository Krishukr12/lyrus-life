import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";

const SOCKET_ORIGIN = import.meta.env.VITE_SOCKET_URL ?? window.location.origin;

export type LiveMeetingParticipant = {
  userId: string;
  userName: string;
};

export function useLiveMeetingSocket(
  meetingId: string | null,
  options: {
    userId: string | null;
    userName: string | null;
    claimHost?: boolean;
    onRemoteNotes: (text: string) => void;
    onMeetingStarted?: () => void;
    onMeetingAutoEnded?: (message: string) => void;
  },
) {
  const { userId, userName, claimHost = false, onRemoteNotes, onMeetingStarted, onMeetingAutoEnded } =
    options;
  const socketRef = useRef<Socket | null>(null);
  const onRemoteNotesRef = useRef(onRemoteNotes);
  onRemoteNotesRef.current = onRemoteNotes;
  const onMeetingStartedRef = useRef(onMeetingStarted);
  onMeetingStartedRef.current = onMeetingStarted;
  const onMeetingAutoEndedRef = useRef(onMeetingAutoEnded);
  onMeetingAutoEndedRef.current = onMeetingAutoEnded;

  const [hostUserId, setHostUserId] = useState<string | null>(null);
  const [hostName, setHostName] = useState<string | null>(null);
  const [participants, setParticipants] = useState<LiveMeetingParticipant[]>([]);

  useEffect(() => {
    if (!meetingId || !userId || !userName) return;

    const socket = io(SOCKET_ORIGIN, {
      path: "/socket.io",
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("meeting:join", { meetingId, userId, userName, claimHost });
    });

    socket.on("notes:sync", (payload: { text?: string }) => {
      onRemoteNotesRef.current(payload?.text ?? "");
    });

    socket.on("host:sync", (payload: { hostUserId?: string; hostName?: string }) => {
      if (payload.hostUserId) setHostUserId(payload.hostUserId);
      if (payload.hostName) setHostName(payload.hostName);
    });

    socket.on("host:transferred", (payload: {
      hostUserId?: string;
      hostName?: string;
      previousHostName?: string;
    }) => {
      if (payload.hostUserId) setHostUserId(payload.hostUserId);
      if (payload.hostName) setHostName(payload.hostName);
      if (payload.hostUserId === userId) {
        toast.info("You are now the meeting host", {
          description: `${payload.previousHostName ?? "The previous host"} left the call.`,
        });
      } else if (payload.hostName) {
        toast.message(`${payload.hostName} is now the host`);
      }
    });

    socket.on("participants:sync", (payload: { participants?: LiveMeetingParticipant[] }) => {
      setParticipants(payload?.participants ?? []);
    });

    socket.on("meeting:started", () => {
      onMeetingStartedRef.current?.();
    });

    socket.on("meeting:auto-ended", (payload: { message?: string }) => {
      onMeetingAutoEndedRef.current?.(
        payload?.message ??
          "The live session ended because everyone left and no one rejoined within 5 minutes.",
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [meetingId, userId, userName, claimHost]);

  const publishNotes = useCallback((text: string) => {
    socketRef.current?.emit("notes:update", { text });
  }, []);

  const isLocalHost = Boolean(userId && hostUserId && userId === hostUserId);

  return { publishNotes, hostUserId, hostName, participants, isLocalHost };
}
