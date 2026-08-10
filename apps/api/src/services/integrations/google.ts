import { IntegrationProvider } from "@lyrus/db";
import {
  getUserIntegration,
  updateIntegrationTokens,
  type StoredIntegration,
} from "./user-integration.repository.js";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
].join(" ");

function googleClientId(): string {
  const id = process.env.GOOGLE_CLIENT_ID;
  if (!id) throw new Error("GOOGLE_CLIENT_ID is not configured");
  return id;
}

function googleClientSecret(): string {
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!secret) throw new Error("GOOGLE_CLIENT_SECRET is not configured");
  return secret;
}

export function isGoogleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim());
}

export function googleOAuthMissingEnv(): string[] {
  const missing: string[] = [];
  if (!process.env.GOOGLE_CLIENT_ID?.trim()) missing.push("GOOGLE_CLIENT_ID");
  if (!process.env.GOOGLE_CLIENT_SECRET?.trim()) missing.push("GOOGLE_CLIENT_SECRET");
  return missing;
}

export function buildGoogleAuthUrl(state: string, redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: googleClientId(),
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_SCOPES,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

async function exchangeGoogleCode(
  code: string,
  redirectUri: string,
): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
}> {
  const body = new URLSearchParams({
    code,
    client_id: googleClientId(),
    client_secret: googleClientSecret(),
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google token exchange failed: ${text}`);
  }
  return res.json() as Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    scope?: string;
  }>;
}

async function refreshGoogleToken(refreshToken: string): Promise<{
  access_token: string;
  expires_in?: number;
}> {
  const body = new URLSearchParams({
    client_id: googleClientId(),
    client_secret: googleClientSecret(),
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google token refresh failed: ${text}`);
  }
  return res.json() as Promise<{ access_token: string; expires_in?: number }>;
}

async function fetchGoogleEmail(accessToken: string): Promise<string | null> {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { email?: string };
  return data.email ?? null;
}

export async function completeGoogleOAuth(
  code: string,
  redirectUri: string,
): Promise<{
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
  scopes: string;
  externalEmail: string | null;
}> {
  const tokens = await exchangeGoogleCode(code, redirectUri);
  const expiresAt = tokens.expires_in
    ? new Date(Date.now() + tokens.expires_in * 1000)
    : null;
  const externalEmail = await fetchGoogleEmail(tokens.access_token);
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token ?? null,
    expiresAt,
    scopes: tokens.scope ?? GOOGLE_SCOPES,
    externalEmail,
  };
}

export async function getValidGoogleAccessToken(
  integration: StoredIntegration,
): Promise<string> {
  const expiresSoon =
    integration.expiresAt != null &&
    integration.expiresAt.getTime() - Date.now() < 60_000;

  if (!expiresSoon) {
    return integration.accessToken;
  }

  if (!integration.refreshToken) {
    throw new Error("Google connection expired — reconnect in Settings → Integrations");
  }

  const refreshed = await refreshGoogleToken(integration.refreshToken);
  const expiresAt = refreshed.expires_in
    ? new Date(Date.now() + refreshed.expires_in * 1000)
    : null;
  await updateIntegrationTokens(integration.id, refreshed.access_token, expiresAt);
  return refreshed.access_token;
}

