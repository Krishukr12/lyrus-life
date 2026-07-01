import { Router } from "express";
import { integrationPreferencesSchema, integrationProviderSchema } from "@lyrus/shared";
import { requireAuthUser } from "../middleware/authenticate.js";
import { asyncHandler } from "../lib/http.js";
import {
  disconnectIntegration,
  getIntegrationsConfig,
  handleIntegrationCallback,
  listIntegrationStatuses,
  startIntegrationConnect,
  updateGoogleIntegrationPreferences,
} from "../services/integrations/index.js";
import { webIntegrationsRedirect } from "../services/integrations/oauth-state.js";
import { processRecallWebhook } from "../services/recording-bot/index.js";
import { prisma } from "@lyrus/db";
import { fetchGoogleCalendarEventById, listUpcomingGoogleMeetEvents } from "../services/integrations/google.js";
import { isRecallConfigured } from "../services/recording-bot/recall.js";
import { mapMeeting } from "../lib/mappers.js";
import { requireRouteParam } from "../lib/route-params.js";
import {
  importGoogleCalendarEventForUser,
  syncGoogleCalendarMeetingsToPlatform,
} from "../services/integrations/calendar-import.service.js";
import { getUserIntegration } from "../services/integrations/user-integration.repository.js";
import { IntegrationProvider } from "@lyrus/db";
import {
  googleAutoImportEnabled,
  parseIntegrationPreferences,
} from "../services/integrations/integration-preferences.js";

const meetingInclude = {
  participants: true,
  invites: { orderBy: { sentAt: "desc" as const } },
  transcript: { include: { segments: true } },
  mom: true,
} as const;

