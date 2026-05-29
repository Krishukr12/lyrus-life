import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { generateMomPdfBytes, momPdfFilename, type MomPdfInput } from "@lyrus/mom-pdf";
import nodemailer from "nodemailer";
import type { InviteResult } from "./email.js";
import { createSmtpTransport, getSmtpConfig } from "./smtp-config.js";

export type MomDeliveryStatus = "sent" | "logged" | "failed";

export interface MomShareResult {
  email: string;
  name: string;
  status: MomDeliveryStatus;
  error?: string;
}

export interface SendMomToStakeholdersInput {
  meetingId: string;
  meetingTitle: string;
  approvedBy: string;
  organizerEmail: string;
  pdfInput: MomPdfInput;
  stakeholders: Array<{ name: string; email: string }>;
}

function getWebAppUrl(meetingId: string): string {
  const base = (process.env.WEB_APP_URL ?? "http://localhost:8080").replace(/\/$/, "");
  return `${base}/meetings/${meetingId}`;
}

function buildMomShareHtml(input: SendMomToStakeholdersInput): string {
  const meetingUrl = getWebAppUrl(input.meetingId);
  const keyPointsHtml = input.pdfInput.mom.keyPoints
    .map((p) => `<li>${p.replace(/</g, "&lt;")}</li>`)
    .join("");

  return `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
      <p style="color: #1C8D95; font-weight: bold; font-size: 14px; margin: 0;">LYRUS</p>
      <p style="color: #1C8D95; font-style: italic; font-size: 12px; margin: 4px 0 16px;">Think • Design • Deliver</p>
      <h2 style="color: #1a1a2e;">Minutes of Meeting — ${input.meetingTitle}</h2>
      <p>The meeting minutes have been reviewed and approved by <strong>${input.approvedBy}</strong>.</p>
      <p>Please find the official MOM attached as a PDF (Lyrus Life template).</p>
      ${
        keyPointsHtml
          ? `<p><strong>Key discussion points:</strong></p><ul>${keyPointsHtml}</ul>`
          : ""
      }
      <p style="margin-top: 24px;">
        <a href="${meetingUrl}" style="background: #0d9488; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">
          View meeting in Lyrus Life
        </a>
      </p>
      <p style="color: #666; font-size: 13px; margin-top: 24px;">
        This message was sent automatically after Lyrus Life approval.
      </p>
    </div>
  `.trim();
}

async function logMomShareToFile(
  meetingId: string,
  stakeholder: { name: string; email: string },
  html: string,
  pdf: Buffer,
  filename: string,
): Promise<void> {
  const dir = path.join(process.cwd(), "mom-shares", meetingId);
  await mkdir(dir, { recursive: true });
  const safeEmail = stakeholder.email.replace(/[^a-z0-9@._-]/gi, "_");
  await writeFile(path.join(dir, `${safeEmail}.html`), html, "utf8");
  await writeFile(path.join(dir, `${safeEmail}-${filename}`), pdf);
}

export async function sendMomToStakeholders(
  input: SendMomToStakeholdersInput,
): Promise<MomShareResult[]> {
  if (input.stakeholders.length === 0) {
    return [];
  }

  const pdf = Buffer.from(generateMomPdfBytes(input.pdfInput));
  const pdfFilename = momPdfFilename(input.meetingTitle);
  const html = buildMomShareHtml(input);
  const meetingUrl = getWebAppUrl(input.meetingId);
  const text = [
    `Minutes of Meeting: ${input.meetingTitle}`,
    `Approved by: ${input.approvedBy}`,
    "",
    "The official MOM PDF is attached.",
    "",
    `View online: ${meetingUrl}`,
  ].join("\n");

  const results: MomShareResult[] = [];
  const smtp = getSmtpConfig(input.organizerEmail);

  if (smtp) {
    const transporter = createSmtpTransport(smtp);

    for (const stakeholder of input.stakeholders) {
      try {
        await transporter.sendMail({
          from: smtp.from,
          to: `"${stakeholder.name}" <${stakeholder.email}>`,
          subject: `MOM approved: ${input.meetingTitle}`,
          text,
          html,
          attachments: [
            {
              filename: pdfFilename,
              content: pdf,
              contentType: "application/pdf",
            },
          ],
        });
        results.push({ email: stakeholder.email, name: stakeholder.name, status: "sent" });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Send failed";
        console.error(`[mom-share] failed for ${stakeholder.email}:`, message);
        results.push({
          email: stakeholder.email,
          name: stakeholder.name,
          status: "failed",
          error: message,
        });
      }
    }

    return results;
  }

  console.log("\n--- MOM shared with stakeholders (SMTP not configured) ---");
  console.log(`Meeting: ${input.meetingTitle} (${input.meetingId})`);
  console.log(`Approved by: ${input.approvedBy}`);

  for (const stakeholder of input.stakeholders) {
    try {
      await logMomShareToFile(input.meetingId, stakeholder, html, pdf, pdfFilename);
      console.log(`  ✓ Logged MOM for ${stakeholder.name} <${stakeholder.email}>`);
      results.push({ email: stakeholder.email, name: stakeholder.name, status: "logged" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Log failed";
      results.push({
        email: stakeholder.email,
        name: stakeholder.name,
        status: "failed",
        error: message,
      });
    }
  }

  console.log(`  Files saved under: mom-shares/${input.meetingId}/\n`);
  return results;
}

/** Map MomShareResult to InviteResult shape for consistent API responses. */
export function mapMomShareToInviteResults(results: MomShareResult[]): InviteResult[] {
  return results.map((r) => ({
    email: r.email,
    name: r.name,
    status: r.status,
    error: r.error,
  }));
}