export async function createGoogleMeetEvent(input: {
  userId: string;
  meetingId: string;
  title: string;
  description: string;
  scheduledAt: Date;
  durationMinutes: number;
  attendees: Array<{ email: string; name: string }>;
}): Promise<{ joinUrl: string; calendarEventId: string }> {
  const integration = await getUserIntegration(input.userId, IntegrationProvider.GOOGLE);
  if (!integration) {
    throw new Error("Connect Google in Settings → Integrations to schedule Google Meet meetings");
  }

  const accessToken = await getValidGoogleAccessToken(integration);
  const end = new Date(input.scheduledAt.getTime() + input.durationMinutes * 60_000);

  const eventBody = {
    summary: input.title,
    description: input.description,
    start: { dateTime: input.scheduledAt.toISOString(), timeZone: "UTC" },
    end: { dateTime: end.toISOString(), timeZone: "UTC" },
    attendees: input.attendees.map((a) => ({ email: a.email, displayName: a.name })),
    conferenceData: {
      createRequest: {
        requestId: input.meetingId,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventBody),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create Google Meet event: ${text}`);
  }

  const event = (await res.json()) as {
    id?: string;
    hangoutLink?: string;
    conferenceData?: {
      entryPoints?: Array<{ entryPointType?: string; uri?: string }>;
    };
  };

  const joinUrl =
    event.hangoutLink ??
    event.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")?.uri;

  if (!joinUrl || !event.id) {
    throw new Error("Google Meet link was not returned — check Calendar API permissions");
  }

  return { joinUrl, calendarEventId: event.id };
}

type GoogleCalendarEvent = {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  iCalUID?: string;
  status?: string;
  organizer?: { email?: string; self?: boolean };
  creator?: { email?: string; self?: boolean };
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  hangoutLink?: string;
  conferenceData?: {
    conferenceId?: string;
    entryPoints?: Array<{ entryPointType?: string; uri?: string; label?: string }>;
    conferenceSolution?: { key?: { type?: string } };
  };
  attendees?: Array<{ email?: string; displayName?: string }>;
};

const MEET_URL_RE = /https?:\/\/meet\.google\.com\/[a-z0-9-]+/i;
const MEET_CODE_RE = /meet\.google\.com\/([a-z0-9-]+)/i;

function normalizeMeetUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith("http")) return trimmed;
  return `https://${trimmed}`;
}

function extractMeetJoinUrl(event: GoogleCalendarEvent): string | null {
  const direct = event.hangoutLink;
  if (direct) return normalizeMeetUrl(direct);

  const conf = event.conferenceData;
  if (conf) {
    const videoUri = conf.entryPoints?.find((e) => e.entryPointType === "video")?.uri;
    if (videoUri) return normalizeMeetUrl(videoUri);
    const labelUri = conf.entryPoints?.find((e) => e.label?.includes("meet.google.com"))?.label;
    if (labelUri) return normalizeMeetUrl(labelUri);
    if (conf.conferenceId && /^[a-z0-9]{3}-[a-z0-9]{4}-[a-z0-9]{3}$/i.test(conf.conferenceId)) {
      return `https://meet.google.com/${conf.conferenceId}`;
    }
  }

  const location = event.location ?? "";
  const locationMatch = location.match(MEET_URL_RE) ?? location.match(MEET_CODE_RE);
  if (locationMatch) {
    return locationMatch[0]!.includes("http")
      ? normalizeMeetUrl(locationMatch[0]!)
      : `https://${locationMatch[0]}`;
  }
  const descMatch =
    (event.description ?? "").match(MEET_URL_RE) ?? (event.description ?? "").match(MEET_CODE_RE);
  if (descMatch) {
    return descMatch[0]!.includes("http")
      ? normalizeMeetUrl(descMatch[0]!)
      : `https://${descMatch[0]}`;
  }
  return null;
}

type GoogleCalendarListEntry = {
  id: string;
  summary: string;
  primary?: boolean;
  selected?: boolean;
  accessRole?: string;
};

function isSystemCalendar(calendar: GoogleCalendarListEntry): boolean {
  const id = calendar.id.toLowerCase();
  const summary = (calendar.summary ?? "").toLowerCase();
  if (id.includes("#contacts@") || id.includes("birthdays@") || id.includes("holiday@")) return true;
  if (summary === "birthdays" || summary.includes("holiday")) return true;
  if (summary === "tasks" || id.includes("@tasks.google.com")) return true;
  return false;
}

/** All calendars the connected account can read (except system/holiday calendars). */
function filterCalendarsForIntegratedAccount(
  calendars: GoogleCalendarListEntry[],
  integratedEmail: string | null,
): GoogleCalendarListEntry[] {
  const email = integratedEmail?.trim().toLowerCase() ?? null;

  const filtered = calendars.filter((calendar) => !isSystemCalendar(calendar));

  // Ensure primary / account calendar is always scanned even if calendarList omits it.
  const hasPrimary = filtered.some(
    (c) => c.primary || (email && c.id.trim().toLowerCase() === email),
  );
  if (!hasPrimary) {
    filtered.unshift({
      id: email ?? "primary",
      summary: "Primary",
      primary: true,
      accessRole: "owner",
    });
  }

  const seen = new Set<string>();
  return filtered.filter((c) => {
    const key = c.id.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function listAccessibleGoogleCalendars(
  accessToken: string,
  integratedEmail: string | null,
): Promise<GoogleCalendarListEntry[]> {
  const res = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Could not access Google Calendar (${res.status}). Disconnect and reconnect Google in Integrations to grant calendar permissions. ${text}`,
    );
  }
  const data = (await res.json()) as { items?: GoogleCalendarListEntry[] };
  const items = Array.isArray(data.items) ? data.items : [];
  const filtered = filterCalendarsForIntegratedAccount(items, integratedEmail);
  if (filtered.length === 0) {
    throw new Error(
      "No writable Google calendars found for this account. Check calendar access for contact@virtualedge.in in Google Calendar.",
    );
  }
  return filtered;
}

function parseEventDateTime(value?: { dateTime?: string; date?: string }): string | null {
  if (value?.dateTime) return value.dateTime;
  if (value?.date) return `${value.date}T00:00:00.000Z`;
  return null;
}

export type GoogleMeetCalendarEvent = {
  eventId: string;
  calendarId: string;
  calendarName: string;
  iCalUID?: string;
  title: string;
  description: string;
  startDateTimeIso: string;
  endDateTimeIso: string;
  joinUrl: string | null;
  importable: boolean;
  attendees: Array<{ name: string; email: string }>;
};

type CalendarFetchDiagnostics = {
  calendarId: string;
  calendarName: string;
  rawEventCount: number;
  meetEventCount: number;
  error?: string;
};

async function fetchEventMeetLink(
  accessToken: string,
  calendarId: string,
  eventId: string,
): Promise<string | null> {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}?conferenceDataVersion=1`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!res.ok) return null;
  const ev = (await res.json()) as GoogleCalendarEvent;
  return extractMeetJoinUrl(ev);
}

async function fetchMeetEventsForCalendar(
  accessToken: string,
  calendar: GoogleCalendarListEntry,
  timeMin: Date,
  timeMax: Date,
  maxResults: number,
): Promise<{ events: GoogleMeetCalendarEvent[]; diagnostics: CalendarFetchDiagnostics }> {
  const params = new URLSearchParams({
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: String(maxResults),
    conferenceDataVersion: "1",
  });

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar.id)}/events?${params.toString()}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!res.ok) {
    const text = await res.text();
    return {
      events: [],
      diagnostics: {
        calendarId: calendar.id,
        calendarName: calendar.summary,
        rawEventCount: 0,
        meetEventCount: 0,
        error: `${res.status}: ${text.slice(0, 200)}`,
      },
    };
  }

  const data = (await res.json()) as { items?: GoogleCalendarEvent[] };
  const items = (Array.isArray(data.items) ? data.items : []).filter(
    (ev) => ev.status !== "cancelled",
  );

  const events: GoogleMeetCalendarEvent[] = [];

  for (const ev of items) {
    const startIso = parseEventDateTime(ev.start);
    const endIso = parseEventDateTime(ev.end);
    if (!startIso || !endIso || !ev.id) continue;

    let joinUrl = extractMeetJoinUrl(ev);
    // List requests already use conferenceDataVersion=1. Avoid per-event detail
    // fetches — they were the main source of sync latency (1 Google API call each).

    const attendees = (ev.attendees ?? [])
      .map((a) => ({
        email: a.email ?? "",
        name: a.displayName ?? a.email ?? "Participant",
      }))
      .filter((a) => Boolean(a.email));

    events.push({
      eventId: ev.id,
      calendarId: calendar.id,
      calendarName: calendar.summary,
      iCalUID: ev.iCalUID,
      title: ev.summary ?? "Calendar event",
      description: ev.description ?? "",
      startDateTimeIso: startIso,
      endDateTimeIso: endIso,
      joinUrl,
      importable: Boolean(joinUrl),
      attendees,
    });
  }

  return {
    events,
    diagnostics: {
      calendarId: calendar.id,
      calendarName: calendar.summary,
      rawEventCount: items.length,
      meetEventCount: events.filter((e) => e.importable).length,
    },
  };
}

export async function listUpcomingGoogleMeetEvents(input: {
  userId: string;
  timeMin: Date;
  timeMax: Date;
  maxResults?: number;
}): Promise<{
  connectedAccountEmail: string | null;
  scopesGranted: string;
  calendarsScanned: Array<{ id: string; name: string; accessRole?: string }>;
  diagnostics: CalendarFetchDiagnostics[];
  events: GoogleMeetCalendarEvent[];
}> {
  const integration = await getUserIntegration(input.userId, IntegrationProvider.GOOGLE);
  if (!integration) {
    throw new Error("Connect Google in Settings → Integrations to import Calendar meetings");
  }

  const integratedEmail = integration.externalEmail;
  const accessToken = await getValidGoogleAccessToken(integration);
  const calendars = await listAccessibleGoogleCalendars(accessToken, integratedEmail);
  const perCalendar = Math.max(15, Math.ceil((input.maxResults ?? 50) / Math.max(calendars.length, 1)));

  const batches = await Promise.all(
    calendars.map((calendar) =>
      fetchMeetEventsForCalendar(accessToken, calendar, input.timeMin, input.timeMax, perCalendar),
    ),
  );

  const diagnostics = batches.map((b) => b.diagnostics);
  const merged = batches.flatMap((b) => b.events);
  const seen = new Set<string>();
  const deduped: GoogleMeetCalendarEvent[] = [];

  for (const ev of merged.sort(
    (a, b) => new Date(a.startDateTimeIso).getTime() - new Date(b.startDateTimeIso).getTime(),
  )) {
    // Deduplicate by calendar event *instance* id only.
    // Recurring series share the same iCalUID across instances — using that key
    // previously dropped every occurrence after the first (so "today" vanished).
    const key = `${ev.calendarId}:${ev.eventId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(ev);
  }

  return {
    connectedAccountEmail: integratedEmail,
    scopesGranted: integration.scopes,
    calendarsScanned: calendars.map((c) => ({
      id: c.id,
      name: c.summary,
      accessRole: c.accessRole,
    })),
    diagnostics,
    events: deduped.slice(0, input.maxResults ?? 50),
  };
}

export async function fetchGoogleCalendarEventById(input: {
  userId: string;
  eventId: string;
  calendarId?: string;
}): Promise<GoogleMeetCalendarEvent> {
  const integration = await getUserIntegration(input.userId, IntegrationProvider.GOOGLE);
  if (!integration) {
    throw new Error("Connect Google in Settings → Integrations to import Calendar meetings");
  }
  const accessToken = await getValidGoogleAccessToken(integration);
  const integratedEmail = integration.externalEmail;

  const tryFetch = async (calendarId: string): Promise<GoogleMeetCalendarEvent | null> => {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(input.eventId)}?conferenceDataVersion=1`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!res.ok) return null;
    const ev = (await res.json()) as GoogleCalendarEvent;
    const joinUrl = extractMeetJoinUrl(ev);
    const startIso = parseEventDateTime(ev.start);
    const endIso = parseEventDateTime(ev.end);
    if (!startIso || !endIso || !ev.id) return null;
    const calendars = await listAccessibleGoogleCalendars(accessToken, integratedEmail);
    const calendarName = calendars.find((c) => c.id === calendarId)?.summary ?? calendarId;
    const attendees = (ev.attendees ?? [])
      .map((a) => ({
        email: a.email ?? "",
        name: a.displayName ?? a.email ?? "Participant",
      }))
      .filter((a) => Boolean(a.email));
    return {
      eventId: ev.id,
      calendarId,
      calendarName,
      iCalUID: ev.iCalUID,
      title: ev.summary ?? "Calendar event",
      description: ev.description ?? "",
      startDateTimeIso: startIso,
      endDateTimeIso: endIso,
      joinUrl,
      importable: Boolean(joinUrl),
      attendees,
    };
  };

  if (input.calendarId) {
    const ev = await tryFetch(input.calendarId);
    if (!ev) {
      throw new Error("Selected calendar event was not found");
    }
    return ev;
  }

  const calendars = await listAccessibleGoogleCalendars(accessToken, integratedEmail);
  for (const calendar of calendars) {
    const ev = await tryFetch(calendar.id);
    if (ev) return ev;
  }

  throw new Error("Selected calendar event was not found");
}
