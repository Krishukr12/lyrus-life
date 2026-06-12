import { PipelineStep, prisma, type Prisma } from "@lyrus/db";
import type { PipelineStepType } from "../types/enums.js";

export async function logAudit(
  meetingId: string | null,
  action: PipelineStepType,
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