export function createIntegrationsRouter(): Router {
  const router = Router();

  router.get(
    "/users/me/integrations",
    asyncHandler(async (req, res) => {
      const user = requireAuthUser(req);
      const integrations = await listIntegrationStatuses(user.id);
      res.json({
        config: getIntegrationsConfig(),
        integrations,
      });
    }),
  );

  router.post(
    "/users/me/integrations/:provider/connect",
    asyncHandler(async (req, res) => {
      const user = requireAuthUser(req);
      const parsed = integrationProviderSchema.safeParse(req.params.provider);
      if (!parsed.success) {
        res.status(400).json({ error: "invalid_provider" });
        return;
      }
      const { authUrl } = await startIntegrationConnect(user.id, parsed.data, req);
      res.json({ authUrl });
    }),
  );

  router.delete(
    "/users/me/integrations/:provider",
    asyncHandler(async (req, res) => {
      const user = requireAuthUser(req);
      const parsed = integrationProviderSchema.safeParse(req.params.provider);
      if (!parsed.success) {
        res.status(400).json({ error: "invalid_provider" });
        return;
      }
      await disconnectIntegration(user.id, parsed.data);
      res.status(204).end();
    }),
  );

  router.patch(
    "/users/me/integrations/google/preferences",
    asyncHandler(async (req, res) => {
      const user = requireAuthUser(req);
      const parsed = integrationPreferencesSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
      }
      const preferences = await updateGoogleIntegrationPreferences(user.id, parsed.data);
      res.json({ preferences });
    }),
  );

  // Calendar import (Google) — list events with Meet links across all accessible calendars.
  router.get(
    "/users/me/calendar/google/events",
    asyncHandler(async (req, res) => {
      const user = requireAuthUser(req);
      const now = new Date();
      const days = typeof req.query.days === "string" ? Number(req.query.days) : 14;
      const pastDays = typeof req.query.pastDays === "string" ? Number(req.query.pastDays) : 30;
      const futureDays = Number.isFinite(days) ? days : 14;
      const lookbackDays = Number.isFinite(pastDays) ? pastDays : 7;
      const timeMin = new Date(now.getTime() - lookbackDays * 24 * 60 * 60 * 1000);
      const timeMax = new Date(now.getTime() + futureDays * 24 * 60 * 60 * 1000);
      const result = await listUpcomingGoogleMeetEvents({
        userId: user.id,
        timeMin,
        timeMax,
        maxResults: 50,
      });

      const integration = await getUserIntegration(user.id, IntegrationProvider.GOOGLE);
      const prefs = parseIntegrationPreferences(integration?.preferences);
      const autoSync = req.query.autoSync !== "0" && googleAutoImportEnabled(prefs);

      let syncSummary: { imported: number; skipped: number } | undefined;
      if (autoSync && isRecallConfigured() && result.events.some((e) => e.importable)) {
        syncSummary = await syncGoogleCalendarMeetingsToPlatform(
          { id: user.id, name: user.name, email: user.email },
          result.events,
        );
      }

      res.json({ ...result, syncSummary });
    }),
  );

  router.post(
    "/users/me/calendar/google/sync",
    asyncHandler(async (req, res) => {
      const user = requireAuthUser(req);
      if (!isRecallConfigured()) {
        res.status(503).json({
          error: "recording_not_configured",
          message: "Automated recording is not configured (RECALL_API_KEY).",
        });
        return;
      }

      const now = new Date();
      const result = await listUpcomingGoogleMeetEvents({
        userId: user.id,
        timeMin: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        timeMax: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        maxResults: 50,
      });

      const syncSummary = await syncGoogleCalendarMeetingsToPlatform(
        { id: user.id, name: user.name, email: user.email },
        result.events,
      );

      res.json({
        connectedAccountEmail: result.connectedAccountEmail,
        ...syncSummary,
      });
    }),
  );

  // Import a Google Calendar event into Meeting Desk AI (creates a Meeting + schedules Recall bot).
  router.post(
    "/users/me/calendar/google/events/:eventId/import",
    asyncHandler(async (req, res) => {
      const user = requireAuthUser(req);
      const eventId = requireRouteParam(req.params.eventId, "eventId");
      const body = (req.body ?? {}) as { calendarId?: unknown };
      const calendarId = typeof body.calendarId === "string" ? body.calendarId : undefined;
      if (!isRecallConfigured()) {
        res.status(503).json({
          error: "recording_not_configured",
          message:
            "Automated recording is not configured (RECALL_API_KEY). Contact your administrator.",
        });
        return;
      }

      const ev = await fetchGoogleCalendarEventById({ userId: user.id, eventId, calendarId });
      if (!ev.joinUrl) {
        res.status(400).json({
          error: "no_meet_link",
          message: "This calendar event does not have a Google Meet link to track.",
        });
        return;
      }

      const { meeting } = await importGoogleCalendarEventForUser(
        { id: user.id, name: user.name, email: user.email },
        ev,
      );

      const refreshed = await prisma.meeting.findUnique({
        where: { id: meeting.id },
        include: meetingInclude,
      });
      res.json({ meeting: mapMeeting(refreshed as any) });
    }),
  );

  return router;
}

export function createIntegrationCallbacksRouter(): Router {
  const router = Router();

  router.get(
    "/integrations/:provider/callback",
    asyncHandler(async (req, res) => {
      const parsed = integrationProviderSchema.safeParse(req.params.provider);
      if (!parsed.success) {
        res.redirect(webIntegrationsRedirect("?error=invalid_provider"));
        return;
      }

      const code = typeof req.query.code === "string" ? req.query.code : null;
      const state = typeof req.query.state === "string" ? req.query.state : null;
      const oauthError = typeof req.query.error === "string" ? req.query.error : null;

      if (oauthError || !code || !state) {
        res.redirect(webIntegrationsRedirect(`?error=${oauthError ?? "oauth_failed"}`));
        return;
      }

      try {
        await handleIntegrationCallback(parsed.data, code, state, req);
        res.redirect(webIntegrationsRedirect(`?connected=${parsed.data}`));
      } catch (err) {
        const message = err instanceof Error ? err.message : "oauth_failed";
        res.redirect(webIntegrationsRedirect(`?error=${encodeURIComponent(message)}`));
      }
    }),
  );

  return router;
}

export function createWebhooksRouter(): Router {
  const router = Router();

  router.post(
    "/webhooks/recall",
    asyncHandler(async (req, res) => {
      await processRecallWebhook(req.body);
      res.json({ ok: true });
    }),
  );

  return router;
}
