import { SignJWT, jwtVerify } from "jose";

const STATE_TTL_SECONDS = 600;

function stateSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET ?? "dev-insecure-secret-change-me";
  return new TextEncoder().encode(secret);
}

export async function createOAuthState(userId: string, provider: string): Promise<string> {
  return new SignJWT({ userId, provider })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${STATE_TTL_SECONDS}s`)
    .sign(stateSecret());
}

export async function verifyOAuthState(
  state: string,
): Promise<{ userId: string; provider: string }> {
  const { payload } = await jwtVerify(state, stateSecret());
  const userId = payload.userId;
  const provider = payload.provider;
  if (typeof userId !== "string" || typeof provider !== "string") {
    throw new Error("Invalid OAuth state");
  }
  return { userId, provider };
}

function apiPublicBase(): string {
  const explicit = process.env.API_PUBLIC_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  const port = process.env.API_PORT ?? "3001";
  return `http://localhost:${port}`;
}

export function integrationCallbackUrl(provider: "google" | "microsoft"): string {
  return `${apiPublicBase()}/integrations/${provider}/callback`;
}

export function webIntegrationsRedirect(query = ""): string {
  const base = (process.env.WEB_APP_URL ?? "http://localhost:8080").replace(/\/$/, "");
  return `${base}/settings/integrations${query}`;
}
