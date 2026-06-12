import type { Request } from "express";
import { UserStatus, prisma } from "@lyrus/db";
import { ACCESS_TOKEN_COOKIE } from "../lib/auth-config.js";
import { verifyToken, type AccessTokenPayload } from "../lib/jwt.js";
import type { AuthUser } from "../types/express.js";

/** Returns auth user if a valid token/cookie is present; otherwise null (no 401). */
export async function tryAuthenticate(req: Request): Promise<AuthUser | null> {
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

    req.authUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      organizationId: user.organizationId,
    };
    return req.authUser;
  } catch {
    return null;
  }
}
