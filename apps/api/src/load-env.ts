import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

if (process.env.NODE_ENV !== "production") {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  // Prefer repo .env over empty/placeholder shell vars so local OAuth keys actually apply.
  const dotenvOpts = { override: true } as const;
  config({ path: resolve(__dirname, "../../../.env"), ...dotenvOpts });
  config({ path: resolve(__dirname, "../.env"), ...dotenvOpts });
}
