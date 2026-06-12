import { Router } from "express";
import { UserRole } from "@lyrus/db";
import { zodErrorMessage } from "../../lib/api-errors.js";
import { asyncHandler } from "../../lib/http.js";
import { requireRouteParam } from "../../lib/route-params.js";
import { authorize } from "../../middleware/authorize.js";
import { requireAuthUser } from "../../middleware/authenticate.js";
import {
  pricingConfigSchema,
  updateOrganizationBillingSchema,
} from "../../schemas/billing.schemas.js";
import { BillingServiceError, billingService } from "../../services/billing.service.js";
import { logTenantAudit } from "../../services/tenant-audit.service.js";

export function createAdminBillingRouter(): Router {
  const router = Router();

  router.get(
    "/admin/billing/pricing",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (_req, res) => {
      const pricing = await billingService.getPricingConfig();
      res.json({ pricing });
    }),
  );

  router.put(
    "/admin/billing/pricing",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const parsed = pricingConfigSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "validation_error",
          message: zodErrorMessage(parsed.error),
        });
        return;
      }
      const pricing = await billingService.updatePricingConfig(parsed.data);
      res.json({ pricing });
    }),
  );

  router.post(
    "/admin/billing/pricing/reset",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (_req, res) => {
      const pricing = await billingService.resetPricingConfig();
      res.json({ pricing });
    }),
  );

  router.get(
    "/admin/billing/customers",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (_req, res) => {
      const data = await billingService.listCustomerBilling();
      res.json(data);
    }),
  );

  router.get(
    "/admin/billing/customers/:organizationId",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const detail = await billingService.getCustomerBillingDetail(organizationId);
      if (!detail) {
        res.status(404).json({ error: "not_found", message: "Organization not found" });
        return;
      }
      res.json({ billing: detail });
    }),
  );

  router.patch(
    "/admin/billing/customers/:organizationId",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const parsed = updateOrganizationBillingSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "validation_error",
          message: zodErrorMessage(parsed.error),
        });
        return;
      }

      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      let nextBillingDate: Date | null | undefined;
      if (parsed.data.nextBillingDate !== undefined) {
        if (parsed.data.nextBillingDate === "" || parsed.data.nextBillingDate === null) {
          nextBillingDate = null;
        } else {
          nextBillingDate = new Date(parsed.data.nextBillingDate);
        }
      }

      try {
        const actor = requireAuthUser(req);
        const billing = await billingService.updateCustomerBilling(organizationId, {
          subscriptionPlan: parsed.data.subscriptionPlan,
          billingCycle: parsed.data.billingCycle,
          billingStatus: parsed.data.billingStatus,
          activeLocations: parsed.data.activeLocations,
          nextBillingDate,
        });
        await logTenantAudit({
          organizationId,
          userId: actor.id,
          action: "billing.updated",
          metadata: { organizationId, changes: parsed.data },
        });
        res.json({ billing });
      } catch (err) {
        if (err instanceof BillingServiceError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  return router;
}
