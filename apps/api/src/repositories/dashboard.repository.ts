import {
  MeetingStatus,
  OrganizationStatus,
  UserRole,
  UserStatus,
  prisma,
} from "@lyrus/db";
import { startOfDay, startOfMonth } from "date-fns";

export const dashboardRepository = {
  async getOrganizationCounts() {
    const [total, active, pending, suspended] = await Promise.all([
      prisma.organization.count(),
      prisma.organization.count({ where: { status: OrganizationStatus.ACTIVE } }),
      prisma.organization.count({ where: { status: OrganizationStatus.PENDING } }),
      prisma.organization.count({ where: { status: OrganizationStatus.SUSPENDED } }),
    ]);
    return { total, active, pending, suspended };
  },

  async getOrganizationGrowthCounts() {
    const now = new Date();
    const d30 = new Date(now);
    d30.setDate(d30.getDate() - 30);
    const d60 = new Date(now);
    d60.setDate(d60.getDate() - 60);

    const [recent, previous] = await Promise.all([
      prisma.organization.count({ where: { createdAt: { gte: d30 } } }),
      prisma.organization.count({
        where: { createdAt: { gte: d60, lt: d30 } },
      }),
    ]);

    return { recent, previous };
  },

  async getUserCounts() {
    const employeeRoles = [UserRole.ORG_ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE];
    const d30 = new Date();
    d30.setDate(d30.getDate() - 30);

    const [total, active, newLast30Days] = await Promise.all([
      prisma.user.count({ where: { role: { in: employeeRoles } } }),
      prisma.user.count({
        where: { role: { in: employeeRoles }, status: UserStatus.ACTIVE },
      }),
      prisma.user.count({
        where: { role: { in: employeeRoles }, createdAt: { gte: d30 } },
      }),
    ]);

    return { total, active, newLast30Days };
  },

  async getMeetingCounts() {
    const now = new Date();
    const todayStart = startOfDay(now);
    const monthStart = startOfMonth(now);
    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [total, today, thisMonth, liveNow] = await Promise.all([
      prisma.meeting.count(),
      prisma.meeting.count({
        where: { scheduledAt: { gte: todayStart, lt: tomorrow } },
      }),
      prisma.meeting.count({
        where: { scheduledAt: { gte: monthStart } },
      }),
      prisma.meeting.count({
        where: {
          liveEndedAt: null,
          liveStartedAt: { not: null },
          status: { in: [MeetingStatus.ONGOING, MeetingStatus.UPCOMING] },
        },
      }),
    ]);

    return { total, today, thisMonth, liveNow };
  },

  async getMonthlyCreatedCounts(
    model: "organization" | "meeting",
    since: Date,
  ): Promise<{ createdAt: Date }[]> {
    if (model === "organization") {
      return prisma.organization.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      });
    }
    return prisma.meeting.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    });
  },

  async getRecentOrganizations(limit = 8) {
    return prisma.organization.findMany({
      where: { status: { not: OrganizationStatus.PENDING } },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { _count: { select: { users: true, meetings: true } } },
    });
  },

  async getPendingOrganizations(limit = 10) {
    return prisma.organization.findMany({
      where: { status: OrganizationStatus.PENDING },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  async getRecentActivity(limit = 30) {
    return prisma.tenantAuditLog.findMany({
      where: {
        action: {
          notIn: ["auth.login", "organization.created"],
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        organization: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async getPipelineJobCounts() {
    const [processing, failed] = await Promise.all([
      prisma.meeting.count({ where: { status: MeetingStatus.PROCESSING } }),
      prisma.meeting.count({ where: { status: MeetingStatus.FAILED } }),
    ]);
    return { processing, failed };
  },
};
