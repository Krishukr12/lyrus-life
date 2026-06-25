import { z } from "zod";

export const meetingPlatformSchema = z.enum([
  "lyrus",
  "google_meet",
  "microsoft_teams",
]);

export type MeetingPlatformInput = z.infer<typeof meetingPlatformSchema>;

export const integrationProviderSchema = z.enum(["google", "microsoft"]);

export type IntegrationProviderInput = z.infer<typeof integrationProviderSchema>;

export const userIntegrationStatusSchema = z.object({
  provider: integrationProviderSchema,
  connected: z.boolean(),
  externalEmail: z.string().nullable(),
  connectedAt: z.string().nullable(),
  preferences: z
    .object({
      autoImportGoogleCalendar: z.boolean().optional(),
    })
    .optional(),
});

export const integrationPreferencesSchema = z.object({
  autoImportGoogleCalendar: z.boolean().optional(),
});

export type IntegrationPreferences = z.infer<typeof integrationPreferencesSchema>;

export type UserIntegrationStatus = z.infer<typeof userIntegrationStatusSchema>;
