import "./load-env.js";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import Fastify from "fastify";
import { getJwtSecret } from "./lib/auth-config.js";
import { authenticate } from "./middleware/authenticate.js";
import { authRoutes } from "./routes/auth.js";
import { liveRoutes } from "./routes/live.js";
import { meetingRoutes } from "./routes/meetings.js";
import { attachLiveMeetingSocket } from "./socket/live-meeting.js";

const port = Number(process.env.API_PORT ?? 3001);
const host = process.env.API_HOST ?? "0.0.0.0";

async function main() {
  const app = Fastify({ logger: true });

  const corsOrigins = process.env.CORS_ORIGIN?.split(",") ?? [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
  ];

  await app.register(fastifyCors, {
    origin: corsOrigins,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  });

  await app.register(fastifyCookie);
  await app.register(fastifyJwt, {
    secret: getJwtSecret(),
  });

  await app.register(multipart, {
    limits: { fileSize: 100 * 1024 * 1024 },
  });

  app.get("/health", async () => ({ ok: true, service: "lyrus-api" }));

  await app.register(authRoutes);
  await app.register(liveRoutes);

  await app.register(async (protectedApp) => {
    protectedApp.addHook("onRequest", authenticate);
    await protectedApp.register(meetingRoutes);
  });

  await app.listen({ port, host });
  attachLiveMeetingSocket(app.server, corsOrigins);
  app.log.info(`API listening on http://${host}:${port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
