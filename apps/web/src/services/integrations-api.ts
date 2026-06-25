import type { UserIntegrationStatus } from "@lyrus/shared";
import { request } from "@/lib/api";

export interface IntegrationsResponse {
  config: {
    google: { configured: boolean };
    microsoft: { configured: boolean };
  };
  integrations: UserIntegrationStatus[];
}

export async function getMyIntegrations(): Promise<IntegrationsResponse> {
  return request<IntegrationsResponse>("/users/me/integrations");
}

export async function startIntegrationConnect(
  provider: "google" | "microsoft",
): Promise<{ authUrl: string }> {
  return request<{ authUrl: string }>(`/users/me/integrations/${provider}/connect`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function disconnectIntegration(provider: "google" | "microsoft"): Promise<void> {
  await request<void>(`/users/me/integrations/${provider}`, { method: "DELETE" });
}

export type CalendarMeetEvent = {
  eventId: string;
  calendarId: string;
  calendarName: string;
  title: string;
  description: string;
  startDateTimeIso: string;
  endDateTimeIso: string;
  joinUrl: string | null;
  importable: boolean;
  attendees: Array<{ name: string; email: string }>;
};

export type CalendarFetchDiagnostics = {
  calendarId: string;
  calendarName: string;
  rawEventCount: number;
  meetEventCount: number;
  error?: string;
};

export async function listGoogleCalendarMeetEvents(
  days = 14,
  pastDays = 30,
): Promise<{
  connectedAccountEmail: string | null;
  scopesGranted?: string;
  calendarsScanned?: Array<{ id: string; name: string; accessRole?: string }>;
  diagnostics?: CalendarFetchDiagnostics[];
  events: CalendarMeetEvent[];
  syncSummary?: { imported: number; skipped: number };
}> {
  return request<{
    connectedAccountEmail: string | null;
    scopesGranted?: string;
    calendarsScanned?: Array<{ id: string; name: string; accessRole?: string }>;
    diagnostics?: CalendarFetchDiagnostics[];
    events: CalendarMeetEvent[];
    syncSummary?: { imported: number; skipped: number };
  }>(`/users/me/calendar/google/events?days=${days}&pastDays=${pastDays}&autoSync=1`);
}

export async function syncGoogleCalendarMeetings(): Promise<{
  connectedAccountEmail: string | null;
  imported: number;
  skipped: number;
  meetingIds: string[];
}> {
  return request(`/users/me/calendar/google/sync`, { method: "POST", body: JSON.stringify({}) });
}

export async function updateGoogleIntegrationPreferences(preferences: {
  autoImportGoogleCalendar: boolean;
}): Promise<{ preferences: { autoImportGoogleCalendar?: boolean } }> {
  return request(`/users/me/integrations/google/preferences`, {
    method: "PATCH",
    body: JSON.stringify(preferences),
  });
}

export async function importGoogleCalendarMeetEvent(
  eventId: string,
  calendarId: string,
): Promise<{ meeting: unknown }> {
  return request<{ meeting: unknown }>(
    `/users/me/calendar/google/events/${encodeURIComponent(eventId)}/import`,
    { method: "POST", body: JSON.stringify({ calendarId }) },
  );
}
