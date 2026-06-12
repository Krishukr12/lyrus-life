import { z } from "zod";
import { indianPhoneSchema, optionalIndianPhoneSchema } from "./phone.js";

export const tenantUserRoleSchema = z.enum([
  "SUPER_ADMIN",
  "ORG_ADMIN",
  "MANAGER",
  "EMPLOYEE",
]);

export const organizationStatusSchema = z.enum(["ACTIVE", "SUSPENDED", "PENDING"]);

export const subscriptionPlanSchema = z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE"]);

export const userStatusSchema = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const organizationCodeSchema = z
  .string()
  .trim()
  .min(2)
  .max(20)
  .regex(/^[A-Za-z0-9]+$/, "Code must be letters and numbers only")
  .transform((v) => v.toUpperCase());

export const createOrganizationSchema = z.object({
  name: z.string().min(2).max(200),
  code: organizationCodeSchema,
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  legalName: z.string().max(200).optional(),
  primaryContactName: z.string().max(120).optional(),
  industry: z.string().max(120).optional(),
  email: z.string().email(),
  phone: indianPhoneSchema.optional(),
  website: z.union([z.literal(""), z.string().url()]).optional(),
  companySize: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]).optional(),
  country: z.string().max(80).optional(),
  state: z.string().max(80).optional(),
  city: z.string().max(80).optional(),
  address: z.string().max(500).optional(),
  timezone: z.string().max(80).default("Asia/Kolkata"),
  subscriptionPlan: subscriptionPlanSchema.default("STARTER"),
  status: organizationStatusSchema.default("ACTIVE"),
  adminFirstName: z.string().min(1).max(80),
  adminLastName: z.string().min(1).max(80),
  adminEmail: z.string().email(),
  adminPhone: optionalIndianPhoneSchema,
});

export const updateOrganizationSettingsSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  legalName: z.string().max(200).optional().nullable(),
  primaryContactName: z.string().max(120).optional().nullable(),
  industry: z.string().max(120).optional().nullable(),
  logoUrl: z.string().max(2048).optional().nullable(),
  email: z.string().email().optional(),
  phone: optionalIndianPhoneSchema,
  website: z.union([z.literal(""), z.string().url()]).optional().nullable(),
  companySize: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]).optional().nullable(),
  country: z.string().max(80).optional().nullable(),
  state: z.string().max(80).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  timezone: z.string().min(1).max(80).optional(),
  meetingDefaultDurationMinutes: z.coerce.number().int().min(15).max(480).optional(),
});

export const updateOrganizationSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  legalName: z.string().max(200).optional().nullable(),
  primaryContactName: z.string().max(120).optional().nullable(),
  industry: z.string().max(120).optional().nullable(),
  email: z.string().email().optional(),
  phone: optionalIndianPhoneSchema,
  website: z.union([z.literal(""), z.string().url()]).optional().nullable(),
  companySize: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]).optional().nullable(),
  country: z.string().max(80).optional().nullable(),
  state: z.string().max(80).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  timezone: z.string().max(80).optional(),
  subscriptionPlan: subscriptionPlanSchema.optional(),
  status: organizationStatusSchema.optional(),
});

export const orgMemberRoleSchema = z.enum(["ORG_ADMIN", "MANAGER", "EMPLOYEE"]);

export const createOrgUserSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email(),
  mobile: z.string().max(30).optional(),
  role: orgMemberRoleSchema.default("EMPLOYEE"),
  designation: z.string().max(120).optional(),
  department: z.string().max(120).optional(),
  employeeCode: z.string().max(64).optional(),
  joiningDate: z.string().datetime().optional(),
});

export const updateOrgUserSchema = z.object({
  firstName: z.string().min(1).max(80).optional(),
  lastName: z.string().min(1).max(80).optional(),
  mobile: z.string().max(30).optional().nullable(),
  role: orgMemberRoleSchema.optional(),
  status: userStatusSchema.optional(),
  designation: z.string().max(120).optional().nullable(),
  department: z.string().max(120).optional().nullable(),
  employeeCode: z.string().max(64).optional().nullable(),
  joiningDate: z.string().datetime().optional().nullable(),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
