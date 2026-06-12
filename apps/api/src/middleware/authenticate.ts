import type { NextFunction, Request, Response } from "express";
import { OrganizationStatus, UserRole, UserStatus, prisma } from "@lyrus/db";
import { ACCESS_TOKEN_COOKIE } from "../lib/auth-config.js";
import { verifyToken, type AccessTokenPayload } from "../lib/jwt.js";
import type { AuthUser } from "../types/express.js";

async function resolveAuthUser(req: Request): Promise<AuthUser | null> {
  const header = req.headers.authorization;
  const rawToken = header?.startsWith("Bearer ")
    ? header.slice(7)
    : req.cookies[ACCESS_TOKEN_COOKIE];

  if (!rawToken || typeof rawToken !== "string") {
    return null;
  }

  try {
    const payload = await verifyToken<AccessTokenPayload>(rawToken);
    if (!payload.sub || !payload.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        organizationId: true,
      },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      organizationId: user.organizationId,
    };
  } catch {
    return null;
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const user = await resolveAuthUser(req);
  if (!user) {
    res.status(401).json({
      error: "unauthorized",
      message: "Sign in required",
    });
    return;
  }

  if (user.role !== UserRole.SUPER_ADMIN && user.organizationId) {
    const org = await prisma.organization.findUnique({
      where: { id: user.organizationId },
      select: { status: true },
    });
    if (org?.status === OrganizationStatus.SUSPENDED) {
      res.status(403).json({
        error: "organization_suspended",
        message:
          "Your organization's access has been suspended. Please contact your administrator.",
      });
      return;
    }
    if (org?.status === OrganizationStatus.PENDING) {
      res.status(403).json({
        error: "organization_pending",
        message:
          "Your organization account is pending approval. Please contact your administrator.",
      });
      return;
    }
  }

  req.authUser = user;
  next();
}

export function requireAuthUser(req: Request): AuthUser {
  if (!req.authUser) {
    throw new Error("Auth user missing after authenticate middleware");
  }
  return req.authUser;
}
