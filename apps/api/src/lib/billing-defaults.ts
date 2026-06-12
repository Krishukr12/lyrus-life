/** Default INR pricing for Indian market (super admin can override in UI). */
export const DEFAULT_PLATFORM_PRICING = {
  starterMonthlyInr: 999,
  starterYearlyInr: 9_999,
  growthMonthlyInr: 2_999,
  growthYearlyInr: 29_999,
  enterpriseBaseMonthlyInr: 9_999,
  extraUserMonthlyInr: 99,
  extraLocationMonthlyInr: 499,
  gstPercent: 18,
  freeTrialDays: 14,
} as const;

/** Users/locations included in base plan before per-unit charges apply. */
export const PLAN_INCLUDED_ALLOWANCES = {
  STARTER: { users: 5, locations: 1 },
  PROFESSIONAL: { users: 20, locations: 5 },
  ENTERPRISE: { users: 50, locations: 20 },
} as const;
