import { CreateMeetingResponse, Meeting, MOM, UserTask } from "./types";
import { getCurrentUserDisplayName } from "./current-user";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const hasJsonBody = init?.body != null && init.body !== "";
  const headers: HeadersInit = {
    ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
    ...(init?.headers ?? {}),
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = (await response.json()) as { error?: unknown };
      if (body.error) {
        message =
          typeof body.error === "string"
            ? body.error
            : JSON.stringify(body.error);
      }
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getMeetings(): Promise<Meeting[]> {
  return request<Meeting[]>("/meetings");
}

export async function getMeeting(id: string): Promise<Meeting | undefined> {
  try {
    return await request<Meeting>(`/meetings/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return undefined;
    throw e;
  }
}

export async function createMeeting(
  data: Omit<Meeting, "id" | "status" | "notes" | "mom">,
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
    body: form,
  });

  if (!response.ok) {
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

  const response = await fetch(`${API_BASE}/meetings/${meetingId}/complete`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore
    }
    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<CompleteMeetingResponse>;
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
    body: JSON.stringify({ approvedBy: getCurrentUserDisplayName() }),
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
