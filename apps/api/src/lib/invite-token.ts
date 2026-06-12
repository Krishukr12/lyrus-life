import { createHash, randomBytes } from "node:crypto";

const INVITE_TOKEN_BYTES = 32;

export function generateInviteToken(): { token: string; tokenHash: string } {
  const token = randomBytes(INVITE_TOKEN_BYTES).toString("base64url");
  const tokenHash = hashInviteToken(token);
  return { token, tokenHash };
}

export function hashInviteToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
