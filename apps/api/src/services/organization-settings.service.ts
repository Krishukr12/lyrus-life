import type { updateOrganizationSettingsSchema } from "@lyrus/shared";
import type { z } from "zod";
import { organizationRepository } from "../repositories/organization.repository.js";
import { logTenantAudit } from "./tenant-audit.service.js";

export class OrganizationSettingsError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode = 400,
  ) {
    super(message);
  }
}

export const organizationSettingsService = {
  async getSettings(organizationId: string) {
    const org = await organizationRepository.findById(organizationId);
    if (!org) {
      throw new OrganizationSettingsError("not_found", "Organization not found", 404);
    }
    return org;
  },

  async updateSettings(
    actorId: string,
    organizationId: string,
    input: z.infer<typeof updateOrganizationSettingsSchema>,
  ) {
    const org = await organizationRepository.findById(organizationId);
    if (!org) {
      throw new OrganizationSettingsError("not_found", "Organization not found", 404);
    }

    const updated = await organizationRepository.update(organizationId, {
      name: input.name,
      legalName: input.legalName,
      primaryContactName: input.primaryContactName,
      industry: input.industry,
      logoUrl: input.logoUrl,
      email: input.email?.toLowerCase(),
      phone: input.phone,
      website: input.website,
      companySize: input.companySize,
      country: input.country,
      state: input.state,
      city: input.city,
      address: input.address,
      timezone: input.timezone,
      meetingDefaultDurationMinutes: input.meetingDefaultDurationMinutes,
    });

    await logTenantAudit({
      organizationId,
      userId: actorId,
      action: "organization.settings_updated",
      metadata: { changes: input },
    });

    return updated;
  },
};
