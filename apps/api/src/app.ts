import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import { HttpAuthError } from "./lib/meeting-access.js";
import { OrganizationServiceError } from "./services/organization.service.js";
import { UserManagementError } from "./services/user-management.service.js";
import { BillingServiceError } from "./services/billing.service.js";
import { authenticate } from "./middleware/authenticate.js";
import { globalRateLimiter, securityHeaders } from "./middleware/security.js";
import { createAuthRouter } from "./routes/auth.js";
import { createAdminOrganizationsRouter } from "./routes/admin/organizations.js";
import { createAdminOrganizationDetailRouter } from "./routes/admin/organization-detail.js";
import { createAdminBillingRouter } from "./routes/admin/billing.js";
import { createAdminDashboardRouter } from "./routes/admin/dashboard.js";
import { createAdminMomTemplatesRouter } from "./routes/admin/mom-templates.js";
import { MomTemplateServiceError } from "./services/mom-template.service.js";
import { createOrganizationUsersRouter } from "./routes/organization/users.js";
import { createOrganizationInvitationsRouter } from "./routes/organization/invitations.js";
import { createOrganizationSettingsRouter } from "./routes/organization/settings.js";
import { InvitationError } from "./services/invitation.service.js";
import { PlanLimitError } from "./lib/plan-limits.js";
import { createLiveRouter } from "./routes/live.js";
import { createMeetingsRouter } from "./routes/meetings.js";

export function createApp(corsOrigins: string[]): Express {
  const app = express();

  app.use(securityHeaders);
  app.use(globalRateLimiter);
  app.use(
    cors({
      origin: corsOrigins,
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "lyrus-api" });
  });

  app.use(createAuthRouter());
  app.use(createLiveRouter());

  const protectedApi = express.Router();
  protectedApi.use(authenticate);
  protectedApi.use(createAdminOrganizationsRouter());
  protectedApi.use(createAdminOrganizationDetailRouter());
  protectedApi.use(createAdminDashboardRouter());
  protectedApi.use(createAdminBillingRouter());
  protectedApi.use(createAdminMomTemplatesRouter());
  protectedApi.use(createOrganizationUsersRouter());
  protectedApi.use(createOrganizationInvitationsRouter());
  protectedApi.use(createOrganizationSettingsRouter());
  protectedApi.use(createMeetingsRouter());
  app.use(protectedApi);

  app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) {
      next(err);
      return;
    }
    if (err instanceof HttpAuthError) {
      res.status(err.statusCode).json({ error: err.code, message: err.message });
      return;
    }
    if (
      err instanceof OrganizationServiceError ||
      err instanceof UserManagementError ||
      err instanceof InvitationError
    ) {
      const body: Record<string, unknown> = { error: err.code, message: err.message };
      if ("preview" in err && err.preview) {
        body.billingPreview = err.preview;
      }
      res.status(err.statusCode).json(body);
      return;
    }
    if (err instanceof BillingServiceError) {
      res.status(err.statusCode).json({ error: err.code, message: err.message });
      return;
    }
    if (err instanceof PlanLimitError) {
      res.status(err.statusCode).json({ error: err.code, message: err.message });
      return;
    }
    if (err instanceof MomTemplateServiceError) {
      res.status(err.statusCode).json({ error: err.code, message: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({
      error: "internal_error",
      message: err instanceof Error ? err.message : "Internal server error",
    });
  });

  return app;
}
