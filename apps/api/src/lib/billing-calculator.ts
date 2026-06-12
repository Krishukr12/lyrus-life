import { PLAN_INCLUDED_ALLOWANCES } from "./billing-defaults.js";

export type PlanTier = "STARTER" | "PROFESSIONAL" | "ENTERPRISE";

export type PricingConfigInput = {
  starterMonthlyInr: number;
  starterYearlyInr: number;
  growthMonthlyInr: number;
  growthYearlyInr: number;
  enterpriseBaseMonthlyInr: number;
  extraUserMonthlyInr: number;
  extraLocationMonthlyInr: number;
  gstPercent: number;
};

export type BillingCalculationInput = {
  plan: PlanTier;
  billingCycle: "monthly" | "yearly";
  activeUsers: number;
  activeLocations: number;
  pricing: PricingConfigInput;
};

export type BillingCalculationResult = {
  basePlanInr: number;
  extraUsers: number;
  extraUsersCostInr: number;
  extraLocations: number;
  extraLocationsCostInr: number;
  monthlySubtotalInr: number;
  gstInr: number;
  totalInr: number;
};

function basePlanPrice(
  plan: PlanTier,
  cycle: "monthly" | "yearly",
  pricing: PricingConfigInput,
): number {
  if (plan === "STARTER") {
    return cycle === "yearly" ? pricing.starterYearlyInr : pricing.starterMonthlyInr;
  }
  if (plan === "PROFESSIONAL") {
    return cycle === "yearly" ? pricing.growthYearlyInr : pricing.growthMonthlyInr;
  }
  return pricing.enterpriseBaseMonthlyInr;
}

export function calculateOrganizationBilling(
  input: BillingCalculationInput,
): BillingCalculationResult {
  const included = PLAN_INCLUDED_ALLOWANCES[input.plan];
  const extraUsers = Math.max(0, input.activeUsers - included.users);
  const extraLocations = Math.max(0, input.activeLocations - included.locations);

  const basePlanInr = basePlanPrice(input.plan, input.billingCycle, input.pricing);
  const extraUsersCostInr = extraUsers * input.pricing.extraUserMonthlyInr;
  const extraLocationsCostInr = extraLocations * input.pricing.extraLocationMonthlyInr;

  let monthlySubtotalInr = basePlanInr + extraUsersCostInr + extraLocationsCostInr;
  if (input.billingCycle === "yearly") {
    monthlySubtotalInr = Math.round(monthlySubtotalInr / 12);
  }

  const gstInr = Math.round((monthlySubtotalInr * input.pricing.gstPercent) / 100);
  const totalInr = monthlySubtotalInr + gstInr;

  return {
    basePlanInr,
    extraUsers,
    extraUsersCostInr,
    extraLocations,
    extraLocationsCostInr,
    monthlySubtotalInr,
    gstInr,
    totalInr,
  };
}

export function planDisplayName(plan: PlanTier): string {
  if (plan === "PROFESSIONAL") return "Growth";
  return plan.charAt(0) + plan.slice(1).toLowerCase();
}
