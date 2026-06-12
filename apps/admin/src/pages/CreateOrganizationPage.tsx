import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  Globe,
  MapPin,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { PageContainer } from "@/components/admin/PageContainer";
import { OnboardingStepper } from "@/components/admin/OnboardingStepper";
import { FormSection } from "@/components/admin/FormSection";
import { OnboardingPlanCards } from "@/components/admin/organization/OnboardingPlanCards";
import { OnboardingPreviewPanel } from "@/components/admin/organization/OnboardingPreviewPanel";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { FormGrid, FormGridFull, FormInput, FormSelect } from "@/components/admin/FormFields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { adminApi } from "@/services/api";
import { slugifyOrganizationName } from "@/lib/slugify";
import {
  onboardingFormDefaults,
  onboardingFormSchema,
  type OnboardingFormValues,
} from "@/lib/schemas";
import { toCreateOrganizationPayload } from "@/lib/onboarding";

const COMPANY_SIZE_OPTIONS = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+", label: "500+ employees" },
];

const TIMEZONE_OPTIONS = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Australia/Sydney",
].map((tz) => ({ value: tz, label: tz }));

const BILLING_OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "annual", label: "Annual" },
];

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "TRIAL", label: "Trial" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "PENDING_SETUP", label: "Pending setup" },
];

const SECTION_IDS = ["step-company", "step-business", "step-subscription", "step-admin"] as const;

function computeCompletion(values: OnboardingFormValues): number {
  const checks = [
    values.name,
    values.code,
    values.slug,
    values.industry,
    values.companySize,
    values.country,
    values.timezone,
    values.primaryContactName,
    values.primaryContactEmail,
    values.primaryContactPhone,
    values.subscriptionPlan,
    values.adminFirstName,
    values.adminLastName,
    values.adminEmail,
  ];
  const filled = checks.filter((v) => String(v ?? "").trim().length > 0).length;
  return Math.round((filled / checks.length) * 100);
}

