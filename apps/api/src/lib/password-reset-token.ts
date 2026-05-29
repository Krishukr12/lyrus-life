import type { FastifyInstance } from "fastify";
import { hashSecret, verifySecret } from "./password.js";

export const PASSWORD_RESET_PURPOSE = "password_reset";
export const PASSWORD_RESET_TTL_SEC = 10 * 60;

export interface PasswordResetPayload {
  purpose: typeof PASSWORD_RESET_PURPOSE;
  email: string;
  otpHash: string;
}

export async function createPasswordResetToken(
  app: FastifyInstance,
  email: string,
  otp: string,
): Promise<string> {
  const otpHash = await hashSecret(otp);
  return app.jwt.sign(
    {
      purpose: PASSWORD_RESET_PURPOSE,
      email,
      otpHash,
    } satisfies PasswordResetPayload,
    { expiresIn: PASSWORD_RESET_TTL_SEC },
  );
}

export async function verifyPasswordResetOtp(
  app: FastifyInstance,
  resetToken: string,
  code: string,
): Promise<{ email: string }> {
  let payload: PasswordResetPayload;
  try {
    payload = await app.jwt.verify<PasswordResetPayload>(resetToken);
  } catch {
    throw new PasswordResetError("Reset link expired or invalid. Request a new code.");
  }

  if (payload.purpose !== PASSWORD_RESET_PURPOSE || !payload.email || !payload.otpHash) {
    throw new PasswordResetError("Reset link expired or invalid. Request a new code.");
  }

  const valid = await verifySecret(code, payload.otpHash);
  if (!valid) {
    throw new PasswordResetError("Invalid or expired code.");
  }

  return { email: payload.email };
}

export class PasswordResetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PasswordResetError";
  }
}
