import {
  addDays,
  format,
  formatDistanceToNow,
  isWithinInterval,
  startOfMonth,
  subMonths,
} from "date-fns";
import type { TenantAuditLog, Organization, User } from "@lyrus/db";
import { dashboardRepository } from "../repositories/dashboard.repository.js";
import { billingService } from "./billing.service.js";
import { getSystemHealth } from "../lib/system-health.js";
import { serializeOrganization } from "../lib/serializers.js";

function computeGrowthPercent(recent: number, previous: number): number {
  if (previous === 0) return recent > 0 ? 100 : 0;
  return ((recent - previous) / previous) * 100;
}

function buildMonthlyBuckets(records: { createdAt: Date }[], months = 6) {
  const now = new Date();
  const buckets: { label: string; count: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i));
    const label = format(monthStart, "MMM");
    const count = records.filter((r) => {
      const d = r.createdAt;
      return d.getMonth() === monthStart.getMonth() && d.getFullYear() === monthStart.getFullYear();
    }).length;
    buckets.push({ label, count });
  }

  return buckets;
}

function formatActivityDetail(
  log: TenantAuditLog & {
    organization?: Pick<Organization, "name"> | null;
    user?: Pick<User, "name" | "email"> | null;
  },
): string {
  const meta = (log.metadata ?? {}) as Record<string, unknown>;
  const orgName = log.organization?.name;

  switch (log.action) {
    case "organization.created":
      return orgName ? `${orgName} onboarded` : "Organization onboarded";
    case "organization.activated":
      return orgName ? `${orgName} activated` : "Organization activated";
    case "organization.suspended":
      return orgName ? `${orgName} suspended` : "Organization suspended";
    case "organization.updated":
      return orgName ? `${orgName} updated` : "Organization updated";
    case "user.created":
      return typeof meta.email === "string"
        ? `Invite sent to ${meta.email}`
        : "User invited";
    case "user.activated":
      return typeof meta.email === "string"
        ? `${meta.email} activated`
        : "User activated";
    case "auth.login":
      return log.user?.email
        ? `${log.user.name || log.user.email} signed in`
        : "User signed in";
    case "meeting.started":
      return typeof meta.title === "string"
        ? `Meeting started: ${meta.title}`
        : "Meeting started";
    case "meeting.ended":
      return typeof meta.title === "string"
        ? `Meeting ended: ${meta.title}`
        : "Meeting ended";
    case "billing.updated":
      return orgName ? `Subscription updated for ${orgName}` : "Subscription updated";
    default:
      return log.action.replace(/\./g, " ");
  }
}

export const dashboardService = {
  async getDashboard() {
    const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));

    const [
      orgCounts,
      orgGrowth,
      userCounts,
      meetingCounts,
      orgMonthlyRecords,
      meetingMonthlyRecords,
      recentOrgs,
      pendingOrgs,
      recentActivity,
      billing,
      health,
    ] = await Promise.all([
      dashboardRepository.getOrganizationCounts(),
      dashboardRepository.getOrganizationGrowthCounts(),
      dashboardRepository.getUserCounts(),
      dashboardRepository.getMeetingCounts(),
      dashboardRepository.getMonthlyCreatedCounts("organization", sixMonthsAgo),
      dashboardRepository.getMonthlyCreatedCounts("meeting", sixMonthsAgo),
      dashboardRepository.getRecentOrganizations(8),
      dashboardRepository.getPendingOrganizations(10),
      dashboardRepository.getRecentActivity(12),
      billingService.listCustomerBilling(),
      getSystemHealth(),
    ]);

    const billingItems = billing.items;
    const mrrInr = billingItems
      .filter((r) => r.billingStatus === "ACTIVE")
      .reduce((sum, r) => sum + r.totalAmountInr, 0);
    const activeSubscriptions = billingItems.filter((r) => r.billingStatus === "ACTIVE").length;
    const trialAccounts = billingItems.filter((r) => r.billingStatus === "TRIAL").length;

    const now = new Date();
    const renewalWindowEnd = addDays(now, 30);
    const upcomingRenewals = billingItems.filter((r) => {
      if (!r.nextBillingDate) return false;
      const d = new Date(r.nextBillingDate);
      return isWithinInterval(d, { start: now, end: renewalWindowEnd });
    }).length;

    const revenueByCustomer = [...billingItems]
      .filter((r) => r.billingStatus === "ACTIVE" && r.totalAmountInr > 0)
      .sort((a, b) => b.totalAmountInr - a.totalAmountInr)
      .slice(0, 20)
      .map((r) => ({
        organizationId: r.organizationId,
        organizationName: r.organizationName,
        amountInr: r.totalAmountInr,
      }));

    return {
      organizations: {
        total: orgCounts.total,
        active: orgCounts.active,
        pending: orgCounts.pending,
        suspended: orgCounts.suspended,
        growthPercent: computeGrowthPercent(orgGrowth.recent, orgGrowth.previous),
      },
      users: userCounts,
      meetings: meetingCounts,
      billing: {
        mrrInr,
        activeSubscriptions,
        trialAccounts,
        upcomingRenewals,
      },
      charts: {
        tenantGrowth: buildMonthlyBuckets(orgMonthlyRecords),
        meetingsByMonth: buildMonthlyBuckets(meetingMonthlyRecords),
        revenueByCustomer,
      },
      recentOrganizations: recentOrgs.map(serializeOrganization),
      recentActivity: recentActivity.map((log) => ({
        id: log.id,
        action: log.action,
        detail: formatActivityDetail(log),
        time: formatDistanceToNow(log.createdAt, { addSuffix: true }),
        createdAt: log.createdAt.toISOString(),
      })),
      pendingRequests: pendingOrgs.map((org) => ({
        id: org.id,
        org: org.name,
        plan: org.subscriptionPlan,
        email: org.email,
        submitted: formatDistanceToNow(org.createdAt, { addSuffix: true }),
      })),
      systemHealth: {
        services: health.services,
        allOperational: health.allOperational,
      },
      livekit: {
        configured: health.livekit.configured,
        status: health.livekit.status,
        activeRooms: health.livekit.activeRooms,
        activeParticipants: health.livekit.activeParticipants,
        ongoingMeetings: meetingCounts.liveNow,
        webhookConfigured: health.livekit.webhookConfigured,
      },
    };
  },
};
