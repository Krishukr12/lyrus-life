import { config } from "dotenv";
import { resolve } from "node:path";
import fastifyCors from "@fastify/cors";

config({ path: resolve(process.cwd(), "../../.env") });
config({ path: resolve(process.cwd(), ".env") });
import multipart from "@fastify/multipart";
import Fastify from "fastify";
import { meetingRoutes } from "./routes/meetings.js";

const port = Number(process.env.API_PORT ?? 3001);
const host = process.env.API_HOST ?? "0.0.0.0";

async function main() {
  const app = Fastify({ logger: true });

  await app.register(fastifyCors, {
    origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:8080", "http://127.0.0.1:8080"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  });

  await app.register(multipart, {
    limits: { fileSize: 100 * 1024 * 1024 },
  });

  await app.register(meetingRoutes);

  await app.listen({ port, host });
  app.log.info(`API listening on http://${host}:${port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
