import type { Meeting } from "@/lib/types";

export type MomStakeholderStatus =
  | "none"
  | "awaiting_approval"
  | "not_shared"
  | "shared";

/** Cutover for calendar/external meetings — only generate MOM after calendar was connected. */
export type MomEligibilityContext = {
  googleConnectedAt?: string | null;
  microsoftConnectedAt?: string | null;
};

export function momEligibilityFromIntegrations(
  integrations: Array<{
    provider: string;
    connected: boolean;
    connectedAt: string | null;
  }>,
): MomEligibilityContext {
  const google = integrations.find((i) => i.provider === "google" && i.connected);
  const microsoft = integrations.find((i) => i.provider === "microsoft" && i.connected);
  return {
    googleConnectedAt: google?.connectedAt ?? null,
    microsoftConnectedAt: microsoft?.connectedAt ?? null,
  };
}

export function getMomStakeholderStatus(meeting: Meeting): MomStakeholderStatus {
  if (!meeting.mom) return "none";
  if (!meeting.mom.approved) return "awaiting_approval";
  if (!meeting.mom.shared) return "not_shared";
  return "shared";
}

function isExternalOrCalendarMeeting(meeting: Meeting): boolean {
  return (
    Boolean(meeting.calendarEventId) ||
    meeting.platform === "google_meet" ||
    meeting.platform === "microsoft_teams"
  );
}

function meetingStartMs(meeting: Meeting): number {
  if (meeting.scheduledAt) {
    const t = new Date(meeting.scheduledAt).getTime();
    if (!Number.isNaN(t)) return t;
  }
  const fallback = new Date(`${meeting.date}T${meeting.time || "00:00"}:00`).getTime();
  return Number.isNaN(fallback) ? 0 : fallback;
}

function connectedAtForMeeting(
  meeting: Meeting,
  ctx?: MomEligibilityContext,
): string | null | undefined {
  if (meeting.platform === "microsoft_teams") {
    return ctx?.microsoftConnectedAt ?? ctx?.googleConnectedAt;
  }
  if (meeting.platform === "google_meet") {
    return ctx?.googleConnectedAt ?? ctx?.microsoftConnectedAt;
  }
  // Calendar import without clear platform — prefer Google, then Microsoft
  return ctx?.googleConnectedAt ?? ctx?.microsoftConnectedAt;
}

/**
 * External/calendar meetings that ended before calendar sync existed
 * were never recorded — don't ask to generate a MOM for them.
 */
export function isEligibleForMomGeneration(
  meeting: Meeting,
  ctx?: MomEligibilityContext,
): boolean {
  if (!isExternalOrCalendarMeeting(meeting)) return true;
  const connectedAt = connectedAtForMeeting(meeting, ctx);
  if (!connectedAt) return false;
  const connectedMs = new Date(connectedAt).getTime();
  if (Number.isNaN(connectedMs)) return false;
  return meetingStartMs(meeting) >= connectedMs;
}

/** MOM still needs to be generated, approved, or sent to stakeholders. */
export function needsMomStakeholderAction(
  meeting: Meeting,
  ctx?: MomEligibilityContext,
): boolean {
  const status = getMomStakeholderStatus(meeting);
  // Existing drafts always stay in the queue until approved/sent
  if (status === "awaiting_approval" || status === "not_shared") return true;
  if (meeting.status === "completed" && status === "none") {
    return isEligibleForMomGeneration(meeting, ctx);
  }
  return false;
}

export function momStakeholderStatusLabel(status: MomStakeholderStatus): string {
  switch (status) {
    case "none":
      return "MOM not generated";
    case "awaiting_approval":
      return "Awaiting approval";
    case "not_shared":
      return "Not sent to stakeholders";
    case "shared":
      return "Sent to stakeholders";
  }
}

export function filterMeetingsPendingMom(
  meetings: Meeting[],
  ctx?: MomEligibilityContext,
): Meeting[] {
  return meetings
    .filter((m) => needsMomStakeholderAction(m, ctx))
    .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
}
