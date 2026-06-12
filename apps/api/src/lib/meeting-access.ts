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

  if (user.role === UserRole.ORG_ADMIN || user.role === UserRole.MANAGER) {
    if (!user.organizationId || meeting.organizationId !== user.organizationId) {
      throw new HttpAuthError(403, "forbidden", "You're not authorized to do so");
    }
    return;
  }

  if (user.role === UserRole.VIEWER) {
    if (!user.organizationId || meeting.organizationId !== user.organizationId) {
      throw new HttpAuthError(403, "forbidden", "You're not authorized to do so");
    }
    const isParticipant = meeting.participants.some(
      (p) => p.email.toLowerCase() === user.email.toLowerCase(),
    );
    if (meeting.organizerId !== user.id && !isParticipant) {
      throw new HttpAuthError(403, "forbidden", "You're not authorized to do so");
    }
    return;
  }

  const isOrganizer = meeting.organizerId === user.id;
  const isParticipant = meeting.participants.some(
    (p) => p.email.toLowerCase() === user.email.toLowerCase(),
  );

  if (meeting.organizationId && meeting.organizationId !== user.organizationId) {
    throw new HttpAuthError(403, "forbidden", "You're not authorized to do so");
  }

  if (!isOrganizer && !isParticipant) {
    throw new HttpAuthError(403, "forbidden", "You're not authorized to do so");
  }
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

  if (
    (user.role === UserRole.ORG_ADMIN || user.role === UserRole.MANAGER) &&
    user.organizationId
  ) {
    return { organizationId: user.organizationId };
  }

  if (!user.organizationId) {
    return { id: "__none__" };
  }

  if (user.role === UserRole.VIEWER) {
    return {
      organizationId: user.organizationId,
      participants: {
        some: { email: { equals: user.email, mode: "insensitive" as const } },
      },
    };
  }

  return {
    organizationId: user.organizationId,
    OR: [
      { organizerId: user.id },
      { participants: { some: { email: { equals: user.email, mode: "insensitive" as const } } } },
    ],
  };
}
