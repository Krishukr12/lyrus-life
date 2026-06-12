import { PLAN_INCLUDED_ALLOWANCES } from "./billing-defaults.js";
import {
  calculateOrganizationBilling,
  planDisplayName,
  type BillingCalculationInput,
  type BillingCalculationResult,
  type PlanTier,
} from "./billing-calculator.js";

export interface BillingLineItemDraft {
  description: string;
  quantity: number;
  unitPriceInr: number;
  amountInr: number;
  sortOrder: number;
}

export function buildBillingLineItems(
  input: BillingCalculationInput & { discountPercent?: number },
): {
  amounts: BillingCalculationResult & { discountInr: number; cycleSubtotalInr: number };
  lineItems: BillingLineItemDraft[];
  included: (typeof PLAN_INCLUDED_ALLOWANCES)[PlanTier];
} {
  const included = PLAN_INCLUDED_ALLOWANCES[input.plan];
  const amounts = calculateOrganizationBilling(input);
  const cycleSubtotalInr =
    input.billingCycle === "yearly"
      ? amounts.basePlanInr + amounts.extraUsersCostInr + amounts.extraLocationsCostInr
      : amounts.monthlySubtotalInr;

  const discountInr = Math.round(
    (cycleSubtotalInr * (input.discountPercent ?? 0)) / 100,
  );
  const taxableSubtotal = cycleSubtotalInr - discountInr;
  const gstInr = Math.round((taxableSubtotal * input.pricing.gstPercent) / 100);
  const totalInr = taxableSubtotal + gstInr;

  const lineItems: BillingLineItemDraft[] = [];
  let order = 0;

  lineItems.push({
    description: `${planDisplayName(input.plan)} plan (${input.billingCycle})`,
    quantity: 1,
    unitPriceInr: amounts.basePlanInr,
    amountInr: amounts.basePlanInr,
    sortOrder: order++,
  });

  if (amounts.extraUsers > 0) {
    lineItems.push({
      description: `Additional seats (${amounts.extraUsers} × ₹${input.pricing.extraUserMonthlyInr}/seat)`,
      quantity: amounts.extraUsers,
      unitPriceInr: input.pricing.extraUserMonthlyInr,
      amountInr: amounts.extraUsersCostInr,
      sortOrder: order++,
    });
  }

  if (amounts.extraLocations > 0) {
    lineItems.push({
      description: `Additional locations (${amounts.extraLocations} × ₹${input.pricing.extraLocationMonthlyInr}/location)`,
      quantity: amounts.extraLocations,
      unitPriceInr: input.pricing.extraLocationMonthlyInr,
      amountInr: amounts.extraLocationsCostInr,
      sortOrder: order++,
    });
  }

  if (discountInr > 0) {
    lineItems.push({
      description: `Discount (${input.discountPercent}%)`,
      quantity: 1,
      unitPriceInr: -discountInr,
      amountInr: -discountInr,
      sortOrder: order++,
    });
  }

  lineItems.push({
    description: `GST (${input.pricing.gstPercent}%)`,
    quantity: 1,
    unitPriceInr: gstInr,
    amountInr: gstInr,
    sortOrder: order++,
  });

  return {
    amounts: {
      ...amounts,
      monthlySubtotalInr: input.billingCycle === "yearly" ? Math.round(cycleSubtotalInr / 12) : cycleSubtotalInr,
      discountInr,
      cycleSubtotalInr,
      gstInr,
      totalInr,
    },
    lineItems,
    included,
  };
}
