import { createSmtpTransport, getOrganizerEmail, getSmtpConfig } from "./smtp-config.js";

export interface SendInvoiceEmailInput {
  to: string;
  organizationName: string;
  invoiceNumber: string;
  totalInr: number;
  dueDate?: string;
  pdfBytes: Uint8Array;
}

export interface InvoiceEmailResult {
  status: "sent" | "logged" | "failed";
  error?: string;
}

function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export async function sendInvoiceEmail(
  input: SendInvoiceEmailInput,
): Promise<InvoiceEmailResult> {
  const smtp = getSmtpConfig(getOrganizerEmail());
  const subject = `Invoice ${input.invoiceNumber} — ${input.organizationName}`;
  const html = `
    <p>Hello,</p>
    <p>Please find attached invoice <strong>${input.invoiceNumber}</strong> for <strong>${input.organizationName}</strong>.</p>
    <p><strong>Amount due:</strong> ${formatInr(input.totalInr)}</p>
    ${input.dueDate ? `<p><strong>Due date:</strong> ${input.dueDate}</p>` : ""}
    <p>Thank you for your business.</p>
  `;

  if (!smtp) {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const dir = path.join(process.cwd(), "invoice-emails", input.invoiceNumber);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `${input.invoiceNumber}.pdf`), Buffer.from(input.pdfBytes));
    await fs.writeFile(
      path.join(dir, "meta.json"),
      JSON.stringify({ to: input.to, subject, loggedAt: new Date().toISOString() }, null, 2),
    );
    return { status: "logged" };
  }

  try {
    const transport = createSmtpTransport(smtp);
    await transport.sendMail({
      from: smtp.from,
      to: input.to,
      subject,
      html,
      attachments: [
        {
          filename: `${input.invoiceNumber}.pdf`,
          content: Buffer.from(input.pdfBytes),
          contentType: "application/pdf",
        },
      ],
    });
    return { status: "sent" };
  } catch (err) {
    return {
      status: "failed",
      error: err instanceof Error ? err.message : "Failed to send invoice email",
    };
  }
}
