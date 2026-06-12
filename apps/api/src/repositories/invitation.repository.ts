import { OrganizationInvitationStatus, prisma, type Prisma } from "@lyrus/db";

export const invitationRepository = {
  async findPendingByEmail(organizationId: string, email: string) {
    return prisma.organizationInvitation.findFirst({
      where: {
        organizationId,
        email: email.toLowerCase(),
        status: OrganizationInvitationStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
    });
  },

  async findByTokenHash(tokenHash: string) {
    return prisma.organizationInvitation.findUnique({
      where: { tokenHash },
      include: {
        organization: {
          select: { id: true, name: true, slug: true, status: true, subscriptionPlan: true },
        },
        invitedBy: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async listOrganizationInvitations(
    organizationId: string,
    status?: (typeof OrganizationInvitationStatus)[keyof typeof OrganizationInvitationStatus],
  ) {
    return prisma.organizationInvitation.findMany({
      where: {
        organizationId,
        ...(status ? { status } : {}),
      },
      include: {
        invitedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async createInvitation(data: {
    organizationId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Prisma.UserCreateInput["role"];
    tokenHash: string;
    invitedById: string;
    expiresAt: Date;
    mobile?: string;
    designation?: string;
    department?: string;
  }) {
    return prisma.organizationInvitation.create({
      data: {
        organizationId: data.organizationId,
        email: data.email.toLowerCase(),
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        tokenHash: data.tokenHash,
        invitedById: data.invitedById,
        expiresAt: data.expiresAt,
        mobile: data.mobile,
        designation: data.designation,
        department: data.department,
      },
      include: {
        invitedBy: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async markAccepted(id: string, userId: string) {
    return prisma.organizationInvitation.update({
      where: { id },
      data: {
        status: OrganizationInvitationStatus.ACCEPTED,
        userId,
        acceptedAt: new Date(),
      },
    });
  },

  async cancelInvitation(id: string, organizationId: string) {
    return prisma.organizationInvitation.updateMany({
      where: { id, organizationId, status: OrganizationInvitationStatus.PENDING },
      data: { status: OrganizationInvitationStatus.CANCELLED },
    });
  },

  async expireStaleInvitations() {
    return prisma.organizationInvitation.updateMany({
      where: {
        status: OrganizationInvitationStatus.PENDING,
        expiresAt: { lte: new Date() },
      },
      data: { status: OrganizationInvitationStatus.EXPIRED },
    });
  },

  async updateToken(id: string, tokenHash: string, expiresAt: Date) {
    return prisma.organizationInvitation.update({
      where: { id },
      data: { tokenHash, expiresAt, status: OrganizationInvitationStatus.PENDING },
    });
  },
};
