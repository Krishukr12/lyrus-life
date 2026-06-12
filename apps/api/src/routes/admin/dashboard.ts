import { Router } from "express";
import { UserRole } from "@lyrus/db";
import { asyncHandler } from "../../lib/http.js";
import { authorize } from "../../middleware/authorize.js";
import { dashboardService } from "../../services/dashboard.service.js";

export function createAdminDashboardRouter(): Router {
  const router = Router();

  router.get(
    "/admin/dashboard",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (_req, res) => {
      const dashboard = await dashboardService.getDashboard();
      res.json(dashboard);
    }),
  );

  return router;
}
