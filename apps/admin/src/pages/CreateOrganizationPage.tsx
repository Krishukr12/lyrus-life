import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { PageContainer } from "@/components/admin/PageContainer";
import { OnboardingStepper } from "@/components/admin/OnboardingStepper";
import {
  FormSubsection,
  OnboardingStepShell,
} from "@/components/admin/organization/OnboardingStepShell";
import { MeetingNotesConfigStep } from "@/components/admin/organization/meeting-notes/MeetingNotesConfigStep";
import { OnboardingPlanCards } from "@/components/admin/organization/OnboardingPlanCards";
import { OnboardingReviewSection } from "@/components/admin/organization/OnboardingReviewSection";
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
import type { OnboardingMomTemplateDraft } from "@/lib/mom-template-types";
import { validateTemplateDraft } from "@/lib/mom-template-utils";
import { toCreateOrganizationPayload } from "@/lib/onboarding";

const TOTAL_STEPS = 6;

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

const STEP_FIELDS: Partial<Record<number, (keyof OnboardingFormValues)[]>> = {
  1: ["name", "code", "slug", "industry", "companySize"],
  2: ["country", "timezone", "primaryContactName", "primaryContactEmail", "primaryContactPhone"],
  3: ["subscriptionPlan"],
  5: ["adminFirstName", "adminLastName", "adminEmail"],
};

const SECTION_IDS: Record<number, string> = {
  1: "step-company",
  2: "step-business",
  3: "step-subscription",
  4: "step-meeting-notes",
  5: "step-admin",
  6: "step-review",
};

