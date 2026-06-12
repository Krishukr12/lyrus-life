import { MeetingStatus, UserRole, UserStatus, prisma, type UserStatus as UserStatusType } from "@lyrus/db";
import { billingService } from "./billing.service.js";
import { organizationRepository } from "../repositories/organization.repository.js";
import { countActiveOrganizationSeats, PLAN_MAX_USERS } from "../lib/plan-limits.js";
import { serializeMeetingListItem, serializeOrganization, serializeUser } from "../lib/serializers.js";
import { formatDistanceToNow } from "date-fns";

export class OrganizationAdminError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 404,
  ) {
    super(message);
  }
}

export const organizationAdminService = {
  async getOrganizationDetail(organizationId: string) {
    const org = await organizationRepository.findDetailById(organizationId);
    if (!org) {
      throw new OrganizationAdminError("not_found", "Organization not found", 404);
    }

    const employeeRoles = [UserRole.ORG_ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE];
    const [activeEmployees, billingDetail] = await Promise.all([
      prisma.user.count({
        where: {
          organizationId,
          status: UserStatus.ACTIVE,
          role: { in: employeeRoles },
        },
      }),
      billingService.getCustomerBillingDetail(organizationId),
    ]);

    const admin = org.users[0] ?? null;
    const maxUsers = PLAN_MAX_USERS[org.subscriptionPlan];

    return {
      organization: serializeOrganization(org),
      usage: {
        totalEmployees: org._count.users,
        activeEmployees,
        totalMeetings: org._count.meetings,
      },
      admin: admin
        ? {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            phone: admin.mobile,
            lastLoginAt: admin.lastLoginAt?.toISOString() ?? null,
          }
        : null,
      subscription: billingDetail
        ? {
            plan: billingDetail.currentPlan,
            planLabel: billingDetail.currentPlanLabel,
            billingStatus: billingDetail.billingStatus,
            billingCycle: billingDetail.billingCycle,
            nextBillingDate: billingDetail.nextBillingDate,
            monthlyAmountInr: billingDetail.monthlyAmountInr,
            totalAmountInr: billingDetail.totalAmountInr,
            activeUsers: billingDetail.activeUsers,
            userLimit: maxUsers,
          }
        : null,
    };
  },

  async listMeetings(
    organizationId: string,
    filters: { search?: string; status?: MeetingStatus; skip?: number; take?: number },
  ) {
    const org = await organizationRepository.findById(organizationId);
    if (!org) {
      throw new OrganizationAdminError("not_found", "Organization not found", 404);
    }

    const where = {
      organizationId,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.search
        ? { title: { contains: filters.search, mode: "insensitive" as const } }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.meeting.findMany({
        where,
        orderBy: { scheduledAt: "desc" },
        skip: filters.skip,
        take: filters.take ?? 25,
        include: {
          organizer: { select: { name: true, email: true } },
          _count: { select: { participants: true } },
        },
      }),
      prisma.meeting.count({ where }),
    ]);

    return {
      items: items.map(serializeMeetingListItem),
      total,
    };
  },

  async listAuditLogs(
    organizationId: string,
    filters: { skip?: number; take?: number },
  ) {
    const org = await organizationRepository.findById(organizationId);
    if (!org) {
      throw new OrganizationAdminError("not_found", "Organization not found", 404);
    }

    const [items, total] = await Promise.all([
      prisma.tenantAuditLog.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
        skip: filters.skip,
        take: filters.take ?? 30,
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.tenantAuditLog.count({ where: { organizationId } }),
    ]);

    return {
      items: items.map((log) => ({
        id: log.id,
        action: log.action,
        detail: log.action.replace(/\./g, " "),
        time: formatDistanceToNow(log.createdAt, { addSuffix: true }),
        createdAt: log.createdAt.toISOString(),
        actor: log.user
          ? { id: log.user.id, name: log.user.name, email: log.user.email }
          : null,
        metadata: log.metadata,
      })),
      total,
    };
  },

  async listEmployees(
    organizationId: string,
    filters: {
      search?: string;
      status?: UserStatusType;
      role?: (typeof UserRole)[keyof typeof UserRole];
      skip?: number;
      take?: number;
    },
  ) {
    const org = await organizationRepository.findById(organizationId);
    if (!org) {
      throw new OrganizationAdminError("not_found", "Organization not found", 404);
    }

    const { userRepository } = await import("../repositories/user.repository.js");
    const { items, total } = await userRepository.listOrganizationUsers({
      organizationId,
      search: filters.search,
      status: filters.status,
      role: filters.role,
      skip: filters.skip,
      take: filters.take ?? 25,
    });

    return {
      items: items.map(serializeUser),
      total,
    };
  },
};
