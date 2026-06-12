import { Router } from "express";
import { UserRole } from "@lyrus/db";
import { createOrgUserSchema, updateOrgUserSchema } from "@lyrus/shared";
import { zodErrorMessage } from "../../lib/api-errors.js";
import { asyncHandler } from "../../lib/http.js";
import { requireRouteParam } from "../../lib/route-params.js";
import { serializeUser } from "../../lib/serializers.js";
import { authorize } from "../../middleware/authorize.js";
import { requireAuthUser } from "../../middleware/authenticate.js";
import { requireActiveOrganization } from "../../middleware/require-active-organization.js";
import { assertTenantMatch, requireTenantContext } from "../../middleware/tenant-context.js";
import { userRepository } from "../../repositories/user.repository.js";
import {
  UserManagementError,
  userManagementService,
} from "../../services/user-management.service.js";
import { organizationRepository } from "../../repositories/organization.repository.js";

export function createOrganizationUsersRouter(): Router {
  const router = Router();

  router.use(requireTenantContext);
  router.use(assertTenantMatch);
  router.use(requireActiveOrganization);

  router.get(
    "/organizations/dashboard",
    authorize([UserRole.ORG_ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE]),
    asyncHandler(async (req, res) => {
      const tenant = req.tenant!;
      const stats = await organizationRepository.getOrgDashboardStats(tenant.organizationId);
      res.json(stats);
    }),
  );

  router.get(
    "/organizations/users",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      const tenant = req.tenant!;
      const page = Math.max(1, Number(req.query.page) || 1);
      const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 25));
      const search = typeof req.query.search === "string" ? req.query.search : undefined;

      const { items, total } = await userRepository.listOrganizationUsers({
        organizationId: tenant.organizationId,
        search,
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      res.json({
        items: items.map(serializeUser),
        total,
        page,
        pageSize,
      });
    }),
  );

  router.post(
    "/organizations/users",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      const parsed = createOrgUserSchema.safeParse(req.body);
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
        const result = await userManagementService.createEmployee(
          actor.id,
          tenant.organizationId,
          parsed.data,
        );
        res.status(201).json({
          user: serializeUser(result.user),
          temporaryPassword: result.temporaryPassword,
        });
      } catch (err) {
        if (err instanceof UserManagementError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.get(
    "/organizations/users/:id",
    authorize([UserRole.ORG_ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE]),
    asyncHandler(async (req, res) => {
      const tenant = req.tenant!;
      const userId = requireRouteParam(req.params.id, "id");
      const actor = requireAuthUser(req);

      if (actor.role === UserRole.EMPLOYEE && actor.id !== userId) {
        res.status(403).json({ error: "forbidden", message: "Employees can only view their own profile" });
        return;
      }

      const user = await userRepository.findByIdInOrganization(userId, tenant.organizationId);
      if (!user) {
        res.status(404).json({ error: "not_found", message: "User not found" });
        return;
      }

      res.json({ user: serializeUser(user) });
    }),
  );

  router.patch(
    "/organizations/users/:id",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      const parsed = updateOrgUserSchema.safeParse(req.body);
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
        const userId = requireRouteParam(req.params.id, "id");
        const user = await userManagementService.updateEmployee(
          actor.id,
          tenant.organizationId,
          userId,
          parsed.data,
        );
        res.json({ user: serializeUser(user) });
      } catch (err) {
        if (err instanceof UserManagementError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.delete(
    "/organizations/users/:id",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      try {
        const actor = requireAuthUser(req);
        const tenant = req.tenant!;
        const userId = requireRouteParam(req.params.id, "id");
        const user = await userManagementService.deactivateEmployee(
          actor.id,
          tenant.organizationId,
          userId,
        );
        res.json({ user: serializeUser(user) });
      } catch (err) {
        if (err instanceof UserManagementError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.post(
    "/organizations/users/:id/reset-password",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      try {
        const actor = requireAuthUser(req);
        const tenant = req.tenant!;
        const userId = requireRouteParam(req.params.id, "id");
        const result = await userManagementService.resetEmployeePassword(
          actor.id,
          tenant.organizationId,
          userId,
        );
        res.json(result);
      } catch (err) {
        if (err instanceof UserManagementError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.post(
    "/organizations/users/:id/activate",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      try {
        const actor = requireAuthUser(req);
        const tenant = req.tenant!;
        const userId = requireRouteParam(req.params.id, "id");
        const user = await userManagementService.activateEmployee(
          actor.id,
          tenant.organizationId,
          userId,
        );
        res.json({ user: serializeUser(user) });
      } catch (err) {
        if (err instanceof UserManagementError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.post(
    "/organizations/users/:id/resend-invite",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      try {
        const actor = requireAuthUser(req);
        const tenant = req.tenant!;
        const userId = requireRouteParam(req.params.id, "id");
        const result = await userManagementService.resendInvite(
          actor.id,
          tenant.organizationId,
          userId,
        );
        res.json(result);
      } catch (err) {
        if (err instanceof UserManagementError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.post(
    "/organizations/users/:id/force-password-change",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      try {
        const actor = requireAuthUser(req);
        const tenant = req.tenant!;
        const userId = requireRouteParam(req.params.id, "id");
        const result = await userManagementService.forcePasswordChange(
          actor.id,
          tenant.organizationId,
          userId,
        );
        res.json(result);
      } catch (err) {
        if (err instanceof UserManagementError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.get(
    "/organizations/users/:id/login-history",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      try {
        const tenant = req.tenant!;
        const userId = requireRouteParam(req.params.id, "id");
        const events = await userManagementService.getLoginHistory(
          tenant.organizationId,
          userId,
        );
        res.json({
          items: events.map((e) => ({
            id: e.id,
            action: e.action,
            createdAt: e.createdAt.toISOString(),
            metadata: e.metadata,
          })),
        });
      } catch (err) {
        if (err instanceof UserManagementError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  return router;
}
