import { UserRole, prisma } from "@lyrus/db";

type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
import { isEmailDomainAllowed } from "./auth-config.js";
import { HttpAuthError } from "./meeting-access.js";

export type MeetingJoinContext = {
  id: string;
  title: string;
  organizerId: string | null;
  joinSlug: string | null;
  status: string;
  liveStartedAt: Date | null;
  liveBroadcastAt: Date | null;
  liveEndedAt: Date | null;
  organizer: { email: string } | null;
  participants: { email: string }[];
  invites: { email: string }[];
};

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isEmailInvitedToMeeting(meeting: MeetingJoinContext, email: string): boolean {
  const normalized = normalizeEmail(email);
  if (meeting.organizer?.email && normalizeEmail(meeting.organizer.email) === normalized) {
    return true;
  }
  if (meeting.participants.some((p) => normalizeEmail(p.email) === normalized)) {
    return true;
  }
  if (meeting.invites.some((i) => normalizeEmail(i.email) === normalized)) {
    return true;
  }
  return false;
}

export function assertEmailAllowedForOrganization(email: string): void {
  if (!isEmailDomainAllowed(email)) {
    throw new HttpAuthError(
      403,
      "org_forbidden",
      "Only people with your organization email can join meetings on this platform.",
    );
  }
}

export function assertInvitedToMeeting(meeting: MeetingJoinContext, email: string): void {
  if (!isEmailInvitedToMeeting(meeting, email)) {
    throw new HttpAuthError(
      403,
      "not_invited",
      "You are not on the invite list for this meeting. Ask the host to add your email.",
    );
  }
}

export function assertCanJoinMeeting(
  meeting: MeetingJoinContext,
  user: { id: string; email: string; role: UserRoleType },
): { isHost: boolean } {
  assertEmailAllowedForOrganization(user.email);
  assertInvitedToMeeting(meeting, user.email);

  const isHost =
    user.role === UserRole.SUPER_ADMIN ||
    user.role === UserRole.ORG_ADMIN ||
    meeting.organizerId === user.id ||
    Boolean(
      meeting.organizer?.email && normalizeEmail(meeting.organizer.email) === normalizeEmail(user.email),
    );

  return { isHost };
}

const meetingJoinSelect = {
  id: true,
  title: true,
  organizerId: true,
  joinSlug: true,
  status: true,
  liveStartedAt: true,
  liveBroadcastAt: true,
  liveEndedAt: true,
  organizer: { select: { email: true } },
  participants: { select: { email: true } },
  invites: { select: { email: true } },
} as const;

export async function loadMeetingJoinContextBySlug(slug: string): Promise<MeetingJoinContext | null> {
  return prisma.meeting.findUnique({
    where: { joinSlug: slug },
    select: meetingJoinSelect,
  });
}

export async function loadMeetingJoinContextById(meetingId: string): Promise<MeetingJoinContext | null> {
  return prisma.meeting.findUnique({
    where: { id: meetingId },
    select: meetingJoinSelect,
  });
}

export async function ensureMeetingJoinSlug(meetingId: string): Promise<string> {
  const { generateJoinSlug } = await import("./join-slug.js");
  const existing = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: { joinSlug: true },
  });
  if (existing?.joinSlug) return existing.joinSlug;
  const joinSlug = generateJoinSlug();
  await prisma.meeting.update({
    where: { id: meetingId },
    data: { joinSlug },
  });
  return joinSlug;
}
