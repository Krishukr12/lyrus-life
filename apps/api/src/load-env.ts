import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

if (process.env.NODE_ENV !== "production") {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  config({ path: resolve(__dirname, "../../../.env") });
  config({ path: resolve(__dirname, "../.env") });
}
