import { format } from "date-fns";
import type { CustomerBillingDetail } from "@/lib/billing-types";
import { formatInr } from "@/lib/format-inr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function BillingDetailDialog({
  open,
  onOpenChange,
  billing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billing: CustomerBillingDetail | null;
}) {
  if (!billing) return null;

  const b = billing.breakdown;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-[14px]">
        <DialogHeader>
          <DialogTitle className="text-slate-900">{billing.organizationName}</DialogTitle>
          <p className="text-sm text-slate-500">{billing.email}</p>
        </DialogHeader>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-[#e5e7eb] pb-2">
            <dt className="text-slate-500">Plan</dt>
            <dd className="font-medium text-slate-900">
              {billing.currentPlanLabel} ({billing.billingCycle})
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Base plan</dt>
            <dd className="font-medium tabular-nums">{formatInr(b.basePlanInr)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">
              Extra users ({b.extraUsers} × {formatInr(billing.pricing.extraUserMonthlyInr)})
            </dt>
            <dd className="font-medium tabular-nums">{formatInr(b.extraUsersCostInr)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">
              Extra locations ({b.extraLocations} ×{" "}
              {formatInr(billing.pricing.extraLocationMonthlyInr)})
            </dt>
            <dd className="font-medium tabular-nums">{formatInr(b.extraLocationsCostInr)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-[#e5e7eb] pt-2">
            <dt className="text-slate-500">Monthly subtotal</dt>
            <dd className="font-medium tabular-nums">{formatInr(b.monthlySubtotalInr)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">GST ({billing.pricing.gstPercent}%)</dt>
            <dd className="font-medium tabular-nums">{formatInr(b.gstInr)}</dd>
          </div>
          <div className="flex justify-between gap-4 rounded-[10px] bg-slate-50 px-3 py-2">
            <dt className="font-semibold text-slate-900">Total payable / month</dt>
            <dd className="font-semibold tabular-nums text-slate-900">{formatInr(b.totalInr)}</dd>
          </div>
          {billing.nextBillingDate ? (
            <div className="flex justify-between gap-4 text-xs text-slate-500 pt-1">
              <dt>Next billing</dt>
              <dd>{format(new Date(billing.nextBillingDate), "PPP")}</dd>
            </div>
          ) : null}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
