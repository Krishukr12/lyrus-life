import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
import { buildMeetingIcs, type CalendarEventInput } from "./ics.js";
import { createSmtpTransport, getSmtpConfig } from "./smtp-config.js";

export type InviteDeliveryStatus = "sent" | "logged" | "failed";

export interface InviteResult {
  email: string;
  name: string;
  status: InviteDeliveryStatus;
  error?: string;
}

export interface SendMeetingInvitesInput {
  meetingId: string;
  joinSlug: string;
  title: string;
  description: string;
  scheduledAt: Date;
  durationMinutes: number;
  organizerName: string;
  organizerEmail: string;
  attendees: Array<{ name: string; email: string }>;
}

function getMeetingJoinUrl(joinSlug: string): string {
  const base = (process.env.WEB_APP_URL ?? "http://localhost:8080").replace(/\/$/, "");
  return `${base}/join/${joinSlug}`;
}

function buildInviteHtml(input: SendMeetingInvitesInput): string {
  const joinUrl = getMeetingJoinUrl(input.joinSlug);
  const when = input.scheduledAt.toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #1a1a2e;">You're invited: ${input.title}</h2>
      <p><strong>When:</strong> ${when} (${input.durationMinutes} minutes)</p>
      ${input.description ? `<p><strong>Agenda:</strong><br/>${input.description.replace(/\n/g, "<br/>")}</p>` : ""}
      <p><strong>Organizer:</strong> ${input.organizerName} (${input.organizerEmail})</p>
      <p style="margin-top: 24px;">
        <a href="${joinUrl}" style="background: #0d9488; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">
          Join meeting
        </a>
      </p>
      <p style="color: #666; font-size: 13px; margin-top: 24px;">
        Sign in with your work email to join. Only invited colleagues on your organization domain can enter.
        A calendar invite (.ics) is attached.
      </p>
    </div>
  `.trim();
}

async function logInviteToFile(
  meetingId: string,
  attendee: { name: string; email: string },
  ics: string,
  html: string,
): Promise<void> {
  const dir = path.join(process.cwd(), "invites", meetingId);
  await mkdir(dir, { recursive: true });
  const safeEmail = attendee.email.replace(/[^a-z0-9@._-]/gi, "_");
  await writeFile(path.join(dir, `${safeEmail}.html`), html, "utf8");
  await writeFile(path.join(dir, `${safeEmail}.ics`), ics, "utf8");
}

export async function sendMeetingInvites(
  input: SendMeetingInvitesInput,
): Promise<InviteResult[]> {
  if (input.attendees.length === 0) {
    return [];
  }

  const end = new Date(input.scheduledAt.getTime() + input.durationMinutes * 60_000);
  const joinUrl = getMeetingJoinUrl(input.joinSlug);

  const calendarBase: CalendarEventInput = {
    uid: `lyrus-meeting-${input.meetingId}@lyrus.life`,
    title: input.title,
    description: `${input.description}\n\nJoin: ${joinUrl}`,
    start: input.scheduledAt,
    end,
    organizerName: input.organizerName,
    organizerEmail: input.organizerEmail,
    attendees: input.attendees,
    location: "Lyrus Life (virtual)",
    url: joinUrl,
  };

  const ics = buildMeetingIcs(calendarBase);
  const html = buildInviteHtml(input);
  const text = [
    `You're invited to: ${input.title}`,
    `When: ${input.scheduledAt.toLocaleString()} (${input.durationMinutes} min)`,
    input.description ? `Agenda: ${input.description}` : "",
    `Join: ${joinUrl}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const results: InviteResult[] = [];
  const smtp = getSmtpConfig(input.organizerEmail);

  if (smtp) {
    const transporter = createSmtpTransport(smtp);

    for (const attendee of input.attendees) {
      try {
        await transporter.sendMail({
          from: smtp.from,
          to: `"${attendee.name}" <${attendee.email}>`,
          subject: `Meeting invite: ${input.title}`,
          text,
          html,
          icalEvent: {
            method: "REQUEST",
            content: ics,
          },
          attachments: [
            {
              filename: "invite.ics",
              content: ics,
              contentType: "text/calendar; method=REQUEST",
            },
          ],
        });
        results.push({ email: attendee.email, name: attendee.name, status: "sent" });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Send failed";
        console.error(`[invite] failed for ${attendee.email}:`, message);
        results.push({
          email: attendee.email,
          name: attendee.name,
          status: "failed",
          error: message,
        });
      }
    }

    return results;
  }

  // Development: persist invites to disk + console (no SMTP required)
  console.log("\n--- Meeting invites (SMTP not configured) ---");
  console.log(`Meeting: ${input.title} (${input.meetingId})`);
  console.log(`Join URL: ${joinUrl}`);

  for (const attendee of input.attendees) {
    try {
      await logInviteToFile(input.meetingId, attendee, ics, html);
      console.log(`  ✓ Logged invite for ${attendee.name} <${attendee.email}>`);
      results.push({ email: attendee.email, name: attendee.name, status: "logged" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Log failed";
      results.push({
        email: attendee.email,
        name: attendee.name,
        status: "failed",
        error: message,
      });
    }
  }

  console.log(`  Files saved under: invites/${input.meetingId}/\n`);
  return results;
}
