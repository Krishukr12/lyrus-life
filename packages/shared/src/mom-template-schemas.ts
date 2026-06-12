import { z } from "zod";

export const momTemplateCategorySchema = z.enum([
  "GENERAL_BUSINESS",
  "ENGINEERING_STANDUP",
  "PROJECT_MANAGEMENT",
  "SALES",
  "HR_INTERVIEW",
  "LEADERSHIP_REVIEW",
  "CONSULTING_REVIEW",
  "CUSTOM",
]);

export const momTemplateSourceSchema = z.enum(["PRESET", "CUSTOM", "UPLOADED"]);

export const momTemplateSectionInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(500).optional(),
  aiInstructions: z.string().trim().min(1).max(2000),
  isRequired: z.boolean().default(true),
  sortOrder: z.number().int().min(0),
});

export const createMomTemplateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(500).optional(),
  category: momTemplateCategorySchema,
  source: momTemplateSourceSchema.default("CUSTOM"),
  isDefault: z.boolean().optional(),
  presetKey: z.string().trim().max(80).optional(),
  sections: z.array(momTemplateSectionInputSchema).min(1).max(30).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const updateMomTemplateSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(500).optional(),
  category: momTemplateCategorySchema.optional(),
  isDefault: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  sections: z.array(momTemplateSectionInputSchema).min(1).max(30).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const reorderMomTemplateSectionsSchema = z.object({
  sectionIds: z.array(z.string().min(1)).min(1).max(30),
});

export const onboardingMomTemplatesSchema = z.object({
  templates: z.array(createMomTemplateSchema).min(1).max(20),
  defaultTemplateIndex: z.number().int().min(0).optional(),
});

export type MomTemplateCategory = z.infer<typeof momTemplateCategorySchema>;
export type MomTemplateSource = z.infer<typeof momTemplateSourceSchema>;
export type MomTemplateSectionInput = z.infer<typeof momTemplateSectionInputSchema>;
export type CreateMomTemplateInput = z.infer<typeof createMomTemplateSchema>;
export type UpdateMomTemplateInput = z.infer<typeof updateMomTemplateSchema>;
