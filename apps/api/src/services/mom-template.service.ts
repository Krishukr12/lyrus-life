import type { CreateMomTemplateInput, UpdateMomTemplateInput } from "@lyrus/shared";
import type { Prisma } from "@lyrus/db";
import { getMomTemplatePreset } from "../lib/mom-template-presets.js";
import { headingsToSections, extractTemplateStructure } from "../lib/template-structure-extractor.js";
import { momTemplateRepository } from "../repositories/mom-template.repository.js";
import { organizationRepository } from "../repositories/organization.repository.js";
import { saveMomTemplateFile } from "./mom-template-storage.js";
import { logTenantAudit } from "./tenant-audit.service.js";

export class MomTemplateServiceError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 400,
  ) {
    super(message);
  }
}

function resolveSectionsFromInput(input: CreateMomTemplateInput) {
  if (input.sections && input.sections.length > 0) {
    return input.sections;
  }

  if (input.presetKey) {
    const preset = getMomTemplatePreset(input.presetKey);
    if (!preset) {
      throw new MomTemplateServiceError("invalid_preset", "Unknown template preset", 400);
    }
    return preset.sections.map((s, index) => ({
      title: s.title,
      description: s.description,
      aiInstructions: s.aiInstructions,
      isRequired: s.isRequired,
      sortOrder: index,
    }));
  }

  throw new MomTemplateServiceError(
    "sections_required",
    "Template must include sections or a valid preset key",
    400,
  );
}

export const momTemplateService = {
  async listTemplates(organizationId: string, includeArchived = false) {
    const org = await organizationRepository.findById(organizationId);
    if (!org) {
      throw new MomTemplateServiceError("not_found", "Organization not found", 404);
    }
    return momTemplateRepository.listByOrganization(organizationId, includeArchived);
  },

  async getTemplate(organizationId: string, templateId: string) {
    const template = await momTemplateRepository.findById(organizationId, templateId);
    if (!template) {
      throw new MomTemplateServiceError("not_found", "Template not found", 404);
    }
    return template;
  },

  async createTemplate(actorId: string, organizationId: string, input: CreateMomTemplateInput) {
    const org = await organizationRepository.findById(organizationId);
    if (!org) {
      throw new MomTemplateServiceError("not_found", "Organization not found", 404);
    }

    const sections = resolveSectionsFromInput(input);
    const existing = await momTemplateRepository.listByOrganization(organizationId);
    const isDefault = input.isDefault ?? existing.length === 0;

    const template = await momTemplateRepository.create(organizationId, {
      name: input.name,
      description: input.description,
      category: input.category,
      source: input.source,
      isDefault,
      metadata: {
        ...(input.metadata ?? {}),
        presetKey: input.presetKey,
      } as Prisma.InputJsonValue,
      sections,
    });

    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "mom_template.created",
      metadata: { templateId: template.id, name: template.name },
    });

    return template;
  },

  async updateTemplate(
    actorId: string,
    organizationId: string,
    templateId: string,
    input: UpdateMomTemplateInput,
  ) {
    const updated = await momTemplateRepository.update(organizationId, templateId, {
      name: input.name,
      description: input.description,
      category: input.category,
      isDefault: input.isDefault,
      isArchived: input.isArchived,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
      sections: input.sections,
    });

    if (!updated) {
      throw new MomTemplateServiceError("not_found", "Template not found", 404);
    }

    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "mom_template.updated",
      metadata: { templateId, changes: JSON.parse(JSON.stringify(input)) },
    });

    return updated;
  },

  async duplicateTemplate(actorId: string, organizationId: string, templateId: string) {
    const duplicated = await momTemplateRepository.duplicate(organizationId, templateId, actorId);
    if (!duplicated) {
      throw new MomTemplateServiceError("not_found", "Template not found", 404);
    }

    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "mom_template.duplicated",
      metadata: { sourceTemplateId: templateId, newTemplateId: duplicated.id },
    });

    return duplicated;
  },

  async setDefaultTemplate(actorId: string, organizationId: string, templateId: string) {
    const updated = await momTemplateRepository.setDefault(organizationId, templateId);
    if (!updated) {
      throw new MomTemplateServiceError("not_found", "Template not found", 404);
    }

    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "mom_template.set_default",
      metadata: { templateId },
    });

    return updated;
  },

  async archiveTemplate(actorId: string, organizationId: string, templateId: string) {
    const archived = await momTemplateRepository.archive(organizationId, templateId);
    if (!archived) {
      throw new MomTemplateServiceError("not_found", "Template not found", 404);
    }

    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "mom_template.archived",
      metadata: { templateId },
    });

    return archived;
  },

  async deleteTemplate(actorId: string, organizationId: string, templateId: string) {
    const deleted = await momTemplateRepository.delete(organizationId, templateId);
    if (!deleted) {
      throw new MomTemplateServiceError("not_found", "Template not found", 404);
    }

    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "mom_template.deleted",
      metadata: { templateId },
    });
  },

  async uploadTemplateFile(
    actorId: string,
    organizationId: string,
    templateId: string,
    buffer: Buffer,
    fileName: string,
    mimeType: string,
  ) {
    const template = await momTemplateRepository.findById(organizationId, templateId);
    if (!template) {
      throw new MomTemplateServiceError("not_found", "Template not found", 404);
    }

    const allowed =
      mimeType === "application/pdf" ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword";

    if (!allowed) {
      throw new MomTemplateServiceError(
        "invalid_file_type",
        "Only DOCX and PDF files are supported",
        400,
      );
    }

    const headings = await extractTemplateStructure(buffer, mimeType);
    const { storageKey, storageBackend } = await saveMomTemplateFile(
      organizationId,
      templateId,
      buffer,
      fileName,
      mimeType,
    );

    await momTemplateRepository.createUploadRecord({
      templateId,
      organizationId,
      fileName,
      mimeType,
      storageKey,
      storageBackend,
      sizeBytes: buffer.length,
      extractedHeadings: headings as unknown as Prisma.InputJsonValue,
    });

    if (headings.length > 0) {
      await momTemplateRepository.update(organizationId, templateId, {
        source: "UPLOADED",
        sections: headingsToSections(headings),
      });
    } else {
      await momTemplateRepository.update(organizationId, templateId, {
        source: "UPLOADED",
      });
    }

    const refreshed = await momTemplateRepository.findById(organizationId, templateId);
    if (!refreshed) {
      throw new MomTemplateServiceError("not_found", "Template not found", 404);
    }

    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "mom_template.file_uploaded",
      metadata: { templateId, fileName, headingCount: headings.length },
    });

    return refreshed;
  },

  async provisionOnboardingTemplates(
    actorId: string,
    organizationId: string,
    templates: CreateMomTemplateInput[],
    defaultTemplateIndex = 0,
  ) {
    const created = [];
    for (let i = 0; i < templates.length; i++) {
      const input = templates[i]!;
      const template = await this.createTemplate(actorId, organizationId, {
        ...input,
        isDefault: i === defaultTemplateIndex,
      });
      created.push(template);
    }
    return created;
  },

  async resolveForMeeting(organizationId: string | null | undefined, templateId?: string | null) {
    if (!organizationId) return null;

    if (templateId) {
      const specific = await momTemplateRepository.findById(organizationId, templateId);
      if (specific && !specific.isArchived) return specific;
    }

    return momTemplateRepository.findDefault(organizationId);
  },
};
