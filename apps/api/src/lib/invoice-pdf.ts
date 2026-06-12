import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { PLATFORM_BILLING } from "./billing-defaults.js";

export interface InvoicePdfLineItem {
  description: string;
  quantity: number;
  unitPriceInr: number;
  amountInr: number;
}

export interface InvoicePdfInput {
  invoiceNumber: string;
  status: string;
  organizationName: string;
  billingAddress?: string | null;
  planName: string;
  billingCycle: string;
  periodStart: Date;
  periodEnd: Date;
  includedSeats: number;
  activeSeats: number;
  additionalSeats: number;
  subtotalInr: number;
  discountInr: number;
  gstInr: number;
  totalInr: number;
  issuedAt: Date;
  dueAt?: Date | null;
  lineItems: InvoicePdfLineItem[];
}

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function generateInvoicePdfBytes(input: InvoicePdfInput): Uint8Array {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const left = 48;
  let y = 52;
  const pageWidth = 595.28;

  pdf.setTextColor(28, 141, 149);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text(PLATFORM_BILLING.companyName, left, y);
  y += 16;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text(PLATFORM_BILLING.companyAddress, left, y);
  if (PLATFORM_BILLING.companyGstin) {
    y += 12;
    pdf.text(`GSTIN: ${PLATFORM_BILLING.companyGstin}`, left, y);
  }

  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text("INVOICE", pageWidth - left, 52, { align: "right" });
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(input.invoiceNumber, pageWidth - left, 68, { align: "right" });
  pdf.text(`Status: ${input.status}`, pageWidth - left, 82, { align: "right" });
  pdf.text(`Issued: ${format(input.issuedAt, "MMM d, yyyy")}`, pageWidth - left, 96, {
    align: "right",
  });
  if (input.dueAt) {
    pdf.text(`Due: ${format(input.dueAt, "MMM d, yyyy")}`, pageWidth - left, 110, {
      align: "right",
    });
  }

  y = 130;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Bill To", left, y);
  y += 14;
  pdf.setFont("helvetica", "normal");
  pdf.text(input.organizationName, left, y);
  y += 12;
  if (input.billingAddress) {
    const wrapped = pdf.splitTextToSize(input.billingAddress, 240);
    pdf.text(wrapped, left, y);
    y += 12 * wrapped.length;
  }

  y += 10;
  pdf.setFont("helvetica", "bold");
  pdf.text("Billing period", left, y);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `${format(input.periodStart, "MMM d, yyyy")} – ${format(input.periodEnd, "MMM d, yyyy")}`,
    left + 90,
    y,
  );
  y += 14;
  pdf.setFont("helvetica", "bold");
  pdf.text("Plan", left, y);
  pdf.setFont("helvetica", "normal");
  pdf.text(`${input.planName} (${input.billingCycle})`, left + 90, y);
  y += 14;
  pdf.setFont("helvetica", "bold");
  pdf.text("Seats", left, y);
  pdf.setFont("helvetica", "normal");
  pdf.text(
    `${input.activeSeats} active · ${input.includedSeats} included · ${input.additionalSeats} additional`,
    left + 90,
    y,
  );

  y += 24;
  const colWidths = [220, 50, 80, 80];
  const headers = ["Description", "Qty", "Unit", "Amount"];
  let x = left;
  pdf.setFillColor(245, 247, 250);
  pdf.rect(left, y, pageWidth - 96, 22, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  headers.forEach((header, i) => {
    pdf.text(header, x + 4, y + 14);
    x += colWidths[i] ?? 0;
  });
  y += 22;
  pdf.setFont("helvetica", "normal");

  for (const item of input.lineItems) {
    if (item.description.startsWith("GST")) continue;
    x = left;
    const row = [
      item.description,
      String(item.quantity),
      formatInr(item.unitPriceInr),
      formatInr(item.amountInr),
    ];
    row.forEach((cell, i) => {
      const width = colWidths[i] ?? 80;
      const text = pdf.splitTextToSize(cell, width - 8)[0] ?? "";
      pdf.text(text, x + 4, y + 12);
      x += width;
    });
    y += 20;
  }

  y += 10;
  const summaryX = pageWidth - left - 160;
  pdf.text("Subtotal", summaryX, y);
  pdf.text(formatInr(input.subtotalInr), pageWidth - left, y, { align: "right" });
  y += 14;
  if (input.discountInr > 0) {
    pdf.text("Discount", summaryX, y);
    pdf.text(`-${formatInr(input.discountInr)}`, pageWidth - left, y, { align: "right" });
    y += 14;
  }
  pdf.text("GST", summaryX, y);
  pdf.text(formatInr(input.gstInr), pageWidth - left, y, { align: "right" });
  y += 16;
  pdf.setFont("helvetica", "bold");
  pdf.text("Total", summaryX, y);
  pdf.text(formatInr(input.totalInr), pageWidth - left, y, { align: "right" });

  return new Uint8Array(pdf.output("arraybuffer"));
}
