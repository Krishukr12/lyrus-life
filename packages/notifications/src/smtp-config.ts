export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
}

function env(key: string, fallbackKey?: string): string | undefined {
  const value = process.env[key] ?? (fallbackKey ? process.env[fallbackKey] : undefined);
  return value?.trim() || undefined;
}

/** Supports EMAIL_* (preferred) and legacy SMTP_* variables. */
export function getSmtpConfig(organizerEmailFallback: string): SmtpConfig | null {
  const host = env("EMAIL_HOST", "SMTP_HOST");
  const user = env("EMAIL_USER", "SMTP_USER");
  const passRaw = env("EMAIL_PASS", "SMTP_PASS");
  if (!host || !user || !passRaw) {
    return null;
  }

  const pass = passRaw.replace(/\s+/g, "");
  const port = Number(env("EMAIL_PORT", "SMTP_PORT") ?? "465");
  const secureEnv = env("EMAIL_SECURE", "SMTP_SECURE");
  const secure =
    secureEnv === "true" || secureEnv === "1" || (secureEnv !== "false" && port === 465);

  const from = env("EMAIL_FROM", "SMTP_FROM") ?? `"Lyrus Life" <${user}>`;

  return {
    host,
    port,
    secure,
    user,
    pass,
    from,
  };
}

export function getOrganizerEmail(fallback = "host@lyrus.life"): string {
  return env("EMAIL_USER", "SMTP_USER") ?? env("ORGANIZER_EMAIL") ?? fallback;
}
