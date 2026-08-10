import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { getJwtSecret } from "./auth-config.js";

const ALGORITHM = "aes-256-gcm";

/** Historical defaults used before token-crypto shared getJwtSecret(). */
const LEGACY_DEV_SECRETS = [
  "dev-insecure-secret-change-me",
  "dev-only-set-JWT_SECRET-in-env-before-production!!",
];

function keyFromSecret(secret: string): Buffer {
  return createHash("sha256").update(secret).digest();
}

function candidateSecrets(): string[] {
  const primary = getJwtSecret();
  return [...new Set([primary, ...LEGACY_DEV_SECRETS])];
}

function decryptWithKey(payload: string, key: Buffer): string {
  const [ivB64, tagB64, dataB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Invalid encrypted payload");
  }
  const iv = Buffer.from(ivB64, "base64url");
  const tag = Buffer.from(tagB64, "base64url");
  const data = Buffer.from(dataB64, "base64url");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, keyFromSecret(getJwtSecret()), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

export function decryptSecret(payload: string): string {
  let lastError: unknown;
  for (const secret of candidateSecrets()) {
    try {
      return decryptWithKey(payload, keyFromSecret(secret));
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("Unable to decrypt secret");
}

/** Returns null when ciphertext was encrypted with an unknown key or is corrupted. */
export function tryDecryptSecret(payload: string): string | null {
  try {
    return decryptSecret(payload);
  } catch {
    return null;
  }
}
