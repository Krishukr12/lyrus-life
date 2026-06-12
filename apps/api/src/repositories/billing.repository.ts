import { prisma, type Prisma } from "@lyrus/db";
import { DEFAULT_PLATFORM_PRICING } from "../lib/billing-defaults.js";

export type BillingStatusValue = "ACTIVE" | "PENDING" | "OVERDUE" | "TRIAL" | "CANCELLED";

export type PricingConfigUpdate = {
  starterMonthlyInr: number;
  starterYearlyInr: number;
  growthMonthlyInr: number;
  growthYearlyInr: number;
  enterpriseBaseMonthlyInr: number;
  extraUserMonthlyInr: number;
  extraLocationMonthlyInr: number;
  gstPercent: number;
  freeTrialDays: number;
};

function toPricingNumbers(row: {
  starterMonthlyInr: number;
  starterYearlyInr: number;
  growthMonthlyInr: number;
  growthYearlyInr: number;
  enterpriseBaseMonthlyInr: number;
  extraUserMonthlyInr: number;
  extraLocationMonthlyInr: number;
  gstPercent: { toNumber?: () => number } | number;
  freeTrialDays: number;
}): PricingConfigUpdate {
  return {
    starterMonthlyInr: row.starterMonthlyInr,
    starterYearlyInr: row.starterYearlyInr,
    growthMonthlyInr: row.growthMonthlyInr,
    growthYearlyInr: row.growthYearlyInr,
    enterpriseBaseMonthlyInr: row.enterpriseBaseMonthlyInr,
    extraUserMonthlyInr: row.extraUserMonthlyInr,
    extraLocationMonthlyInr: row.extraLocationMonthlyInr,
    gstPercent: Number(row.gstPercent),
    freeTrialDays: row.freeTrialDays,
  };
}

export const billingRepository = {
  async getPricingConfig(): Promise<PricingConfigUpdate> {
    const row = await prisma.platformPricingConfig.findUnique({ where: { id: "default" } });
    if (!row) {
      return { ...DEFAULT_PLATFORM_PRICING };
    }
    return toPricingNumbers(row);
  },

  async upsertPricingConfig(data: PricingConfigUpdate): Promise<PricingConfigUpdate> {
    const row = await prisma.platformPricingConfig.upsert({
      where: { id: "default" },
      create: { id: "default", ...data, gstPercent: data.gstPercent },
      update: { ...data, gstPercent: data.gstPercent },
    });
    return toPricingNumbers(row);
  },

  async resetPricingToDefaults(): Promise<PricingConfigUpdate> {
    return this.upsertPricingConfig({ ...DEFAULT_PLATFORM_PRICING });
  },

  async listOrganizationsForBilling() {
    return prisma.organization.findMany({
      orderBy: { name: "asc" },
      include: {
        billingProfile: true,
        users: {
          where: { status: "ACTIVE", role: { in: ["ORG_ADMIN", "MANAGER", "EMPLOYEE"] } },
          select: { id: true },
        },
      },
    });
  },

  async getOrganizationBilling(organizationId: string) {
    return prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        billingProfile: true,
        users: {
          where: { status: "ACTIVE", role: { in: ["ORG_ADMIN", "MANAGER", "EMPLOYEE"] } },
          select: { id: true },
        },
      },
    });
  },

  async upsertOrganizationBilling(
    organizationId: string,
    data: {
      activeLocations?: number;
      billingStatus?: BillingStatusValue;
      billingCycle?: string;
      nextBillingDate?: Date | null;
      trialStartedAt?: Date | null;
      trialEndsAt?: Date | null;
      cancelledAt?: Date | null;
      currentPeriodStart?: Date | null;
      currentPeriodEnd?: Date | null;
      discountPercent?: number;
      billingEmail?: string | null;
    },
  ) {
    return prisma.organizationBilling.upsert({
      where: { organizationId },
      create: {
        organizationId,
        activeLocations: data.activeLocations ?? 0,
        billingStatus: data.billingStatus ?? "PENDING",
        billingCycle: data.billingCycle ?? "monthly",
        nextBillingDate: data.nextBillingDate ?? null,
        trialStartedAt: data.trialStartedAt ?? null,
        trialEndsAt: data.trialEndsAt ?? null,
        cancelledAt: data.cancelledAt ?? null,
        currentPeriodStart: data.currentPeriodStart ?? null,
        currentPeriodEnd: data.currentPeriodEnd ?? null,
        discountPercent: data.discountPercent ?? 0,
        billingEmail: data.billingEmail ?? null,
      },
      update: {
        ...(data.activeLocations !== undefined ? { activeLocations: data.activeLocations } : {}),
        ...(data.billingStatus !== undefined ? { billingStatus: data.billingStatus } : {}),
        ...(data.billingCycle !== undefined ? { billingCycle: data.billingCycle } : {}),
        ...(data.nextBillingDate !== undefined ? { nextBillingDate: data.nextBillingDate } : {}),
        ...(data.trialStartedAt !== undefined ? { trialStartedAt: data.trialStartedAt } : {}),
        ...(data.trialEndsAt !== undefined ? { trialEndsAt: data.trialEndsAt } : {}),
        ...(data.cancelledAt !== undefined ? { cancelledAt: data.cancelledAt } : {}),
        ...(data.currentPeriodStart !== undefined
          ? { currentPeriodStart: data.currentPeriodStart }
          : {}),
        ...(data.currentPeriodEnd !== undefined ? { currentPeriodEnd: data.currentPeriodEnd } : {}),
        ...(data.discountPercent !== undefined ? { discountPercent: data.discountPercent } : {}),
        ...(data.billingEmail !== undefined ? { billingEmail: data.billingEmail } : {}),
      },
    });
  },

  async updateOrganizationPlan(organizationId: string, subscriptionPlan: Prisma.OrganizationUpdateInput["subscriptionPlan"]) {
    return prisma.organization.update({
      where: { id: organizationId },
      data: { subscriptionPlan },
    });
  },
};
