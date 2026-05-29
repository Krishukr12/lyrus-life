import type { FastifyRequest } from "fastify";
import { ACCESS_TOKEN_COOKIE } from "../lib/auth-config.js";

/** Returns auth user if a valid token/cookie is present; otherwise null (no 401). */
export async function tryAuthenticate(request: FastifyRequest) {
  try {
    const header = request.headers.authorization;
    const rawToken = header?.startsWith("Bearer ") ? header.slice(7) : request.cookies[ACCESS_TOKEN_COOKIE];
    if (!rawToken) return null;

    const payload = await request.server.jwt.verify<{
      sub: string;
      email: string;
      name: string;
      role: string;
    }>(rawToken);

    request.authUser = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role as import("@lyrus/db").UserRole,
    };
    return request.authUser;
  } catch {
    return null;
  }
}
