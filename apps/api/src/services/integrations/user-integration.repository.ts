import { IntegrationProvider, prisma } from "@lyrus/db";
import type { IntegrationProviderType } from "@lyrus/db";
import { decryptSecret, encryptSecret } from "../../lib/token-crypto.js";

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
}): StoredIntegration {
  return {
    id: row.id,
    userId: row.userId,
    provider: row.provider,
    accessToken: decryptSecret(row.accessTokenEnc),
    refreshToken: row.refreshTokenEnc ? decryptSecret(row.refreshTokenEnc) : null,
    expiresAt: row.expiresAt,
    scopes: row.scopes,
    externalAccountId: row.externalAccountId,
    externalEmail: row.externalEmail,
    preferences:
      row.preferences && typeof row.preferences === "object"
        ? (row.preferences as Record<string, unknown>)
        : null,
  };
}

export async function getUserIntegration(
  userId: string,
  provider: IntegrationProviderType,
): Promise<StoredIntegration | null> {
  const row = await prisma.userIntegration.findUnique({
    where: { userId_provider: { userId, provider } },
  });
  return row ? mapIntegration(row) : null;
}

export async function listUserIntegrations(userId: string): Promise<StoredIntegration[]> {
  const rows = await prisma.userIntegration.findMany({ where: { userId } });
  return rows.map(mapIntegration);
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
  return mapIntegration(row);
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
    data: { preferences },
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
