import { Router } from "express";
import { OrganizationStatus, UserStatus, prisma } from "@lyrus/db";
import {
  acceptInvitationSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  loginPasswordSchema,
  resetPasswordSchema,
  setRequiredPasswordSchema,
} from "@lyrus/shared";
import { sendPasswordResetOtpEmail } from "@lyrus/notifications";
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE_SEC,
  getCompanyName,
  isEmailDomainAllowed,
} from "../lib/auth-config.js";
import { zodErrorMessage } from "../lib/api-errors.js";
import { asyncHandler } from "../lib/http.js";
import { signAccessToken } from "../lib/jwt.js";
import {
  createPasswordResetToken,
  PasswordResetError,
  verifyPasswordResetOtp,
} from "../lib/password-reset-token.js";
import { generateOtpCode } from "@lyrus/auth";
import { serializeOrganization, serializeUser } from "../lib/serializers.js";
import { authenticate, requireAuthUser } from "../middleware/authenticate.js";
import { authRateLimiter } from "../middleware/security.js";
import { userRepository } from "../repositories/user.repository.js";
import { logTenantAudit } from "../services/tenant-audit.service.js";
import {
  InvitationError,
  invitationService,
} from "../services/invitation.service.js";
import { hashPassword, verifyPassword, verifyPasswordAndMaybeUpgrade } from "../utils/password.js";
import type { Response } from "express";

function setAccessTokenCookie(res: Response, token: string) {
  const secure = process.env.NODE_ENV === "production";
  res.cookie(ACCESS_TOKEN_COOKIE, token, {
    path: "/",
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: ACCESS_TOKEN_MAX_AGE_SEC * 1000,
  });
}

async function signUserAccessToken(user: {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string | null;
}) {
  return signAccessToken(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
    },
    ACCESS_TOKEN_MAX_AGE_SEC,
  );
}

async function issueSession(
  res: Response,
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    organizationId: string | null;
    mustChangePassword?: boolean;
    organization?: ReturnType<typeof serializeOrganization> | null;
  },
) {
  const token = await signUserAccessToken(user);
  setAccessTokenCookie(res, token);
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
      mustChangePassword: user.mustChangePassword ?? false,
    },
    organization: user.organization ?? null,
  };
}

