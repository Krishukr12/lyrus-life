export type PlatformPricing = {
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

export type BillingBreakdown = {
  basePlanInr: number;
  extraUsers: number;
  extraUsersCostInr: number;
  extraLocations: number;
  extraLocationsCostInr: number;
  monthlySubtotalInr: number;
  gstInr: number;
  totalInr: number;
};

export type CustomerBillingRow = {
  organizationId: string;
  organizationName: string;
  slug: string;
  currentPlan: string;
  currentPlanLabel: string;
  activeUsers: number;
  activeLocations: number;
  billingCycle: string;
  monthlyAmountInr: number;
  gstInr: number;
  totalAmountInr: number;
  billingStatus: string;
  nextBillingDate: string | null;
  breakdown: BillingBreakdown;
};

export type CustomerBillingDetail = CustomerBillingRow & {
  pricing: PlatformPricing;
  orgStatus: string;
  email: string;
};
