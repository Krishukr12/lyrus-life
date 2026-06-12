import { addDays, isWithinInterval, parseISO } from "date-fns";
import type { CustomerBillingRow } from "@/lib/billing-types";

export function computeRevenueSummary(items: CustomerBillingRow[]) {
  const mrr = items
    .filter((r) => r.billingStatus === "ACTIVE")
    .reduce((sum, r) => sum + r.totalAmountInr, 0);

  const activeCustomers = items.filter((r) => r.billingStatus === "ACTIVE").length;
  const trialCustomers = items.filter((r) => r.billingStatus === "TRIAL").length;

  const now = new Date();
  const windowEnd = addDays(now, 30);
  const expectedNextBilling = items
    .filter((r) => {
      if (!r.nextBillingDate) return false;
      const d = parseISO(r.nextBillingDate);
      return isWithinInterval(d, { start: now, end: windowEnd });
    })
    .reduce((sum, r) => sum + r.totalAmountInr, 0);

  return { mrr, activeCustomers, trialCustomers, expectedNextBilling };
}
