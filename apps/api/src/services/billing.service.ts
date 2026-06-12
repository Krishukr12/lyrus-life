import { prisma, type Prisma } from "@lyrus/db";
import {
  calculateOrganizationBilling,
  planDisplayName,
  type PlanTier,
  type PricingConfigInput,
} from "../lib/billing-calculator.js";
import { billingRepository, type BillingStatusValue } from "../repositories/billing.repository.js";

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

  return {
    organizationId: org.id,
    organizationName: org.name,
    slug: org.slug,
    currentPlan: org.subscriptionPlan,
    currentPlanLabel: planDisplayName(org.subscriptionPlan),
    activeUsers,
    activeLocations,
    billingCycle,
    monthlyAmountInr: amounts.monthlySubtotalInr,
    gstInr: amounts.gstInr,
    totalAmountInr: amounts.totalInr,
    billingStatus,
    nextBillingDate: profile?.nextBillingDate?.toISOString() ?? null,
    breakdown: amounts,
  };
}

export const billingService = {
  getPricingConfig: () => billingRepository.getPricingConfig(),

  updatePricingConfig: (data: PricingConfigInput & { freeTrialDays: number }) =>
    billingRepository.upsertPricingConfig(data),

  resetPricingConfig: () => billingRepository.resetPricingToDefaults(),

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
    },
  ) {
    const org = await billingRepository.getOrganizationBilling(organizationId);
    if (!org) {
      throw new BillingServiceError("not_found", "Organization not found", 404);
    }

    if (input.subscriptionPlan) {
      await billingRepository.updateOrganizationPlan(organizationId, input.subscriptionPlan);
    }

    await billingRepository.upsertOrganizationBilling(organizationId, {
      activeLocations: input.activeLocations,
      billingStatus: input.billingStatus,
      billingCycle: input.billingCycle,
      nextBillingDate: input.nextBillingDate,
    });

    return this.getCustomerBillingDetail(organizationId);
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
