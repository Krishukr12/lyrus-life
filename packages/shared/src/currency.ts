/** Platform default — all customer-facing money amounts are INR. */
export const APP_CURRENCY = "INR" as const;
export const APP_LOCALE = "en-IN" as const;

export type FormatInrOptions = {
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
};

/** Format amount in Indian Rupees (₹) using Indian numbering. */
export function formatInr(amount: number, options?: FormatInrOptions): string {
  return new Intl.NumberFormat(APP_LOCALE, {
    style: "currency",
    currency: APP_CURRENCY,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
    minimumFractionDigits: options?.minimumFractionDigits,
  }).format(amount);
}

/** App-wide currency formatter (alias for INR). */
export const formatCurrency = formatInr;

/** Compact display for tables/cards, e.g. ₹1.2L */
export function formatInrCompact(amount: number): string {
  return new Intl.NumberFormat(APP_LOCALE, {
    style: "currency",
    currency: APP_CURRENCY,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}
