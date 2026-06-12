import { access, constants } from "node:fs/promises";
import { createSmtpTransport, getOrganizerEmail, getSmtpConfig } from "@lyrus/notifications";
import { prisma } from "@lyrus/db";
import { getLiveKitMonitorStats } from "./livekit-monitor.js";
import { localUploadDir } from "../services/storage/local.js";
import { isS3Configured, resolveStorageBackend } from "../services/storage/config.js";
import { dashboardRepository } from "../repositories/dashboard.repository.js";

export type HealthStatus = "healthy" | "monitoring" | "down";

export type HealthService = {
  name: string;
  status: HealthStatus;
  label: string;
};

let emailHealthCache: { checkedAt: number; result: HealthService } | null = null;
const EMAIL_HEALTH_CACHE_MS = 60_000;

async function checkDatabase(): Promise<HealthService> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { name: "Database", status: "healthy", label: "Connected" };
  } catch {
    return { name: "Database", status: "down", label: "Unreachable" };
  }
}

async function checkStorage(): Promise<HealthService> {
  try {
    const backend = resolveStorageBackend();
    if (backend === "s3") {
      if (!isS3Configured()) {
        return { name: "Storage", status: "down", label: "S3 misconfigured" };
      }
      return { name: "Storage", status: "healthy", label: "S3 ready" };
    }
    await access(localUploadDir(), constants.W_OK);
    return { name: "Storage", status: "healthy", label: "Local ready" };
  } catch {
    return { name: "Storage", status: "down", label: "Unavailable" };
  }
}

function emailVerifyLabel(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("timeout") || message.includes("timed out")) {
    return "SMTP timeout — check network";
  }
  if (
    message.includes("auth") ||
    message.includes("credentials") ||
    message.includes("535") ||
    message.includes("534")
  ) {
    return "SMTP auth failed — check EMAIL_PASS";
  }
  if (message.includes("enotfound") || message.includes("econnrefused")) {
    return "SMTP host unreachable";
  }
  return "Configured, verify failed";
}

async function checkEmail(): Promise<HealthService> {
  const cached = emailHealthCache;
  if (cached && Date.now() - cached.checkedAt < EMAIL_HEALTH_CACHE_MS) {
    return cached.result;
  }

  const smtp = getSmtpConfig(getOrganizerEmail());
  if (!smtp) {
    const result: HealthService = { name: "Email", status: "monitoring", label: "Not configured" };
    emailHealthCache = { checkedAt: Date.now(), result };
    return result;
  }

  try {
    const transport = createSmtpTransport(smtp);
    await Promise.race([
      transport.verify(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("smtp verify timeout")), 8_000);
      }),
    ]);
    const result: HealthService = { name: "Email", status: "healthy", label: "SMTP verified" };
    emailHealthCache = { checkedAt: Date.now(), result };
    return result;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[health] SMTP verify failed:", error instanceof Error ? error.message : error);
    }
    const result: HealthService = {
      name: "Email",
      status: "monitoring",
      label: emailVerifyLabel(error),
    };
    emailHealthCache = { checkedAt: Date.now(), result };
    return result;
  }
}

async function checkJobs(): Promise<HealthService> {
  const { processing, failed } = await dashboardRepository.getPipelineJobCounts();
  if (failed > 0) {
    return {
      name: "Jobs",
      status: "monitoring",
      label: `${failed} failed pipeline${failed === 1 ? "" : "s"}`,
    };
  }
  if (processing > 0) {
    return {
      name: "Jobs",
      status: "healthy",
      label: `${processing} processing`,
    };
  }
  return { name: "Jobs", status: "healthy", label: "Idle" };
}

export async function getSystemHealth(): Promise<{
  services: HealthService[];
  allOperational: boolean;
  livekit: Awaited<ReturnType<typeof getLiveKitMonitorStats>>;
}> {
  const [database, storage, email, jobs, livekit] = await Promise.all([
    checkDatabase(),
    checkStorage(),
    checkEmail(),
    checkJobs(),
    getLiveKitMonitorStats(),
  ]);

  const api: HealthService = { name: "API", status: "healthy", label: "Healthy" };

  const livekitService: HealthService = {
    name: "LiveKit",
    status: livekit.status,
    label: livekit.label,
  };

  const services = [api, database, livekitService, jobs, storage, email];
  const allOperational = services.every((s) => s.status !== "down");

  return { services, allOperational, livekit };
}
