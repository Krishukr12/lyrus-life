import { Router } from "express";
import { UserRole } from "@lyrus/db";
import { inviteOrgUserSchema } from "@lyrus/shared";
import { zodErrorMessage } from "../../lib/api-errors.js";
import { asyncHandler } from "../../lib/http.js";
import { requireRouteParam } from "../../lib/route-params.js";
import { authorize } from "../../middleware/authorize.js";
import { requireAuthUser } from "../../middleware/authenticate.js";
import { requireActiveOrganization } from "../../middleware/require-active-organization.js";
import { assertTenantMatch, requireTenantContext } from "../../middleware/tenant-context.js";
import {
  InvitationError,
  invitationService,
} from "../../services/invitation.service.js";
import { getSeatUsageSummary } from "../../services/seat-billing.service.js";

export function createOrganizationInvitationsRouter(): Router {
  const router = Router();

  router.use(requireTenantContext);
  router.use(assertTenantMatch);
  router.use(requireActiveOrganization);

  router.get(
    "/organizations/seats",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      const tenant = req.tenant!;
      const summary = await getSeatUsageSummary(tenant.organizationId);
      res.json(summary);
    }),
  );

  router.get(
    "/organizations/billing/seat-preview",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      const tenant = req.tenant!;
      const seatsToAdd = Math.max(1, Number(req.query.seatsToAdd) || 1);
      const preview = await invitationService.getBillingPreview(
        tenant.organizationId,
        seatsToAdd,
      );
      res.json(preview);
    }),
  );

  router.get(
    "/organizations/invitations",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      const tenant = req.tenant!;
      const invitations = await invitationService.listInvitations(tenant.organizationId);
      res.json(invitations);
    }),
  );

  router.post(
    "/organizations/invitations",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      const parsed = inviteOrgUserSchema.safeParse(req.body);
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
        const result = await invitationService.inviteUser(
          actor.id,
          tenant.organizationId,
          parsed.data,
        );
        res.status(201).json({
          invitation: {
            id: result.invitation.id,
            email: result.invitation.email,
            firstName: result.invitation.firstName,
            lastName: result.invitation.lastName,
            role: result.invitation.role,
            status: result.invitation.status,
            expiresAt: result.invitation.expiresAt.toISOString(),
            createdAt: result.invitation.createdAt.toISOString(),
          },
          billingPreview: result.billingPreview,
        });
      } catch (err) {
        if (err instanceof InvitationError) {
          res.status(err.statusCode).json({
            error: err.code,
            message: err.message,
            billingPreview: err.preview,
          });
          return;
        }
        throw err;
      }
    }),
  );

  router.post(
    "/organizations/invitations/:id/resend",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      try {
        const actor = requireAuthUser(req);
        const tenant = req.tenant!;
        const invitationId = requireRouteParam(req.params.id, "id");
        const result = await invitationService.resendInvitation(
          actor.id,
          tenant.organizationId,
          invitationId,
        );
        res.json(result);
      } catch (err) {
        if (err instanceof InvitationError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.delete(
    "/organizations/invitations/:id",
    authorize([UserRole.ORG_ADMIN]),
    asyncHandler(async (req, res) => {
      try {
        const actor = requireAuthUser(req);
        const tenant = req.tenant!;
        const invitationId = requireRouteParam(req.params.id, "id");
        const result = await invitationService.cancelInvitation(
          actor.id,
          tenant.organizationId,
          invitationId,
        );
        res.json(result);
      } catch (err) {
        if (err instanceof InvitationError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  return router;
}
