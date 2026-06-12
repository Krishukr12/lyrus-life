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

export async function sendEmployeePasswordResetEmail(input: {
  to: string;
  name: string;
  organizationName: string;
  temporaryPassword: string;
  loginUrl: string;
}): Promise<boolean> {
  const smtp = getSmtpConfig(input.to);
  if (!smtp) {
    console.info(
      `[employee-password-reset] ${input.to} @ ${input.organizationName} temp password: ${input.temporaryPassword}`,
    );
    return false;
  }

  const transport = createSmtpTransport(smtp);

  await transport.sendMail({
    from: smtp.from,
    to: input.to,
    subject: `Your ${input.organizationName} password was reset`,
    text: `Hi ${input.name},\n\nYour password for ${input.organizationName} was reset by an administrator.\n\nSign in: ${input.loginUrl}\nEmail: ${input.to}\nTemporary password: ${input.temporaryPassword}\n\nYou will be asked to set a new password when you sign in.\n\n— ${input.organizationName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color: #0f766e;">Password reset</h2>
        <p>Hi ${input.name},</p>
        <p>Your password for <strong>${input.organizationName}</strong> was reset by an administrator.</p>
        <p><a href="${input.loginUrl}" style="background: #0f766e; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Sign in</a></p>
        <p><strong>Email:</strong> ${input.to}<br/>
        <strong>Temporary password:</strong> ${input.temporaryPassword}</p>
        <p style="color: #666; font-size: 14px;">When you sign in, you will only need to choose a new password — you will not be asked for your old password.</p>
      </div>
    `.trim(),
  });

  return true;
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
    text: `Hi ${input.name},\n\nYour organization admin account for ${input.organizationName} is ready.\n\nOrganization: ${input.organizationName}\nLogin URL: ${input.loginUrl}\nEmail: ${input.to}\nTemporary password: ${input.temporaryPassword}\n\nOn your first sign-in you will be asked to set a new password.\n\n— Lyrus Life`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color: #0f766e;">Organization admin account</h2>
        <p>Hi ${input.name},</p>
        <p>Your admin account for <strong>${input.organizationName}</strong> is ready.</p>
        <p><strong>Organization:</strong> ${input.organizationName}</p>
        <p><a href="${input.loginUrl}" style="background: #0f766e; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Sign in to the organization portal</a></p>
        <p><strong>Email:</strong> ${input.to}<br/>
        <strong>Temporary password:</strong> ${input.temporaryPassword}</p>
        <p style="color: #666; font-size: 14px;">On your first sign-in you will be asked to set a new password and verify your account.</p>
      </div>
    `.trim(),
  });
}
