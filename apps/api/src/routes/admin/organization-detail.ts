import { Router } from "express";
import { MeetingStatus, UserRole, UserStatus } from "@lyrus/db";
import { createOrgUserSchema, updateOrgUserSchema } from "@lyrus/shared";
import { zodErrorMessage } from "../../lib/api-errors.js";
import { asyncHandler } from "../../lib/http.js";
import { requireRouteParam } from "../../lib/route-params.js";
import { serializeOrganization, serializeUser } from "../../lib/serializers.js";
import { authorize } from "../../middleware/authorize.js";
import { requireAuthUser } from "../../middleware/authenticate.js";
import {
  OrganizationAdminError,
  organizationAdminService,
} from "../../services/organization-admin.service.js";
import {
  UserManagementError,
  userManagementService,
} from "../../services/user-management.service.js";

function handleOrgAdminError(
  err: unknown,
  res: import("express").Response,
): boolean {
  if (err instanceof OrganizationAdminError) {
    res.status(err.statusCode).json({ error: err.code, message: err.message });
    return true;
  }
  if (err instanceof UserManagementError) {
    res.status(err.statusCode).json({ error: err.code, message: err.message });
    return true;
  }
  return false;
}

export function createAdminOrganizationDetailRouter(): Router {
  const router = Router();

  router.get(
    "/admin/organizations/:organizationId/detail",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      try {
        const detail = await organizationAdminService.getOrganizationDetail(organizationId);
        res.json(detail);
      } catch (err) {
        if (handleOrgAdminError(err, res)) return;
        throw err;
      }
    }),
  );

  router.get(
    "/admin/organizations/:organizationId/employees",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const page = Math.max(1, Number(req.query.page) || 1);
      const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 25));
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const status =
        typeof req.query.status === "string"
          ? (req.query.status as (typeof UserStatus)[keyof typeof UserStatus])
          : undefined;
      const role =
        typeof req.query.role === "string"
          ? (req.query.role as "ORG_ADMIN" | "MANAGER" | "EMPLOYEE")
          : undefined;

      try {
        const { items, total } = await organizationAdminService.listEmployees(organizationId, {
          search,
          status,
          role,
          skip: (page - 1) * pageSize,
          take: pageSize,
        });
        res.json({ items, total, page, pageSize });
      } catch (err) {
        if (handleOrgAdminError(err, res)) return;
        throw err;
      }
    }),
  );

  router.post(
    "/admin/organizations/:organizationId/employees",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const parsed = createOrgUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "validation_error",
          message: zodErrorMessage(parsed.error),
        });
        return;
      }
      const actor = requireAuthUser(req);
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      try {
        const result = await userManagementService.createEmployee(
          actor.id,
          organizationId,
          parsed.data,
        );
        res.status(201).json({
          user: serializeUser(result.user),
          temporaryPassword: result.temporaryPassword,
        });
      } catch (err) {
        if (handleOrgAdminError(err, res)) return;
        throw err;
      }
    }),
  );

  router.patch(
    "/admin/organizations/:organizationId/employees/:userId",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const parsed = updateOrgUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "validation_error",
          message: zodErrorMessage(parsed.error),
        });
        return;
      }
      const actor = requireAuthUser(req);
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const userId = requireRouteParam(req.params.userId, "userId");
      try {
        const user = await userManagementService.updateEmployee(
          actor.id,
          organizationId,
          userId,
          parsed.data,
        );
        res.json({ user: serializeUser(user) });
      } catch (err) {
        if (handleOrgAdminError(err, res)) return;
        throw err;
      }
    }),
  );

  router.delete(
    "/admin/organizations/:organizationId/employees/:userId",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const actor = requireAuthUser(req);
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const userId = requireRouteParam(req.params.userId, "userId");
      try {
        const user = await userManagementService.deactivateEmployee(
          actor.id,
          organizationId,
          userId,
        );
        res.json({ user: serializeUser(user) });
      } catch (err) {
        if (handleOrgAdminError(err, res)) return;
        throw err;
      }
    }),
  );

  router.post(
    "/admin/organizations/:organizationId/employees/:userId/activate",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const actor = requireAuthUser(req);
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const userId = requireRouteParam(req.params.userId, "userId");
      try {
        const user = await userManagementService.activateEmployee(
          actor.id,
          organizationId,
          userId,
        );
        res.json({ user: serializeUser(user) });
      } catch (err) {
        if (handleOrgAdminError(err, res)) return;
        throw err;
      }
    }),
  );

  router.post(
    "/admin/organizations/:organizationId/employees/:userId/reset-password",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const actor = requireAuthUser(req);
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const userId = requireRouteParam(req.params.userId, "userId");
      try {
        const result = await userManagementService.resetEmployeePassword(
          actor.id,
          organizationId,
          userId,
        );
        res.json(result);
      } catch (err) {
        if (handleOrgAdminError(err, res)) return;
        throw err;
      }
    }),
  );

  router.post(
    "/admin/organizations/:organizationId/employees/:userId/resend-invite",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const actor = requireAuthUser(req);
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const userId = requireRouteParam(req.params.userId, "userId");
      try {
        const result = await userManagementService.resendInvite(
          actor.id,
          organizationId,
          userId,
        );
        res.json(result);
      } catch (err) {
        if (handleOrgAdminError(err, res)) return;
        throw err;
      }
    }),
  );

  router.get(
    "/admin/organizations/:organizationId/meetings",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const page = Math.max(1, Number(req.query.page) || 1);
      const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 25));
      const search = typeof req.query.search === "string" ? req.query.search : undefined;
      const status =
        typeof req.query.status === "string"
          ? (req.query.status as (typeof MeetingStatus)[keyof typeof MeetingStatus])
          : undefined;

      try {
        const { items, total } = await organizationAdminService.listMeetings(organizationId, {
          search,
          status,
          skip: (page - 1) * pageSize,
          take: pageSize,
        });
        res.json({ items, total, page, pageSize });
      } catch (err) {
        if (handleOrgAdminError(err, res)) return;
        throw err;
      }
    }),
  );

  router.get(
    "/admin/organizations/:organizationId/audit-logs",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const page = Math.max(1, Number(req.query.page) || 1);
      const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 30));

      try {
        const { items, total } = await organizationAdminService.listAuditLogs(organizationId, {
          skip: (page - 1) * pageSize,
          take: pageSize,
        });
        res.json({ items, total, page, pageSize });
      } catch (err) {
        if (handleOrgAdminError(err, res)) return;
        throw err;
      }
    }),
  );

  router.get(
    "/admin/organizations/:organizationId",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      try {
        const detail = await organizationAdminService.getOrganizationDetail(organizationId);
        res.json({
          organization: detail.organization,
          usage: detail.usage,
          admin: detail.admin,
          subscription: detail.subscription,
        });
      } catch (err) {
        if (handleOrgAdminError(err, res)) return;
        throw err;
      }
    }),
  );

  return router;
}
