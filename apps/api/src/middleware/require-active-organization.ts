import type { NextFunction, Request, Response } from "express";
import { BillingStatus, OrganizationStatus, UserRole, prisma } from "@lyrus/db";
import { requireAuthUser } from "./authenticate.js";

const SUSPENDED_MESSAGE =
  "Your organization's access has been suspended. Please contact your administrator.";
const PENDING_MESSAGE =
  "Your organization account is pending approval. Please contact your administrator.";

export async function requireActiveOrganization(req: Request, res: Response, next: NextFunction) {
  const user = requireAuthUser(req);
  if (user.role === UserRole.SUPER_ADMIN) {
    next();
    return;
  }

  if (!user.organizationId) {
    res.status(403).json({ error: "forbidden", message: "Organization membership required" });
    return;
  }

  const org = await prisma.organization.findUnique({
    where: { id: user.organizationId },
    select: {
      status: true,
      billingProfile: { select: { billingStatus: true, trialEndsAt: true } },
    },
  });

  if (!org) {
    res.status(403).json({ error: "organization_not_found", message: "Organization not found" });
    return;
  }

  if (org.status === OrganizationStatus.SUSPENDED) {
    res.status(403).json({ error: "organization_suspended", message: SUSPENDED_MESSAGE });
    return;
  }

  if (org.status === OrganizationStatus.PENDING) {
    res.status(403).json({ error: "organization_pending", message: PENDING_MESSAGE });
    return;
  }

  const billingStatus = org.billingProfile?.billingStatus;
  if (billingStatus === BillingStatus.OVERDUE) {
    res.status(403).json({
      error: "billing_overdue",
      message:
        "Your organization's billing is overdue. Please contact your administrator to restore access.",
    });
    return;
  }

  if (billingStatus === BillingStatus.CANCELLED) {
    res.status(403).json({
      error: "billing_cancelled",
      message: "Your organization's subscription has been cancelled.",
    });
    return;
  }

  if (
    billingStatus === BillingStatus.TRIAL &&
    org.billingProfile?.trialEndsAt &&
    org.billingProfile.trialEndsAt < new Date()
  ) {
    res.status(403).json({
      error: "trial_expired",
      message: "Your trial period has ended. Please upgrade to continue.",
    });
    return;
  }

  next();
}
