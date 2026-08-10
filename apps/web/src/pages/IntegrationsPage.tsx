import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  disconnectIntegration,
  getMyIntegrations,
  startIntegrationConnect,
  updateGoogleIntegrationPreferences,
} from "@/services/integrations-api";
import { Loader2, Link2, Unlink } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const PROVIDERS = [
  {
    id: "google" as const,
    name: "Google Meet",
    description: "Schedule meetings on Google Meet and import calendar events for automatic recording.",
    configKey: "google" as const,
  },
  {
    id: "microsoft" as const,
    name: "Microsoft Teams",
    description: "Schedule meetings on Microsoft Teams using your Microsoft account.",
    configKey: "microsoft" as const,
  },
];

export default function IntegrationsPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["user", "integrations"],
    queryFn: getMyIntegrations,
  });

  useEffect(() => {
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");
    if (connected) {
      toast.success(`${connected === "google" ? "Google" : "Microsoft"} connected`);
      void queryClient.invalidateQueries({ queryKey: ["user", "integrations"] });
      setSearchParams({}, { replace: true });
    } else if (error) {
      toast.error(decodeURIComponent(error));
      setSearchParams({}, { replace: true });
    }
  }, [queryClient, searchParams, setSearchParams]);

  const connect = useMutation({
    mutationFn: async (provider: "google" | "microsoft") => {
      const { authUrl } = await startIntegrationConnect(provider);
      window.location.href = authUrl;
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const disconnect = useMutation({
    mutationFn: disconnectIntegration,
    onSuccess: () => {
      toast.success("Disconnected");
      void queryClient.invalidateQueries({ queryKey: ["user", "integrations"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateGooglePrefs = useMutation({
    mutationFn: updateGoogleIntegrationPreferences,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["user", "integrations"] });
      toast.success("Google Calendar preference saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <div className="h-8 w-64 rounded-lg bg-muted animate-pulse" />
        <div className="h-48 rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-7">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Account</p>
        <h1 className="text-[26px] leading-tight font-heading font-bold mt-1">
          <span className="text-gradient">Integrations</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Connect your Google or Microsoft account (e.g. contact@virtualedge.in). Calendar Meet events
          can flow into Meeting Desk AI automatically for recording, MOM, and approval — even when you
          join from Google Calendar directly.
        </p>
      </div>

      <div className="space-y-4">
        {PROVIDERS.map((provider) => {
          const status = data?.integrations.find((i) => i.provider === provider.id);
          const serverConfigured = data?.config[provider.configKey]?.configured ?? false;
          const connected = status?.connected ?? false;

          return (
            <Card key={provider.id} className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading font-semibold">{provider.name}</h2>
                    {connected ? (
                      <Badge variant="secondary" className="text-[10px]">Connected</Badge>
                    ) : !serverConfigured && provider.id === "microsoft" ? (
                      <Badge variant="outline" className="text-[10px]">Coming soon</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">Not connected</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{provider.description}</p>
                  {connected && status?.externalEmail ? (
                    <p className="text-xs text-muted-foreground mt-2">{status.externalEmail}</p>
                  ) : null}
                  {connected && provider.id === "google" ? (
                    <div className="mt-4 flex items-start justify-between gap-4 rounded-lg border bg-muted/30 p-3">
                      <div className="space-y-1">
                        <Label htmlFor={`auto-import-${provider.id}`} className="text-sm font-medium">
                          Auto-track Google Calendar meetings
                        </Label>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          All Meet events on this account are imported into Meeting Desk AI with a
                          recording bot — you can still join from Google Calendar; the platform handles
                          the rest.
                        </p>
                      </div>
                      <Switch
                        id={`auto-import-${provider.id}`}
                        checked={status?.preferences?.autoImportGoogleCalendar !== false}
                        disabled={updateGooglePrefs.isPending}
                        onCheckedChange={(checked) =>
                          void updateGooglePrefs.mutate({ autoImportGoogleCalendar: checked })
                        }
                      />
                    </div>
                  ) : null}
                </div>
                <div className="shrink-0">
                  {connected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      disabled={disconnect.isPending}
                      onClick={() => void disconnect.mutate(provider.id)}
                    >
                      {disconnect.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Unlink className="h-3.5 w-3.5" />
                      )}
                      Disconnect
                    </Button>
                  ) : !serverConfigured && provider.id === "microsoft" ? (
                    <Button size="sm" variant="outline" disabled>
                      Coming soon
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="gap-1.5"
                      disabled={!serverConfigured || connect.isPending}
                      onClick={() => void connect.mutate(provider.id)}
                    >
                      {connect.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Link2 className="h-3.5 w-3.5" />
                      )}
                      Connect
                    </Button>
                  )}
                </div>
              </div>
              {!serverConfigured && provider.id === "google" ? (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Not configured on this server — set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the
                  API .env, then restart the API.
                  {data?.config.google?.missingEnv?.length ? (
                    <>
                      {" "}
                      Missing:{" "}
                      <code className="text-[11px]">{data.config.google.missingEnv.join(", ")}</code>
                    </>
                  ) : null}
                </p>
              ) : null}
              {!serverConfigured && provider.id === "microsoft" ? (
                <p className="text-xs text-muted-foreground">
                  We&apos;re working on Microsoft Teams integration — stay tuned.
                </p>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
