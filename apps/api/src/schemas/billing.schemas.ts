import { z } from "zod";

export const pricingConfigSchema = z.object({
  starterMonthlyInr: z.coerce.number().int().min(0).max(10_000_000),
  starterYearlyInr: z.coerce.number().int().min(0).max(100_000_000),
  growthMonthlyInr: z.coerce.number().int().min(0).max(10_000_000),
  growthYearlyInr: z.coerce.number().int().min(0).max(100_000_000),
  enterpriseBaseMonthlyInr: z.coerce.number().int().min(0).max(10_000_000),
  extraUserMonthlyInr: z.coerce.number().int().min(0).max(1_000_000),
  extraLocationMonthlyInr: z.coerce.number().int().min(0).max(1_000_000),
  gstPercent: z.coerce.number().min(0).max(100),
  freeTrialDays: z.coerce.number().int().min(0).max(365),
});

export const updateOrganizationBillingSchema = z.object({
  subscriptionPlan: z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE"]).optional(),
  billingCycle: z.enum(["monthly", "yearly"]).optional(),
  billingStatus: z.enum(["ACTIVE", "PENDING", "OVERDUE", "TRIAL"]).optional(),
  activeLocations: z.coerce.number().int().min(0).max(10_000).optional(),
  nextBillingDate: z
    .union([z.string().datetime(), z.string().date(), z.literal(""), z.null()])
    .optional(),
});
