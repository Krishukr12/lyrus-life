/** Display-only allowances (matches server billing calculator). `null` = unlimited. */
export const PLAN_INCLUDED_ALLOWANCES = {
  STARTER: { users: 5, locations: 1, label: "Starter" },
  PROFESSIONAL: { users: 20, locations: 5, label: "Growth" },
  ENTERPRISE: { users: 50, locations: 20, label: "Enterprise" },
  FOREVER_FREE: { users: null as number | null, locations: null as number | null, label: "Forever Free" },
} as const;