export function createAuthRouter(): Router {
  const router = Router();

  router.use("/auth", authRateLimiter);

  router.post(
    "/auth/login",
    asyncHandler(async (req, res) => {
      const parsed = loginPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "validation_error",
          message: zodErrorMessage(parsed.error),
        });
        return;
      }

      const email = parsed.data.email.toLowerCase().trim();
      if (!isEmailDomainAllowed(email)) {
        res.status(403).json({
          error: "forbidden",
          message: "You're not authorized to do so",
        });
        return;
      }

      const user = await userRepository.findByEmail(email);
      if (!user) {
        res.status(401).json({
          error: "invalid_email",
          message: "No account found with this email address.",
        });
        return;
      }

      if (user.status !== UserStatus.ACTIVE) {
        res.status(403).json({
          error: "account_inactive",
          message: "Your account is not active. Contact your administrator.",
        });
        return;
      }

      if (user.organization?.status === OrganizationStatus.SUSPENDED) {
        res.status(403).json({
          error: "organization_suspended",
          message:
            "Your organization account is currently suspended. Please contact your administrator.",
        });
        return;
      }

      if (user.organization?.status === OrganizationStatus.PENDING) {
        res.status(403).json({
          error: "organization_pending",
          message:
            "Your organization account is pending approval. Please contact your administrator.",
        });
        return;
      }

      if (!user.passwordHash) {
        res.status(401).json({
          error: "invalid_credentials",
          message: "This account cannot sign in with a password.",
        });
        return;
      }

      const { valid, upgradedHash } = await verifyPasswordAndMaybeUpgrade(
        parsed.data.password,
        user.passwordHash,
      );
      if (!valid) {
        res.status(401).json({
          error: "invalid_password",
          message: "Incorrect password. Please try again.",
        });
        return;
      }

      if (upgradedHash) {
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: upgradedHash },
        });
      }

      await userRepository.updateLastLogin(user.id);

      try {
        await logTenantAudit({
          organizationId: user.organizationId,
          userId: user.id,
          action: "auth.login",
          metadata: { email: user.email },
        });
      } catch (auditError) {
        console.warn("auth.login audit log failed:", auditError);
      }

      res.json(
        await issueSession(res, {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
          mustChangePassword: user.mustChangePassword,
          organization: user.organization
            ? serializeOrganization(user.organization)
            : null,
        }),
      );
    }),
  );

  router.post(
    "/auth/change-password",
    authenticate,
    asyncHandler(async (req, res) => {
      const parsed = changePasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "validation_error",
          message: zodErrorMessage(parsed.error),
        });
        return;
      }

      const authUser = requireAuthUser(req);
      const user = await prisma.user.findUnique({ where: { id: authUser.id } });
      if (!user?.passwordHash) {
        res.status(400).json({ error: "invalid_state", message: "Password not set for this account" });
        return;
      }

      const currentValid = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
      if (!currentValid) {
        res.status(401).json({ error: "invalid_password", message: "Current password is incorrect" });
        return;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: await hashPassword(parsed.data.newPassword),
          mustChangePassword: false,
          emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
        },
      });

      await logTenantAudit({
        organizationId: user.organizationId,
        userId: user.id,
        action: "auth.password_changed",
        metadata: { firstLogin: !user.emailVerifiedAt },
      });

      res.json({ ok: true });
    }),
  );

  router.post(
    "/auth/set-required-password",
    authenticate,
    asyncHandler(async (req, res) => {
      const parsed = setRequiredPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "validation_error",
          message: zodErrorMessage(parsed.error),
        });
        return;
      }

      const authUser = requireAuthUser(req);
      const user = await prisma.user.findUnique({ where: { id: authUser.id } });
      if (!user) {
        res.status(401).json({ error: "unauthorized", message: "User not found" });
        return;
      }

      if (!user.mustChangePassword) {
        res.status(400).json({
          error: "invalid_state",
          message: "Password change is not required for this account",
        });
        return;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash: await hashPassword(parsed.data.newPassword),
          mustChangePassword: false,
          emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
        },
      });

      await logTenantAudit({
        organizationId: user.organizationId,
        userId: user.id,
        action: "auth.password_changed",
        metadata: { firstLogin: !user.emailVerifiedAt, requiredReset: true },
      });

      res.json({ ok: true });
    }),
  );

  router.post(
    "/auth/forgot-password",
    asyncHandler(async (req, res) => {
      const parsed = forgotPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "validation_error",
          message: zodErrorMessage(parsed.error),
        });
        return;
      }

      const email = parsed.data.email.toLowerCase().trim();
      if (!isEmailDomainAllowed(email)) {
        res.status(403).json({
          error: "forbidden",
          message: "You're not authorized to do so",
        });
        return;
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.json({
          ok: true,
          message: "If this email is registered, a reset code has been sent.",
        });
        return;
      }

      const code = generateOtpCode();
      const resetToken = await createPasswordResetToken(email, code);

      await sendPasswordResetOtpEmail({
        to: user.email,
        name: user.name,
        code,
        companyName: getCompanyName(),
      });

      res.json({
        ok: true,
        resetToken,
        email: user.email,
        message: "If this email is registered, a reset code has been sent.",
      });
    }),
  );

  router.post(
    "/auth/reset-password",
    asyncHandler(async (req, res) => {
      const parsed = resetPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "validation_error",
          message: zodErrorMessage(parsed.error),
        });
        return;
      }

      try {
        const { email } = await verifyPasswordResetOtp(
          parsed.data.resetToken,
          parsed.data.code,
        );

        const user = await userRepository.findByEmail(email);
        if (!user) {
          res.status(401).json({
            error: "invalid_reset",
            message: "Invalid or expired code.",
          });
          return;
        }

        const updated = await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: await hashPassword(parsed.data.newPassword) },
          include: { organization: { include: { billingProfile: true } } },
        });

        res.json(
          await issueSession(res, {
            id: updated.id,
            email: updated.email,
            name: updated.name,
            role: updated.role,
            organizationId: updated.organizationId,
            organization: updated.organization
              ? serializeOrganization(updated.organization)
              : null,
          }),
        );
      } catch (err) {
        if (err instanceof PasswordResetError) {
          res.status(401).json({
            error: "invalid_reset",
            message: err.message,
          });
          return;
        }
        throw err;
      }
    }),
  );

  router.get(
    "/auth/invitation",
    asyncHandler(async (req, res) => {
      const token = typeof req.query.token === "string" ? req.query.token : "";
      if (!token) {
        res.status(400).json({ error: "validation_error", message: "Token is required" });
        return;
      }
      try {
        const invitation = await invitationService.getInvitationByToken(token);
        res.json(invitation);
      } catch (err) {
        if (err instanceof InvitationError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.post(
    "/auth/accept-invitation",
    asyncHandler(async (req, res) => {
      const parsed = acceptInvitationSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "validation_error",
          message: zodErrorMessage(parsed.error),
        });
        return;
      }

      try {
        const result = await invitationService.acceptInvitation(
          parsed.data.token,
          parsed.data.password,
        );
        res.json(
          await issueSession(res, {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            organizationId: result.user.organizationId,
            mustChangePassword: false,
            organization: result.organization
              ? serializeOrganization(result.organization)
              : null,
          }),
        );
      } catch (err) {
        if (err instanceof InvitationError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.get(
    "/auth/me",
    authenticate,
    asyncHandler(async (req, res) => {
      const authUser = requireAuthUser(req);
      const user = await userRepository.findByEmail(authUser.email);
      if (!user) {
        res.status(401).json({ error: "unauthorized", message: "User not found" });
        return;
      }
      res.json({
        user: serializeUser(user),
        organization: user.organization ? serializeOrganization(user.organization) : null,
      });
    }),
  );

  router.post(
    "/auth/logout",
    authenticate,
    asyncHandler(async (req, res) => {
      const user = requireAuthUser(req);
      await logTenantAudit({
        organizationId: user.organizationId,
        userId: user.id,
        action: "auth.logout",
      });
      res.clearCookie(ACCESS_TOKEN_COOKIE, { path: "/" });
      res.json({ ok: true });
    }),
  );

  return router;
}
