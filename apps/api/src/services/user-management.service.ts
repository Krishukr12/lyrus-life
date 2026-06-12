import { UserRole, UserStatus, prisma } from "@lyrus/db";
import { sendEmployeeInviteEmail } from "@lyrus/notifications";
import type { createOrgUserSchema, updateOrgUserSchema } from "@lyrus/shared";
import type { z } from "zod";
import { assertOrganizationCanAddUser, PlanLimitError } from "../lib/plan-limits.js";
import { userRepository } from "../repositories/user.repository.js";
import { logTenantAudit } from "./tenant-audit.service.js";
import { generateTemporaryPassword } from "../utils/slug.js";
import { fullName } from "../utils/user-name.js";
import { hashPassword } from "../utils/password.js";

export class UserManagementError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 400,
  ) {
    super(message);
  }
}

function inviteLoginUrl(): string {
  const webAppUrl = process.env.WEB_APP_URL ?? "http://localhost:8080";
  return `${webAppUrl}/login`;
}

async function sendInviteEmail(
  organizationName: string,
  user: { email: string; name: string },
  temporaryPassword: string,
) {
  try {
    await sendEmployeeInviteEmail({
      to: user.email,
      name: user.name,
      organizationName,
      temporaryPassword,
      loginUrl: inviteLoginUrl(),
    });
  } catch (err) {
    console.warn("Failed to send employee invite email", err);
  }
}

export const userManagementService = {
  async createEmployee(
    actorId: string,
    organizationId: string,
    input: z.infer<typeof createOrgUserSchema>,
  ) {
    try {
      await assertOrganizationCanAddUser(organizationId);
    } catch (err) {
      if (err instanceof PlanLimitError) {
        throw new UserManagementError(err.code, err.message, err.statusCode);
      }
      throw err;
    }

    const email = input.email.toLowerCase();
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new UserManagementError("email_taken", "Email is already registered", 409);
    }

    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { name: true },
    });
    if (!org) {
      throw new UserManagementError("not_found", "Organization not found", 404);
    }

    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await hashPassword(temporaryPassword);

    const user = await userRepository.createOrganizationUser({
      organization: { connect: { id: organizationId } },
      firstName: input.firstName,
      lastName: input.lastName,
      name: fullName(input.firstName, input.lastName),
      email,
      mobile: input.mobile,
      passwordHash,
      role: input.role,
      status: UserStatus.ACTIVE,
      mustChangePassword: true,
      employeeProfile: {
        designation: input.designation,
        department: input.department,
        employeeCode: input.employeeCode,
        joiningDate: input.joiningDate ? new Date(input.joiningDate) : undefined,
      },
    });

    await sendInviteEmail(org.name, user, temporaryPassword);

    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "user.created",
      metadata: { targetUserId: user.id, role: user.role },
    });

    return { user, temporaryPassword };
  },

  async updateEmployee(
    actorId: string,
    organizationId: string,
    userId: string,
    input: z.infer<typeof updateOrgUserSchema>,
  ) {
    const existing = await userRepository.findByIdInOrganization(userId, organizationId);
    if (!existing) {
      throw new UserManagementError("not_found", "User not found", 404);
    }

    if (input.status === UserStatus.ACTIVE && existing.status !== UserStatus.ACTIVE) {
      try {
        await assertOrganizationCanAddUser(organizationId);
      } catch (err) {
        if (err instanceof PlanLimitError) {
          throw new UserManagementError(err.code, err.message, err.statusCode);
        }
        throw err;
      }
    }

    const firstName = input.firstName ?? existing.firstName;
    const lastName = input.lastName ?? existing.lastName;

    const user = await userRepository.updateOrganizationUser(
      userId,
      organizationId,
      {
        firstName: input.firstName,
        lastName: input.lastName,
        name: fullName(firstName, lastName),
        mobile: input.mobile,
        role: input.role,
        status: input.status,
      },
      {
        designation: input.designation,
        department: input.department,
        employeeCode: input.employeeCode,
        joiningDate:
          input.joiningDate === null
            ? null
            : input.joiningDate
              ? new Date(input.joiningDate)
              : undefined,
      },
    );

    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "user.updated",
      metadata: { targetUserId: userId, changes: input },
    });

    return user;
  },

  async deactivateEmployee(actorId: string, organizationId: string, userId: string) {
    if (actorId === userId) {
      throw new UserManagementError("invalid_action", "You cannot deactivate your own account", 400);
    }
    return this.updateEmployee(actorId, organizationId, userId, {
      status: UserStatus.INACTIVE,
    });
  },

  async activateEmployee(actorId: string, organizationId: string, userId: string) {
    return this.updateEmployee(actorId, organizationId, userId, {
      status: UserStatus.ACTIVE,
    });
  },

  async resetEmployeePassword(actorId: string, organizationId: string, userId: string) {
    const existing = await userRepository.findByIdInOrganization(userId, organizationId);
    if (!existing) {
      throw new UserManagementError("not_found", "User not found", 404);
    }

    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await hashPassword(temporaryPassword);

    await userRepository.updateOrganizationUser(userId, organizationId, {
      passwordHash,
      mustChangePassword: true,
    });

    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "user.password_reset",
      metadata: { targetUserId: userId },
    });

    return { temporaryPassword, email: existing.email };
  },

  async resendInvite(actorId: string, organizationId: string, userId: string) {
    const result = await this.resetEmployeePassword(actorId, organizationId, userId);
    const existing = await userRepository.findByIdInOrganization(userId, organizationId);
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { name: true },
    });
    if (existing && org) {
      await sendInviteEmail(org.name, existing, result.temporaryPassword);
    }
    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "user.invite_resent",
      metadata: { targetUserId: userId },
    });
    return result;
  },

  async forcePasswordChange(actorId: string, organizationId: string, userId: string) {
    const existing = await userRepository.findByIdInOrganization(userId, organizationId);
    if (!existing) {
      throw new UserManagementError("not_found", "User not found", 404);
    }

    await userRepository.updateOrganizationUser(userId, organizationId, {
      mustChangePassword: true,
    });

    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "user.force_password_change",
      metadata: { targetUserId: userId },
    });

    return { ok: true };
  },

  async getLoginHistory(organizationId: string, userId: string) {
    const existing = await userRepository.findByIdInOrganization(userId, organizationId);
    if (!existing) {
      throw new UserManagementError("not_found", "User not found", 404);
    }

    const events = await prisma.tenantAuditLog.findMany({
      where: {
        organizationId,
        userId,
        action: { in: ["auth.login", "auth.logout", "auth.password_changed"] },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return events;
  },
};
