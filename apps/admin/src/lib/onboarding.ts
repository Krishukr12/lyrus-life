import type { OnboardingFormValues } from "@/lib/schemas";
import type { OnboardingMomTemplateDraft } from "@/lib/mom-template-types";
import { draftToApiPayload } from "@/lib/mom-template-utils";

function mapOnboardingStatusToOrgStatus(
  status: OnboardingFormValues["onboardingStatus"],
): "ACTIVE" | "SUSPENDED" | "PENDING" {
  if (status === "SUSPENDED") return "SUSPENDED";
  if (status === "PENDING_SETUP") return "PENDING";
  return "ACTIVE";
}

export function toCreateOrganizationPayload(
  form: OnboardingFormValues,
  momTemplates?: OnboardingMomTemplateDraft[],
) {
  const address = [form.city, form.state, form.country].filter(Boolean).join(", ");
  const defaultTemplateIndex = momTemplates?.findIndex((t) => t.isDefault) ?? 0;

  return {
    name: form.name,
    code: form.code.toUpperCase(),
    slug: form.slug,
    legalName: form.legalBusinessName || undefined,
    primaryContactName: form.primaryContactName,
    industry: form.industry || undefined,
    email: form.primaryContactEmail,
    phone: form.primaryContactPhone,
    website: form.website || undefined,
    companySize: form.companySize,
    country: form.country,
    state: form.state || undefined,
    city: form.city || undefined,
    address: address || undefined,
    timezone: form.timezone,
    subscriptionPlan: form.subscriptionPlan,
    billingCycle: form.billingCycle === "annual" ? "yearly" : "monthly",
    status: mapOnboardingStatusToOrgStatus(form.onboardingStatus),
    adminFirstName: form.adminFirstName,
    adminLastName: form.adminLastName,
    adminEmail: form.adminEmail,
    adminPhone: form.adminPhone || undefined,
    ...(momTemplates && momTemplates.length > 0
      ? {
          momTemplates: {
            templates: momTemplates.map(draftToApiPayload),
            defaultTemplateIndex: defaultTemplateIndex >= 0 ? defaultTemplateIndex : 0,
          },
        }
      : {}),
  };
}
