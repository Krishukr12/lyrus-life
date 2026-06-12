import type { OnboardingFormValues } from "@/lib/schemas";

function mapOnboardingStatusToOrgStatus(
  status: OnboardingFormValues["onboardingStatus"],
): "ACTIVE" | "SUSPENDED" | "PENDING" {
  if (status === "SUSPENDED") return "SUSPENDED";
  if (status === "PENDING_SETUP") return "PENDING";
  return "ACTIVE";
}

export function toCreateOrganizationPayload(form: OnboardingFormValues) {
  const address = [form.city, form.state, form.country].filter(Boolean).join(", ");
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
    status: mapOnboardingStatusToOrgStatus(form.onboardingStatus),
    adminFirstName: form.adminFirstName,
    adminLastName: form.adminLastName,
    adminEmail: form.adminEmail,
    adminPhone: form.adminPhone || undefined,
  };
}
