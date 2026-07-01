import "./load-env.js";
import { validateProductionEnv } from "./validate-env.js";
import { createServer } from "node:http";
import { createApp } from "./app.js";
import { attachLiveMeetingSocket } from "./socket/live-meeting.js";

const port = Number(process.env.PORT ?? process.env.API_PORT ?? 3000);
const host = process.env.API_HOST ?? "0.0.0.0";

const corsOrigins = process.env.CORS_ORIGIN?.split(",") ?? [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:8081",
  "http://127.0.0.1:8081",
];

validateProductionEnv();

const app = createApp(corsOrigins);
const server = createServer(app);

attachLiveMeetingSocket(server, corsOrigins);

server.listen(port, host, () => {
  console.log(`API listening on http://${host}:${port}`);
});

server.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down gracefully`);
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
