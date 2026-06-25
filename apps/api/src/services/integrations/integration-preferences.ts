import type { IntegrationPreferences } from "@lyrus/shared";

export const DEFAULT_GOOGLE_INTEGRATION_PREFERENCES: IntegrationPreferences = {
  autoImportGoogleCalendar: true,
};

export function parseIntegrationPreferences(raw: unknown): IntegrationPreferences {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_GOOGLE_INTEGRATION_PREFERENCES };
  }
  const obj = raw as Record<string, unknown>;
  return {
    autoImportGoogleCalendar:
      typeof obj.autoImportGoogleCalendar === "boolean"
        ? obj.autoImportGoogleCalendar
        : DEFAULT_GOOGLE_INTEGRATION_PREFERENCES.autoImportGoogleCalendar,
  };
}

export function googleAutoImportEnabled(preferences: IntegrationPreferences | undefined): boolean {
  return preferences?.autoImportGoogleCalendar !== false;
}
