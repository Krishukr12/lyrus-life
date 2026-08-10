import { Check } from "lucide-react";
import { PlanBadge } from "@/components/admin/billing/PlanBadge";
import { formatInr } from "@/lib/format-inr";
import { PLAN_INCLUDED_ALLOWANCES } from "@/lib/plan-allowances";
import type { PlatformPricing } from "@/lib/billing-types";
import { cn } from "@/lib/utils";

type PlanKey = "STARTER" | "PROFESSIONAL" | "ENTERPRISE" | "FOREVER_FREE";

const PLANS: {
  key: PlanKey;
  label: string;
  description: string;
  features: string[];
  accent: string;
  ring: string;
  selectedRing: string;
}[] = [
  {
    key: "STARTER",
    label: "Starter",
    description: "For small teams getting started with meeting intelligence.",
    features: ["AI meeting summaries", "Basic analytics", "Email support"],
    accent: "from-slate-400 to-slate-600",
    ring: "ring-slate-200",
    selectedRing: "ring-slate-400",
  },
  {
    key: "PROFESSIONAL",
    label: "Growth",
    description: "For growing organizations that need deeper insights.",
    features: ["Advanced AI insights", "Team dashboards", "Priority support"],
    accent: "from-violet-500 to-purple-600",
    ring: "ring-violet-200",
    selectedRing: "ring-violet-500",
  },
  {
    key: "ENTERPRISE",
    label: "Enterprise",
    description: "For large teams with custom scale and compliance needs.",
    features: ["Custom limits", "SSO & audit logs", "Dedicated success manager"],
    accent: "from-blue-500 to-indigo-600",
    ring: "ring-blue-200",
    selectedRing: "ring-blue-500",
  },
  {
    key: "FOREVER_FREE",
    label: "Forever Free",
    description: "Internal testing orgs — no limits and no billing. Remove later.",
    features: ["Unlimited users", "Unlimited meetings", "No invoices or trial expiry"],
    accent: "from-emerald-500 to-teal-600",
    ring: "ring-emerald-200",
    selectedRing: "ring-emerald-500",
  },
];

type OnboardingPlanCardsProps = {
  value: PlanKey;
  onChange: (plan: PlanKey) => void;
  pricing?: PlatformPricing;
};

function planPrice(plan: PlanKey, pricing?: PlatformPricing) {
  if (plan === "FOREVER_FREE") return formatInr(0);
  if (!pricing) return "—";
  if (plan === "STARTER") return formatInr(pricing.starterMonthlyInr);
  if (plan === "PROFESSIONAL") return formatInr(pricing.growthMonthlyInr);
  return formatInr(pricing.enterpriseBaseMonthlyInr);
}

function formatAllowance(value: number | null) {
  return value == null ? "Unlimited" : String(value);
}

export function OnboardingPlanCards({ value, onChange, pricing }: OnboardingPlanCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {PLANS.map((plan) => {
        const selected = value === plan.key;
        const allowances = PLAN_INCLUDED_ALLOWANCES[plan.key];

        return (
          <button
            key={plan.key}
            type="button"
            onClick={() => onChange(plan.key)}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-[22px] border bg-white text-left",
              "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
              selected
                ? cn("border-transparent shadow-lg ring-2", plan.selectedRing)
                : "border-slate-200/80 shadow-sm hover:border-slate-300",
            )}
          >
            <div className={cn("h-1.5 bg-gradient-to-r", plan.accent)} />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <PlanBadge plan={plan.key} />
                {selected ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : null}
              </div>

              <h3 className="mt-3 text-lg font-bold tracking-tight text-slate-900">{plan.label}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{plan.description}</p>

              <div className="mt-4">
                <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                  {planPrice(plan.key, pricing)}
                  <span className="text-sm font-medium text-slate-500">/mo</span>
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Included users</span>
                  <span className="font-semibold text-slate-800">
                    {formatAllowance(allowances.users)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Locations</span>
                  <span className="font-semibold text-slate-800">
                    {formatAllowance(allowances.locations)}
                  </span>
                </div>
              </div>

              <ul className="mt-4 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-slate-600">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </button>
        );
      })}
    </div>
  );
}
