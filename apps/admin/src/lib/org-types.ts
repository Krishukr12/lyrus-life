import type { OrganizationSummary } from "@/lib/types";

export type OrgEmployee = {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  role: string;
  status: string;
  lastLoginAt: string | null;
  profile: {
    designation: string | null;
    department: string | null;
  } | null;
};

export type OrgMeeting = {
  id: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  status: string;
  organizerName: string | null;
  participantCount: number;
};

export type OrgAuditItem = {
  id: string;
  action: string;
  detail: string;
  time: string;
  createdAt: string;
  actor: { id: string; name: string; email: string } | null;
};

export type OrganizationDetail = {
  organization: OrganizationSummary & {
    code?: string | null;
    legalName?: string | null;
    primaryContactName?: string | null;
    website?: string | null;
    companySize?: string | null;
    country?: string | null;
    state?: string | null;
    city?: string | null;
    address?: string | null;
    timezone?: string;
  };
  usage: {
    totalEmployees: number;
    activeEmployees: number;
    totalMeetings: number;
  };
  admin: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    lastLoginAt: string | null;
  } | null;
  subscription: {
    plan: string;
    planLabel: string;
    billingStatus: string;
    billingCycle: string;
    nextBillingDate: string | null;
    trialEndsAt: string | null;
    monthlyAmountInr: number;
    annualCostInr: number;
    totalAmountInr: number;
    activeUsers: number;
    includedUsers: number;
    additionalUsers: number;
    meetingLimit: number | null;
    totalMeetings: number;
  } | null;
};
