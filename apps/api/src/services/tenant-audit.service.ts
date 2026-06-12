import { prisma, type Prisma } from "@lyrus/db";

export async function logTenantAudit(input: {
  organizationId?: string | null;
  userId?: string | null;
  action: string;
  metadata?: Prisma.InputJsonValue;
}) {
  await prisma.tenantAuditLog.create({
    data: {
      organizationId: input.organizationId ?? undefined,
      userId: input.userId ?? undefined,
      action: input.action,
      metadata: input.metadata,
    },
  });
}
