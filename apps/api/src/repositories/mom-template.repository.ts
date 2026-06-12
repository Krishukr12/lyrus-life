import { prisma, type MomTemplate, type MomTemplateSection, type Prisma } from "@lyrus/db";

export type MomTemplateWithRelations = MomTemplate & {
  sections: MomTemplateSection[];
  upload: { id: string; fileName: string; mimeType: string; sizeBytes: number; extractedHeadings: unknown } | null;
};

const templateInclude = {
  sections: { orderBy: { sortOrder: "asc" as const } },
  upload: {
    select: {
      id: true,
      fileName: true,
      mimeType: true,
      sizeBytes: true,
      extractedHeadings: true,
    },
  },
} satisfies Prisma.MomTemplateInclude;

export const momTemplateRepository = {
  async listByOrganization(organizationId: string, includeArchived = false) {
    return prisma.momTemplate.findMany({
      where: {
        organizationId,
        ...(includeArchived ? {} : { isArchived: false }),
      },
      include: templateInclude,
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    });
  },

  async findById(organizationId: string, templateId: string) {
    return prisma.momTemplate.findFirst({
      where: { id: templateId, organizationId },
      include: templateInclude,
    });
  },

  async findDefault(organizationId: string) {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { defaultMomTemplateId: true },
    });
    if (org?.defaultMomTemplateId) {
      return prisma.momTemplate.findFirst({
        where: { id: org.defaultMomTemplateId, organizationId, isArchived: false },
        include: templateInclude,
      });
    }
    return prisma.momTemplate.findFirst({
      where: { organizationId, isDefault: true, isArchived: false },
      include: templateInclude,
    });
  },

  async create(
    organizationId: string,
    data: {
      name: string;
      description?: string;
      category: MomTemplate["category"];
      source: MomTemplate["source"];
      isDefault?: boolean;
      metadata?: Prisma.InputJsonValue;
      sections: Array<{
        title: string;
        description?: string;
        aiInstructions: string;
        isRequired: boolean;
        sortOrder: number;
      }>;
    },
  ) {
    return prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.momTemplate.updateMany({
          where: { organizationId },
          data: { isDefault: false },
        });
      }

      const template = await tx.momTemplate.create({
        data: {
          organizationId,
          name: data.name,
          description: data.description,
          category: data.category,
          source: data.source,
          isDefault: data.isDefault ?? false,
          metadata: data.metadata,
          sections: {
            create: data.sections,
          },
        },
        include: templateInclude,
      });

      if (data.isDefault) {
        await tx.organization.update({
          where: { id: organizationId },
          data: { defaultMomTemplateId: template.id },
        });
      }

      return template;
    });
  },

  async update(
    organizationId: string,
    templateId: string,
    data: {
      name?: string;
      description?: string | null;
      category?: MomTemplate["category"];
      source?: MomTemplate["source"];
      isDefault?: boolean;
      isArchived?: boolean;
      metadata?: Prisma.InputJsonValue;
      sections?: Array<{
        title: string;
        description?: string;
        aiInstructions: string;
        isRequired: boolean;
        sortOrder: number;
      }>;
    },
  ) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.momTemplate.findFirst({
        where: { id: templateId, organizationId },
      });
      if (!existing) return null;

      if (data.isDefault) {
        await tx.momTemplate.updateMany({
          where: { organizationId },
          data: { isDefault: false },
        });
      }

      if (data.sections) {
        await tx.momTemplateSection.deleteMany({ where: { templateId } });
        await tx.momTemplateSection.createMany({
          data: data.sections.map((s) => ({ ...s, templateId })),
        });
      }

      const updated = await tx.momTemplate.update({
        where: { id: templateId },
        data: {
          name: data.name,
          description: data.description,
          category: data.category,
          source: data.source,
          isDefault: data.isDefault,
          isArchived: data.isArchived,
          metadata: data.metadata,
        },
        include: templateInclude,
      });

      if (data.isDefault) {
        await tx.organization.update({
          where: { id: organizationId },
          data: { defaultMomTemplateId: templateId },
        });
      }

      return updated;
    });
  },

  async duplicate(organizationId: string, templateId: string, actorId: string) {
    const source = await this.findById(organizationId, templateId);
    if (!source) return null;

    return this.create(organizationId, {
      name: `${source.name} (Copy)`,
      description: source.description ?? undefined,
      category: source.category,
      source: source.source,
      isDefault: false,
      metadata: {
        ...(typeof source.metadata === "object" && source.metadata !== null ? source.metadata : {}),
        duplicatedFrom: source.id,
        duplicatedBy: actorId,
      } as Prisma.InputJsonValue,
      sections: source.sections.map((s) => ({
        title: s.title,
        description: s.description ?? undefined,
        aiInstructions: s.aiInstructions,
        isRequired: s.isRequired,
        sortOrder: s.sortOrder,
      })),
    });
  },

  async setDefault(organizationId: string, templateId: string) {
    return this.update(organizationId, templateId, { isDefault: true });
  },

  async archive(organizationId: string, templateId: string) {
    const template = await this.findById(organizationId, templateId);
    if (!template) return null;

    return prisma.$transaction(async (tx) => {
      const updated = await tx.momTemplate.update({
        where: { id: templateId },
        data: { isArchived: true, isDefault: false },
        include: templateInclude,
      });

      if (template.isDefault) {
        await tx.organization.update({
          where: { id: organizationId },
          data: { defaultMomTemplateId: null },
        });
      }

      return updated;
    });
  },

  async delete(organizationId: string, templateId: string) {
    const template = await this.findById(organizationId, templateId);
    if (!template) return false;

    await prisma.$transaction(async (tx) => {
      if (template.isDefault) {
        await tx.organization.update({
          where: { id: organizationId },
          data: { defaultMomTemplateId: null },
        });
      }
      await tx.momTemplate.delete({ where: { id: templateId } });
    });
    return true;
  },

  async createUploadRecord(data: {
    templateId: string;
    organizationId: string;
    fileName: string;
    mimeType: string;
    storageKey: string;
    storageBackend: "LOCAL" | "S3";
    sizeBytes: number;
    extractedHeadings?: Prisma.InputJsonValue;
  }) {
    return prisma.momTemplateUpload.upsert({
      where: { templateId: data.templateId },
      create: data,
      update: {
        fileName: data.fileName,
        mimeType: data.mimeType,
        storageKey: data.storageKey,
        storageBackend: data.storageBackend,
        sizeBytes: data.sizeBytes,
        extractedHeadings: data.extractedHeadings,
      },
    });
  },
};
