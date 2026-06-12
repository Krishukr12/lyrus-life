import type { PlatformPricing } from "@/lib/billing-types";
import { formatInr } from "@/lib/format-inr";

export type PricingHistoryEntry = {
  id: string;
  changedBy: string;
  plan: string;
  field: string;
  oldValue: string;
  newValue: string;
  date: string;
};

const STORAGE_KEY = "lyrus-admin-pricing-history";
const MAX_ENTRIES = 50;

const FIELD_LABELS: Record<keyof PlatformPricing, string> = {
  starterMonthlyInr: "Starter monthly",
  starterYearlyInr: "Starter yearly",
  growthMonthlyInr: "Growth monthly",
  growthYearlyInr: "Growth yearly",
  enterpriseBaseMonthlyInr: "Enterprise base",
  extraUserMonthlyInr: "Extra user",
  extraLocationMonthlyInr: "Extra location",
  gstPercent: "GST %",
  freeTrialDays: "Free trial days",
};

const FIELD_PLAN: Record<keyof PlatformPricing, string> = {
  starterMonthlyInr: "Starter",
  starterYearlyInr: "Starter",
  growthMonthlyInr: "Growth",
  growthYearlyInr: "Growth",
  enterpriseBaseMonthlyInr: "Enterprise",
  extraUserMonthlyInr: "Platform",
  extraLocationMonthlyInr: "Platform",
  gstPercent: "Platform",
  freeTrialDays: "Platform",
};

function formatValue(key: keyof PlatformPricing, value: number): string {
  if (key === "gstPercent") return `${value}%`;
  if (key === "freeTrialDays") return `${value} days`;
  return formatInr(value);
}

export function loadPricingHistory(): PricingHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PricingHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function appendPricingHistory(
  previous: PlatformPricing,
  next: PlatformPricing,
  changedBy: string,
): PricingHistoryEntry[] {
  const entries: PricingHistoryEntry[] = [];
  const now = new Date().toISOString();

  (Object.keys(FIELD_LABELS) as (keyof PlatformPricing)[]).forEach((key) => {
    if (previous[key] !== next[key]) {
      entries.push({
        id: `${now}-${key}`,
        changedBy,
        plan: FIELD_PLAN[key],
        field: FIELD_LABELS[key],
        oldValue: formatValue(key, previous[key]),
        newValue: formatValue(key, next[key]),
        date: now,
      });
    }
  });

  if (entries.length === 0) return loadPricingHistory();

  const merged = [...entries, ...loadPricingHistory()].slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // ignore quota
  }
  return merged;
}
