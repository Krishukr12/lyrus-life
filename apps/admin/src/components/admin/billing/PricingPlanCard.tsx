import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlanBadge } from "@/components/admin/billing/PlanBadge";
import { formatInr } from "@/lib/format-inr";

type PricingPlanCardProps = {
  planKey: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  planLabel: string;
  monthlyInr?: number;
  yearlyInr?: number;
  baseMonthlyInr?: number;
  extraUserInr?: number;
  extraLocationInr?: number;
  includedUsers: number;
  includedLocations: number;
  accent?: "slate" | "violet" | "blue";
  onEdit: () => void;
};

const accentStyles = {
  slate: "from-slate-500 to-slate-600",
  violet: "from-violet-500 to-purple-600",
  blue: "from-blue-500 to-indigo-600",
};

export function PricingPlanCard({
  planKey,
  planLabel,
  monthlyInr,
  yearlyInr,
  baseMonthlyInr,
  extraUserInr,
  extraLocationInr,
  includedUsers,
  includedLocations,
  accent = "slate",
  onEdit,
}: PricingPlanCardProps) {
  const isEnterprise = planKey === "ENTERPRISE";

  return (
    <div className="admin-card-accent group flex flex-col overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className={cn("h-1 bg-gradient-to-r", accentStyles[accent])} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2 mb-4">
          <PlanBadge plan={planKey} />
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            INR
          </span>
        </div>

        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{planLabel}</h3>

        <div className="mt-4 space-y-3 flex-1">
          {isEnterprise ? (
            <>
              <div>
                <p className="text-xs text-slate-500">Base price</p>
                <p className="text-2xl font-semibold text-slate-900 tabular-nums tracking-tight">
                  {formatInr(baseMonthlyInr ?? 0)}
                  <span className="text-sm font-normal text-slate-500">/month</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#e5e7eb]">
                <div>
                  <p className="text-xs text-slate-500">Extra user</p>
                  <p className="text-sm font-semibold text-slate-800 tabular-nums">
                    {formatInr(extraUserInr ?? 0)}
                    <span className="text-xs font-normal text-slate-500">/mo</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Extra location</p>
                  <p className="text-sm font-semibold text-slate-800 tabular-nums">
                    {formatInr(extraLocationInr ?? 0)}
                    <span className="text-xs font-normal text-slate-500">/mo</span>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-xs text-slate-500">Monthly</p>
                <p className="text-2xl font-semibold text-slate-900 tabular-nums tracking-tight">
                  {formatInr(monthlyInr ?? 0)}
                  <span className="text-sm font-normal text-slate-500">/month</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Yearly</p>
                <p className="text-xl font-semibold text-slate-800 tabular-nums">
                  {formatInr(yearlyInr ?? 0)}
                  <span className="text-sm font-normal text-slate-500">/year</span>
                </p>
              </div>
            </>
          )}

          <div className="rounded-[10px] bg-slate-50/80 border border-[#e5e7eb] px-3 py-2.5 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Included users</span>
              <span className="font-semibold text-slate-800">{includedUsers}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Included locations</span>
              <span className="font-semibold text-slate-800">{includedLocations}</span>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-5 w-full rounded-[8px] group-hover:border-blue-300 group-hover:bg-blue-50/50"
          onClick={onEdit}
        >
          <Pencil className="h-3.5 w-3.5 mr-1.5" />
          Edit pricing
        </Button>
      </div>
    </div>
  );
}
