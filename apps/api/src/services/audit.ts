import { PipelineStep, prisma, type Prisma } from "@lyrus/db";

export async function logAudit(
  meetingId: string | null,
  action: PipelineStep,
  details?: Prisma.InputJsonValue,
  userId?: string,
) {
  await prisma.auditLog.create({
    data: {
      meetingId: meetingId ?? undefined,
      userId,
      action,
      details,
    },
  });
}
