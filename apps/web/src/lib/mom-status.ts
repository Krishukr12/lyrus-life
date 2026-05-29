import type { Meeting } from "@/lib/types";

export type MomStakeholderStatus =
  | "none"
  | "awaiting_approval"
  | "not_shared"
  | "shared";

export function getMomStakeholderStatus(meeting: Meeting): MomStakeholderStatus {
  if (!meeting.mom) return "none";
  if (!meeting.mom.approved) return "awaiting_approval";
  if (!meeting.mom.shared) return "not_shared";
  return "shared";
}

/** MOM still needs to be generated, approved, or sent to stakeholders. */
export function needsMomStakeholderAction(meeting: Meeting): boolean {
  const status = getMomStakeholderStatus(meeting);
  if (status === "awaiting_approval" || status === "not_shared") return true;
  if (meeting.status === "completed" && status === "none") return true;
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

export function filterMeetingsPendingMom(meetings: Meeting[]): Meeting[] {
  return meetings
    .filter(needsMomStakeholderAction)
    .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
}
