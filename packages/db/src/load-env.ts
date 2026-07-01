import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

if (process.env.NODE_ENV !== "production") {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  /** Monorepo root .env — single source of truth for DATABASE_URL and shared secrets. */
  config({ path: resolve(__dirname, "../../../.env") });
}
