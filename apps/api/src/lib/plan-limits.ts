import {
  BillingStatus,
  OrganizationStatus,
  UserRole,
  UserStatus,
  prisma,
} from "@lyrus/db";
import type { PlanTier } from "./billing-calculator.js";
import { PLAN_INCLUDED_ALLOWANCES } from "./billing-defaults.js";

const SEAT_ROLES = [
  UserRole.ORG_ADMIN,
  UserRole.MANAGER,
  UserRole.EMPLOYEE,
  UserRole.VIEWER,
] as const;

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
      role: { in: [...SEAT_ROLES] },
    },
  });
}

export async function countPendingInvitationSeats(organizationId: string): Promise<number> {
  return prisma.organizationInvitation.count({
    where: {
      organizationId,
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
  });
}

export async function countOrganizationMeetings(organizationId: string): Promise<number> {
  return prisma.meeting.count({ where: { organizationId } });
}

/** Included seats before extras bill. Unlimited plans return a large sentinel for math/UI. */
export function getIncludedSeats(plan: PlanTier): number {
  return PLAN_INCLUDED_ALLOWANCES[plan].users ?? Number.MAX_SAFE_INTEGER;
}

export function getMeetingLimit(plan: PlanTier): number | null {
  return PLAN_INCLUDED_ALLOWANCES[plan].meetings;
}

export function isForeverFreePlan(plan: PlanTier | string): boolean {
  return plan === "FOREVER_FREE";
}

export async function assertOrganizationBillingActive(organizationId: string): Promise<void> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { billingProfile: true },
  });

  if (!org) {
    throw new PlanLimitError("not_found", "Organization not found", 404);
  }

  if (org.status !== OrganizationStatus.ACTIVE) {
    throw new PlanLimitError("organization_inactive", "Organization is not active", 403);
  }

  const billingStatus = org.billingProfile?.billingStatus;
  if (billingStatus === BillingStatus.OVERDUE) {
    throw new PlanLimitError(
      "billing_overdue",
      "Billing is overdue. Please settle outstanding invoices to continue.",
      403,
    );
  }

  if (billingStatus === BillingStatus.CANCELLED) {
    throw new PlanLimitError("billing_cancelled", "Subscription has been cancelled", 403);
  }

  if (billingStatus === BillingStatus.TRIAL && org.billingProfile?.trialEndsAt) {
    if (org.billingProfile.trialEndsAt < new Date()) {
      throw new PlanLimitError(
        "trial_expired",
        "Trial period has ended. Upgrade to continue using the platform.",
        403,
      );
    }
  }
}

/** Seat-based billing: additional seats are billed, not blocked. */
export async function assertOrganizationCanAddUser(organizationId: string): Promise<void> {
  await assertOrganizationBillingActive(organizationId);
}

export async function assertOrganizationCanCreateMeeting(organizationId: string): Promise<void> {
  await assertOrganizationBillingActive(organizationId);

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { subscriptionPlan: true },
  });
  if (!org) return;

  const limit = getMeetingLimit(org.subscriptionPlan);
  if (limit === null) return;

  const count = await countOrganizationMeetings(organizationId);
  if (count >= limit) {
    throw new PlanLimitError(
      "plan_meeting_limit",
      `Your ${org.subscriptionPlan} plan allows up to ${limit} meetings. Upgrade your plan to create more.`,
      403,
    );
  }
}

/** @deprecated Use getIncludedSeats — kept for compatibility */
export const PLAN_MAX_USERS: Record<PlanTier, number | null> = {
  STARTER: null,
  PROFESSIONAL: null,
  ENTERPRISE: null,
  FOREVER_FREE: null,
};
