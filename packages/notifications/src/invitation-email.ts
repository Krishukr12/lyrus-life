import { createSmtpTransport, getSmtpConfig } from "./smtp-config.js";

function roleLabel(role: string): string {
  switch (role) {
    case "ORG_ADMIN":
      return "Organization Admin";
    case "MANAGER":
      return "Manager";
    case "VIEWER":
      return "Viewer";
    default:
      return "Member";
  }
}

export async function sendUserInvitationEmail(input: {
  to: string;
  name: string;
  organizationName: string;
  inviteUrl: string;
  role: string;
  expiresAt: Date;
}): Promise<void> {
  const smtp = getSmtpConfig(input.to);
  const expiryDate = input.expiresAt.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!smtp) {
    console.info(
      `[user-invitation] ${input.to} @ ${input.organizationName} invite: ${input.inviteUrl}`,
    );
    return;
  }

  const transport = createSmtpTransport(smtp);

  await transport.sendMail({
    from: smtp.from,
    to: input.to,
    subject: `You're invited to join ${input.organizationName}`,
    text: `Hi ${input.name},\n\nYou've been invited to join ${input.organizationName} as ${roleLabel(input.role)}.\n\nAccept your invitation: ${input.inviteUrl}\n\nThis link expires on ${expiryDate}.\n\n— ${input.organizationName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color: #0f766e;">Join ${input.organizationName}</h2>
        <p>Hi ${input.name},</p>
        <p>You've been invited to join <strong>${input.organizationName}</strong> as <strong>${roleLabel(input.role)}</strong>.</p>
        <p style="margin: 24px 0;">
          <a href="${input.inviteUrl}" style="background: #0f766e; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Accept invitation
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">This invitation expires on ${expiryDate}.</p>
        <p style="color: #999; font-size: 12px;">If you didn't expect this invitation, you can safely ignore this email.</p>
      </div>
    `.trim(),
  });
}
