import { prisma } from "@lyrus/db";
import type { IntegrationProviderType } from "@lyrus/db";
import { encryptSecret, tryDecryptSecret } from "../../lib/token-crypto.js";

export type StoredIntegration = {
  id: string;
  userId: string;
  provider: IntegrationProviderType;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
  scopes: string;
  externalAccountId: string | null;
  externalEmail: string | null;
  preferences: Record<string, unknown> | null;
};

export type IntegrationStatusRow = {
  provider: IntegrationProviderType;
  externalEmail: string | null;
  preferences: Record<string, unknown> | null;
  connectedAt: Date;
};

function parsePreferences(preferences: unknown): Record<string, unknown> | null {
  return preferences && typeof preferences === "object"
    ? (preferences as Record<string, unknown>)
    : null;
}

function mapIntegration(row: {
  id: string;
  userId: string;
  provider: IntegrationProviderType;
  accessTokenEnc: string;
  refreshTokenEnc: string | null;
  expiresAt: Date | null;
  scopes: string;
  externalAccountId: string | null;
  externalEmail: string | null;
  preferences?: unknown;
}): StoredIntegration | null {
  const accessToken = tryDecryptSecret(row.accessTokenEnc);
  if (!accessToken) {
    return null;
  }

  let refreshToken: string | null = null;
  if (row.refreshTokenEnc) {
    refreshToken = tryDecryptSecret(row.refreshTokenEnc);
    // Refresh token alone failing shouldn't wipe the connection mid-request;
    // callers that need refresh will fail and can reconnect.
    if (refreshToken === null) {
      console.warn(
        `[integrations] Unable to decrypt refresh token for ${row.provider} (user ${row.userId}); treating as missing`,
      );
    }
  }

  return {
    id: row.id,
    userId: row.userId,
    provider: row.provider,
    accessToken,
    refreshToken,
    expiresAt: row.expiresAt,
    scopes: row.scopes,
    externalAccountId: row.externalAccountId,
    externalEmail: row.externalEmail,
    preferences: parsePreferences(row.preferences),
  };
}

async function purgeUndecryptableIntegration(
  userId: string,
  provider: IntegrationProviderType,
): Promise<void> {
  console.warn(
    `[integrations] Removing undecryptable ${provider} tokens for user ${userId} — reconnect required`,
  );
  await prisma.userIntegration.deleteMany({ where: { userId, provider } });
}

export async function getUserIntegration(
  userId: string,
  provider: IntegrationProviderType,
): Promise<StoredIntegration | null> {
  const row = await prisma.userIntegration.findUnique({
    where: { userId_provider: { userId, provider } },
  });
  if (!row) return null;

  const mapped = mapIntegration(row);
  if (!mapped) {
    await purgeUndecryptableIntegration(userId, provider);
    return null;
  }
  return mapped;
}

/** Status listing validates tokens can decrypt; undecryptable rows are purged. */
export async function listUserIntegrationStatuses(
  userId: string,
): Promise<IntegrationStatusRow[]> {
  const rows = await prisma.userIntegration.findMany({
    where: { userId },
    select: {
      id: true,
      userId: true,
      provider: true,
      accessTokenEnc: true,
      externalEmail: true,
      preferences: true,
      createdAt: true,
    },
  });

  const usable: IntegrationStatusRow[] = [];
  for (const row of rows) {
    const accessToken = tryDecryptSecret(row.accessTokenEnc);
    if (!accessToken) {
      await purgeUndecryptableIntegration(row.userId, row.provider);
      continue;
    }
    usable.push({
      provider: row.provider,
      externalEmail: row.externalEmail,
      preferences: parsePreferences(row.preferences),
      connectedAt: row.createdAt,
    });
  }
  return usable;
}

export async function listUserIntegrations(userId: string): Promise<StoredIntegration[]> {
  const rows = await prisma.userIntegration.findMany({ where: { userId } });
  const usable: StoredIntegration[] = [];

  for (const row of rows) {
    const mapped = mapIntegration(row);
    if (!mapped) {
      await purgeUndecryptableIntegration(row.userId, row.provider);
      continue;
    }
    usable.push(mapped);
  }

  return usable;
}

export async function upsertUserIntegration(input: {
  userId: string;
  provider: IntegrationProviderType;
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: Date | null;
  scopes?: string;
  externalAccountId?: string | null;
  externalEmail?: string | null;
}): Promise<StoredIntegration> {
  const row = await prisma.userIntegration.upsert({
    where: {
      userId_provider: { userId: input.userId, provider: input.provider },
    },
    create: {
      userId: input.userId,
      provider: input.provider,
      accessTokenEnc: encryptSecret(input.accessToken),
      refreshTokenEnc: input.refreshToken ? encryptSecret(input.refreshToken) : null,
      expiresAt: input.expiresAt ?? null,
      scopes: input.scopes ?? "",
      externalAccountId: input.externalAccountId ?? null,
      externalEmail: input.externalEmail ?? null,
    },
    update: {
      accessTokenEnc: encryptSecret(input.accessToken),
      refreshTokenEnc: input.refreshToken ? encryptSecret(input.refreshToken) : null,
      expiresAt: input.expiresAt ?? null,
      scopes: input.scopes ?? "",
      externalAccountId: input.externalAccountId ?? null,
      externalEmail: input.externalEmail ?? null,
    },
  });
  const mapped = mapIntegration(row);
  if (!mapped) {
    throw new Error("Failed to read integration immediately after upsert");
  }
  return mapped;
}

export async function deleteUserIntegration(
  userId: string,
  provider: IntegrationProviderType,
): Promise<void> {
  await prisma.userIntegration.deleteMany({ where: { userId, provider } });
}

export async function updateIntegrationPreferences(
  userId: string,
  provider: IntegrationProviderType,
  preferences: Record<string, unknown>,
): Promise<void> {
  await prisma.userIntegration.update({
    where: { userId_provider: { userId, provider } },
    data: { preferences: preferences as object },
  });
}

export async function updateIntegrationTokens(
  id: string,
  accessToken: string,
  expiresAt: Date | null,
  refreshToken?: string | null,
): Promise<void> {
  await prisma.userIntegration.update({
    where: { id },
    data: {
      accessTokenEnc: encryptSecret(accessToken),
      expiresAt,
      ...(refreshToken !== undefined
        ? { refreshTokenEnc: refreshToken ? encryptSecret(refreshToken) : null }
        : {}),
    },
  });
}
