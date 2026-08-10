import { SignJWT, jwtVerify } from "jose";
import {
  integrationCallbackUrl as sharedIntegrationCallbackUrl,
  webIntegrationsRedirect as sharedWebIntegrationsRedirect,
  type PublicUrlRequest,
} from "@lyrus/shared";
import { getJwtSecret } from "../../lib/auth-config.js";

const STATE_TTL_SECONDS = 600;

function stateSecret(): Uint8Array {
  return new TextEncoder().encode(getJwtSecret());
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

export function integrationCallbackUrl(
  provider: "google" | "microsoft",
  req?: PublicUrlRequest,
): string {
  return sharedIntegrationCallbackUrl(provider, req);
}

export function webIntegrationsRedirect(query = ""): string {
  return sharedWebIntegrationsRedirect(query);
}
