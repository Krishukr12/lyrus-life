import type { NextFunction, Request, Response } from "express";
import { UserRole } from "@lyrus/db";
import { requireAuthUser } from "./authenticate.js";

/**
 * Ensures tenant-scoped routes always have an organization context.
 * Super admins must pass ?organizationId= or X-Organization-Id header for org-scoped APIs.
 */
export function requireTenantContext(req: Request, res: Response, next: NextFunction) {
  const user = requireAuthUser(req);

  if (user.role === UserRole.SUPER_ADMIN) {
    const headerOrg = req.headers["x-organization-id"];
    const queryOrg = typeof req.query.organizationId === "string" ? req.query.organizationId : undefined;
    const organizationId =
      (typeof headerOrg === "string" ? headerOrg : undefined) ?? queryOrg ?? user.organizationId;

    if (!organizationId) {
      res.status(400).json({
        error: "organization_required",
        message: "Super admin must specify organization context",
      });
      return;
    }

    req.tenant = { organizationId };
    next();
    return;
  }

  if (!user.organizationId) {
    res.status(403).json({
      error: "forbidden",
      message: "No organization associated with this account",
    });
    return;
  }

  req.tenant = { organizationId: user.organizationId };
  next();
}

/** Rejects requests when JWT organization does not match route tenant. */
export function assertTenantMatch(req: Request, res: Response, next: NextFunction) {
  const user = requireAuthUser(req);
  const tenant = req.tenant;
  if (!tenant) {
    res.status(500).json({ error: "tenant_missing", message: "Tenant context not initialized" });
    return;
  }

  if (user.role !== UserRole.SUPER_ADMIN && user.organizationId !== tenant.organizationId) {
    res.status(403).json({
      error: "tenant_mismatch",
      message: "Cross-tenant access denied",
    });
    return;
  }

  next();
}