export default function CreateOrganizationPage() {
  const navigate = useNavigate();
  const { collapsed } = useSidebar();
  const slugTouched = useRef(false);
  const [activeStep, setActiveStep] = useState(1);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: onboardingFormDefaults,
    mode: "onBlur",
  });

  const formValues = form.watch();
  const nameValue = form.watch("name");
  const completionPercent = computeCompletion(formValues);

  const { data: pricingData } = useQuery({
    queryKey: ["admin", "billing", "pricing"],
    queryFn: () => adminApi.getBillingPricing(),
  });

  useEffect(() => {
    if (!slugTouched.current && nameValue) {
      form.setValue("slug", slugifyOrganizationName(nameValue), { shouldValidate: false });
    }
  }, [nameValue, form]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id, index) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveStep(index + 1);
            }
          }
        },
        { rootMargin: "-20% 0px -55% 0px", threshold: 0 },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const create = useMutation({
    mutationFn: adminApi.createOrganization,
    onSuccess: (result) => {
      toast.success("Organization onboarded", {
        description: `Temporary password: ${result.temporaryPassword}`,
        duration: 20000,
      });
      navigate(`/organizations/${result.organization.id}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function onSubmit(values: OnboardingFormValues) {
    create.mutate(toCreateOrganizationPayload(values));
  }

  return (
    <PageContainer>
      <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-slate-600" asChild>
        <Link to="/organizations">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to organizations
        </Link>
      </Button>

      <PageHeader
        eyebrow="Onboarding"
        title="Onboard organization"
        description="Provision a new tenant with company profile, subscription plan, and admin credentials."
      />

      <OnboardingStepper activeStep={activeStep} completionPercent={completionPercent} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pb-28" noValidate>
          <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              {/* Step 1 — Company Identity */}
              <div id="step-company">
                <FormSection
                  step={1}
                  title="Company Identity"
                  description="Core organization details and business profile."
                  icon={Building2}
                >
                  <FormGrid>
                    <FormGridFull>
                      <FormInput
                        control={form.control}
                        name="name"
                        label="Organization name *"
                        placeholder="Reliance Industries Ltd"
                        labelClassName="text-sm font-semibold text-slate-800"
                      />
                    </FormGridFull>
                    <FormInput
                      control={form.control}
                      name="code"
                      label="Organization code *"
                      placeholder="REL001"
                      inputClassName="font-mono uppercase rounded-xl"
                      labelClassName="text-sm font-semibold text-slate-800"
                    />
                    <FormInput
                      control={form.control}
                      name="slug"
                      label="Organization slug *"
                      inputClassName="font-mono rounded-xl"
                      placeholder="acme-corp"
                      labelClassName="text-sm font-semibold text-slate-800"
                      onFocus={() => {
                        slugTouched.current = true;
                      }}
                    />
                    <FormGridFull>
                      <FormInput
                        control={form.control}
                        name="legalBusinessName"
                        label="Legal business name"
                        labelClassName="text-sm font-semibold text-slate-800"
                      />
                    </FormGridFull>
                    <FormInput
                      control={form.control}
                      name="industry"
                      label="Industry *"
                      labelClassName="text-sm font-semibold text-slate-800"
                    />
                    <FormGridFull>
                      <FormSelect
                        control={form.control}
                        name="companySize"
                        label="Company size *"
                        placeholder="Select company size"
                        options={COMPANY_SIZE_OPTIONS}
                      />
                    </FormGridFull>
                  </FormGrid>
                </FormSection>
              </div>

              {/* Step 2 — Business Details */}
              <div id="step-business" className="space-y-6">
                <FormSection
                  title="Location"
                  description="Regional settings and headquarters location."
                  icon={MapPin}
                >
                  <FormGrid>
                    <FormInput
                      control={form.control}
                      name="country"
                      label="Country *"
                      labelClassName="text-sm font-semibold text-slate-800"
                    />
                    <FormInput
                      control={form.control}
                      name="state"
                      label="State / Province"
                      labelClassName="text-sm font-semibold text-slate-800"
                    />
                    <FormInput
                      control={form.control}
                      name="city"
                      label="City"
                      labelClassName="text-sm font-semibold text-slate-800"
                    />
                    <FormSelect
                      control={form.control}
                      name="timezone"
                      label="Timezone *"
                      options={TIMEZONE_OPTIONS}
                    />
                  </FormGrid>
                </FormSection>

                <FormSection
                  title="Digital Presence"
                  description="Public-facing company information."
                  icon={Globe}
                >
                  <FormGrid>
                    <FormGridFull>
                      <FormInput
                        control={form.control}
                        name="website"
                        label="Website"
                        type="url"
                        placeholder="https://example.com"
                        labelClassName="text-sm font-semibold text-slate-800"
                      />
                    </FormGridFull>
                  </FormGrid>
                </FormSection>

                <FormSection
                  step={2}
                  title="Contact Information"
                  description="Primary billing and operations contact."
                  icon={User}
                >
                  <FormGrid>
                    <FormGridFull>
                      <FormInput
                        control={form.control}
                        name="primaryContactName"
                        label="Primary contact name *"
                        labelClassName="text-sm font-semibold text-slate-800"
                      />
                    </FormGridFull>
                    <FormInput
                      control={form.control}
                      name="primaryContactEmail"
                      label="Primary contact email *"
                      type="email"
                      autoComplete="email"
                      labelClassName="text-sm font-semibold text-slate-800"
                    />
                    <FormInput
                      control={form.control}
                      name="primaryContactPhone"
                      label="Primary contact phone *"
                      type="tel"
                      placeholder="+91 98765 43210"
                      labelClassName="text-sm font-semibold text-slate-800"
                    />
                  </FormGrid>
                </FormSection>
              </div>

              {/* Step 3 — Subscription */}
              <div id="step-subscription">
                <FormSection
                  step={3}
                  title="Subscription Plan"
                  description="Choose a plan and configure limits for this tenant."
                  icon={CreditCard}
                >
                  <div className="mb-6">
                    <p className="mb-3 text-sm font-semibold text-slate-800">Select plan *</p>
                    <OnboardingPlanCards
                      value={formValues.subscriptionPlan}
                      onChange={(plan) =>
                        form.setValue("subscriptionPlan", plan, { shouldValidate: true })
                      }
                      pricing={pricingData?.pricing}
                    />
                  </div>

                  <FormGrid>
                    <FormSelect
                      control={form.control}
                      name="billingCycle"
                      label="Billing cycle"
                      options={BILLING_OPTIONS}
                    />
                    <FormInput
                      control={form.control}
                      name="trialDays"
                      label="Trial days"
                      type="number"
                      labelClassName="text-sm font-semibold text-slate-800"
                    />
                    <FormInput
                      control={form.control}
                      name="maxEmployees"
                      label="Max employees"
                      type="number"
                      labelClassName="text-sm font-semibold text-slate-800"
                    />
                    <FormInput
                      control={form.control}
                      name="maxMeetingRooms"
                      label="Max meeting rooms"
                      type="number"
                      labelClassName="text-sm font-semibold text-slate-800"
                    />
                    <FormInput
                      control={form.control}
                      name="storageLimitGb"
                      label="Storage limit (GB)"
                      type="number"
                      labelClassName="text-sm font-semibold text-slate-800"
                    />
                  </FormGrid>
                </FormSection>
              </div>

              {/* Step 4 — Admin */}
              <div id="step-admin">
                <FormSection
                  step={4}
                  title="Admin Account"
                  description="Initial tenant administrator credentials."
                  icon={Shield}
                >
                  <FormGrid>
                    <FormInput
                      control={form.control}
                      name="adminFirstName"
                      label="First name *"
                      labelClassName="text-sm font-semibold text-slate-800"
                    />
                    <FormInput
                      control={form.control}
                      name="adminLastName"
                      label="Last name *"
                      labelClassName="text-sm font-semibold text-slate-800"
                    />
                    <FormInput
                      control={form.control}
                      name="adminEmail"
                      label="Email *"
                      type="email"
                      autoComplete="email"
                      labelClassName="text-sm font-semibold text-slate-800"
                    />
                    <FormInput
                      control={form.control}
                      name="adminPhone"
                      label="Phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      labelClassName="text-sm font-semibold text-slate-800"
                    />
                    <FormGridFull>
                      <FormSelect
                        control={form.control}
                        name="onboardingStatus"
                        label="Onboarding status"
                        options={STATUS_OPTIONS}
                      />
                    </FormGridFull>
                  </FormGrid>
                </FormSection>
              </div>

              <div className="flex items-start gap-3 rounded-[22px] border border-blue-100 bg-blue-50/50 p-4">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <p className="text-xs leading-relaxed text-slate-600">
                  Core tenant data is provisioned via the organization API. Subscription limit
                  fields are stored in admin records for operational reference.
                </p>
              </div>
            </div>

            {/* Live preview — desktop only */}
            <div className="hidden xl:block">
              <OnboardingPreviewPanel values={formValues} />
            </div>
          </div>

          <div
            className={cn(
              "fixed bottom-0 left-0 right-0 z-10 border-t border-slate-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80",
              collapsed ? "lg:left-[4.5rem]" : "lg:left-64",
            )}
          >
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4 lg:px-8">
              <Button
                type="submit"
                className="min-w-[180px] rounded-xl bg-blue-600 shadow-sm shadow-blue-600/20 hover:bg-blue-700"
                disabled={create.isPending}
              >
                {create.isPending ? "Provisioning…" : "Create organization"}
              </Button>
              <Button type="button" variant="outline" className="rounded-xl" asChild>
                <Link to="/organizations">Cancel</Link>
              </Button>
              <span className="ml-auto hidden text-xs text-slate-500 sm:inline">
                {completionPercent}% complete
              </span>
            </div>
          </div>
        </form>
      </Form>
    </PageContainer>
  );
}
