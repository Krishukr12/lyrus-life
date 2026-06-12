import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const indianPhoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const organizationsFilterSchema = z.object({
  search: z.string().max(120, "Search is too long"),
  status: z.enum(["all", "ACTIVE", "SUSPENDED", "PENDING"]),
});

export type OrganizationsFilterValues = z.infer<typeof organizationsFilterSchema>;

export const globalSearchSchema = z.object({
  query: z.string().max(120, "Search query is too long"),
});

export type GlobalSearchValues = z.infer<typeof globalSearchSchema>;

export const companySizeSchema = z.enum(["1-10", "11-50", "51-200", "201-500", "500+"], {
  required_error: "Select company size",
});

export const onboardingStatusSchema = z.enum(["ACTIVE", "TRIAL", "SUSPENDED", "PENDING_SETUP"]);

export const billingCycleSchema = z.enum(["monthly", "annual"]);

export const subscriptionPlanSchema = z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE"]);

export const onboardingFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Organization name must be at least 2 characters")
    .max(200, "Organization name is too long"),
  code: z
    .string()
    .trim()
    .min(2, "Organization code is required")
    .max(20, "Code is too long")
    .regex(/^[A-Za-z0-9]+$/, "Use letters and numbers only"),
  legalBusinessName: z.string().trim().max(200, "Legal name is too long").optional().or(z.literal("")),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(80, "Slug is too long")
    .regex(slugRegex, "Use lowercase letters, numbers, and hyphens only"),
  industry: z.string().trim().min(1, "Industry is required").max(120, "Industry is too long"),
  companySize: companySizeSchema,
  primaryContactName: z
    .string()
    .trim()
    .min(1, "Contact name is required")
    .max(120, "Contact name is too long"),
  primaryContactEmail: z
    .string()
    .trim()
    .min(1, "Contact email is required")
    .email("Enter a valid email address"),
  primaryContactPhone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .regex(indianPhoneRegex, "Enter a valid Indian mobile number (e.g. +91 98765 43210)"),
  website: z.union([
    z.literal(""),
    z.string().trim().url("Enter a valid URL (include https://)"),
  ]),
  country: z.string().trim().min(1, "Country is required").max(80, "Country is too long"),
  state: z.string().trim().max(80, "State is too long").optional().or(z.literal("")),
  city: z.string().trim().max(80, "City is too long").optional().or(z.literal("")),
  timezone: z.string().min(1, "Timezone is required"),
  subscriptionPlan: subscriptionPlanSchema,
  billingCycle: billingCycleSchema,
  trialDays: z.coerce
    .number({ invalid_type_error: "Enter a valid number" })
    .int("Trial days must be a whole number")
    .min(0, "Trial days cannot be negative")
    .max(365, "Trial days cannot exceed 365"),
  maxEmployees: z.coerce
    .number({ invalid_type_error: "Enter a valid number" })
    .int("Must be a whole number")
    .min(1, "At least 1 employee")
    .max(100_000, "Limit too high"),
  maxMeetingRooms: z.coerce
    .number({ invalid_type_error: "Enter a valid number" })
    .int("Must be a whole number")
    .min(1, "At least 1 room")
    .max(10_000, "Limit too high"),
  storageLimitGb: z.coerce
    .number({ invalid_type_error: "Enter a valid number" })
    .int("Must be a whole number")
    .min(1, "At least 1 GB")
    .max(100_000, "Limit too high"),
  adminFirstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(80, "First name is too long"),
  adminLastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(80, "Last name is too long"),
  adminEmail: z
    .string()
    .trim()
    .min(1, "Admin email is required")
    .email("Enter a valid email address"),
  adminPhone: z.union([
    z.literal(""),
    z.string().trim().regex(indianPhoneRegex, "Enter a valid Indian mobile number"),
  ]),
  onboardingStatus: onboardingStatusSchema,
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

export const onboardingFormDefaults: OnboardingFormValues = {
  name: "",
  code: "",
  legalBusinessName: "",
  slug: "",
  industry: "",
  companySize: "11-50",
  primaryContactName: "",
  primaryContactEmail: "",
  primaryContactPhone: "",
  website: "",
  country: "India",
  state: "",
  city: "",
  timezone: "Asia/Kolkata",
  subscriptionPlan: "STARTER",
  billingCycle: "monthly",
  trialDays: 14,
  maxEmployees: 50,
  maxMeetingRooms: 10,
  storageLimitGb: 100,
  adminFirstName: "",
  adminLastName: "",
  adminEmail: "",
  adminPhone: "",
  onboardingStatus: "ACTIVE",
};
