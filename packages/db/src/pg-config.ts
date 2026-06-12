import type { PoolConfig } from "pg";

export function pgConnectionConfig(connectionString: string): PoolConfig {
  const isLocalDb = /localhost|127\.0\.0\.1/.test(connectionString);
  return {
    connectionString,
    connectionTimeoutMillis: 10_000,
    ...(isLocalDb ? {} : { ssl: { rejectUnauthorized: false } }),
  };
}
