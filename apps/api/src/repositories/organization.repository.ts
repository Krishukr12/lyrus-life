import { OrganizationStatus, prisma, type Organization, type Prisma } from "@lyrus/db";

type OrgStatus = (typeof OrganizationStatus)[keyof typeof OrganizationStatus];

export type OrganizationListFilters = {
  status?: OrgStatus;
  search?: string;
  skip?: number;
  take?: number;
};

export const organizationRepository = {
  async findById(id: string): Promise<Organization | null> {
    return prisma.organization.findUnique({ where: { id } });
  },

  async findBySlug(slug: string): Promise<Organization | null> {
    return prisma.organization.findUnique({ where: { slug } });
  },

  async findByCode(code: string): Promise<Organization | null> {
    return prisma.organization.findUnique({ where: { code: code.toUpperCase() } });
  },

  async findDetailById(id: string) {
    return prisma.organization.findUnique({
      where: { id },
      include: {
        _count: { select: { users: true, meetings: true } },
        billingProfile: true,
        users: {
          where: { role: "ORG_ADMIN" },
          orderBy: { createdAt: "asc" },
          take: 1,
          select: {
            id: true,
            name: true,
            email: true,
            mobile: true,
            firstName: true,
            lastName: true,
            lastLoginAt: true,
          },
        },
      },
    });
  },

  async list(filters: OrganizationListFilters = {}) {
    const where: Prisma.OrganizationWhereInput = {};
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { slug: { contains: filters.search, mode: "insensitive" } },
        { code: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.organization.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: filters.skip,
        take: filters.take ?? 50,
        include: {
          _count: { select: { users: true, meetings: true } },
        },
      }),
      prisma.organization.count({ where }),
    ]);

    return { items, total };
  },

  async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    return prisma.organization.create({ data });
  },

  async update(id: string, data: Prisma.OrganizationUpdateInput): Promise<Organization> {
    return prisma.organization.update({ where: { id }, data });
  },

  async setStatus(id: string, status: OrgStatus): Promise<Organization> {
    return prisma.organization.update({ where: { id }, data: { status } });
  },

  async getPlatformStats() {
    const [totalOrganizations, activeOrganizations, totalEmployees, totalMeetings] =
      await Promise.all([
        prisma.organization.count(),
        prisma.organization.count({ where: { status: OrganizationStatus.ACTIVE } }),
        prisma.user.count({
          where: { role: { in: ["ORG_ADMIN", "MANAGER", "EMPLOYEE", "VIEWER"] } },
        }),
        prisma.meeting.count(),
      ]);

    return { totalOrganizations, activeOrganizations, totalEmployees, totalMeetings };
  },

  async getOrgDashboardStats(organizationId: string) {
    const startOfMonth = new Date();
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const [totalEmployees, activeEmployees, meetingsThisMonth, recentAudit] =
      await Promise.all([
        prisma.user.count({ where: { organizationId } }),
        prisma.user.count({
          where: { organizationId, status: "ACTIVE" },
        }),
        prisma.meeting.count({
          where: {
            organizationId,
            createdAt: { gte: startOfMonth },
          },
        }),
        prisma.tenantAuditLog.findMany({
          where: { organizationId },
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            user: {
              select: { id: true, email: true, name: true, firstName: true, lastName: true },
            },
          },
        }),
      ]);

    return { totalEmployees, activeEmployees, meetingsThisMonth, recentAudit };
  },
};