function computeCompletion(values: OnboardingFormValues, momTemplates: OnboardingMomTemplateDraft[]): number {
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
    momTemplates.length > 0 ? "yes" : "",
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
  const [currentStep, setCurrentStep] = useState(1);
  const [momTemplates, setMomTemplates] = useState<OnboardingMomTemplateDraft[]>([]);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: onboardingFormDefaults,
    mode: "onBlur",
  });

  const formValues = form.watch();
  const nameValue = form.watch("name");
  const completionPercent = computeCompletion(formValues, momTemplates);

  const { data: pricingData } = useQuery({
    queryKey: ["admin", "billing", "pricing"],
    queryFn: () => adminApi.getBillingPricing(),
  });

  useEffect(() => {
    if (!slugTouched.current && nameValue) {
      form.setValue("slug", slugifyOrganizationName(nameValue), { shouldValidate: false });
    }
  }, [nameValue, form]);

  const create = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const result = await adminApi.createOrganization(payload);
      const uploads = momTemplates.filter((t) => t.pendingUpload);
      if (uploads.length > 0) {
        const { items } = await adminApi.listMomTemplates(result.organization.id);
        for (const draft of uploads) {
          const match = items.find((item) => item.name === draft.name);
          if (match && draft.pendingUpload) {
            await adminApi.uploadMomTemplateFile(
              result.organization.id,
              match.id,
              draft.pendingUpload,
            );
          }
        }
      }
      return result;
    },
    onSuccess: (result) => {
      toast.success("Organization onboarded", {
        description: `Temporary password: ${result.temporaryPassword}`,
        duration: 20000,
      });
      navigate(`/organizations/${result.organization.id}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function scrollToSection(sectionId: string) {
    const stepMap: Record<string, number> = {
      "step-company": 1,
      "step-business": 2,
      "step-subscription": 3,
      "step-meeting-notes": 4,
      "step-admin": 5,
    };
    const step = stepMap[sectionId];
    if (step) setCurrentStep(step);
  }

  async function validateCurrentStep(): Promise<boolean> {
    if (currentStep === 4) {
      if (momTemplates.length === 0) {
        toast.error("Choose at least one meeting notes template");
        return false;
      }
      for (const template of momTemplates) {
        const error = validateTemplateDraft(template);
        if (error) {
          toast.error(error);
          return false;
        }
      }
      if (!momTemplates.some((t) => t.isDefault)) {
        toast.error("Mark one template as the default");
        return false;
      }
      return true;
    }

    const fields = STEP_FIELDS[currentStep];
    if (!fields?.length) return true;
    return form.trigger(fields);
  }

  async function handleNext() {
    const valid = await validateCurrentStep();
    if (!valid) return;
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function handleBack() {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }

  function onSubmit(values: OnboardingFormValues) {
    if (momTemplates.length === 0) {
      toast.error("Choose at least one meeting notes template");
      return;
    }

    for (const template of momTemplates) {
      const error = validateTemplateDraft(template);
      if (error) {
        toast.error(error);
        return;
      }
    }

    if (!momTemplates.some((t) => t.isDefault)) {
      toast.error("Mark one template as the default");
      return;
    }

    create.mutate(toCreateOrganizationPayload(values, momTemplates));
  }

  const labelClass = "text-sm font-medium text-slate-700";

  return (
    <PageContainer narrow>
      <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-slate-600" asChild>
        <Link to="/organizations">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to organizations
        </Link>
      </Button>

      <PageHeader
        eyebrow="Onboarding"
        title="Onboard organization"
        description="Set up a new tenant in a few guided steps."
      />

      <OnboardingStepper
        currentStep={currentStep}
        completionPercent={completionPercent}
        onStepClick={(step) => step < currentStep && setCurrentStep(step)}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pb-28" noValidate>
          <div id={SECTION_IDS[currentStep]} className="mx-auto max-w-3xl">
            {currentStep === 1 && (
              <OnboardingStepShell
                step={1}
                title="Company identity"
                description="Basic details about the organization."
              >
                <FormGrid>
                  <FormGridFull>
                    <FormInput
                      control={form.control}
                      name="name"
                      label="Organization name *"
                      placeholder="Reliance Industries Ltd"
                      labelClassName={labelClass}
                    />
                  </FormGridFull>
                  <FormInput
                    control={form.control}
                    name="code"
                    label="Organization code *"
                    placeholder="REL001"
                    inputClassName="font-mono uppercase"
                    labelClassName={labelClass}
                  />
                  <FormInput
                    control={form.control}
                    name="slug"
                    label="URL slug *"
                    inputClassName="font-mono"
                    placeholder="reliance-industries"
                    labelClassName={labelClass}
                    onFocus={() => {
                      slugTouched.current = true;
                    }}
                  />
                  <FormGridFull>
                    <FormInput
                      control={form.control}
                      name="legalBusinessName"
                      label="Legal business name"
                      labelClassName={labelClass}
                    />
                  </FormGridFull>
                  <FormInput
                    control={form.control}
                    name="industry"
                    label="Industry *"
                    placeholder="Manufacturing, Technology, etc."
                    labelClassName={labelClass}
                  />
                  <FormSelect
                    control={form.control}
                    name="companySize"
                    label="Company size *"
                    placeholder="Select company size"
                    options={COMPANY_SIZE_OPTIONS}
                  />
                </FormGrid>
              </OnboardingStepShell>
            )}

            {currentStep === 2 && (
              <OnboardingStepShell
                step={2}
                title="Business details"
                description="Location, website, and primary contact."
              >
                <div className="space-y-8">
                  <FormSubsection title="Location">
                    <FormGrid>
                      <FormInput
                        control={form.control}
                        name="country"
                        label="Country *"
                        labelClassName={labelClass}
                      />
                      <FormInput
                        control={form.control}
                        name="state"
                        label="State / Province"
                        labelClassName={labelClass}
                      />
                      <FormInput
                        control={form.control}
                        name="city"
                        label="City"
                        labelClassName={labelClass}
                      />
                      <FormSelect
                        control={form.control}
                        name="timezone"
                        label="Timezone *"
                        options={TIMEZONE_OPTIONS}
                      />
                    </FormGrid>
                  </FormSubsection>

                  <FormSubsection title="Website">
                    <FormInput
                      control={form.control}
                      name="website"
                      label="Website"
                      type="url"
                      placeholder="https://example.com"
                      labelClassName={labelClass}
                    />
                  </FormSubsection>

                  <FormSubsection title="Primary contact">
                    <FormGrid>
                      <FormGridFull>
                        <FormInput
                          control={form.control}
                          name="primaryContactName"
                          label="Contact name *"
                          labelClassName={labelClass}
                        />
                      </FormGridFull>
                      <FormInput
                        control={form.control}
                        name="primaryContactEmail"
                        label="Email *"
                        type="email"
                        autoComplete="email"
                        labelClassName={labelClass}
                      />
                      <FormInput
                        control={form.control}
                        name="primaryContactPhone"
                        label="Phone *"
                        type="tel"
                        placeholder="+91 98765 43210"
                        labelClassName={labelClass}
                      />
                    </FormGrid>
                  </FormSubsection>
                </div>
              </OnboardingStepShell>
            )}

            {currentStep === 3 && (
              <OnboardingStepShell
                step={3}
                title="Subscription plan"
                description="Choose a plan for this tenant."
              >
                <div className="space-y-6">
                  <OnboardingPlanCards
                    value={formValues.subscriptionPlan}
                    onChange={(plan) =>
                      form.setValue("subscriptionPlan", plan, { shouldValidate: true })
                    }
                    pricing={pricingData?.pricing}
                  />

                  <details className="group rounded-xl border border-slate-200/80 bg-slate-50/50">
                    <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-slate-700 marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center justify-between">
                        Customize limits & billing
                        <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-90" />
                      </span>
                    </summary>
                    <div className="border-t border-slate-200/80 px-4 pb-4 pt-2">
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
                          labelClassName={labelClass}
                        />
                        <FormInput
                          control={form.control}
                          name="maxEmployees"
                          label="Max employees"
                          type="number"
                          labelClassName={labelClass}
                        />
                        <FormInput
                          control={form.control}
                          name="maxMeetingRooms"
                          label="Max meeting rooms"
                          type="number"
                          labelClassName={labelClass}
                        />
                        <FormInput
                          control={form.control}
                          name="storageLimitGb"
                          label="Storage limit (GB)"
                          type="number"
                          labelClassName={labelClass}
                        />
                      </FormGrid>
                    </div>
                  </details>
                </div>
              </OnboardingStepShell>
            )}

            {currentStep === 4 && (
              <OnboardingStepShell
                step={4}
                title="Meeting notes template"
                description="Pick how AI-generated minutes are structured."
              >
                <MeetingNotesConfigStep templates={momTemplates} onChange={setMomTemplates} />
              </OnboardingStepShell>
            )}

            {currentStep === 5 && (
              <OnboardingStepShell
                step={5}
                title="Admin account"
                description="Credentials for the tenant administrator."
              >
                <FormGrid>
                  <FormInput
                    control={form.control}
                    name="adminFirstName"
                    label="First name *"
                    labelClassName={labelClass}
                  />
                  <FormInput
                    control={form.control}
                    name="adminLastName"
                    label="Last name *"
                    labelClassName={labelClass}
                  />
                  <FormInput
                    control={form.control}
                    name="adminEmail"
                    label="Email *"
                    type="email"
                    autoComplete="email"
                    labelClassName={labelClass}
                  />
                  <FormInput
                    control={form.control}
                    name="adminPhone"
                    label="Phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    labelClassName={labelClass}
                  />
                  <FormGridFull>
                    <FormSelect
                      control={form.control}
                      name="onboardingStatus"
                      label="Initial status"
                      options={STATUS_OPTIONS}
                    />
                  </FormGridFull>
                </FormGrid>
              </OnboardingStepShell>
            )}

            {currentStep === 6 && (
              <OnboardingStepShell
                step={6}
                title="Review & confirm"
                description="Verify everything looks correct before provisioning."
              >
                <OnboardingReviewSection
                  values={formValues}
                  momTemplates={momTemplates}
                  onEditSection={scrollToSection}
                />
              </OnboardingStepShell>
            )}
          </div>

          <div
            className={cn(
              "fixed bottom-0 left-0 right-0 z-10 border-t border-slate-200/80 bg-white/95 backdrop-blur-md",
              collapsed ? "lg:left-[4.5rem]" : "lg:left-64",
            )}
          >
            <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 lg:px-8">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={handleBack}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <Button type="button" variant="outline" className="rounded-xl" asChild>
                  <Link to="/organizations">Cancel</Link>
                </Button>
              )}

              {currentStep < TOTAL_STEPS ? (
                <Button
                  type="button"
                  className="ml-auto min-w-[140px] rounded-xl bg-blue-600 hover:bg-blue-700"
                  onClick={handleNext}
                >
                  Continue
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="ml-auto min-w-[180px] rounded-xl bg-blue-600 shadow-sm hover:bg-blue-700"
                  disabled={create.isPending}
                >
                  {create.isPending ? "Provisioning…" : "Create organization"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </PageContainer>
  );
}
