import { BillingStatus, OrganizationStatus, UserRole, UserStatus, prisma } from "@lyrus/db";
import { sendOrgAdminWelcomeEmail } from "@lyrus/notifications";
import type { createOrganizationSchema, updateOrganizationSchema } from "@lyrus/shared";
import type { z } from "zod";
import { organizationRepository } from "../repositories/organization.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { logTenantAudit } from "./tenant-audit.service.js";
import { generateTemporaryPassword } from "../utils/slug.js";
import { fullName } from "../utils/user-name.js";
import { hashPassword } from "../utils/password.js";
import { momTemplateService } from "./mom-template.service.js";
import { billingService } from "./billing.service.js";
import { billingRepository } from "../repositories/billing.repository.js";

export class OrganizationServiceError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 400,
  ) {
    super(message);
  }
}

async function cascadeSuspendOrganization(organizationId: string) {
  await prisma.user.updateMany({
    where: { organizationId },
    data: { status: UserStatus.SUSPENDED },
  });
}

async function cascadeActivateOrganization(organizationId: string) {
  await prisma.user.updateMany({
    where: { organizationId, status: UserStatus.SUSPENDED },
    data: { status: UserStatus.ACTIVE },
  });
}

export const organizationService = {
  async createOrganization(
    actorId: string,
    input: z.infer<typeof createOrganizationSchema>,
  ) {
    const slug = input.slug.toLowerCase();
    const code = input.code.toUpperCase();

    const [existingSlug, existingCode] = await Promise.all([
      organizationRepository.findBySlug(slug),
      organizationRepository.findByCode(code),
    ]);
    if (existingSlug) {
      throw new OrganizationServiceError("slug_taken", "Organization slug is already in use", 409);
    }
    if (existingCode) {
      throw new OrganizationServiceError("code_taken", "Organization code is already in use", 409);
    }

    const adminEmail = input.adminEmail.toLowerCase();
    const existingUser = await userRepository.findByEmail(adminEmail);
    if (existingUser) {
      throw new OrganizationServiceError(
        "admin_email_taken",
        "Admin email is already registered",
        409,
      );
    }

    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await hashPassword(temporaryPassword);

    const orgStatus = input.status ?? OrganizationStatus.ACTIVE;
    const billingStatus =
      orgStatus === OrganizationStatus.PENDING ? BillingStatus.PENDING : BillingStatus.ACTIVE;

    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: input.name,
          code,
          slug,
          legalName: input.legalName,
          primaryContactName: input.primaryContactName,
          industry: input.industry,
          email: input.email.toLowerCase(),
          phone: input.phone,
          website: input.website || null,
          companySize: input.companySize,
          country: input.country,
          state: input.state,
          city: input.city,
          address: input.address,
          timezone: input.timezone ?? "Asia/Kolkata",
          subscriptionPlan: input.subscriptionPlan,
          status: orgStatus,
        },
      });

      await tx.organizationBilling.create({
        data: {
          organizationId: organization.id,
          billingStatus,
          billingCycle: input.billingCycle ?? "monthly",
          billingEmail: adminEmail,
        },
      });

      const admin = await tx.user.create({
        data: {
          organizationId: organization.id,
          firstName: input.adminFirstName,
          lastName: input.adminLastName,
          name: fullName(input.adminFirstName, input.adminLastName),
          email: adminEmail,
          mobile: input.adminPhone || null,
          passwordHash,
          role: UserRole.ORG_ADMIN,
          status: UserStatus.ACTIVE,
          mustChangePassword: true,
        },
      });

      await tx.tenantAuditLog.create({
        data: {
          organizationId: organization.id,
          userId: actorId,
          action: "organization.created",
          metadata: {
            organizationId: organization.id,
            code: organization.code,
            slug: organization.slug,
            adminUserId: admin.id,
          },
        },
      });

      return { organization, admin };
    });

    const webAppUrl = process.env.WEB_APP_URL ?? "http://localhost:8080";
    if (input.momTemplates?.templates?.length) {
      await momTemplateService.provisionOnboardingTemplates(
        actorId,
        result.organization.id,
        input.momTemplates.templates,
        input.momTemplates.defaultTemplateIndex ?? 0,
      );
    }

    const pricing = await billingRepository.getPricingConfig();
    if (orgStatus === OrganizationStatus.ACTIVE && pricing.freeTrialDays > 0) {
      await billingService.startTrial(
        result.organization.id,
        pricing.freeTrialDays,
        actorId,
      );
    } else if (orgStatus === OrganizationStatus.ACTIVE) {
      await billingRepository.upsertOrganizationBilling(result.organization.id, {
        billingStatus: BillingStatus.ACTIVE,
      });
      await billingService.initializeBillingPeriod(
        result.organization.id,
        input.billingCycle ?? "monthly",
      );
    }

    try {
      await sendOrgAdminWelcomeEmail({
        to: result.admin.email,
        name: result.admin.name,
        organizationName: result.organization.name,
        temporaryPassword,
        loginUrl: `${webAppUrl}/login`,
      });
    } catch (err) {
      console.warn("Failed to send org admin welcome email", err);
    }

    const organization = await organizationRepository.findById(result.organization.id);

    return {
      organization: organization ?? result.organization,
      admin: result.admin,
      temporaryPassword,
    };
  },

  async updateOrganization(
    actorId: string,
    organizationId: string,
    input: z.infer<typeof updateOrganizationSchema>,
  ) {
    const org = await organizationRepository.findById(organizationId);
    if (!org) {
      throw new OrganizationServiceError("not_found", "Organization not found", 404);
    }

    const updated = await organizationRepository.update(organizationId, {
      name: input.name,
      legalName: input.legalName,
      primaryContactName: input.primaryContactName,
      industry: input.industry,
      email: input.email?.toLowerCase(),
      phone: input.phone,
      website: input.website,
      companySize: input.companySize,
      country: input.country,
      state: input.state,
      city: input.city,
      address: input.address,
      timezone: input.timezone,
      subscriptionPlan: input.subscriptionPlan,
      status: input.status,
    });

    if (input.status === OrganizationStatus.SUSPENDED && org.status !== OrganizationStatus.SUSPENDED) {
      await cascadeSuspendOrganization(organizationId);
    }
    if (input.status === OrganizationStatus.ACTIVE && org.status !== OrganizationStatus.ACTIVE) {
      await cascadeActivateOrganization(organizationId);
    }

    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "organization.updated",
      metadata: { organizationId, changes: input },
    });

    return updated;
  },

  async activateOrganization(actorId: string, organizationId: string) {
    const org = await organizationRepository.findById(organizationId);
    if (!org) {
      throw new OrganizationServiceError("not_found", "Organization not found", 404);
    }

    const updated = await organizationRepository.setStatus(
      organizationId,
      OrganizationStatus.ACTIVE,
    );
    await cascadeActivateOrganization(organizationId);
    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "organization.activated",
      metadata: { organizationId },
    });
    return updated;
  },

  async suspendOrganization(actorId: string, organizationId: string) {
    const org = await organizationRepository.findById(organizationId);
    if (!org) {
      throw new OrganizationServiceError("not_found", "Organization not found", 404);
    }

    const updated = await organizationRepository.setStatus(
      organizationId,
      OrganizationStatus.SUSPENDED,
    );
    await cascadeSuspendOrganization(organizationId);
    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "organization.suspended",
      metadata: { organizationId },
    });
    return updated;
  },
};
