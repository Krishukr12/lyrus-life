import { OrganizationInvitationStatus, UserStatus, prisma } from "@lyrus/db";
import { sendUserInvitationEmail } from "@lyrus/notifications";
import { addDays } from "date-fns";
import type { inviteOrgUserSchema } from "@lyrus/shared";
import type { z } from "zod";
import { generateInviteToken, hashInviteToken } from "../lib/invite-token.js";
import {
  assertOrganizationCanAddUser,
  countActiveOrganizationSeats,
  getIncludedSeats,
  PlanLimitError,
} from "../lib/plan-limits.js";
import { invitationRepository } from "../repositories/invitation.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import {
  buildSeatBillingPreview,
  recordSeatChangeEvent,
} from "./seat-billing.service.js";
import { logTenantAudit } from "./tenant-audit.service.js";
import { fullName } from "../utils/user-name.js";
import { hashPassword } from "../utils/password.js";

const INVITE_EXPIRY_DAYS = 7;

export class InvitationError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 400,
    public preview?: Awaited<ReturnType<typeof buildSeatBillingPreview>>,
  ) {
    super(message);
  }
}

function inviteAcceptUrl(token: string): string {
  const webAppUrl = process.env.WEB_APP_URL ?? "http://localhost:8080";
  return `${webAppUrl}/auth/accept-invite?token=${encodeURIComponent(token)}`;
}

