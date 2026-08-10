import { z } from "zod";

export const pricingConfigFormSchema = z.object({
  starterMonthlyInr: z.coerce.number().int().min(0, "Must be 0 or more"),
  starterYearlyInr: z.coerce.number().int().min(0, "Must be 0 or more"),
  growthMonthlyInr: z.coerce.number().int().min(0, "Must be 0 or more"),
  growthYearlyInr: z.coerce.number().int().min(0, "Must be 0 or more"),
  enterpriseBaseMonthlyInr: z.coerce.number().int().min(0, "Must be 0 or more"),
  extraUserMonthlyInr: z.coerce.number().int().min(0, "Must be 0 or more"),
  extraLocationMonthlyInr: z.coerce.number().int().min(0, "Must be 0 or more"),
  gstPercent: z.coerce.number().min(0).max(100, "GST must be between 0 and 100"),
  freeTrialDays: z.coerce.number().int().min(0).max(365, "Trial days must be 0–365"),
});

export type PricingConfigFormValues = z.infer<typeof pricingConfigFormSchema>;

export const editBillingSchema = z.object({
  subscriptionPlan: z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE", "FOREVER_FREE"]),
  billingCycle: z.enum(["monthly", "yearly"]),
  billingStatus: z.enum(["ACTIVE", "PENDING", "OVERDUE", "TRIAL", "CANCELLED"]),
  activeLocations: z.coerce.number().int().min(0).max(10_000),
  discountPercent: z.coerce.number().min(0).max(100).optional(),
  billingEmail: z.union([z.string().email(), z.literal("")]).optional(),
  nextBillingDate: z.string().optional(),
});

export type EditBillingFormValues = z.infer<typeof editBillingSchema>;

export const DEFAULT_PRICING_FORM: PricingConfigFormValues = {
  starterMonthlyInr: 999,
  starterYearlyInr: 9_999,
  growthMonthlyInr: 2_999,
  growthYearlyInr: 29_999,
  enterpriseBaseMonthlyInr: 9_999,
  extraUserMonthlyInr: 99,
  extraLocationMonthlyInr: 499,
  gstPercent: 18,
  freeTrialDays: 14,
};
