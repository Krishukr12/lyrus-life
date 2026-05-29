import type { FastifyReply, FastifyRequest } from "fastify";
import { ACCESS_TOKEN_COOKIE } from "../lib/auth-config.js";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const header = request.headers.authorization;
    if (header?.startsWith("Bearer ")) {
      const token = header.slice(7);
      const payload = await request.server.jwt.verify<{ sub: string; email: string; name: string; role: string }>(
        token,
      );
      request.authUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role as import("@lyrus/db").UserRole,
      };
      return;
    }

    const cookieToken = request.cookies[ACCESS_TOKEN_COOKIE];
    if (cookieToken) {
      const payload = await request.server.jwt.verify<{ sub: string; email: string; name: string; role: string }>(
        cookieToken,
      );
      request.authUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role as import("@lyrus/db").UserRole,
      };
      return;
    }
  } catch {
    // fall through to 401
  }

  return reply.status(401).send({
    error: "unauthorized",
    message: "Sign in required",
  });
}

export function requireAuthUser(request: FastifyRequest) {
  if (!request.authUser) {
    throw new Error("Auth user missing after authenticate hook");
  }
  return request.authUser;
}
