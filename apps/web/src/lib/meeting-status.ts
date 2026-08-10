import type { Meeting, MeetingStatus } from "@/lib/types";

/**
 * Keep UI status honest when the API/DB still says "upcoming" after end time
 * (common for Google Calendar imports that never ran a pipeline).
 */
export function resolveMeetingStatus(
  meeting: Pick<Meeting, "status" | "scheduledAt" | "date" | "time" | "duration">,
  now = new Date(),
): MeetingStatus {
  if (meeting.status === "completed") return "completed";

  const startMs = meeting.scheduledAt
    ? Date.parse(meeting.scheduledAt)
    : Date.parse(`${meeting.date}T${meeting.time || "00:00"}:00`);
  if (Number.isNaN(startMs)) return meeting.status;

  const endMs = startMs + Math.max(meeting.duration || 60, 1) * 60_000;
  const nowMs = now.getTime();

  if (nowMs < startMs) return "upcoming";
  if (nowMs < endMs) return "ongoing";
  return "completed";
}

export function withResolvedMeetingStatus<T extends Meeting>(meeting: T, now = new Date()): T {
  return { ...meeting, status: resolveMeetingStatus(meeting, now) };
}
