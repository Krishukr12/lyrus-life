import type { FastifyInstance } from "fastify";
import { prisma } from "@lyrus/db";
import { forgotPasswordSchema, loginPasswordSchema, resetPasswordSchema } from "@lyrus/shared";
import { sendPasswordResetOtpEmail } from "@lyrus/notifications";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE_SEC,
  getCompanyName,
  isEmailDomainAllowed,
} from "../lib/auth-config.js";
import { zodErrorMessage } from "../lib/api-errors.js";
import {
  createPasswordResetToken,
  PasswordResetError,
  verifyPasswordResetOtp,
} from "../lib/password-reset-token.js";
import { generateOtpCode, hashSecret, verifySecret } from "../lib/password.js";
import { authenticate, requireAuthUser } from "../middleware/authenticate.js";

function setAccessTokenCookie(reply: import("fastify").FastifyReply, token: string) {
  const secure = process.env.NODE_ENV === "production";
  reply.setCookie(ACCESS_TOKEN_COOKIE, token, {
    path: "/",
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: ACCESS_TOKEN_MAX_AGE_SEC,
  });
}

function authUserPayload(user: { id: string; email: string; name: string; role: string }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

async function signAccessToken(
  app: FastifyInstance,
  user: { id: string; email: string; name: string; role: string },
) {
  return app.jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    { expiresIn: ACCESS_TOKEN_MAX_AGE_SEC },
  );
}

async function issueSession(
  app: FastifyInstance,
  reply: import("fastify").FastifyReply,
  user: { id: string; email: string; name: string; role: string },
) {
  const token = await signAccessToken(app, user);
  setAccessTokenCookie(reply, token);
  return {
    token,
    user: authUserPayload(user),
  };
}

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", async (request, reply) => {
    const parsed = loginPasswordSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "validation_error",
        message: zodErrorMessage(parsed.error),
      });
    }

    const email = parsed.data.email.toLowerCase().trim();
    if (!isEmailDomainAllowed(email)) {
      return reply.status(403).send({
        error: "forbidden",
        message: "You're not authorized to do so",
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({
        error: "invalid_email",
        message: "No account found with this email address.",
      });
    }

    if (!user.passwordHash) {
      return reply.status(401).send({
        error: "invalid_credentials",
        message: "This account cannot sign in with a password.",
      });
    }

    const valid = await verifySecret(parsed.data.password, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({
        error: "invalid_password",
        message: "Incorrect password. Please try again.",
      });
    }

    return issueSession(app, reply, user);
  });

  /** Sends reset OTP by email. OTP is not stored in DB — only a signed resetToken is returned. */
  app.post("/auth/forgot-password", async (request, reply) => {
    const parsed = forgotPasswordSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "validation_error",
        message: zodErrorMessage(parsed.error),
      });
    }

    const email = parsed.data.email.toLowerCase().trim();
    if (!isEmailDomainAllowed(email)) {
      return reply.status(403).send({
        error: "forbidden",
        message: "You're not authorized to do so",
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return {
        ok: true,
        message: "If this email is registered, a reset code has been sent.",
      };
    }

    const code = generateOtpCode();
    const resetToken = await createPasswordResetToken(app, email, code);

    await sendPasswordResetOtpEmail({
      to: user.email,
      name: user.name,
      code,
      companyName: getCompanyName(),
    });

    return {
      ok: true,
      resetToken,
      email: user.email,
      message: "If this email is registered, a reset code has been sent.",
    };
  });

  /** Verifies OTP from signed token, sets new password, and signs the user in. */
  app.post("/auth/reset-password", async (request, reply) => {
    const parsed = resetPasswordSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "validation_error",
        message: zodErrorMessage(parsed.error),
      });
    }

    try {
      const { email } = await verifyPasswordResetOtp(
        app,
        parsed.data.resetToken,
        parsed.data.code,
      );

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return reply.status(401).send({
          error: "invalid_reset",
          message: "Invalid or expired code.",
        });
      }

      const passwordHash = await hashSecret(parsed.data.newPassword);
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });

      return issueSession(app, reply, updated);
    } catch (err) {
      if (err instanceof PasswordResetError) {
        return reply.status(401).send({
          error: "invalid_reset",
          message: err.message,
        });
      }
      throw err;
    }
  });

  app.get("/auth/me", { preHandler: [authenticate] }, async (request) => {
    const user = requireAuthUser(request);
    return { user: authUserPayload(user) };
  });

  app.post("/auth/logout", { preHandler: [authenticate] }, async (request, reply) => {
    requireAuthUser(request);
    reply.clearCookie(ACCESS_TOKEN_COOKIE, { path: "/" });
    return { ok: true };
  });
}
