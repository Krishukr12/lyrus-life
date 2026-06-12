import { Router } from "express";
import { UserRole } from "@lyrus/db";
import { zodErrorMessage } from "../../lib/api-errors.js";
import { asyncHandler } from "../../lib/http.js";
import { requireRouteParam } from "../../lib/route-params.js";
import { authorize } from "../../middleware/authorize.js";
import { requireAuthUser } from "../../middleware/authenticate.js";
import {
  pricingConfigSchema,
  recordPaymentSchema,
  updateOrganizationBillingSchema,
} from "../../schemas/billing.schemas.js";
import { BillingServiceError, billingService } from "../../services/billing.service.js";
import { InvoiceServiceError, invoiceService } from "../../services/invoice.service.js";
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
      const actor = requireAuthUser(req);
      const pricing = await billingService.updatePricingConfig(parsed.data, {
        id: actor.id,
        name: actor.name ?? "Super Admin",
      });
      res.json({ pricing });
    }),
  );

  router.post(
    "/admin/billing/pricing/reset",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const actor = requireAuthUser(req);
      const pricing = await billingService.resetPricingConfig({
        id: actor.id,
        name: actor.name ?? "Super Admin",
      });
      res.json({ pricing });
    }),
  );

  router.get(
    "/admin/billing/pricing/history",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (_req, res) => {
      const items = await billingService.listPricingHistory();
      res.json({
        items: items.map((entry) => ({
          id: entry.id,
          actorId: entry.actorId,
          actorName: entry.actorName,
          previous: entry.previous,
          next: entry.next,
          createdAt: entry.createdAt.toISOString(),
        })),
      });
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

  router.get(
    "/admin/billing/customers/:organizationId/dashboard",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      try {
        const dashboard = await invoiceService.getBillingDashboard(organizationId);
        res.json({ dashboard });
      } catch (err) {
        if (err instanceof InvoiceServiceError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.get(
    "/admin/billing/customers/:organizationId/invoices",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const invoices = await invoiceService.listInvoices(organizationId);
      res.json({ invoices });
    }),
  );

  router.post(
    "/admin/billing/customers/:organizationId/invoices/generate",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const actor = requireAuthUser(req);
      try {
        const invoice = await invoiceService.generateInvoice(actor.id, organizationId);
        await logTenantAudit({
          organizationId,
          userId: actor.id,
          action: "invoice.generated",
          metadata: { invoiceId: invoice?.id, invoiceNumber: invoice?.invoiceNumber },
        });
        res.status(201).json({ invoice });
      } catch (err) {
        if (err instanceof InvoiceServiceError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.post(
    "/admin/billing/customers/:organizationId/invoices/send-latest",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const actor = requireAuthUser(req);
      try {
        const generated = await invoiceService.generateInvoice(actor.id, organizationId);
        if (!generated?.id) {
          res.status(500).json({ error: "generation_failed", message: "Failed to generate invoice" });
          return;
        }
        const invoice = await invoiceService.sendInvoice(actor.id, organizationId, generated.id);
        await logTenantAudit({
          organizationId,
          userId: actor.id,
          action: "invoice.sent",
          metadata: { invoiceId: invoice?.id, invoiceNumber: invoice?.invoiceNumber },
        });
        res.json({ invoice });
      } catch (err) {
        if (err instanceof InvoiceServiceError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.post(
    "/admin/billing/customers/:organizationId/invoices/:invoiceId/send",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const invoiceId = requireRouteParam(req.params.invoiceId, "invoiceId");
      const actor = requireAuthUser(req);
      try {
        const invoice = await invoiceService.sendInvoice(actor.id, organizationId, invoiceId);
        await logTenantAudit({
          organizationId,
          userId: actor.id,
          action: "invoice.resent",
          metadata: { invoiceId, invoiceNumber: invoice?.invoiceNumber },
        });
        res.json({ invoice });
      } catch (err) {
        if (err instanceof InvoiceServiceError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.get(
    "/admin/billing/customers/:organizationId/invoices/:invoiceId/pdf",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const invoiceId = requireRouteParam(req.params.invoiceId, "invoiceId");
      try {
        const { buffer, filename } = await invoiceService.getInvoicePdf(organizationId, invoiceId);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.send(buffer);
      } catch (err) {
        if (err instanceof InvoiceServiceError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.get(
    "/admin/billing/customers/:organizationId/payments",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const payments = await invoiceService.listPayments(organizationId);
      res.json({ payments });
    }),
  );

  router.post(
    "/admin/billing/customers/:organizationId/payments",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const parsed = recordPaymentSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "validation_error",
          message: zodErrorMessage(parsed.error),
        });
        return;
      }

      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const actor = requireAuthUser(req);
      try {
        const result = await invoiceService.recordPayment(actor.id, organizationId, parsed.data);
        await logTenantAudit({
          organizationId,
          userId: actor.id,
          action: "payment.recorded",
          metadata: { ...parsed.data, paymentId: result.payment.id },
        });
        res.status(201).json(result);
      } catch (err) {
        if (err instanceof InvoiceServiceError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
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

      let billingEmail: string | null | undefined;
      if (parsed.data.billingEmail !== undefined) {
        billingEmail =
          parsed.data.billingEmail === "" || parsed.data.billingEmail === null
            ? null
            : parsed.data.billingEmail;
      }

      try {
        const actor = requireAuthUser(req);
        const billing = await billingService.updateCustomerBilling(
          organizationId,
          {
            subscriptionPlan: parsed.data.subscriptionPlan,
            billingCycle: parsed.data.billingCycle,
            billingStatus: parsed.data.billingStatus,
            activeLocations: parsed.data.activeLocations,
            nextBillingDate,
            discountPercent: parsed.data.discountPercent,
            billingEmail,
          },
          actor.id,
        );
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
