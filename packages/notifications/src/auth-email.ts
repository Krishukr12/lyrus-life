import { createSmtpTransport, getSmtpConfig } from "./smtp-config.js";

export async function sendPasswordResetOtpEmail(input: {
  to: string;
  name: string;
  code: string;
  companyName: string;
}): Promise<void> {
  const smtp = getSmtpConfig(input.to);
  if (!smtp) {
    console.info(`[password-reset-otp] ${input.to}: ${input.code}`);
    return;
  }

  const transport = createSmtpTransport(smtp);

  await transport.sendMail({
    from: smtp.from,
    to: input.to,
    subject: `${input.companyName} — reset your password`,
    text: `Hi ${input.name},\n\nYour password reset code is: ${input.code}\n\nThis code expires in 10 minutes. If you did not request this, ignore this email.\n\n— ${input.companyName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0f766e;">Reset your password</h2>
        <p>Hi ${input.name},</p>
        <p>Use this code to set a new password and sign in:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #0f766e;">${input.code}</p>
        <p style="color: #666; font-size: 14px;">Expires in 10 minutes. If you did not request this, you can ignore this email.</p>
      </div>
    `.trim(),
  });
}

/** @deprecated Use sendPasswordResetOtpEmail for password reset flows. */
export async function sendLoginOtpEmail(input: {
  to: string;
  name: string;
  code: string;
  companyName: string;
}): Promise<void> {
  const smtp = getSmtpConfig(input.to);
  if (!smtp) {
    console.info(`[auth-otp] ${input.to}: ${input.code}`);
    return;
  }

  const transport = createSmtpTransport(smtp);

  await transport.sendMail({
    from: smtp.from,
    to: input.to,
    subject: `${input.companyName} — your sign-in code`,
    text: `Hi ${input.name},\n\nYour one-time sign-in code is: ${input.code}\n\nThis code expires in 10 minutes. If you did not request this, ignore this email.\n\n— ${input.companyName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0f766e;">Sign in to ${input.companyName}</h2>
        <p>Hi ${input.name},</p>
        <p>Use this one-time code to complete sign-in:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #0f766e;">${input.code}</p>
        <p style="color: #666; font-size: 14px;">Expires in 10 minutes. If you did not request this, you can ignore this email.</p>
      </div>
    `.trim(),
  });
}
