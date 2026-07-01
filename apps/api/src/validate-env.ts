import { resolveApiPublicUrl, resolveWebAppUrl } from "@lyrus/shared";

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function validateProductionEnv(): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  requireEnv("DATABASE_URL");

  const jwtSecret = process.env.JWT_SECRET?.trim();
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be set to at least 32 characters in production");
  }

  resolveWebAppUrl();

  if (!process.env.API_PUBLIC_URL?.trim()) {
    console.warn(
      "[env] API_PUBLIC_URL is not set — OAuth callbacks will use the incoming request Host. " +
        "Set API_PUBLIC_URL=https://api.meetingdesk.in for reliability.",
    );
  } else {
    resolveApiPublicUrl();
  }
}
