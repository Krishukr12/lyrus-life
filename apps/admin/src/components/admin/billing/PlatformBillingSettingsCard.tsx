import type { Control } from "react-hook-form";
import { ArrowUpRight, Settings2 } from "lucide-react";
import { FormInput } from "@/components/admin/FormFields";
import type { PricingConfigFormValues } from "@/lib/billing-schemas";

const cardShell =
  "overflow-hidden rounded-[28px] border border-slate-100/80 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)]";

export function PlatformBillingSettingsCard({
  control,
}: {
  control: Control<PricingConfigFormValues>;
}) {
  return (
    <section className={cardShell}>
      <div className="flex items-center justify-between gap-3 px-6 py-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Settings2 className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              Platform billing settings
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Tax and trial defaults applied across all customer subscriptions
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
      <div className="px-6 pb-6">
        <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
          <FormInput
            control={control}
            name="gstPercent"
            label="GST %"
            type="number"
            inputClassName="tabular-nums rounded-xl"
          />
          <FormInput
            control={control}
            name="freeTrialDays"
            label="Free trial (days)"
            type="number"
            inputClassName="tabular-nums rounded-xl"
          />
        </div>
        <p className="mt-4 max-w-xl text-xs leading-relaxed text-slate-400">
          Customer billing cycles (monthly or yearly) are configured per organization when you
          edit their plan. GST is applied to the monthly subtotal on each invoice.
        </p>
      </div>
    </section>
  );
}
