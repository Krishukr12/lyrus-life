export type TenantUserRole = "SUPER_ADMIN" | "ORG_ADMIN" | "MANAGER" | "EMPLOYEE" | "VIEWER";

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  email: string;
  phone: string | null;
  status: string;
  subscriptionPlan: string;
  createdAt: string;
  updatedAt: string;
  counts?: { users: number; meetings: number };
}

export interface TenantAuthUser {
  id: string;
  email: string;
  name: string;
  role: TenantUserRole;
  organizationId: string | null;
  firstName?: string;
  lastName?: string;
  status?: string;
}

export interface OrgEmployee {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  mobile?: string | null;
  role: TenantUserRole;
  status: string;
  profile: {
    designation: string | null;
    department: string | null;
    employeeCode: string | null;
    joiningDate: string | null;
  } | null;
}