export const invitationService = {
  async getBillingPreview(organizationId: string, seatsToAdd = 1) {
    return buildSeatBillingPreview(organizationId, seatsToAdd);
  },

  async listInvitations(organizationId: string) {
    await invitationRepository.expireStaleInvitations();
    const [pending, accepted] = await Promise.all([
      invitationRepository.listOrganizationInvitations(
        organizationId,
        OrganizationInvitationStatus.PENDING,
      ),
      invitationRepository.listOrganizationInvitations(
        organizationId,
        OrganizationInvitationStatus.ACCEPTED,
      ),
    ]);
    const now = new Date();
    return {
      pending: pending.filter((i) => i.expiresAt > now),
      accepted: accepted.slice(0, 20),
    };
  },

  async inviteUser(
    actorId: string,
    organizationId: string,
    input: z.infer<typeof inviteOrgUserSchema>,
  ) {
    try {
      await assertOrganizationCanAddUser(organizationId);
    } catch (err) {
      if (err instanceof PlanLimitError) {
        throw new InvitationError(err.code, err.message, err.statusCode);
      }
      throw err;
    }

    const email = input.email.toLowerCase();
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new InvitationError("email_taken", "Email is already registered", 409);
    }

    const existingInvite = await invitationRepository.findPendingByEmail(organizationId, email);
    if (existingInvite) {
      throw new InvitationError(
        "invite_pending",
        "A pending invitation already exists for this email",
        409,
      );
    }

    const preview = await buildSeatBillingPreview(organizationId, 1);
    if (preview.requiresConfirmation && !input.confirmAdditionalSeats) {
      throw new InvitationError(
        "seat_limit_confirmation_required",
        "Adding this user will exceed your included seats. Confirmation required.",
        402,
        preview,
      );
    }

    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { name: true },
    });
    if (!org) {
      throw new InvitationError("not_found", "Organization not found", 404);
    }

    const { token, tokenHash } = generateInviteToken();
    const expiresAt = addDays(new Date(), INVITE_EXPIRY_DAYS);

    const invitation = await invitationRepository.createInvitation({
      organizationId,
      email,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      tokenHash,
      invitedById: actorId,
      expiresAt,
      mobile: input.mobile,
      designation: input.designation,
      department: input.department,
    });

    try {
      await sendUserInvitationEmail({
        to: email,
        name: fullName(input.firstName, input.lastName),
        organizationName: org.name,
        inviteUrl: inviteAcceptUrl(token),
        role: input.role,
        expiresAt,
      });
    } catch (err) {
      console.warn("Failed to send invitation email", err);
    }

    const activeSeats = await countActiveOrganizationSeats(organizationId);
    const includedSeats = getIncludedSeats(
      (await prisma.organization.findUnique({
        where: { id: organizationId },
        select: { subscriptionPlan: true },
      }))!.subscriptionPlan as "STARTER" | "PROFESSIONAL" | "ENTERPRISE",
    );

    await recordSeatChangeEvent(organizationId, actorId, {
      action: "invitation.sent",
      activeSeats,
      includedSeats,
      additionalSeats: Math.max(0, activeSeats + 1 - includedSeats),
      targetEmail: email,
    });

    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "invitation.sent",
      metadata: { invitationId: invitation.id, email, role: input.role },
    });

    return { invitation, billingPreview: preview };
  },

  async resendInvitation(actorId: string, organizationId: string, invitationId: string) {
    await invitationRepository.expireStaleInvitations();
    const invitations = await invitationRepository.listOrganizationInvitations(organizationId);
    const invitation = invitations.find((i) => i.id === invitationId);
    if (!invitation || invitation.status !== OrganizationInvitationStatus.PENDING) {
      throw new InvitationError("not_found", "Pending invitation not found", 404);
    }

    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { name: true },
    });
    if (!org) {
      throw new InvitationError("not_found", "Organization not found", 404);
    }

    const { token, tokenHash } = generateInviteToken();
    const expiresAt = addDays(new Date(), INVITE_EXPIRY_DAYS);
    await invitationRepository.updateToken(invitation.id, tokenHash, expiresAt);

    try {
      await sendUserInvitationEmail({
        to: invitation.email,
        name: fullName(invitation.firstName, invitation.lastName),
        organizationName: org.name,
        inviteUrl: inviteAcceptUrl(token),
        role: invitation.role,
        expiresAt,
      });
    } catch (err) {
      console.warn("Failed to resend invitation email", err);
    }

    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "invitation.resent",
      metadata: { invitationId },
    });

    return { ok: true };
  },

  async cancelInvitation(actorId: string, organizationId: string, invitationId: string) {
    const result = await invitationRepository.cancelInvitation(invitationId, organizationId);
    if (result.count === 0) {
      throw new InvitationError("not_found", "Pending invitation not found", 404);
    }

    const activeSeats = await countActiveOrganizationSeats(organizationId);
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { subscriptionPlan: true },
    });
    const includedSeats = getIncludedSeats(
      org!.subscriptionPlan as "STARTER" | "PROFESSIONAL" | "ENTERPRISE",
    );

    await recordSeatChangeEvent(organizationId, actorId, {
      action: "invitation.cancelled",
      activeSeats,
      includedSeats,
      additionalSeats: Math.max(0, activeSeats - includedSeats),
    });

    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "invitation.cancelled",
      metadata: { invitationId },
    });

    return { ok: true };
  },

  async getInvitationByToken(token: string) {
    await invitationRepository.expireStaleInvitations();
    const invitation = await invitationRepository.findByTokenHash(hashInviteToken(token));
    if (!invitation) {
      throw new InvitationError("invalid_token", "Invitation not found or expired", 404);
    }
    if (invitation.status !== OrganizationInvitationStatus.PENDING) {
      throw new InvitationError("invalid_token", "This invitation is no longer valid", 400);
    }
    if (invitation.expiresAt < new Date()) {
      throw new InvitationError("expired", "This invitation has expired", 410);
    }

    return {
      email: invitation.email,
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      role: invitation.role,
      organizationName: invitation.organization.name,
      invitedBy: invitation.invitedBy.name,
      expiresAt: invitation.expiresAt.toISOString(),
    };
  },

  async acceptInvitation(token: string, password: string) {
    await invitationRepository.expireStaleInvitations();
    const invitation = await invitationRepository.findByTokenHash(hashInviteToken(token));
    if (!invitation) {
      throw new InvitationError("invalid_token", "Invitation not found or expired", 404);
    }
    if (invitation.status !== OrganizationInvitationStatus.PENDING) {
      throw new InvitationError("invalid_token", "This invitation is no longer valid", 400);
    }
    if (invitation.expiresAt < new Date()) {
      throw new InvitationError("expired", "This invitation has expired", 410);
    }

    const existingUser = await userRepository.findByEmail(invitation.email);
    if (existingUser) {
      throw new InvitationError("email_taken", "Email is already registered", 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await userRepository.createOrganizationUser({
      organization: { connect: { id: invitation.organizationId } },
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      name: fullName(invitation.firstName, invitation.lastName),
      email: invitation.email,
      mobile: invitation.mobile,
      passwordHash,
      role: invitation.role,
      status: UserStatus.ACTIVE,
      mustChangePassword: false,
      emailVerifiedAt: new Date(),
      invitedBy: { connect: { id: invitation.invitedById } },
      employeeProfile: {
        designation: invitation.designation,
        department: invitation.department,
      },
    });

    await invitationRepository.markAccepted(invitation.id, user.id);

    const activeSeats = await countActiveOrganizationSeats(invitation.organizationId);
    const org = await prisma.organization.findUnique({
      where: { id: invitation.organizationId },
      select: { subscriptionPlan: true },
    });
    const includedSeats = getIncludedSeats(
      org!.subscriptionPlan as "STARTER" | "PROFESSIONAL" | "ENTERPRISE",
    );

    await recordSeatChangeEvent(invitation.organizationId, user.id, {
      action: "invitation.accepted",
      activeSeats,
      includedSeats,
      additionalSeats: Math.max(0, activeSeats - includedSeats),
      targetUserId: user.id,
      targetEmail: invitation.email,
    });

    await logTenantAudit({
      organizationId: invitation.organizationId,
      userId: user.id,
      action: "invitation.accepted",
      metadata: { invitationId: invitation.id },
    });

    return {
      user,
      organization: invitation.organization,
    };
  },
};
