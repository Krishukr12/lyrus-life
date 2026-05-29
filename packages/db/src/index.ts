import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import clientModule from "../generated/client/client.js";
import enumModule from "../generated/client/enums.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../../.env") });
config({ path: resolve(__dirname, "../.env") });

const clientExports =
  (clientModule as { default?: typeof clientModule }).default ?? clientModule;
const enumExports = (enumModule as { default?: typeof enumModule }).default ?? enumModule;

export const PrismaClient = clientExports.PrismaClient;
export const Prisma = clientExports.Prisma;
export const {
  MeetingStatus,
  MeetingTag,
  TaskStatus,
  TaskPriority,
  PipelineStep,
  InviteStatus,
} = enumExports;

export type PrismaClient = InstanceType<typeof PrismaClient>;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to the repo root .env or packages/db/.env",
    );
  }

  const pool = new Pool({ connectionString });
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
} from "../generated/client/client.js";
