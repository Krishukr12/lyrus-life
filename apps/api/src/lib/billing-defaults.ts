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

/** Users/locations included in base plan before per-unit charges apply. `null` = unlimited. */
export const PLAN_INCLUDED_ALLOWANCES = {
  STARTER: { users: 5, locations: 1, meetings: 100 as number | null },
  PROFESSIONAL: { users: 20, locations: 5, meetings: 500 as number | null },
  ENTERPRISE: { users: 50, locations: 20, meetings: null as number | null },
  /** Temporary testing plan — no limits, no billing. Remove later. */
  FOREVER_FREE: {
    users: null as number | null,
    locations: null as number | null,
    meetings: null as number | null,
  },
} as const;

export const PLATFORM_BILLING = {
  companyName: process.env.BILLING_COMPANY_NAME ?? "Quincore Business Solutions Pvt Ltd",
  companyAddress:
    process.env.BILLING_COMPANY_ADDRESS ??
    "Bengaluru, Karnataka, India",
  companyGstin: process.env.BILLING_COMPANY_GSTIN ?? "",
  invoiceDueDays: Number(process.env.BILLING_INVOICE_DUE_DAYS ?? 15),
} as const;
