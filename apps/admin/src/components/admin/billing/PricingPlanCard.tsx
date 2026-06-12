import { ArrowUpRight, Pencil } from "lucide-react";
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

const accentIcon = {
  slate: "bg-slate-50 text-slate-600",
  violet: "bg-violet-50 text-violet-600",
  blue: "bg-blue-50 text-blue-600",
} as const;

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
  const isFeatured = isEnterprise;

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-[28px] p-6",
        "shadow-[0_4px_24px_rgba(15,23,42,0.06)] transition-all duration-300",
        isFeatured
          ? "bg-[#3B82F6] text-white"
          : "border border-slate-100/80 bg-white hover:shadow-[0_8px_32px_rgba(15,23,42,0.08)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold",
              isFeatured ? "bg-white/20 text-white" : accentIcon[accent],
            )}
          >
            {planLabel.charAt(0)}
          </div>
          {isFeatured ? (
            <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#3B82F6]">
              Enterprise
            </span>
          ) : (
            <PlanBadge plan={planKey} />
          )}
        </div>
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
            isFeatured
              ? "bg-white/15 text-white hover:bg-white/25"
              : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600",
          )}
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <h3
        className={cn(
          "mt-4 text-lg font-semibold tracking-tight",
          isFeatured ? "text-white" : "text-slate-900",
        )}
      >
        {planLabel}
      </h3>
      <p className={cn("text-[10px] font-semibold uppercase tracking-wider", isFeatured ? "text-white/70" : "text-slate-400")}>
        INR pricing
      </p>

      <div className="mt-4 flex-1 space-y-3">
        {isEnterprise ? (
          <>
            <div>
              <p className={cn("text-xs font-medium", isFeatured ? "text-white/70" : "text-slate-400")}>
                Base price
              </p>
              <p
                className={cn(
                  "text-2xl font-bold tabular-nums tracking-tight",
                  isFeatured ? "text-white" : "text-slate-900",
                )}
              >
                {formatInr(baseMonthlyInr ?? 0)}
                <span className={cn("text-sm font-normal", isFeatured ? "text-white/70" : "text-slate-500")}>
                  /month
                </span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-white/20 pt-3">
              <AllowanceCell
                label="Extra user"
                value={`${formatInr(extraUserInr ?? 0)}/mo`}
                featured={isFeatured}
              />
              <AllowanceCell
                label="Extra location"
                value={`${formatInr(extraLocationInr ?? 0)}/mo`}
                featured={isFeatured}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <p className={cn("text-xs font-medium", isFeatured ? "text-white/70" : "text-slate-400")}>
                Monthly
              </p>
              <p
                className={cn(
                  "text-2xl font-bold tabular-nums tracking-tight",
                  isFeatured ? "text-white" : "text-slate-900",
                )}
              >
                {formatInr(monthlyInr ?? 0)}
                <span className={cn("text-sm font-normal", isFeatured ? "text-white/70" : "text-slate-500")}>
                  /month
                </span>
              </p>
            </div>
            <div>
              <p className={cn("text-xs font-medium", isFeatured ? "text-white/70" : "text-slate-400")}>
                Yearly
              </p>
              <p
                className={cn(
                  "text-xl font-bold tabular-nums",
                  isFeatured ? "text-white" : "text-slate-800",
                )}
              >
                {formatInr(yearlyInr ?? 0)}
                <span className={cn("text-sm font-normal", isFeatured ? "text-white/70" : "text-slate-500")}>
                  /year
                </span>
              </p>
            </div>
          </>
        )}

        <div
          className={cn(
            "space-y-1.5 rounded-2xl px-3 py-2.5",
            isFeatured
              ? "bg-white/15"
              : "border border-slate-100/80 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]",
          )}
        >
          <div className="flex justify-between text-xs">
            <span className={isFeatured ? "text-white/70" : "text-slate-400"}>Included users</span>
            <span className={cn("font-semibold", isFeatured ? "text-white" : "text-slate-800")}>
              {includedUsers}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className={isFeatured ? "text-white/70" : "text-slate-400"}>Included locations</span>
            <span className={cn("font-semibold", isFeatured ? "text-white" : "text-slate-800")}>
              {includedLocations}
            </span>
          </div>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className={cn(
          "mt-5 w-full rounded-full text-xs font-medium",
          isFeatured
            ? "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            : "border-slate-200/80 hover:border-blue-200 hover:bg-blue-50/50",
        )}
        onClick={onEdit}
      >
        <Pencil className="mr-1.5 h-3.5 w-3.5" />
        Edit pricing
      </Button>
    </div>
  );
}

function AllowanceCell({
  label,
  value,
  featured,
}: {
  label: string;
  value: string;
  featured?: boolean;
}) {
  return (
    <div>
      <p className={cn("text-xs font-medium", featured ? "text-white/70" : "text-slate-400")}>
        {label}
      </p>
      <p className={cn("text-sm font-semibold tabular-nums", featured ? "text-white" : "text-slate-800")}>
        {value}
      </p>
    </div>
  );
}
