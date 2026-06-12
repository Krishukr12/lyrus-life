import { prisma } from "@lyrus/db";
import type { PlanTier } from "../lib/billing-calculator.js";
import { planDisplayName } from "../lib/billing-calculator.js";
import { buildBillingLineItems } from "../lib/billing-line-items.js";
import {
  countActiveOrganizationSeats,
  countPendingInvitationSeats,
  getIncludedSeats,
} from "../lib/plan-limits.js";
import { billingRepository } from "../repositories/billing.repository.js";
import { invoiceRepository } from "../repositories/invoice.repository.js";

export interface SeatBillingPreview {
  subscriptionPlan: string;
  planLabel: string;
  billingCycle: "monthly" | "yearly";
  includedSeats: number;
  activeSeats: number;
  pendingInvitations: number;
  usedSeats: number;
  availableSeats: number;
  additionalSeatsCurrent: number;
  additionalSeatsAfter: number;
  extraSeatPriceMonthlyInr: number;
  currentMonthlySubtotalInr: number;
  currentTotalInr: number;
  projectedMonthlySubtotalInr: number;
  projectedAnnualCostInr: number;
  projectedTotalInr: number;
  additionalMonthlyCostInr: number;
  additionalAnnualCostInr: number;
  requiresConfirmation: boolean;
  gstPercent: number;
}

export async function buildSeatBillingPreview(
  organizationId: string,
  seatsToAdd = 1,
): Promise<SeatBillingPreview> {
  const [org, pricing, activeSeats, pendingInvitations] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: organizationId },
      include: { billingProfile: true },
    }),
    billingRepository.getPricingConfig(),
    countActiveOrganizationSeats(organizationId),
    countPendingInvitationSeats(organizationId),
  ]);

  if (!org) {
    throw new Error("Organization not found");
  }

  const plan = org.subscriptionPlan as PlanTier;
  const billingCycle = (org.billingProfile?.billingCycle === "yearly" ? "yearly" : "monthly") as
    | "monthly"
    | "yearly";
  const activeLocations = org.billingProfile?.activeLocations ?? 0;
  const discountPercent = org.billingProfile?.discountPercent
    ? Number(org.billingProfile.discountPercent)
    : 0;
  const includedSeats = getIncludedSeats(plan);
  const usedSeats = activeSeats + pendingInvitations;
  const availableSeats = Math.max(0, includedSeats - usedSeats);

  const current = buildBillingLineItems({
    plan,
    billingCycle,
    activeUsers: activeSeats,
    activeLocations,
    pricing,
    discountPercent,
  });

  const projectedActiveSeats = activeSeats + seatsToAdd;
  const projected = buildBillingLineItems({
    plan,
    billingCycle,
    activeUsers: projectedActiveSeats,
    activeLocations,
    pricing,
    discountPercent,
  });

  const additionalMonthlyCostInr =
    projected.amounts.monthlySubtotalInr - current.amounts.monthlySubtotalInr;
  const additionalAnnualCostInr =
    billingCycle === "yearly"
      ? projected.amounts.totalInr - current.amounts.totalInr
      : additionalMonthlyCostInr * 12;

  return {
    subscriptionPlan: org.subscriptionPlan,
    planLabel: planDisplayName(plan),
    billingCycle,
    includedSeats,
    activeSeats,
    pendingInvitations,
    usedSeats,
    availableSeats,
    additionalSeatsCurrent: current.amounts.extraUsers,
    additionalSeatsAfter: projected.amounts.extraUsers,
    extraSeatPriceMonthlyInr: pricing.extraUserMonthlyInr,
    currentMonthlySubtotalInr: current.amounts.monthlySubtotalInr,
    currentTotalInr: current.amounts.totalInr,
    projectedMonthlySubtotalInr: projected.amounts.monthlySubtotalInr,
    projectedAnnualCostInr:
      billingCycle === "yearly"
        ? projected.amounts.totalInr
        : (projected.amounts.monthlySubtotalInr + projected.amounts.gstInr) * 12,
    projectedTotalInr: projected.amounts.totalInr,
    additionalMonthlyCostInr,
    additionalAnnualCostInr,
    requiresConfirmation: projectedActiveSeats > includedSeats,
    gstPercent: pricing.gstPercent,
  };
}

export async function recordSeatChangeEvent(
  organizationId: string,
  actorId: string,
  metadata: {
    action: "user.created" | "user.activated" | "user.deactivated" | "invitation.sent" | "invitation.accepted" | "invitation.cancelled";
    activeSeats: number;
    includedSeats: number;
    additionalSeats: number;
    targetUserId?: string;
    targetEmail?: string;
  },
) {
  await invoiceRepository.logBillingEvent({
    organizationId,
    type: "seat.changed",
    actorId,
    metadata,
  });
}

export async function getSeatUsageSummary(organizationId: string) {
  const preview = await buildSeatBillingPreview(organizationId, 0);
  return {
    subscriptionPlan: preview.subscriptionPlan,
    planLabel: preview.planLabel,
    billingCycle: preview.billingCycle,
    includedSeats: preview.includedSeats,
    activeSeats: preview.activeSeats,
    pendingInvitations: preview.pendingInvitations,
    usedSeats: preview.usedSeats,
    availableSeats: preview.availableSeats,
    additionalSeats: preview.additionalSeatsCurrent,
    extraSeatPriceMonthlyInr: preview.extraSeatPriceMonthlyInr,
    monthlySubtotalInr: preview.currentMonthlySubtotalInr,
    totalInr: preview.currentTotalInr,
    projectedAnnualCostInr:
      preview.billingCycle === "yearly"
        ? preview.currentTotalInr
        : (preview.currentMonthlySubtotalInr +
            Math.round((preview.currentMonthlySubtotalInr * preview.gstPercent) / 100)) *
          12,
  };
}
