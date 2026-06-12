import type { MomTemplateWithRelations } from "../repositories/mom-template.repository.js";

type TemplateSectionRow = MomTemplateWithRelations["sections"][number];

export function serializeMomTemplate(template: MomTemplateWithRelations) {
  return {
    id: template.id,
    organizationId: template.organizationId,
    name: template.name,
    description: template.description,
    category: template.category,
    source: template.source,
    isDefault: template.isDefault,
    isArchived: template.isArchived,
    metadata: template.metadata,
    sections: template.sections.map((s: TemplateSectionRow) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      aiInstructions: s.aiInstructions,
      isRequired: s.isRequired,
      sortOrder: s.sortOrder,
    })),
    upload: template.upload
      ? {
          id: template.upload.id,
          fileName: template.upload.fileName,
          mimeType: template.upload.mimeType,
          sizeBytes: template.upload.sizeBytes,
          extractedHeadings: template.upload.extractedHeadings,
        }
      : null,
    createdAt: template.createdAt.toISOString(),
    updatedAt: template.updatedAt.toISOString(),
  };
}

export function serializeMomTemplatePreset(preset: {
  key: string;
  name: string;
  description: string;
  category: string;
  accentColor: string;
  icon: string;
  sections: Array<{
    title: string;
    description: string;
    aiInstructions: string;
    isRequired: boolean;
  }>;
}) {
  return {
    key: preset.key,
    name: preset.name,
    description: preset.description,
    category: preset.category,
    accentColor: preset.accentColor,
    icon: preset.icon,
    sections: preset.sections.map((s, index) => ({
      title: s.title,
      description: s.description,
      aiInstructions: s.aiInstructions,
      isRequired: s.isRequired,
      sortOrder: index,
    })),
  };
}
