import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  InvoiceDeliveryStatus,
  InvoiceStatus,
  PaymentStatus,
  TemplateFileStorageBackend,
  UserRole,
} from "@lyrus/db";
import { sendInvoiceEmail } from "@lyrus/notifications";
import { addDays, endOfMonth, format, startOfMonth } from "date-fns";
import { PLAN_INCLUDED_ALLOWANCES, PLATFORM_BILLING } from "../lib/billing-defaults.js";
import { buildBillingLineItems } from "../lib/billing-line-items.js";
import { planDisplayName, type PlanTier } from "../lib/billing-calculator.js";
import { generateInvoicePdfBytes } from "../lib/invoice-pdf.js";
import { billingRepository } from "../repositories/billing.repository.js";
import { invoiceRepository } from "../repositories/invoice.repository.js";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

export class InvoiceServiceError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 400,
  ) {
    super(message);
  }
}

function billingAddressFromOrg(org: {
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  email: string;
}) {
  const parts = [org.name, org.address, org.city, org.state, org.country, org.email].filter(Boolean);
  return parts.join("\n");
}

async function saveInvoicePdf(
  organizationId: string,
  invoiceNumber: string,
  pdfBytes: Uint8Array,
): Promise<{
  storageKey: string;
  storageBackend: (typeof TemplateFileStorageBackend)[keyof typeof TemplateFileStorageBackend];
}> {
  const storageKey = `invoices/${organizationId}/${invoiceNumber}.pdf`;
  const filePath = path.join(UPLOAD_DIR, storageKey);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, Buffer.from(pdfBytes));
  return { storageKey, storageBackend: TemplateFileStorageBackend.LOCAL };
}

async function generateInvoiceNumber(organizationId: string, orgCode?: string | null) {
  const count = await invoiceRepository.countInvoicesForOrg(organizationId);
  const prefix = format(new Date(), "yyyyMM");
  const code = (orgCode ?? "ORG").replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 8);
  return `INV-${prefix}-${code}-${String(count + 1).padStart(4, "0")}`;
}

type InvoiceWithRelations = NonNullable<Awaited<ReturnType<typeof invoiceRepository.findById>>>;

function serializeInvoice(
  invoice:
    | InvoiceWithRelations
    | Awaited<ReturnType<typeof invoiceRepository.listByOrganization>>[number]
    | null,
) {
  if (!invoice) return null;
  return {
    id: invoice.id,
    organizationId: invoice.organizationId,
    invoiceNumber: invoice.invoiceNumber,
    status: invoice.status,
    planName: invoice.planName,
    billingCycle: invoice.billingCycle,
    periodStart: invoice.periodStart.toISOString(),
    periodEnd: invoice.periodEnd.toISOString(),
    includedSeats: invoice.includedSeats,
    activeSeats: invoice.activeSeats,
    additionalSeats: invoice.additionalSeats,
    includedLocations: invoice.includedLocations,
    activeLocations: invoice.activeLocations,
    subtotalInr: invoice.subtotalInr,
    discountInr: invoice.discountInr,
    gstInr: invoice.gstInr,
    totalInr: invoice.totalInr,
    billingAddress: invoice.billingAddress,
    issuedAt: invoice.issuedAt?.toISOString() ?? null,
    dueAt: invoice.dueAt?.toISOString() ?? null,
    paidAt: invoice.paidAt?.toISOString() ?? null,
    createdAt: invoice.createdAt.toISOString(),
    lineItems: invoice.lineItems.map((item) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPriceInr: item.unitPriceInr,
      amountInr: item.amountInr,
      sortOrder: item.sortOrder,
    })),
    deliveries: invoice.deliveries?.map((d) => ({
      id: d.id,
      recipientEmail: d.recipientEmail,
      status: d.status,
      error: d.error,
      sentAt: d.sentAt?.toISOString() ?? null,
      createdAt: d.createdAt.toISOString(),
    })),
    payments: ("payments" in invoice ? invoice.payments : undefined)?.map((p) => ({
      id: p.id,
      amountInr: p.amountInr,
      status: p.status,
      method: p.method,
      reference: p.reference,
      paidAt: p.paidAt.toISOString(),
    })),
  };
}

