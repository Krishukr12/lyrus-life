import { addDays, endOfMonth, startOfMonth } from "date-fns";
import { prisma, type Prisma } from "@lyrus/db";
import {
  calculateOrganizationBilling,
  planDisplayName,
  type PlanTier,
  type PricingConfigInput,
} from "../lib/billing-calculator.js";
import { PLAN_INCLUDED_ALLOWANCES } from "../lib/billing-defaults.js";
import { buildBillingLineItems } from "../lib/billing-line-items.js";
import { billingRepository, type BillingStatusValue } from "../repositories/billing.repository.js";
import { invoiceRepository } from "../repositories/invoice.repository.js";

function serializeBillingRow(
  org: Awaited<ReturnType<typeof billingRepository.listOrganizationsForBilling>>[number],
  pricing: PricingConfigInput,
) {
  const activeUsers = org.users.length;
  const profile = org.billingProfile;
  const billingCycle = (profile?.billingCycle === "yearly" ? "yearly" : "monthly") as
    | "monthly"
    | "yearly";
  const activeLocations = profile?.activeLocations ?? 0;
  const billingStatus = profile?.billingStatus ?? "PENDING";

  const amounts = calculateOrganizationBilling({
    plan: org.subscriptionPlan as PlanTier,
    billingCycle,
    activeUsers,
    activeLocations,
    pricing,
  });

  const included = PLAN_INCLUDED_ALLOWANCES[org.subscriptionPlan as PlanTier];
  const discountPercent = profile?.discountPercent ? Number(profile.discountPercent) : 0;
  const full = buildBillingLineItems({
    plan: org.subscriptionPlan as PlanTier,
    billingCycle,
    activeUsers,
    activeLocations,
    pricing,
    discountPercent,
  });

  return {
    organizationId: org.id,
    organizationName: org.name,
    slug: org.slug,
    currentPlan: org.subscriptionPlan,
    currentPlanLabel: planDisplayName(org.subscriptionPlan),
    activeUsers,
    activeLocations,
    includedUsers: included.users,
    additionalUsers: full.amounts.extraUsers,
    billingCycle,
    monthlyAmountInr: full.amounts.monthlySubtotalInr,
    annualCostInr:
      billingCycle === "yearly"
        ? full.amounts.totalInr
        : (full.amounts.monthlySubtotalInr + full.amounts.gstInr) * 12,
    gstInr: full.amounts.gstInr,
    totalAmountInr: full.amounts.totalInr,
    billingStatus,
    nextBillingDate: profile?.nextBillingDate?.toISOString() ?? null,
    trialEndsAt: profile?.trialEndsAt?.toISOString() ?? null,
    breakdown: full.amounts,
  };
}

