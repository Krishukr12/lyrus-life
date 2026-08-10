import { IntegrationProvider } from "@lyrus/db";
import type { IntegrationProviderType } from "@lyrus/db";
import type {
  IntegrationPreferences,
  IntegrationProviderInput,
  PublicUrlRequest,
  UserIntegrationStatus,
} from "@lyrus/shared";
import { integrationPreferencesSchema } from "@lyrus/shared";
import {
  buildGoogleAuthUrl,
  completeGoogleOAuth,
  googleOAuthMissingEnv,
  isGoogleConfigured,
} from "./google.js";
import {
  buildMicrosoftAuthUrl,
  completeMicrosoftOAuth,
  isMicrosoftConfigured,
  microsoftOAuthMissingEnv,
} from "./microsoft.js";
import {
  createOAuthState,
  integrationCallbackUrl,
  verifyOAuthState,
} from "./oauth-state.js";
import {
  deleteUserIntegration,
  getUserIntegration,
  listUserIntegrationStatuses,
  listUserIntegrations,
  updateIntegrationPreferences,
  upsertUserIntegration,
} from "./user-integration.repository.js";
import {
  DEFAULT_GOOGLE_INTEGRATION_PREFERENCES,
  parseIntegrationPreferences,
} from "./integration-preferences.js";

function toProviderEnum(provider: IntegrationProviderInput): IntegrationProviderType {
  return provider === "google" ? IntegrationProvider.GOOGLE : IntegrationProvider.MICROSOFT;
}

export function getIntegrationsConfig() {
  return {
    google: {
      configured: isGoogleConfigured(),
      missingEnv: googleOAuthMissingEnv(),
    },
    microsoft: {
      configured: isMicrosoftConfigured(),
      missingEnv: microsoftOAuthMissingEnv(),
    },
  };
}

export async function listIntegrationStatuses(userId: string): Promise<UserIntegrationStatus[]> {
  const rows = await listUserIntegrationStatuses(userId);
  const byProvider = new Map(rows.map((r) => [r.provider, r]));

  const providers: IntegrationProviderInput[] = ["google", "microsoft"];
  return providers.map((provider) => {
    const row = byProvider.get(toProviderEnum(provider));
    const preferences =
      provider === "google" && row
        ? parseIntegrationPreferences(row.preferences)
        : undefined;
    return {
      provider,
      connected: Boolean(row),
      externalEmail: row?.externalEmail ?? null,
      connectedAt: row ? row.connectedAt.toISOString() : null,
      preferences,
    };
  });
}

export async function startIntegrationConnect(
  userId: string,
  provider: IntegrationProviderInput,
  req?: PublicUrlRequest,
): Promise<{ authUrl: string }> {
  if (provider === "google") {
    if (!isGoogleConfigured()) throw new Error("Google integration is not configured on this server");
    const state = await createOAuthState(userId, provider);
    const redirectUri = integrationCallbackUrl("google", req);
    return { authUrl: buildGoogleAuthUrl(state, redirectUri) };
  }

  if (!isMicrosoftConfigured()) {
    throw new Error("Microsoft integration is not configured on this server");
  }
  const state = await createOAuthState(userId, provider);
  const redirectUri = integrationCallbackUrl("microsoft", req);
  return { authUrl: buildMicrosoftAuthUrl(state, redirectUri) };
}

export async function handleIntegrationCallback(
  provider: IntegrationProviderInput,
  code: string,
  state: string,
  req?: PublicUrlRequest,
): Promise<{ userId: string }> {
  const verified = await verifyOAuthState(state);
  if (verified.provider !== provider) {
    throw new Error("OAuth provider mismatch");
  }

  const redirectUri = integrationCallbackUrl(provider, req);

  if (provider === "google") {
    const tokens = await completeGoogleOAuth(code, redirectUri);
    await upsertUserIntegration({
      userId: verified.userId,
      provider: IntegrationProvider.GOOGLE,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      scopes: tokens.scopes,
      externalEmail: tokens.externalEmail,
    });
    const existing = await getUserIntegration(verified.userId, IntegrationProvider.GOOGLE);
    if (!existing?.preferences) {
      await updateIntegrationPreferences(
        verified.userId,
        IntegrationProvider.GOOGLE,
        DEFAULT_GOOGLE_INTEGRATION_PREFERENCES as Record<string, unknown>,
      );
    }
    return { userId: verified.userId };
  }

  const tokens = await completeMicrosoftOAuth(code, redirectUri);
  await upsertUserIntegration({
    userId: verified.userId,
    provider: IntegrationProvider.MICROSOFT,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: tokens.expiresAt,
    scopes: tokens.scopes,
    externalEmail: tokens.externalEmail,
  });
  return { userId: verified.userId };
}

export async function disconnectIntegration(
  userId: string,
  provider: IntegrationProviderInput,
): Promise<void> {
  await deleteUserIntegration(userId, toProviderEnum(provider));
}

export async function updateGoogleIntegrationPreferences(
  userId: string,
  preferences: IntegrationPreferences,
): Promise<IntegrationPreferences> {
  const integration = await getUserIntegration(userId, IntegrationProvider.GOOGLE);
  if (!integration) {
    throw new Error("Connect Google in Settings → Integrations first");
  }
  const parsed = integrationPreferencesSchema.parse(preferences);
  const merged = {
    ...parseIntegrationPreferences(integration.preferences),
    ...parsed,
  };
  await updateIntegrationPreferences(
    userId,
    IntegrationProvider.GOOGLE,
    merged as Record<string, unknown>,
  );
  return merged;
}

export async function assertUserHasIntegration(
  userId: string,
  platform: "google_meet" | "microsoft_teams",
): Promise<void> {
  const integrations = await listUserIntegrations(userId);
  const needed =
    platform === "google_meet" ? IntegrationProvider.GOOGLE : IntegrationProvider.MICROSOFT;
  const connected = integrations.some((i) => i.provider === needed);
  if (!connected) {
    const label = platform === "google_meet" ? "Google" : "Microsoft";
    throw new Error(`Connect your ${label} account in Settings → Integrations before scheduling on this platform`);
  }
}
