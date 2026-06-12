import type { MomTemplateCategory, MomTemplateSource } from "@lyrus/shared";

export interface MomTemplateSectionDraft {
  id: string;
  title: string;
  description: string;
  aiInstructions: string;
  isRequired: boolean;
  sortOrder: number;
}

export interface MomTemplatePresetSection {
  title: string;
  description: string;
  aiInstructions: string;
  isRequired: boolean;
  sortOrder: number;
}

export interface MomTemplatePreset {
  key: string;
  name: string;
  description: string;
  category: MomTemplateCategory;
  accentColor: string;
  icon: string;
  sections: MomTemplatePresetSection[];
}

export interface OnboardingMomTemplateDraft {
  clientId: string;
  name: string;
  description: string;
  category: MomTemplateCategory;
  source: MomTemplateSource;
  presetKey?: string;
  isDefault: boolean;
  sections: MomTemplateSectionDraft[];
  pendingUpload?: File | null;
}

export interface MomTemplateApiRecord {
  id: string;
  organizationId: string;
  name: string;
  description: string | null;
  category: MomTemplateCategory;
  source: MomTemplateSource;
  isDefault: boolean;
  isArchived: boolean;
  sections: Array<{
    id: string;
    title: string;
    description: string | null;
    aiInstructions: string;
    isRequired: boolean;
    sortOrder: number;
  }>;
  upload: {
    id: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    extractedHeadings: unknown;
  } | null;
  createdAt: string;
  updatedAt: string;
}
