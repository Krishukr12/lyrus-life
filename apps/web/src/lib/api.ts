import { CreateMeetingResponse, Meeting, MOM, UserTask } from "./types";
import { getApiAuthHandlers } from "./auth-handlers";
import { getAccessToken } from "./token-store";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
  }
}

function buildAuthHeaders(extra?: HeadersInit): HeadersInit {
  const token = getAccessToken();
  return {
    ...(extra ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const hasJsonBody = init?.body != null && init.body !== "";
  const headers: HeadersInit = buildAuthHeaders({
    ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
    ...(init?.headers ?? {}),
  });

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    let message = response.statusText;
    let code: string | undefined;
    try {
      const body = (await response.json()) as { error?: unknown; message?: string };
      if (typeof body.error === "string") code = body.error;
      if (body.message) {
        message = body.message;
      } else if (body.error && typeof body.error !== "string") {
        message = JSON.stringify(body.error);
      }
    } catch {
      // ignore parse errors
    }

    if (response.status === 401) {
      getApiAuthHandlers().onUnauthorized?.();
    }
    if (response.status === 403) {
      if (code === "organization_suspended" || code === "organization_pending") {
        getApiAuthHandlers().onOrganizationBlocked?.(message);
      } else {
        getApiAuthHandlers().onForbidden?.();
      }
    }

    throw new ApiError(message, response.status, code);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

async function multipartRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: buildAuthHeaders(init.headers),
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = (await response.json()) as { error?: string; message?: string };
      if (body.message) message = body.message;
      else if (body.error) message = body.error;
    } catch {
      // ignore
    }

    if (response.status === 401) {
      getApiAuthHandlers().onUnauthorized?.();
    }
    if (response.status === 403) {
      getApiAuthHandlers().onForbidden?.();
    }

    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export async function getMeetings(): Promise<Meeting[]> {
  return request<Meeting[]>("/meetings");
}

export interface PersonSuggestion {
  name: string;
  email: string;
  source: "team" | "recent";
}

export async function getPeopleSuggestions(query: string): Promise<PersonSuggestion[]> {
  return request<PersonSuggestion[]>(
    `/people/suggestions${query ? `?q=${encodeURIComponent(query)}` : ""}`,
  );
}

export async function getMeeting(id: string): Promise<Meeting | undefined> {
  try {
    return await request<Meeting>(`/meetings/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return undefined;
    throw e;
  }
}

export async function reprovisionExternalMeeting(meetingId: string): Promise<Meeting> {
  return request<Meeting>(`/meetings/${meetingId}/external/reprovision`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function syncMeetingRecording(meetingId: string): Promise<{
  result: "ingested" | "pending" | "failed" | "none";
  meeting: Meeting;
}> {
  return request<{ result: "ingested" | "pending" | "failed" | "none"; meeting: Meeting }>(
    `/meetings/${meetingId}/recording/sync`,
    { method: "POST", body: JSON.stringify({}) },
  );
}

export async function rescheduleMeetingRecordingBot(meetingId: string): Promise<Meeting> {
  return request<Meeting>(`/meetings/${meetingId}/recording/bot`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function createMeeting(
  data: Omit<Meeting, "id" | "status" | "notes" | "mom"> & {
    platform?: "lyrus" | "google_meet" | "microsoft_teams";
  },
): Promise<CreateMeetingResponse> {
  return request<CreateMeetingResponse>("/meetings", {
    method: "POST",
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      date: data.date,
      time: data.time,
      duration: data.duration,
      tag: data.tag,
      platform: data.platform ?? "lyrus",
      stakeholders: data.stakeholders,
      notes: "",
    }),
  });
}

export async function resendMeetingInvites(meetingId: string): Promise<CreateMeetingResponse> {
  return request<CreateMeetingResponse>(`/meetings/${meetingId}/invites/resend`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function updateMeeting(id: string, updates: Partial<Meeting>): Promise<Meeting> {
  return request<Meeting>(`/meetings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function uploadMeetingAudio(meetingId: string, file: File): Promise<void> {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${API_BASE}/meetings/${meetingId}/audio`, {
    method: "POST",
    credentials: "include",
    headers: buildAuthHeaders(),
    body: form,
  });

  if (!response.ok) {
    if (response.status === 401) getApiAuthHandlers().onUnauthorized?.();
    if (response.status === 403) getApiAuthHandlers().onForbidden?.();
    throw new ApiError("Failed to upload audio", response.status);
  }
}

export async function processMeeting(meetingId: string): Promise<void> {
  await request(`/meetings/${meetingId}/process`, { method: "POST" });
}

export interface CompleteMeetingResponse {
  ok: boolean;
  meeting: Meeting;
  transcriptSource?: string;
}

export async function completeMeetingWithRecording(
  meetingId: string,
  recording: Blob | null,
  notes: string,
): Promise<CompleteMeetingResponse> {
  const form = new FormData();
  if (notes.trim()) {
    form.append("notes", notes);
  }
  if (recording && recording.size > 0) {
    form.append("recording", recording, `meeting-${meetingId}.webm`);
  }

  return multipartRequest<CompleteMeetingResponse>(`/meetings/${meetingId}/complete`, {
    method: "POST",
    body: form,
  });
}

export async function generateMOM(meetingId: string): Promise<MOM> {
  return request<MOM>(`/meetings/${meetingId}/mom/generate`, { method: "POST" });
}

export async function shareMOM(meetingId: string): Promise<void> {
  await approveMOM(meetingId);
}

export async function editMOM(
  meetingId: string,
  updates: Pick<MOM, "keyPoints" | "actionItems">,
): Promise<MOM> {
  return request<MOM>(`/meetings/${meetingId}/mom`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function approveMOM(meetingId: string): Promise<MOM> {
  return request<MOM>(`/meetings/${meetingId}/mom/approve`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function getTasks(): Promise<UserTask[]> {
  return request<UserTask[]>("/tasks");
}

export async function updateTask(id: string, updates: Partial<UserTask>): Promise<UserTask> {
  return request<UserTask>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export function getTasksDueReminders(): UserTask[] {
  return [];
}

export interface PlatformInsights {
  meetingCount: number;
  taskCount: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
  recentMeetings: Array<{
    id: string;
    title: string;
    hasMom: boolean;
    openTasks: number;
  }>;
}

export async function getPlatformInsights(): Promise<PlatformInsights> {
  return request<PlatformInsights>("/insights");
}
