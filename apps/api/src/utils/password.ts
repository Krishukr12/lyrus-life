import bcrypt from "bcryptjs";
import { hashSecret as hashScrypt, verifySecret as verifyScrypt } from "@lyrus/auth";

const BCRYPT_ROUNDS = 12;
const BCRYPT_PREFIX = "$2";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (stored.startsWith(BCRYPT_PREFIX)) {
    return bcrypt.compare(password, stored);
  }
  return verifyScrypt(password, stored);
}

/** Migrate legacy scrypt hashes to bcrypt on successful login. */
export async function verifyPasswordAndMaybeUpgrade(
  password: string,
  stored: string,
): Promise<{ valid: boolean; upgradedHash?: string }> {
  if (stored.startsWith(BCRYPT_PREFIX)) {
    const valid = await bcrypt.compare(password, stored);
    return { valid };
  }
  const valid = await verifyScrypt(password, stored);
  if (!valid) return { valid: false };
  return { valid: true, upgradedHash: await hashPassword(password) };
}

export { hashScrypt, verifyScrypt };
