import {
  AlertCircle,
  Building2,
  CreditCard,
  FileText,
  Globe,
  MapPin,
  Pencil,
  Shield,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { OrganizationAvatar } from "@/components/admin/OrganizationAvatar";
import { PlanBadge } from "@/components/admin/billing/PlanBadge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { MomDocumentPreview } from "@/components/admin/organization/meeting-notes/MomDocumentPreview";
import { Button } from "@/components/ui/button";
import type { OnboardingMomTemplateDraft } from "@/lib/mom-template-types";
import type { OnboardingFormValues } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const COMPANY_SIZE_LABELS: Record<string, string> = {
  "1-10": "1–10 employees",
  "11-50": "11–50 employees",
  "51-200": "51–200 employees",
  "201-500": "201–500 employees",
  "500+": "500+ employees",
};

const BILLING_LABELS: Record<string, string> = {
  monthly: "Monthly",
  annual: "Annual",
};

type ReviewBlock = {
  id: string;
  title: string;
  icon: LucideIcon;
  rows: Array<{ label: string; value: string; required?: boolean }>;
};

type OnboardingReviewSectionProps = {
  values: OnboardingFormValues;
  momTemplates: OnboardingMomTemplateDraft[];
  onEditSection: (sectionId: string) => void;
};

function display(value: string | number | undefined | null, required = false): string {
  const text = value === undefined || value === null ? "" : String(value).trim();
  if (text) return text;
  return required ? "Not filled" : "—";
}

function isMissing(value: string | number | undefined | null): boolean {
  return !String(value ?? "").trim();
}

export function OnboardingReviewSection({
  values,
  momTemplates,
  onEditSection,
}: OnboardingReviewSectionProps) {
  const orgName = values.name?.trim() || "Your Organization";
  const adminName = [values.adminFirstName, values.adminLastName].filter(Boolean).join(" ").trim();
  const location = [values.city, values.state, values.country].filter(Boolean).join(", ");
  const defaultTemplate = momTemplates.find((t) => t.isDefault) ?? momTemplates[0];

  const blocks: ReviewBlock[] = [
    {
      id: "step-company",
      title: "Company identity",
      icon: Building2,
      rows: [
        { label: "Organization name", value: display(values.name, true), required: true },
        { label: "Organization code", value: display(values.code, true), required: true },
        { label: "Slug", value: display(values.slug, true), required: true },
        { label: "Legal business name", value: display(values.legalBusinessName) },
        { label: "Industry", value: display(values.industry, true), required: true },
        {
          label: "Company size",
          value: values.companySize
            ? (COMPANY_SIZE_LABELS[values.companySize] ?? values.companySize)
            : display(undefined, true),
          required: true,
        },
      ],
    },
    {
      id: "step-business",
      title: "Business details",
      icon: MapPin,
      rows: [
        { label: "Country", value: display(values.country, true), required: true },
        { label: "State / Province", value: display(values.state) },
        { label: "City", value: display(values.city) },
        { label: "Timezone", value: display(values.timezone, true), required: true },
        { label: "Website", value: display(values.website) },
        { label: "Primary contact", value: display(values.primaryContactName, true), required: true },
        { label: "Contact email", value: display(values.primaryContactEmail, true), required: true },
        { label: "Contact phone", value: display(values.primaryContactPhone, true), required: true },
        { label: "Location", value: location || "—" },
      ],
    },
    {
      id: "step-subscription",
      title: "Subscription plan",
      icon: CreditCard,
      rows: [
        { label: "Plan", value: display(values.subscriptionPlan, true), required: true },
        {
          label: "Billing cycle",
          value: BILLING_LABELS[values.billingCycle] ?? display(values.billingCycle),
        },
        { label: "Trial days", value: display(values.trialDays) },
        { label: "Max employees", value: display(values.maxEmployees) },
        { label: "Max meeting rooms", value: display(values.maxMeetingRooms) },
        { label: "Storage limit", value: values.storageLimitGb ? `${values.storageLimitGb} GB` : "—" },
      ],
    },
    {
      id: "step-meeting-notes",
      title: "Meeting notes template",
      icon: FileText,
      rows: momTemplates.length
        ? momTemplates.map((t) => ({
            label: t.isDefault ? `${t.name} (default)` : t.name,
            value: `${t.sections.length} sections`,
            required: true,
          }))
        : [{ label: "Templates", value: "Not filled", required: true }],
    },
    {
      id: "step-admin",
      title: "Admin account",
      icon: Shield,
      rows: [
        { label: "Name", value: adminName || "Not filled", required: !adminName },
        { label: "Email", value: display(values.adminEmail, true), required: true },
        { label: "Phone", value: display(values.adminPhone) },
        { label: "Onboarding status", value: display(values.onboardingStatus) },
      ],
    },
  ];

  const missingCount = blocks.reduce((count, block) => {
    return count + block.rows.filter((r) => r.required && (r.value === "Not filled" || r.value === "—")).length;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 sm:flex-row sm:items-center">
        <OrganizationAvatar name={orgName} className="h-16 w-16 rounded-2xl text-lg shadow-sm" />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-slate-900">{orgName}</h3>
          <p className="text-sm text-slate-500">{values.slug || "organization-slug"}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={values.onboardingStatus ?? "PENDING_SETUP"} />
            {values.subscriptionPlan ? <PlanBadge plan={values.subscriptionPlan} /> : null}
          </div>
        </div>
        {missingCount > 0 ? (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {missingCount} required field{missingCount === 1 ? "" : "s"} missing
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
            Ready to provision
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {blocks.map((block) => {
          const Icon = block.icon;
          const hasMissing = block.rows.some(
            (r) => r.required && (r.value === "Not filled" || r.value === "—"),
          );

          return (
            <div
              key={block.id}
              className={cn(
                "rounded-xl border bg-white p-4",
                hasMissing ? "border-amber-200/80" : "border-slate-200/80",
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">{block.title}</h4>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-lg text-xs text-blue-600 hover:text-blue-700"
                  onClick={() => onEditSection(block.id)}
                >
                  <Pencil className="mr-1 h-3 w-3" />
                  Edit
                </Button>
              </div>

              <dl className="space-y-2">
                {block.rows.map((row) => (
                  <div key={row.label} className="flex justify-between gap-3 text-sm">
                    <dt className="shrink-0 text-slate-500">{row.label}</dt>
                    <dd
                      className={cn(
                        "min-w-0 text-right font-medium",
                        row.value === "Not filled" ? "text-amber-600" : "text-slate-800",
                      )}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          );
        })}
      </div>

      {defaultTemplate ? (
        <div className="rounded-xl border border-slate-200/80 bg-white p-4">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Meeting notes preview</h4>
                <p className="text-xs text-slate-500">
                  How generated minutes will look for {defaultTemplate.name}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 rounded-lg text-xs text-blue-600 hover:text-blue-700"
              onClick={() => onEditSection("step-meeting-notes")}
            >
              <Pencil className="mr-1 h-3 w-3" />
              Edit template
            </Button>
          </div>
          <div className="mx-auto max-w-lg">
            <MomDocumentPreview
              templateName={defaultTemplate.name}
              sections={defaultTemplate.sections.map((s) => ({
                title: s.title,
                description: s.description,
                isRequired: s.isRequired,
              }))}
              organizationName={orgName}
            />
          </div>
        </div>
      ) : null}

      {(isMissing(values.primaryContactEmail) || isMissing(values.adminEmail)) && (
        <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
          <User className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p>
            Review each section above and use <span className="font-semibold">Edit</span> to jump
            back and update any details before creating the organization.
          </p>
        </div>
      )}
    </div>
  );
}
