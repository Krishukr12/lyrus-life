import { UserRole, prisma } from "@lyrus/db";

type Role = (typeof UserRole)[keyof typeof UserRole];

export class HttpAuthError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export async function assertMeetingAccess(
  user: { id: string; email: string; role: Role; organizationId: string | null },
  meetingId: string,
): Promise<void> {
  if (user.role === UserRole.SUPER_ADMIN) return;

  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: {
      organizationId: true,
      organizerId: true,
      participants: { select: { email: true } },
    },
  });

  if (!meeting) {
    throw new HttpAuthError(404, "not_found", "Meeting not found");
  }

  const isOrganizer = meeting.organizerId === user.id;
  const isParticipant = meeting.participants.some(
    (p) => p.email.toLowerCase() === user.email.toLowerCase(),
  );

  // Invited participants and organizers always have access — even when the
  // meeting belongs to a different organization (cross-org invites).
  if (isOrganizer || isParticipant) return;

  // Org admins and managers additionally have access to all meetings of their own org.
  if (
    (user.role === UserRole.ORG_ADMIN || user.role === UserRole.MANAGER) &&
    user.organizationId &&
    meeting.organizationId === user.organizationId
  ) {
    return;
  }

  throw new HttpAuthError(403, "forbidden", "You're not authorized to do so");
}

export function meetingsListWhere(user: {
  id: string;
  email: string;
  role: Role;
  organizationId: string | null;
}) {
  if (user.role === UserRole.SUPER_ADMIN) {
    return {};
  }

  // Meetings the user organizes or is invited to by email — regardless of
  // which organization the meeting belongs to (cross-org invites).
  const invitedOr = [
    { organizerId: user.id },
    { participants: { some: { email: { equals: user.email, mode: "insensitive" as const } } } },
  ];

  if (
    (user.role === UserRole.ORG_ADMIN || user.role === UserRole.MANAGER) &&
    user.organizationId
  ) {
    return { OR: [{ organizationId: user.organizationId }, ...invitedOr] };
  }

  return { OR: invitedOr };
}
