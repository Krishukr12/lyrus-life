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
  billingStatus: z.enum(["ACTIVE", "PENDING", "OVERDUE", "TRIAL", "CANCELLED"]).optional(),
  activeLocations: z.coerce.number().int().min(0).max(10_000).optional(),
  discountPercent: z.coerce.number().min(0).max(100).optional(),
  billingEmail: z.union([z.string().email(), z.literal(""), z.null()]).optional(),
  nextBillingDate: z
    .union([z.string().datetime(), z.string().date(), z.literal(""), z.null()])
    .optional(),
});

export const recordPaymentSchema = z.object({
  invoiceId: z.string().optional(),
  amountInr: z.coerce.number().int().min(1).max(100_000_000),
  method: z.string().max(80).optional(),
  reference: z.string().max(200).optional(),
  notes: z.string().max(500).optional(),
});
