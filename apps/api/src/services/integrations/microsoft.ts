import { IntegrationProvider } from "@lyrus/db";
import {
  getUserIntegration,
  updateIntegrationTokens,
  type StoredIntegration,
} from "./user-integration.repository.js";

const MS_AUTH_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
const MS_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
const MS_SCOPES = [
  "offline_access",
  "User.Read",
  "OnlineMeetings.ReadWrite",
  "Calendars.ReadWrite",
].join(" ");

function microsoftClientId(): string {
  const id = process.env.MICROSOFT_CLIENT_ID;
  if (!id) throw new Error("MICROSOFT_CLIENT_ID is not configured");
  return id;
}

function microsoftClientSecret(): string {
  const secret = process.env.MICROSOFT_CLIENT_SECRET;
  if (!secret) throw new Error("MICROSOFT_CLIENT_SECRET is not configured");
  return secret;
}

export function isMicrosoftConfigured(): boolean {
  return Boolean(process.env.MICROSOFT_CLIENT_ID?.trim() && process.env.MICROSOFT_CLIENT_SECRET?.trim());
}

export function microsoftOAuthMissingEnv(): string[] {
  const missing: string[] = [];
  if (!process.env.MICROSOFT_CLIENT_ID?.trim()) missing.push("MICROSOFT_CLIENT_ID");
  if (!process.env.MICROSOFT_CLIENT_SECRET?.trim()) missing.push("MICROSOFT_CLIENT_SECRET");
  return missing;
}

export function buildMicrosoftAuthUrl(state: string, redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: microsoftClientId(),
    redirect_uri: redirectUri,
    response_type: "code",
    scope: MS_SCOPES,
    response_mode: "query",
    state,
  });
  return `${MS_AUTH_URL}?${params.toString()}`;
}

async function exchangeMicrosoftCode(
  code: string,
  redirectUri: string,
): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
}> {
  const body = new URLSearchParams({
    code,
    client_id: microsoftClientId(),
    client_secret: microsoftClientSecret(),
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });
  const res = await fetch(MS_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Microsoft token exchange failed: ${text}`);
  }
  return res.json() as Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
  }>;
}

async function refreshMicrosoftToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}> {
  const body = new URLSearchParams({
    client_id: microsoftClientId(),
    client_secret: microsoftClientSecret(),
    refresh_token: refreshToken,
    grant_type: "refresh_token",
    scope: MS_SCOPES,
  });
  const res = await fetch(MS_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Microsoft token refresh failed: ${text}`);
  }
  return res.json() as Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  }>;
}

async function fetchMicrosoftEmail(accessToken: string): Promise<string | null> {
  const res = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { mail?: string; userPrincipalName?: string };
  return data.mail ?? data.userPrincipalName ?? null;
}

export async function completeMicrosoftOAuth(
  code: string,
  redirectUri: string,
): Promise<{
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
  scopes: string;
  externalEmail: string | null;
}> {
  const tokens = await exchangeMicrosoftCode(code, redirectUri);
  const expiresAt = tokens.expires_in
    ? new Date(Date.now() + tokens.expires_in * 1000)
    : null;
  const externalEmail = await fetchMicrosoftEmail(tokens.access_token);
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token ?? null,
    expiresAt,
    scopes: tokens.scope ?? MS_SCOPES,
    externalEmail,
  };
}

export async function getValidMicrosoftAccessToken(
  integration: StoredIntegration,
): Promise<string> {
  const expiresSoon =
    integration.expiresAt != null &&
    integration.expiresAt.getTime() - Date.now() < 60_000;

  if (!expiresSoon) {
    return integration.accessToken;
  }

  if (!integration.refreshToken) {
    throw new Error("Microsoft connection expired — reconnect in Settings → Integrations");
  }

  const refreshed = await refreshMicrosoftToken(integration.refreshToken);
  const expiresAt = refreshed.expires_in
    ? new Date(Date.now() + refreshed.expires_in * 1000)
    : null;
  await updateIntegrationTokens(
    integration.id,
    refreshed.access_token,
    expiresAt,
    refreshed.refresh_token ?? integration.refreshToken,
  );
  return refreshed.access_token;
}

export async function createTeamsMeeting(input: {
  userId: string;
  title: string;
  description: string;
  scheduledAt: Date;
  durationMinutes: number;
}): Promise<{ joinUrl: string; externalMeetingId: string }> {
  const integration = await getUserIntegration(input.userId, IntegrationProvider.MICROSOFT);
  if (!integration) {
    throw new Error("Connect Microsoft in Settings → Integrations to schedule Teams meetings");
  }

  const accessToken = await getValidMicrosoftAccessToken(integration);
  const end = new Date(input.scheduledAt.getTime() + input.durationMinutes * 60_000);

  const res = await fetch("https://graph.microsoft.com/v1.0/me/onlineMeetings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDateTime: input.scheduledAt.toISOString(),
      endDateTime: end.toISOString(),
      subject: input.title,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create Teams meeting: ${text}`);
  }

  const meeting = (await res.json()) as { id?: string; joinWebUrl?: string };
  if (!meeting.joinWebUrl || !meeting.id) {
    throw new Error("Teams join link was not returned — check Graph API permissions");
  }

  return { joinUrl: meeting.joinWebUrl, externalMeetingId: meeting.id };
}
