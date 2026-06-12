import type { Control } from "react-hook-form";
import { Settings2 } from "lucide-react";
import { FormInput } from "@/components/admin/FormFields";
import type { PricingConfigFormValues } from "@/lib/billing-schemas";

export function PlatformBillingSettingsCard({
  control,
}: {
  control: Control<PricingConfigFormValues>;
}) {
  return (
    <section className="admin-card-accent overflow-hidden">
      <div className="admin-panel-header bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
          <div>
            <h2 className="admin-panel-title">Platform billing settings</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tax and trial defaults applied across all customer subscriptions
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid gap-5 sm:grid-cols-2 max-w-2xl">
          <FormInput
            control={control}
            name="gstPercent"
            label="GST %"
            type="number"
            inputClassName="tabular-nums"
          />
          <FormInput
            control={control}
            name="freeTrialDays"
            label="Free trial (days)"
            type="number"
            inputClassName="tabular-nums"
          />
        </div>
        <p className="mt-4 text-xs text-slate-500 leading-relaxed max-w-xl">
          Customer billing cycles (monthly or yearly) are configured per organization when you
          edit their plan. GST is applied to the monthly subtotal on each invoice.
        </p>
      </div>
    </section>
  );
}
