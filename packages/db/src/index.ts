import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import enumModule from "../generated/client/enums.js";
import generatedModule from "../generated/client/index.js";
import "./load-env.js";
import { pgConnectionConfig } from "./pg-config.js";

const enumExports = (enumModule as { default?: typeof enumModule }).default ?? enumModule;
const generatedExports =
  (generatedModule as { default?: typeof generatedModule }).default ?? generatedModule;

export const PrismaClient = generatedExports.PrismaClient;
export { Prisma } from "../generated/client/index.js";
export const {
  MeetingStatus,
  MeetingTag,
  TaskStatus,
  TaskPriority,
  PipelineStep,
  InviteStatus,
} = enumExports;
export const UserRole = generatedExports.UserRole;
export const UserStatus = generatedExports.UserStatus;
export const OrganizationStatus = generatedExports.OrganizationStatus;
export const SubscriptionPlan = generatedExports.SubscriptionPlan;
export const BillingStatus = generatedExports.BillingStatus;
export const AudioStorageBackend = generatedExports.AudioStorageBackend;
export const TemplateFileStorageBackend = generatedExports.TemplateFileStorageBackend;
export const MomTemplateCategory = generatedExports.MomTemplateCategory;
export const MomTemplateSource = generatedExports.MomTemplateSource;
export const InvoiceStatus = generatedExports.InvoiceStatus;
export const PaymentStatus = generatedExports.PaymentStatus;
export const InvoiceDeliveryStatus = generatedExports.InvoiceDeliveryStatus;
export const OrganizationInvitationStatus = generatedExports.OrganizationInvitationStatus;

export type PrismaClient = InstanceType<typeof PrismaClient>;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add it to the repo root .env");
  }

  const pool = new Pool(pgConnectionConfig(connectionString));
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export type {
  Organization,
  EmployeeProfile,
  TenantAuditLog,
  PlatformPricingConfig,
  OrganizationBilling,
  User,
  Meeting,
  MeetingInvite,
  MeetingParticipant,
  AudioFile,
  Transcript,
  TranscriptSegment,
  Mom,
  ActionItem,
  Decision,
  Summary,
  AuditLog,
  MomTemplate,
  MomTemplateSection,
  MomTemplateUpload,
  Invoice,
  InvoiceLineItem,
  Payment,
  InvoiceDelivery,
  BillingEvent,
  PricingChangeLog,
  OrganizationInvitation,
} from "../generated/client/index.js";
