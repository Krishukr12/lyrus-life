export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length >= 32) {
    return secret;
  }
  if (process.env.NODE_ENV !== "production") {
    return "dev-only-set-JWT_SECRET-in-env-before-production!!";
  }
  throw new Error("JWT_SECRET must be set to at least 32 characters in production");
}

export function getCompanyName(): string {
  return process.env.COMPANY_NAME ?? "Your Company";
}

export function getAllowedEmailDomains(): string[] {
  const raw = process.env.ALLOWED_EMAIL_DOMAINS ?? "";
  return raw
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailDomainAllowed(email: string): boolean {
  const domains = getAllowedEmailDomains();
  if (domains.length === 0) return true;
  const domain = email.split("@")[1]?.toLowerCase();
  return Boolean(domain && domains.includes(domain));
}

export const ACCESS_TOKEN_COOKIE = "lyrus_access_token";
export const ACCESS_TOKEN_MAX_AGE_SEC = 60 * 60 * 24 * 3; // 3 days
