import { OrganizationStatus, SubscriptionPlan, UserRole, UserStatus, prisma } from "@lyrus/db";

/** Max active seats per subscription plan (enforced on user creation). */
export const PLAN_MAX_USERS: Record<
  (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan],
  number | null
> = {
  STARTER: 10,
  PROFESSIONAL: 50,
  ENTERPRISE: null,
};

const SEAT_ROLES = [UserRole.ORG_ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE] as const;

export class PlanLimitError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 403,
  ) {
    super(message);
  }
}

export async function countActiveOrganizationSeats(organizationId: string): Promise<number> {
  return prisma.user.count({
    where: {
      organizationId,
      status: UserStatus.ACTIVE,
      role: { in: SEAT_ROLES },
    },
  });
}

export async function assertOrganizationCanAddUser(organizationId: string): Promise<void> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { subscriptionPlan: true, status: true },
  });

  if (!org) {
    throw new PlanLimitError("not_found", "Organization not found", 404);
  }

  if (org.status !== OrganizationStatus.ACTIVE) {
    throw new PlanLimitError(
      "organization_inactive",
      "Organization is not active",
      403,
    );
  }

  const maxUsers = PLAN_MAX_USERS[org.subscriptionPlan];
  if (maxUsers === null) return;

  const activeCount = await countActiveOrganizationSeats(organizationId);
  if (activeCount >= maxUsers) {
    throw new PlanLimitError(
      "plan_user_limit",
      `Your ${org.subscriptionPlan} plan allows up to ${maxUsers} users. Upgrade your plan to add more.`,
      403,
    );
  }
}
