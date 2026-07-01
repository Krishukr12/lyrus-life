const LOCAL_WEB_APP_URL = "http://localhost:8080";

function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function firstNonEmpty(...values: (string | undefined)[]): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

function firstPublicCorsOrigin(): string | undefined {
  return process.env.CORS_ORIGIN?.split(",")
    .map((origin) => origin.trim())
    .find((origin) => origin && !/localhost|127\.0\.0\.1/.test(origin));
}

export function resolveWebAppUrl(): string {
  const explicit = firstNonEmpty(process.env.WEB_APP_URL, process.env.VITE_WEB_APP_URL);
  if (explicit) return trimTrailingSlash(explicit);

  const corsOrigin = firstPublicCorsOrigin();
  if (corsOrigin) return trimTrailingSlash(corsOrigin);

  if (isProduction()) {
    throw new Error(
      "WEB_APP_URL must be set in production (used for onboarding emails and integration redirects)",
    );
  }

  return LOCAL_WEB_APP_URL;
}

export function webAppJoinUrl(joinSlug: string): string {
  return `${resolveWebAppUrl()}/join/${joinSlug}`;
}
