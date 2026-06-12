import {
  InvoiceDeliveryStatus,
  InvoiceStatus,
  PaymentStatus,
  prisma,
  type Prisma,
} from "@lyrus/db";

type InvoiceStatusValue = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];
type InvoiceDeliveryStatusValue =
  (typeof InvoiceDeliveryStatus)[keyof typeof InvoiceDeliveryStatus];
type PaymentStatusValue = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const invoiceRepository = {
  async findById(organizationId: string, invoiceId: string) {
    return prisma.invoice.findFirst({
      where: { id: invoiceId, organizationId },
      include: {
        lineItems: { orderBy: { sortOrder: "asc" } },
        deliveries: { orderBy: { createdAt: "desc" }, take: 10 },
        payments: { orderBy: { paidAt: "desc" } },
      },
    });
  },

  async listByOrganization(organizationId: string, take = 50) {
    return prisma.invoice.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take,
      include: {
        lineItems: { orderBy: { sortOrder: "asc" } },
        deliveries: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
  },

  async listPayments(organizationId: string, take = 50) {
    return prisma.payment.findMany({
      where: { organizationId },
      orderBy: { paidAt: "desc" },
      take,
      include: { invoice: { select: { invoiceNumber: true } } },
    });
  },

  async countInvoicesForOrg(organizationId: string) {
    return prisma.invoice.count({ where: { organizationId } });
  },

  async createInvoice(data: {
    organizationId: string;
    invoiceNumber: string;
    status: InvoiceStatusValue;
    planName: string;
    billingCycle: string;
    periodStart: Date;
    periodEnd: Date;
    includedSeats: number;
    activeSeats: number;
    additionalSeats: number;
    includedLocations: number;
    activeLocations: number;
    subtotalInr: number;
    discountInr: number;
    gstInr: number;
    totalInr: number;
    billingAddress?: string;
    issuedAt: Date;
    dueAt: Date;
    storageKey?: string;
    storageBackend?: "LOCAL" | "S3";
    lineItems: Array<{
      description: string;
      quantity: number;
      unitPriceInr: number;
      amountInr: number;
      sortOrder: number;
    }>;
  }) {
    return prisma.invoice.create({
      data: {
        organizationId: data.organizationId,
        invoiceNumber: data.invoiceNumber,
        status: data.status,
        planName: data.planName,
        billingCycle: data.billingCycle,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        includedSeats: data.includedSeats,
        activeSeats: data.activeSeats,
        additionalSeats: data.additionalSeats,
        includedLocations: data.includedLocations,
        activeLocations: data.activeLocations,
        subtotalInr: data.subtotalInr,
        discountInr: data.discountInr,
        gstInr: data.gstInr,
        totalInr: data.totalInr,
        billingAddress: data.billingAddress,
        issuedAt: data.issuedAt,
        dueAt: data.dueAt,
        storageKey: data.storageKey,
        storageBackend: data.storageBackend,
        lineItems: { create: data.lineItems },
      },
      include: { lineItems: { orderBy: { sortOrder: "asc" } } },
    });
  },

  async updateInvoiceStatus(
    invoiceId: string,
    status: InvoiceStatusValue,
    extra?: { paidAt?: Date; storageKey?: string; storageBackend?: "LOCAL" | "S3" },
  ) {
    return prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status,
        paidAt: extra?.paidAt,
        storageKey: extra?.storageKey,
        storageBackend: extra?.storageBackend,
      },
      include: { lineItems: { orderBy: { sortOrder: "asc" } } },
    });
  },

  async createDelivery(data: {
    invoiceId: string;
    organizationId: string;
    recipientEmail: string;
    status: InvoiceDeliveryStatusValue;
    error?: string;
    sentAt?: Date;
  }) {
    return prisma.invoiceDelivery.create({ data });
  },

  async createPayment(data: {
    organizationId: string;
    invoiceId?: string;
    amountInr: number;
    status?: PaymentStatusValue;
    method?: string;
    reference?: string;
    notes?: string;
    recordedById?: string;
    paidAt?: Date;
  }) {
    return prisma.payment.create({
      data: {
        organizationId: data.organizationId,
        invoiceId: data.invoiceId,
        amountInr: data.amountInr,
        status: data.status ?? PaymentStatus.SUCCEEDED,
        method: data.method,
        reference: data.reference,
        notes: data.notes,
        recordedById: data.recordedById,
        paidAt: data.paidAt ?? new Date(),
      },
    });
  },

  async logBillingEvent(data: {
    organizationId: string;
    type: string;
    metadata?: Prisma.InputJsonValue;
    actorId?: string;
  }) {
    return prisma.billingEvent.create({ data });
  },

  async logPricingChange(data: {
    actorId?: string;
    actorName?: string;
    previous: Prisma.InputJsonValue;
    next: Prisma.InputJsonValue;
  }) {
    return prisma.pricingChangeLog.create({ data });
  },

  async listPricingChanges(take = 50) {
    return prisma.pricingChangeLog.findMany({
      orderBy: { createdAt: "desc" },
      take,
    });
  },

  async listBillingEvents(organizationId: string, take = 50) {
    return prisma.billingEvent.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take,
    });
  },
};
