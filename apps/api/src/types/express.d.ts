import { UserRole, UserStatus } from "@lyrus/db";

type Role = (typeof UserRole)[keyof typeof UserRole];
type Status = (typeof UserStatus)[keyof typeof UserStatus];

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: Status;
  organizationId: string | null;
};

export type TenantContext = {
  organizationId: string;
};

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
      tenant?: TenantContext;
    }
  }
}

export {};
