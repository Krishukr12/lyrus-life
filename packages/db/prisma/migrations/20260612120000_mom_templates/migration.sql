-- CreateEnum
CREATE TYPE "MomTemplateCategory" AS ENUM ('GENERAL_BUSINESS', 'ENGINEERING_STANDUP', 'PROJECT_MANAGEMENT', 'SALES', 'HR_INTERVIEW', 'LEADERSHIP_REVIEW', 'CONSULTING_REVIEW', 'CUSTOM');

-- CreateEnum
CREATE TYPE "MomTemplateSource" AS ENUM ('PRESET', 'CUSTOM', 'UPLOADED');

-- CreateEnum
CREATE TYPE "TemplateFileStorageBackend" AS ENUM ('LOCAL', 'S3');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN "defaultMomTemplateId" TEXT;

-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN "momTemplateId" TEXT;

-- AlterTable
ALTER TABLE "Mom" ADD COLUMN "templateId" TEXT;
ALTER TABLE "Mom" ADD COLUMN "sections" JSONB;

-- CreateTable
CREATE TABLE "MomTemplate" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "MomTemplateCategory" NOT NULL DEFAULT 'GENERAL_BUSINESS',
    "source" "MomTemplateSource" NOT NULL DEFAULT 'PRESET',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MomTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MomTemplateSection" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "aiInstructions" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MomTemplateSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MomTemplateUpload" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "storageBackend" "TemplateFileStorageBackend" NOT NULL DEFAULT 'LOCAL',
    "sizeBytes" INTEGER NOT NULL,
    "extractedHeadings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MomTemplateUpload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MomTemplate_organizationId_idx" ON "MomTemplate"("organizationId");

-- CreateIndex
CREATE INDEX "MomTemplate_organizationId_isDefault_idx" ON "MomTemplate"("organizationId", "isDefault");

-- CreateIndex
CREATE INDEX "MomTemplate_organizationId_isArchived_idx" ON "MomTemplate"("organizationId", "isArchived");

-- CreateIndex
CREATE INDEX "MomTemplate_organizationId_category_idx" ON "MomTemplate"("organizationId", "category");

-- CreateIndex
CREATE INDEX "MomTemplateSection_templateId_sortOrder_idx" ON "MomTemplateSection"("templateId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "MomTemplateUpload_templateId_key" ON "MomTemplateUpload"("templateId");

-- CreateIndex
CREATE INDEX "MomTemplateUpload_organizationId_idx" ON "MomTemplateUpload"("organizationId");

-- CreateIndex
CREATE INDEX "Meeting_momTemplateId_idx" ON "Meeting"("momTemplateId");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_defaultMomTemplateId_fkey" FOREIGN KEY ("defaultMomTemplateId") REFERENCES "MomTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_momTemplateId_fkey" FOREIGN KEY ("momTemplateId") REFERENCES "MomTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MomTemplate" ADD CONSTRAINT "MomTemplate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MomTemplateSection" ADD CONSTRAINT "MomTemplateSection_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "MomTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MomTemplateUpload" ADD CONSTRAINT "MomTemplateUpload_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "MomTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
