import { SignJWT, jwtVerify } from "jose";
import { getJwtSecret } from "./auth-config.js";

function secretKey() {
  return new TextEncoder().encode(getJwtSecret());
}

export type AccessTokenPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
  organizationId?: string | null;
};

export async function signJwt(
  payload: Record<string, unknown>,
  expiresInSec: number,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${expiresInSec}s`)
    .sign(secretKey());
}

export async function signAccessToken(
  payload: AccessTokenPayload,
  expiresInSec: number,
): Promise<string> {
  return signJwt(payload, expiresInSec);
}

export async function verifyToken<T = Record<string, unknown>>(token: string): Promise<T> {
  const { payload } = await jwtVerify(token, secretKey());
  return payload as T;
}
