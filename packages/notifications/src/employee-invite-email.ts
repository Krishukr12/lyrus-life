import { createSmtpTransport, getSmtpConfig } from "./smtp-config.js";

export async function sendEmployeeInviteEmail(input: {
  to: string;
  name: string;
  organizationName: string;
  temporaryPassword: string;
  loginUrl: string;
}): Promise<void> {
  const smtp = getSmtpConfig(input.to);
  if (!smtp) {
    console.info(
      `[employee-invite] ${input.to} @ ${input.organizationName} temp password: ${input.temporaryPassword}`,
    );
    return;
  }

  const transport = createSmtpTransport(smtp);

  await transport.sendMail({
    from: smtp.from,
    to: input.to,
    subject: `You're invited to ${input.organizationName}`,
    text: `Hi ${input.name},\n\nYou've been invited to ${input.organizationName}.\n\nSign in: ${input.loginUrl}\nEmail: ${input.to}\nTemporary password: ${input.temporaryPassword}\n\nPlease change your password after signing in.\n\n— ${input.organizationName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color: #0f766e;">Welcome to ${input.organizationName}</h2>
        <p>Hi ${input.name},</p>
        <p>Your organization admin created an account for you.</p>
        <p><a href="${input.loginUrl}">Sign in to your account</a></p>
        <p><strong>Email:</strong> ${input.to}<br/>
        <strong>Temporary password:</strong> ${input.temporaryPassword}</p>
        <p style="color: #666; font-size: 14px;">Change your password after your first sign-in.</p>
      </div>
    `.trim(),
  });
}

export async function sendOrgAdminWelcomeEmail(input: {
  to: string;
  name: string;
  organizationName: string;
  temporaryPassword: string;
  loginUrl: string;
}): Promise<void> {
  const smtp = getSmtpConfig(input.to);
  if (!smtp) {
    console.info(
      `[org-admin-welcome] ${input.to} @ ${input.organizationName} temp password: ${input.temporaryPassword}`,
    );
    return;
  }

  const transport = createSmtpTransport(smtp);

  await transport.sendMail({
    from: smtp.from,
    to: input.to,
    subject: `Your ${input.organizationName} admin account`,
    text: `Hi ${input.name},\n\nYour organization admin account for ${input.organizationName} is ready.\n\nSign in: ${input.loginUrl}\nEmail: ${input.to}\nTemporary password: ${input.temporaryPassword}\n\n— Lyrus Life`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color: #0f766e;">Organization admin account</h2>
        <p>Hi ${input.name},</p>
        <p>Your admin account for <strong>${input.organizationName}</strong> is ready.</p>
        <p><a href="${input.loginUrl}">Sign in to the organization portal</a></p>
        <p><strong>Email:</strong> ${input.to}<br/>
        <strong>Temporary password:</strong> ${input.temporaryPassword}</p>
      </div>
    `.trim(),
  });
}
