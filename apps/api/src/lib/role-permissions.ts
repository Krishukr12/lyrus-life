import { UserRole } from "@lyrus/db";

export type OrgPermission =
  | "users.manage"
  | "users.invite"
  | "users.view"
  | "billing.view"
  | "billing.manage"
  | "settings.manage"
  | "meetings.create"
  | "meetings.view_all"
  | "meetings.view_own"
  | "meetings.edit"
  | "templates.manage"
  | "integrations.manage";

const ROLE_PERMISSIONS: Record<string, OrgPermission[]> = {
  [UserRole.ORG_ADMIN]: [
    "users.manage",
    "users.invite",
    "users.view",
    "billing.view",
    "billing.manage",
    "settings.manage",
    "meetings.create",
    "meetings.view_all",
    "meetings.edit",
    "templates.manage",
    "integrations.manage",
  ],
  [UserRole.MANAGER]: [
    "users.view",
    "billing.view",
    "meetings.create",
    "meetings.view_all",
    "meetings.edit",
    "templates.manage",
  ],
  [UserRole.EMPLOYEE]: [
    "users.view",
    "meetings.create",
    "meetings.view_own",
    "meetings.edit",
  ],
  [UserRole.VIEWER]: ["users.view", "meetings.view_own"],
};

export function hasPermission(role: string, permission: OrgPermission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function roleDisplayName(role: string): string {
  switch (role) {
    case UserRole.ORG_ADMIN:
      return "Organization Admin";
    case UserRole.MANAGER:
      return "Manager";
    case UserRole.EMPLOYEE:
      return "Member";
    case UserRole.VIEWER:
      return "Viewer";
    default:
      return role;
  }
}
