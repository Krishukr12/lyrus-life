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
  discountInr?: number;
  cycleSubtotalInr?: number;
};

export type CustomerBillingRow = {
  organizationId: string;
  organizationName: string;
  slug: string;
  currentPlan: string;
  currentPlanLabel: string;
  activeUsers: number;
  activeLocations: number;
  includedUsers?: number;
  additionalUsers?: number;
  billingCycle: string;
  monthlyAmountInr: number;
  annualCostInr?: number;
  gstInr: number;
  totalAmountInr: number;
  billingStatus: string;
  nextBillingDate: string | null;
  trialEndsAt?: string | null;
  breakdown: BillingBreakdown;
};

export type CustomerBillingDetail = CustomerBillingRow & {
  pricing: PlatformPricing;
  orgStatus: string;
  email: string;
};

export type InvoiceLineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPriceInr: number;
  amountInr: number;
  sortOrder: number;
};

export type InvoiceDelivery = {
  id: string;
  recipientEmail: string;
  status: string;
  error: string | null;
  sentAt: string | null;
  createdAt: string;
};

export type InvoiceRecord = {
  id: string;
  organizationId: string;
  invoiceNumber: string;
  status: string;
  planName: string;
  billingCycle: string;
  periodStart: string;
  periodEnd: string;
  includedSeats: number;
  activeSeats: number;
  additionalSeats: number;
  subtotalInr: number;
  discountInr: number;
  gstInr: number;
  totalInr: number;
  billingAddress: string | null;
  issuedAt: string | null;
  dueAt: string | null;
  paidAt: string | null;
  createdAt: string;
  lineItems: InvoiceLineItem[];
  deliveries?: InvoiceDelivery[];
};

export type PaymentRecord = {
  id: string;
  amountInr: number;
  status: string;
  method: string | null;
  reference: string | null;
  notes?: string | null;
  paidAt: string;
  invoiceNumber: string | null;
};

export type BillingDashboard = {
  currentPlan: string;
  currentPlanLabel: string;
  billingCycle: string;
  billingStatus: string;
  monthlyCostInr: number;
  annualCostInr: number;
  includedUsers: number;
  activeUsers: number;
  additionalUsers: number;
  includedLocations: number;
  activeLocations: number;
  additionalLocations: number;
  nextBillingDate: string | null;
  trialEndsAt: string | null;
  upcomingInvoice: {
    id: string;
    invoiceNumber: string;
    totalInr: number;
    dueAt: string | null;
    status: string;
  } | null;
  breakdown: BillingBreakdown;
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    status: string;
    totalInr: number;
    issuedAt: string | null;
    paidAt: string | null;
  }>;
  payments: PaymentRecord[];
  events: Array<{
    id: string;
    type: string;
    metadata: unknown;
    createdAt: string;
  }>;
};

export type PricingChangeLogEntry = {
  id: string;
  actorId: string | null;
  actorName: string | null;
  previous: PlatformPricing;
  next: PlatformPricing;
  createdAt: string;
};
