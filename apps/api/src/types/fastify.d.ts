import type { UserRole } from "@lyrus/db";

declare module "fastify" {
  interface FastifyRequest {
    authUser?: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      email: string;
      name: string;
      role: UserRole;
    };
    user: {
      sub: string;
      email: string;
      name: string;
      role: UserRole;
    };
  }
}
