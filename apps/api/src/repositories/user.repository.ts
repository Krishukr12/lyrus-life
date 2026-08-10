import { UserRole, UserStatus, prisma, type Prisma, type User } from "@lyrus/db";

type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];
type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export type OrgUserListFilters = {
  organizationId: string;
  status?: UserStatusType;
  role?: UserRoleType;
  search?: string;
  skip?: number;
  take?: number;
};

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        organization: { include: { billingProfile: true } },
        employeeProfile: true,
      },
    });
  },

  async findByIdInOrganization(id: string, organizationId: string) {
    return prisma.user.findFirst({
      where: { id, organizationId },
      include: { employeeProfile: true },
    });
  },

  async listOrganizationUsers(filters: OrgUserListFilters) {
    const where: Prisma.UserWhereInput = {
      organizationId: filters.organizationId,
      role: { in: [UserRole.ORG_ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE, UserRole.VIEWER] },
    };
    if (filters.status) where.status = filters.status;
    if (filters.role) where.role = filters.role;
    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search, mode: "insensitive" } },
        { firstName: { contains: filters.search, mode: "insensitive" } },
        { lastName: { contains: filters.search, mode: "insensitive" } },
        { name: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { employeeProfile: true },
        orderBy: { createdAt: "desc" },
        skip: filters.skip,
        take: filters.take ?? 50,
      }),
      prisma.user.count({ where }),
    ]);

    return { items, total };
  },

  async createOrganizationUser(
    data: Prisma.UserCreateInput & { employeeProfile?: Prisma.EmployeeProfileCreateWithoutUserInput },
  ): Promise<User> {
    const { employeeProfile, ...userData } = data;
    return prisma.user.create({
      data: {
        ...userData,
        employeeProfile: employeeProfile
          ? { create: employeeProfile }
          : undefined,
      },
      include: { employeeProfile: true },
    });
  },

  async updateOrganizationUser(
    id: string,
    organizationId: string,
    data: Prisma.UserUpdateInput,
    profile?: Prisma.EmployeeProfileUpdateInput,
  ) {
    const existing = await prisma.user.findFirst({
      where: { id, organizationId },
    });
    if (!existing) {
      throw new Error("Tenant boundary violation");
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        employeeProfile: profile
          ? {
              upsert: {
                create: profile as Prisma.EmployeeProfileCreateWithoutUserInput,
                update: profile,
              },
            }
          : undefined,
      },
      include: { employeeProfile: true },
    });

    return user;
  },

  async updateLastLogin(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  },
};
