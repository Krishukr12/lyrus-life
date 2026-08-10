import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

/**
 * Google/Microsoft sometimes redirect to the web app (app.meetingdesk.in) instead of the API.
 * Forward the OAuth code to the API callback so the integration can complete.
 */
export default function OAuthIntegrationCallbackBridge() {
  const { provider } = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams();
  const [failed, setFailed] = useState(false);

  const hasOAuthParams = searchParams.has("code") && searchParams.has("state");
  const label = provider === "microsoft" ? "Microsoft" : "Google";

  useEffect(() => {
    if (!provider || !hasOAuthParams) return;

    const query = searchParams.toString();
    const callbackUrl = `${API_BASE.replace(/\/$/, "")}/integrations/${provider}/callback?${query}`;
    window.location.replace(callbackUrl);

    const timer = window.setTimeout(() => setFailed(true), 12_000);
    return () => window.clearTimeout(timer);
  }, [hasOAuthParams, provider, searchParams]);

  if (!hasOAuthParams) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="max-w-lg space-y-4 text-center">
          <h1 className="text-2xl font-heading font-bold">Invalid integration callback</h1>
          <p className="text-muted-foreground text-sm">
            Missing OAuth parameters. Start again from Integrations.
          </p>
          <Link to="/settings/integrations" className="text-primary text-sm underline">
            Back to Integrations
          </Link>
        </div>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="max-w-lg space-y-4 text-center">
          <h1 className="text-2xl font-heading font-bold">Could not complete {label} sign-in</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Update your {label} OAuth redirect URI to{" "}
            <code className="text-xs">https://api.meetingdesk.in/integrations/{provider}/callback</code>{" "}
            and set <code className="text-xs">API_PUBLIC_URL=https://api.meetingdesk.in</code> on the API
            server.
          </p>
          <Link to="/settings/integrations" className="text-primary text-sm underline">
            Back to Integrations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">Completing {label} connection…</p>
    </div>
  );
}
