import { randomBytes } from "node:crypto";

export function generateJoinSlug(): string {
  return randomBytes(6).toString("base64url");
}
