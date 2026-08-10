import type { CreateMomTemplateInput } from "@lyrus/shared";
import type { MomTemplatePreset, MomTemplateSectionDraft, OnboardingMomTemplateDraft } from "./mom-template-types";

export function createClientId(): string {
  return `tmp_${Math.random().toString(36).slice(2, 11)}`;
}

export function createSectionDraft(
  partial?: Partial<MomTemplateSectionDraft>,
  sortOrder = 0,
): MomTemplateSectionDraft {
  return {
    id: createClientId(),
    title: partial?.title ?? "New Section",
    description: partial?.description ?? "",
    aiInstructions: partial?.aiInstructions ?? "Extract only what the transcript supports for this section. Leave empty if not discussed.",
    isRequired: partial?.isRequired ?? true,
    sortOrder,
  };
}

export function presetToDraft(preset: MomTemplatePreset, isDefault = false): OnboardingMomTemplateDraft {
  return {
    clientId: createClientId(),
    name: preset.name,
    description: preset.description,
    category: preset.category,
    source: preset.key === "custom" ? "CUSTOM" : "PRESET",
    presetKey: preset.key,
    isDefault,
    sections: preset.sections.map((s, index) => createSectionDraft(s, index)),
  };
}

export function draftToApiPayload(draft: OnboardingMomTemplateDraft): CreateMomTemplateInput {
  return {
    name: draft.name,
    description: draft.description || undefined,
    category: draft.category,
    source: draft.source,
    presetKey: draft.presetKey,
    isDefault: draft.isDefault,
    sections: draft.sections.map((s, index) => ({
      title: s.title,
      description: s.description || undefined,
      aiInstructions: s.aiInstructions,
      isRequired: s.isRequired,
      sortOrder: index,
    })),
  };
}

export function validateTemplateDraft(draft: OnboardingMomTemplateDraft): string | null {
  if (!draft.name.trim()) return "Template name is required";
  if (draft.sections.length === 0) return "Add at least one section";
  for (const section of draft.sections) {
    if (!section.title.trim()) return "Every section needs a title";
    if (!section.aiInstructions.trim()) return `AI instructions required for "${section.title}"`;
  }
  return null;
}
