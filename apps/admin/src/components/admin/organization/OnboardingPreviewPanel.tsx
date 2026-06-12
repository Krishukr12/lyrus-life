import { Building2, Globe, Mail, MapPin, User } from "lucide-react";
import { OrganizationAvatar } from "@/components/admin/OrganizationAvatar";
import { PlanBadge } from "@/components/admin/billing/PlanBadge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { OnboardingFormValues } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type OnboardingPreviewPanelProps = {
  values: Partial<OnboardingFormValues>;
  className?: string;
};

export function OnboardingPreviewPanel({ values, className }: OnboardingPreviewPanelProps) {
  const orgName = values.name?.trim() || "Your Organization";
  const adminName = [values.adminFirstName, values.adminLastName].filter(Boolean).join(" ").trim();
  const location = [values.city, values.state, values.country].filter(Boolean).join(", ");

  return (
    <aside
      className={cn(
        "sticky top-6 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white",
        "shadow-[0_8px_32px_rgba(15,23,42,0.08)]",
        className,
      )}
    >
      <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/40 px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Live Preview
        </p>
        <p className="mt-0.5 text-xs text-slate-500">Updates as you complete the form</p>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-3">
          <OrganizationAvatar name={orgName} className="h-14 w-14 rounded-2xl text-base shadow-sm" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold tracking-tight text-slate-900">{orgName}</h3>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {values.slug || "organization-slug"}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <StatusBadge status={values.onboardingStatus ?? "PENDING_SETUP"} />
              {values.subscriptionPlan ? <PlanBadge plan={values.subscriptionPlan} /> : null}
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <PreviewRow
            icon={Building2}
            label="Industry"
            value={values.industry || "—"}
          />
          <PreviewRow
            icon={Globe}
            label="Timezone"
            value={values.timezone || "—"}
          />
          <PreviewRow icon={MapPin} label="Location" value={location || "—"} />
          <PreviewRow
            icon={User}
            label="Admin"
            value={adminName || values.adminEmail || "—"}
          />
          <PreviewRow
            icon={Mail}
            label="Contact"
            value={values.primaryContactEmail || values.adminEmail || "—"}
          />
        </div>

        {values.companySize ? (
          <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Company size
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-800">{values.companySize} employees</p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function PreviewRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="truncate text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}
