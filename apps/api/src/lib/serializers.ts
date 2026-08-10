import type { Organization, EmployeeProfile, User } from "@lyrus/db";

export function serializeUser(user: User & { employeeProfile?: EmployeeProfile | null }) {
  return {
    id: user.id,
    organizationId: user.organizationId,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    status: user.status,
    mustChangePassword: user.mustChangePassword,
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    profile: user.employeeProfile
      ? {
          designation: user.employeeProfile.designation,
          department: user.employeeProfile.department,
          employeeCode: user.employeeProfile.employeeCode,
          joiningDate: user.employeeProfile.joiningDate?.toISOString() ?? null,
        }
      : null,
  };
}

export function serializeOrganization(
  org: Organization & {
    _count?: { users: number; meetings: number };
    billingProfile?: {
      billingStatus: string;
      trialEndsAt: Date | null;
      trialStartedAt?: Date | null;
    } | null;
  },
) {
  return {
    id: org.id,
    name: org.name,
    code: org.code,
    slug: org.slug,
    legalName: org.legalName,
    primaryContactName: org.primaryContactName,
    industry: org.industry,
    email: org.email,
    phone: org.phone,
    website: org.website,
    companySize: org.companySize,
    country: org.country,
    state: org.state,
    city: org.city,
    logoUrl: org.logoUrl,
    address: org.address,
    timezone: org.timezone,
    meetingDefaultDurationMinutes: org.meetingDefaultDurationMinutes,
    status: org.status,
    subscriptionPlan: org.subscriptionPlan,
    billingStatus: org.billingProfile?.billingStatus ?? null,
    trialEndsAt: org.billingProfile?.trialEndsAt?.toISOString() ?? null,
    createdAt: org.createdAt.toISOString(),
    updatedAt: org.updatedAt.toISOString(),
    counts: org._count
      ? { users: org._count.users, meetings: org._count.meetings }
      : undefined,
  };
}

export function serializeMeetingListItem(
  meeting: {
    id: string;
    title: string;
    scheduledAt: Date;
    durationMinutes: number;
    status: string;
    createdAt: Date;
    organizer: { name: string; email: string } | null;
    _count: { participants: number };
  },
) {
  return {
    id: meeting.id,
    title: meeting.title,
    scheduledAt: meeting.scheduledAt.toISOString(),
    durationMinutes: meeting.durationMinutes,
    status: meeting.status,
    createdAt: meeting.createdAt.toISOString(),
    organizerName: meeting.organizer?.name ?? null,
    organizerEmail: meeting.organizer?.email ?? null,
    participantCount: meeting._count.participants,
  };
}