export const invoiceService = {
  async getOrganizationBillingContext(organizationId: string) {
    const org = await billingRepository.getOrganizationBilling(organizationId);
    if (!org) return null;

    const pricing = await billingRepository.getPricingConfig();
    const profile = org.billingProfile;
    const activeUsers = org.users.length;
    const activeLocations = profile?.activeLocations ?? 0;
    const billingCycle = (profile?.billingCycle === "yearly" ? "yearly" : "monthly") as
      | "monthly"
      | "yearly";
    const discountPercent = profile?.discountPercent
      ? Number(profile.discountPercent)
      : 0;

    const { amounts, lineItems, included } = buildBillingLineItems({
      plan: org.subscriptionPlan as PlanTier,
      billingCycle,
      activeUsers,
      activeLocations,
      pricing,
      discountPercent,
    });

    const orgAdmin = await import("@lyrus/db").then(({ prisma }) =>
      prisma.user.findFirst({
        where: { organizationId, role: UserRole.ORG_ADMIN, status: "ACTIVE" },
        select: { email: true, name: true },
      }),
    );

    return {
      org,
      pricing,
      profile,
      activeUsers,
      activeLocations,
      billingCycle,
      discountPercent,
      amounts,
      lineItems,
      included,
      adminEmail: profile?.billingEmail ?? orgAdmin?.email ?? org.email,
      adminName: orgAdmin?.name ?? org.primaryContactName ?? org.name,
    };
  },

  async getBillingDashboard(organizationId: string) {
    const ctx = await this.getOrganizationBillingContext(organizationId);
    if (!ctx) {
      throw new InvoiceServiceError("not_found", "Organization not found", 404);
    }

    const [invoices, payments, events] = await Promise.all([
      invoiceRepository.listByOrganization(organizationId, 12),
      invoiceRepository.listPayments(organizationId, 12),
      invoiceRepository.listBillingEvents(organizationId, 20),
    ]);

    const upcomingInvoice = invoices.find(
      (inv) => inv.status === "ISSUED" || inv.status === "SENT" || inv.status === "OVERDUE",
    );

    const annualCostInr =
      ctx.billingCycle === "yearly"
        ? ctx.amounts.cycleSubtotalInr + ctx.amounts.gstInr
        : (ctx.amounts.monthlySubtotalInr + ctx.amounts.gstInr) * 12;

    return {
      currentPlan: ctx.org.subscriptionPlan,
      currentPlanLabel: planDisplayName(ctx.org.subscriptionPlan as PlanTier),
      billingCycle: ctx.billingCycle,
      billingStatus: ctx.profile?.billingStatus ?? "PENDING",
      monthlyCostInr: ctx.amounts.monthlySubtotalInr + ctx.amounts.gstInr,
      annualCostInr,
      includedUsers: ctx.included.users,
      activeUsers: ctx.activeUsers,
      additionalUsers: ctx.amounts.extraUsers,
      includedLocations: ctx.included.locations,
      activeLocations: ctx.activeLocations,
      additionalLocations: ctx.amounts.extraLocations,
      nextBillingDate: ctx.profile?.nextBillingDate?.toISOString() ?? null,
      trialEndsAt: ctx.profile?.trialEndsAt?.toISOString() ?? null,
      upcomingInvoice: upcomingInvoice
        ? {
            id: upcomingInvoice.id,
            invoiceNumber: upcomingInvoice.invoiceNumber,
            totalInr: upcomingInvoice.totalInr,
            dueAt: upcomingInvoice.dueAt?.toISOString() ?? null,
            status: upcomingInvoice.status,
          }
        : null,
      breakdown: ctx.amounts,
      invoices: invoices.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        status: inv.status,
        totalInr: inv.totalInr,
        issuedAt: inv.issuedAt?.toISOString() ?? null,
        paidAt: inv.paidAt?.toISOString() ?? null,
      })),
      payments: payments.map((p) => ({
        id: p.id,
        amountInr: p.amountInr,
        status: p.status,
        method: p.method,
        reference: p.reference,
        paidAt: p.paidAt.toISOString(),
        invoiceNumber: p.invoice?.invoiceNumber ?? null,
      })),
      events: events.map((e) => ({
        id: e.id,
        type: e.type,
        metadata: e.metadata,
        createdAt: e.createdAt.toISOString(),
      })),
    };
  },

  async generateInvoice(actorId: string, organizationId: string) {
    const ctx = await this.getOrganizationBillingContext(organizationId);
    if (!ctx) {
      throw new InvoiceServiceError("not_found", "Organization not found", 404);
    }

    if (ctx.org.subscriptionPlan === "FOREVER_FREE") {
      throw new InvoiceServiceError(
        "forever_free_no_invoice",
        "Forever Free organizations are not billed",
        400,
      );
    }

    const now = new Date();
    const periodStart = ctx.profile?.currentPeriodStart ?? startOfMonth(now);
    const periodEnd = ctx.profile?.currentPeriodEnd ?? endOfMonth(now);
    const issuedAt = now;
    const dueAt = addDays(issuedAt, PLATFORM_BILLING.invoiceDueDays);
    const invoiceNumber = await generateInvoiceNumber(organizationId, ctx.org.code);

    const pdfBytes = generateInvoicePdfBytes({
      invoiceNumber,
      status: "ISSUED",
      organizationName: ctx.org.name,
      billingAddress: billingAddressFromOrg(ctx.org),
      planName: planDisplayName(ctx.org.subscriptionPlan as PlanTier),
      billingCycle: ctx.billingCycle,
      periodStart,
      periodEnd,
      includedSeats: ctx.included.users ?? 0,
      activeSeats: ctx.activeUsers,
      additionalSeats: ctx.amounts.extraUsers,
      subtotalInr: ctx.amounts.cycleSubtotalInr,
      discountInr: ctx.amounts.discountInr,
      gstInr: ctx.amounts.gstInr,
      totalInr: ctx.amounts.totalInr,
      issuedAt,
      dueAt,
      lineItems: ctx.lineItems.filter((item) => !item.description.startsWith("GST")),
    });

    const saved = await saveInvoicePdf(organizationId, invoiceNumber, pdfBytes);

    const invoice = await invoiceRepository.createInvoice({
      organizationId,
      invoiceNumber,
      status: InvoiceStatus.ISSUED,
      planName: planDisplayName(ctx.org.subscriptionPlan as PlanTier),
      billingCycle: ctx.billingCycle,
      periodStart,
      periodEnd,
      includedSeats: ctx.included.users ?? 0,
      activeSeats: ctx.activeUsers,
      additionalSeats: ctx.amounts.extraUsers,
      includedLocations: ctx.included.locations ?? 0,
      activeLocations: ctx.activeLocations,
      subtotalInr: ctx.amounts.cycleSubtotalInr,
      discountInr: ctx.amounts.discountInr,
      gstInr: ctx.amounts.gstInr,
      totalInr: ctx.amounts.totalInr,
      billingAddress: billingAddressFromOrg(ctx.org),
      issuedAt,
      dueAt,
      storageKey: saved.storageKey,
      storageBackend: saved.storageBackend,
      lineItems: ctx.lineItems,
    });

    await invoiceRepository.logBillingEvent({
      organizationId,
      type: "invoice.generated",
      actorId,
      metadata: { invoiceId: invoice.id, invoiceNumber, totalInr: invoice.totalInr },
    });

    return serializeInvoice(
      await invoiceRepository.findById(organizationId, invoice.id),
    );
  },

  async sendInvoice(actorId: string, organizationId: string, invoiceId: string) {
    const invoice = await invoiceRepository.findById(organizationId, invoiceId);
    if (!invoice) {
      throw new InvoiceServiceError("not_found", "Invoice not found", 404);
    }

    const ctx = await this.getOrganizationBillingContext(organizationId);
    if (!ctx) {
      throw new InvoiceServiceError("not_found", "Organization not found", 404);
    }

    const recipientEmail = ctx.adminEmail;
    if (!recipientEmail) {
      throw new InvoiceServiceError("no_recipient", "No billing email configured for organization", 400);
    }

    let pdfBytes: Uint8Array;
    if (invoice.storageKey) {
      const { readFile } = await import("node:fs/promises");
      const filePath = path.join(UPLOAD_DIR, invoice.storageKey);
      pdfBytes = new Uint8Array(await readFile(filePath));
    } else {
      pdfBytes = generateInvoicePdfBytes({
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        organizationName: ctx.org.name,
        billingAddress: invoice.billingAddress,
        planName: invoice.planName,
        billingCycle: invoice.billingCycle,
        periodStart: invoice.periodStart,
        periodEnd: invoice.periodEnd,
        includedSeats: invoice.includedSeats,
        activeSeats: invoice.activeSeats,
        additionalSeats: invoice.additionalSeats,
        subtotalInr: invoice.subtotalInr,
        discountInr: invoice.discountInr,
        gstInr: invoice.gstInr,
        totalInr: invoice.totalInr,
        issuedAt: invoice.issuedAt ?? new Date(),
        dueAt: invoice.dueAt,
        lineItems: invoice.lineItems,
      });
    }

    const result = await sendInvoiceEmail({
      to: recipientEmail,
      organizationName: ctx.org.name,
      invoiceNumber: invoice.invoiceNumber,
      totalInr: invoice.totalInr,
      dueDate: invoice.dueAt ? format(invoice.dueAt, "MMM d, yyyy") : undefined,
      pdfBytes,
    });

    const deliveryStatus =
      result.status === "sent"
        ? InvoiceDeliveryStatus.SENT
        : result.status === "logged"
          ? InvoiceDeliveryStatus.SENT
          : InvoiceDeliveryStatus.FAILED;

    await invoiceRepository.createDelivery({
      invoiceId,
      organizationId,
      recipientEmail,
      status: deliveryStatus,
      error: result.error,
      sentAt: deliveryStatus === InvoiceDeliveryStatus.SENT ? new Date() : undefined,
    });

    if (deliveryStatus === InvoiceDeliveryStatus.FAILED) {
      throw new InvoiceServiceError("send_failed", result.error ?? "Failed to send invoice", 502);
    }

    await invoiceRepository.updateInvoiceStatus(invoiceId, InvoiceStatus.SENT);

    await invoiceRepository.logBillingEvent({
      organizationId,
      type: "invoice.sent",
      actorId,
      metadata: { invoiceId, recipientEmail },
    });

    return serializeInvoice(await invoiceRepository.findById(organizationId, invoiceId));
  },

  async recordPayment(
    actorId: string,
    organizationId: string,
    input: {
      invoiceId?: string;
      amountInr: number;
      method?: string;
      reference?: string;
      notes?: string;
    },
  ) {
    const org = await billingRepository.getOrganizationBilling(organizationId);
    if (!org) {
      throw new InvoiceServiceError("not_found", "Organization not found", 404);
    }

    let invoice = null;
    if (input.invoiceId) {
      invoice = await invoiceRepository.findById(organizationId, input.invoiceId);
      if (!invoice) {
        throw new InvoiceServiceError("not_found", "Invoice not found", 404);
      }
    }

    const payment = await invoiceRepository.createPayment({
      organizationId,
      invoiceId: input.invoiceId,
      amountInr: input.amountInr,
      method: input.method ?? "manual",
      reference: input.reference,
      notes: input.notes,
      recordedById: actorId,
      status: PaymentStatus.SUCCEEDED,
    });

    if (invoice) {
      await invoiceRepository.updateInvoiceStatus(invoice.id, InvoiceStatus.PAID, {
        paidAt: new Date(),
      });
      await billingRepository.upsertOrganizationBilling(organizationId, {
        billingStatus: "ACTIVE",
      });
    }

    await invoiceRepository.logBillingEvent({
      organizationId,
      type: "payment.recorded",
      actorId,
      metadata: {
        paymentId: payment.id,
        invoiceId: input.invoiceId,
        amountInr: input.amountInr,
      },
    });

    return {
      payment: {
        id: payment.id,
        amountInr: payment.amountInr,
        status: payment.status,
        method: payment.method,
        reference: payment.reference,
        paidAt: payment.paidAt.toISOString(),
      },
    };
  },

  async getInvoicePdf(organizationId: string, invoiceId: string) {
    const invoice = await invoiceRepository.findById(organizationId, invoiceId);
    if (!invoice) {
      throw new InvoiceServiceError("not_found", "Invoice not found", 404);
    }
    if (!invoice.storageKey) {
      throw new InvoiceServiceError("no_pdf", "Invoice PDF not available", 404);
    }
    const { readFile } = await import("node:fs/promises");
    const filePath = path.join(UPLOAD_DIR, invoice.storageKey);
    const buffer = await readFile(filePath);
    return {
      buffer,
      filename: `${invoice.invoiceNumber}.pdf`,
    };
  },

  listInvoices: async (organizationId: string) => {
    const items = await invoiceRepository.listByOrganization(organizationId);
    return items.map((inv) => serializeInvoice(inv)!);
  },

  listPayments: (organizationId: string) =>
    invoiceRepository.listPayments(organizationId).then((items) =>
      items.map((p) => ({
        id: p.id,
        amountInr: p.amountInr,
        status: p.status,
        method: p.method,
        reference: p.reference,
        notes: p.notes,
        paidAt: p.paidAt.toISOString(),
        invoiceNumber: p.invoice?.invoiceNumber ?? null,
      })),
    ),

  getInvoice: async (organizationId: string, invoiceId: string) => {
    const invoice = await invoiceRepository.findById(organizationId, invoiceId);
    if (!invoice) {
      throw new InvoiceServiceError("not_found", "Invoice not found", 404);
    }
    return serializeInvoice(invoice);
  },
};
