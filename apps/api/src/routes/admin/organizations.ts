import { Router } from "express";
import { UserRole } from "@lyrus/db";
import { createOrganizationSchema, updateOrganizationSchema } from "@lyrus/shared";
import { zodErrorMessage } from "../../lib/api-errors.js";
import { asyncHandler } from "../../lib/http.js";
import { requireRouteParam } from "../../lib/route-params.js";
import { serializeOrganization } from "../../lib/serializers.js";
import { authorize } from "../../middleware/authorize.js";
import { requireAuthUser } from "../../middleware/authenticate.js";
import { organizationRepository } from "../../repositories/organization.repository.js";
import {
  OrganizationServiceError,
  organizationService,
} from "../../services/organization.service.js";

export function createAdminOrganizationsRouter(): Router {
  const router = Router();

  router.get(
    "/admin/stats",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (_req, res) => {
      const stats = await organizationRepository.getPlatformStats();
      res.json(stats);
    }),
  );

  router.get(
    "/admin/organizations",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const page = Math.max(1, Number(req.query.page) || 1);
      const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 25));
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const status =
        typeof req.query.status === "string"
          ? (req.query.status as "ACTIVE" | "SUSPENDED" | "PENDING")
          : undefined;

      const { items, total } = await organizationRepository.list({
        search,
        status,
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      res.json({
        items: items.map(serializeOrganization),
        total,
        page,
        pageSize,
      });
    }),
  );

  router.post(
    "/admin/organizations",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const parsed = createOrganizationSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "validation_error",
          message: zodErrorMessage(parsed.error),
        });
        return;
      }

      try {
        const actor = requireAuthUser(req);
        const result = await organizationService.createOrganization(actor.id, parsed.data);
        res.status(201).json({
          organization: serializeOrganization(result.organization),
          admin: {
            id: result.admin.id,
            email: result.admin.email,
            name: result.admin.name,
          },
          temporaryPassword: result.temporaryPassword,
        });
      } catch (err) {
        if (err instanceof OrganizationServiceError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.patch(
    "/admin/organizations/:id",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const parsed = updateOrganizationSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "validation_error",
          message: zodErrorMessage(parsed.error),
        });
        return;
      }

      try {
        const actor = requireAuthUser(req);
        const id = requireRouteParam(req.params.id, "id");
        const updated = await organizationService.updateOrganization(actor.id, id, parsed.data);
        res.json({ organization: serializeOrganization(updated) });
      } catch (err) {
        if (err instanceof OrganizationServiceError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.post(
    "/admin/organizations/:id/activate",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const actor = requireAuthUser(req);
      const id = requireRouteParam(req.params.id, "id");
      const updated = await organizationService.activateOrganization(actor.id, id);
      res.json({ organization: serializeOrganization(updated) });
    }),
  );

  router.post(
    "/admin/organizations/:id/suspend",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const actor = requireAuthUser(req);
      const id = requireRouteParam(req.params.id, "id");
      const updated = await organizationService.suspendOrganization(actor.id, id);
      res.json({ organization: serializeOrganization(updated) });
    }),
  );

  return router;
}
