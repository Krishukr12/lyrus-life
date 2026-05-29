const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export interface LiveSessionStart {
  joinSlug: string;
  joinUrl: string;
  livekitUrl: string;
  token: string;
  roomName: string;
  isLive: boolean;
  isHost: boolean;
  /** ISO time when the session / waiting room opened (for elapsed timer). */
  sessionStartedAt: string;
}

export interface JoinMeetingAccess {
  meetingId: string;
  title: string;
  status: string;
  isLive: boolean;
  canJoin: boolean;
  isHost: boolean;
  joinPath: string;
  requiresLogin?: boolean;
}

export interface LiveJoinToken {
  livekitUrl: string;
  token: string;
  roomName: string;
  meetingId: string;
}

async function liveRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const hasJsonBody = init?.body != null && init.body !== "";
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = (await response.json()) as { message?: string; error?: string };
      if (body.message) message = body.message;
      else if (body.error) message = typeof body.error === "string" ? body.error : JSON.stringify(body.error);
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

async function authLiveRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const { getAccessToken } = await import("./token-store");
  const token = getAccessToken();
  return liveRequest<T>(path, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export async function startLiveMeeting(meetingId: string): Promise<LiveSessionStart> {
  return authLiveRequest<LiveSessionStart>(`/meetings/${meetingId}/live/start`, { method: "POST" });
}

/** Join a meeting that is already live (invited participants — does not start the room). */
export async function joinLiveMeeting(meetingId: string): Promise<LiveSessionStart> {
  return authLiveRequest<LiveSessionStart>(`/meetings/${meetingId}/live/join`, { method: "POST" });
}

export async function refreshLiveToken(meetingId: string): Promise<Omit<LiveSessionStart, "joinSlug" | "joinUrl">> {
  return authLiveRequest(`/meetings/${meetingId}/live/token`, { method: "POST" });
}

export async function endLiveSession(meetingId: string): Promise<{ ok: boolean; socketNotes: string }> {
  return authLiveRequest(`/meetings/${meetingId}/live/end`, { method: "POST" });
}

export async function getJoinMeetingAccess(slug: string): Promise<JoinMeetingAccess> {
  return authLiveRequest<JoinMeetingAccess>(`/meetings/join/${slug}`);
}

export async function getLiveMeetingStatus(
  meetingId: string,
): Promise<{ isLive: boolean; status: string }> {
  return authLiveRequest(`/meetings/${meetingId}/live/status`);
}
