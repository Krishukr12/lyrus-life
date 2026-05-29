import { UserRole, prisma } from "@lyrus/db";

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
  user: { id: string; email: string; role: UserRole },
  meetingId: string,
): Promise<void> {
  if (user.role === UserRole.ADMIN) return;

  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    select: {
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

  if (!isOrganizer && !isParticipant) {
    throw new HttpAuthError(403, "forbidden", "You're not authorized to do so");
  }
}

export function meetingsListWhere(user: { id: string; email: string; role: UserRole }) {
  if (user.role === UserRole.ADMIN) {
    return {};
  }
  return {
    OR: [
      { organizerId: user.id },
      { participants: { some: { email: { equals: user.email, mode: "insensitive" as const } } } },
    ],
  };
}
