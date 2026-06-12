import { hashSecret, verifySecret } from "./password.js";
import { signJwt, verifyToken } from "./jwt.js";

export const PASSWORD_RESET_PURPOSE = "password_reset";
export const PASSWORD_RESET_TTL_SEC = 10 * 60;

export interface PasswordResetPayload {
  purpose: typeof PASSWORD_RESET_PURPOSE;
  email: string;
  otpHash: string;
}

export async function createPasswordResetToken(email: string, otp: string): Promise<string> {
  const otpHash = await hashSecret(otp);
  return signJwt(
    {
      purpose: PASSWORD_RESET_PURPOSE,
      email,
      otpHash,
    } satisfies PasswordResetPayload,
    PASSWORD_RESET_TTL_SEC,
  );
}

export async function verifyPasswordResetOtp(
  resetToken: string,
  code: string,
): Promise<{ email: string }> {
  let payload: PasswordResetPayload;
  try {
    payload = await verifyToken<PasswordResetPayload>(resetToken);
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
