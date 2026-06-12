export interface OrganizationSummary {
  id: string;
  name: string;
  code?: string | null;
  slug: string;
  legalName?: string | null;
  primaryContactName?: string | null;
  industry: string | null;
  email: string;
  phone: string | null;
  website?: string | null;
  companySize?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  address?: string | null;
  timezone?: string;
  logoUrl?: string | null;
  status: string;
  subscriptionPlan: string;
  createdAt: string;
  updatedAt: string;
  counts?: { users: number; meetings: number };
}

export interface PlatformStats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalEmployees: number;
  totalMeetings: number;
}