export const billingService = {
  getPricingConfig: () => billingRepository.getPricingConfig(),

  async updatePricingConfig(
    data: PricingConfigInput & { freeTrialDays: number },
    actor?: { id: string; name: string },
  ) {
    const previous = await billingRepository.getPricingConfig();
    const next = await billingRepository.upsertPricingConfig(data);
    if (actor) {
      await invoiceRepository.logPricingChange({
        actorId: actor.id,
        actorName: actor.name,
        previous: previous as unknown as Prisma.JsonObject,
        next: next as unknown as Prisma.JsonObject,
      });
    }
    return next;
  },

  resetPricingConfig: async (actor?: { id: string; name: string }) => {
    const previous = await billingRepository.getPricingConfig();
    const next = await billingRepository.resetPricingToDefaults();
    if (actor) {
      await invoiceRepository.logPricingChange({
        actorId: actor.id,
        actorName: actor.name,
        previous: previous as unknown as Prisma.JsonObject,
        next: next as unknown as Prisma.JsonObject,
      });
    }
    return next;
  },

  listPricingHistory: (take = 50) => invoiceRepository.listPricingChanges(take),

  async listCustomerBilling() {
    const [orgs, pricing] = await Promise.all([
      billingRepository.listOrganizationsForBilling(),
      billingRepository.getPricingConfig(),
    ]);
    return {
      pricing,
      items: orgs.map((org) => serializeBillingRow(org, pricing)),
    };
  },

  async getCustomerBillingDetail(organizationId: string) {
    const [org, pricing] = await Promise.all([
      billingRepository.getOrganizationBilling(organizationId),
      billingRepository.getPricingConfig(),
    ]);
    if (!org) return null;
    return {
      pricing,
      ...serializeBillingRow(org, pricing),
      orgStatus: org.status,
      email: org.email,
    };
  },

  async updateCustomerBilling(
    organizationId: string,
    input: {
      subscriptionPlan?: Prisma.OrganizationUpdateInput["subscriptionPlan"];
      billingCycle?: "monthly" | "yearly";
      billingStatus?: BillingStatusValue;
      activeLocations?: number;
      nextBillingDate?: Date | null;
      discountPercent?: number;
      billingEmail?: string | null;
    },
    actorId?: string,
  ) {
    const org = await billingRepository.getOrganizationBilling(organizationId);
    if (!org) {
      throw new BillingServiceError("not_found", "Organization not found", 404);
    }

    const previousPlan = org.subscriptionPlan;

    if (input.subscriptionPlan) {
      await billingRepository.updateOrganizationPlan(organizationId, input.subscriptionPlan);
    }

    const switchingToForeverFree = input.subscriptionPlan === "FOREVER_FREE";

    await billingRepository.upsertOrganizationBilling(organizationId, {
      activeLocations: input.activeLocations,
      billingStatus: switchingToForeverFree ? "ACTIVE" : input.billingStatus,
      billingCycle: input.billingCycle,
      nextBillingDate: switchingToForeverFree ? null : input.nextBillingDate,
      trialStartedAt: switchingToForeverFree ? null : undefined,
      trialEndsAt: switchingToForeverFree ? null : undefined,
      currentPeriodStart: switchingToForeverFree ? null : undefined,
      currentPeriodEnd: switchingToForeverFree ? null : undefined,
      discountPercent: input.discountPercent,
      billingEmail: input.billingEmail,
      cancelledAt: input.billingStatus === "CANCELLED" ? new Date() : undefined,
    });

    if (input.subscriptionPlan && input.subscriptionPlan !== previousPlan) {
      const direction =
        input.subscriptionPlan === "FOREVER_FREE"
          ? "downgrade"
          : previousPlan === "STARTER" && input.subscriptionPlan !== "STARTER"
            ? "upgrade"
            : previousPlan === "ENTERPRISE"
              ? "downgrade"
              : input.subscriptionPlan === "ENTERPRISE"
                ? "upgrade"
                : "downgrade";
      await invoiceRepository.logBillingEvent({
        organizationId,
        type: `subscription.${direction}`,
        actorId,
        metadata: { from: previousPlan, to: input.subscriptionPlan },
      });
    }

    if (input.billingStatus === "CANCELLED") {
      await invoiceRepository.logBillingEvent({
        organizationId,
        type: "subscription.cancelled",
        actorId,
      });
    }

    return this.getCustomerBillingDetail(organizationId);
  },

  async startTrial(organizationId: string, trialDays: number, actorId?: string) {
    const now = new Date();
    const trialEndsAt = addDays(now, trialDays);
    await billingRepository.upsertOrganizationBilling(organizationId, {
      billingStatus: "TRIAL",
      trialStartedAt: now,
      trialEndsAt,
      currentPeriodStart: now,
      currentPeriodEnd: trialEndsAt,
      nextBillingDate: trialEndsAt,
    });
    await invoiceRepository.logBillingEvent({
      organizationId,
      type: "trial.started",
      actorId,
      metadata: { trialDays, trialEndsAt: trialEndsAt.toISOString() },
    });
  },

  async initializeBillingPeriod(organizationId: string, billingCycle: "monthly" | "yearly") {
    const now = new Date();
    const periodEnd =
      billingCycle === "yearly" ? addDays(now, 365) : endOfMonth(now);
    await billingRepository.upsertOrganizationBilling(organizationId, {
      currentPeriodStart: billingCycle === "yearly" ? now : startOfMonth(now),
      currentPeriodEnd: periodEnd,
      nextBillingDate: periodEnd,
    });
  },
};

export class BillingServiceError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "BillingServiceError";
  }
}
