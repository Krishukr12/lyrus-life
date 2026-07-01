const LOCAL_WEB_APP_URL = "http://localhost:8080";

export type PublicUrlRequest = {
  protocol?: string;
  get(name: string): string | undefined;
};

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

function resolvePublicUrlFromRequest(req: PublicUrlRequest): string | undefined {
  const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = req.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost ?? req.get("host")?.trim();
  if (!host || /localhost|127\.0\.0\.1/.test(host)) {
    return undefined;
  }

  const proto = forwardedProto ?? req.protocol ?? "https";
  return trimTrailingSlash(`${proto}://${host}`);
}

/** Public organization portal URL (emails, post-OAuth redirects). */
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

/** Public API URL (OAuth callbacks, webhooks). Uses request Host headers when env is unset. */
export function resolveApiPublicUrl(req?: PublicUrlRequest): string {
  const explicit = firstNonEmpty(process.env.API_PUBLIC_URL);
  if (explicit) return trimTrailingSlash(explicit);

  const viteApiUrl = process.env.VITE_API_URL?.trim();
  if (viteApiUrl?.startsWith("http")) {
    return trimTrailingSlash(viteApiUrl);
  }

  if (req) {
    const fromRequest = resolvePublicUrlFromRequest(req);
    if (fromRequest) return fromRequest;
  }

  if (isProduction()) {
    throw new Error(
      "API_PUBLIC_URL must be set in production (used for Google/Microsoft OAuth callbacks)",
    );
  }

  const port = process.env.API_PORT ?? process.env.PORT ?? "3001";
  return `http://localhost:${port}`;
}

export function integrationCallbackUrl(
  provider: "google" | "microsoft",
  req?: PublicUrlRequest,
): string {
  return `${resolveApiPublicUrl(req)}/integrations/${provider}/callback`;
}

export function webIntegrationsRedirect(query = ""): string {
  return `${resolveWebAppUrl()}/settings/integrations${query}`;
}

export function webAppLoginUrl(): string {
  return `${resolveWebAppUrl()}/login`;
}

export function webAppJoinUrl(joinSlug: string): string {
  return `${resolveWebAppUrl()}/join/${joinSlug}`;
}
