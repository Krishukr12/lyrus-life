import { Router } from "express";
import { UserRole } from "@lyrus/db";
import { updateOrganizationSettingsSchema } from "@lyrus/shared";
import { zodErrorMessage } from "../../lib/api-errors.js";
import { asyncHandler } from "../../lib/http.js";
import { serializeOrganization } from "../../lib/serializers.js";
import { authorize } from "../../middleware/authorize.js";
import { requireAuthUser } from "../../middleware/authenticate.js";
import { requireActiveOrganization } from "../../middleware/require-active-organization.js";
import { assertTenantMatch, requireTenantContext } from "../../middleware/tenant-context.js";
import {
  OrganizationSettingsError,
  organizationSettingsService,
} from "../../services/organization-settings.service.js";
import { countActiveOrganizationSeats, PLAN_MAX_USERS } from "../../lib/plan-limits.js";
import { organizationRepository } from "../../repositories/organization.repository.js";

export function createOrganizationSettingsRouter(): Router {
  const router = Router();

  router.use(requireTenantContext);
  router.use(assertTenantMatch);
  router.use(requireActiveOrganization);

  router.get(
    "/organizations/settings",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      const tenant = req.tenant!;
      const org = await organizationSettingsService.getSettings(tenant.organizationId);
      res.json({ organization: serializeOrganization(org) });
    }),
  );

  router.patch(
    "/organizations/settings",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      const parsed = updateOrganizationSettingsSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "validation_error",
          message: zodErrorMessage(parsed.error),
        });
        return;
      }

      try {
        const actor = requireAuthUser(req);
        const tenant = req.tenant!;
        const org = await organizationSettingsService.updateSettings(
          actor.id,
          tenant.organizationId,
          parsed.data,
        );
        res.json({ organization: serializeOrganization(org) });
      } catch (err) {
        if (err instanceof OrganizationSettingsError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.get(
    "/organizations/plan-usage",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      const tenant = req.tenant!;
      const org = await organizationRepository.findById(tenant.organizationId);
      if (!org) {
        res.status(404).json({ error: "not_found", message: "Organization not found" });
        return;
      }

      const activeUsers = await countActiveOrganizationSeats(tenant.organizationId);
      const maxUsers = PLAN_MAX_USERS[org.subscriptionPlan];

      res.json({
        subscriptionPlan: org.subscriptionPlan,
        activeUsers,
        maxUsers,
        canAddUser: maxUsers === null || activeUsers < maxUsers,
      });
    }),
  );

  return router;
}
