import { Link, useLocation } from "react-router-dom";
import { AlertTriangle, Clock, Link2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkspaceLock } from "@/lib/workspace-access";

type TrialPageState = {
  message?: string;
  code?: string;
} | null;

function titleForCode(code?: string): string {
  switch (code) {
    case "billing_overdue":
      return "Billing overdue";
    case "billing_cancelled":
      return "Subscription cancelled";
    case "organization_inactive":
      return "Organization inactive";
    default:
      return "Trial period ended";
  }
}

export default function TrialExpiredPage() {
  const { organization, user } = useAuth();
  const location = useLocation();
  const state = location.state as TrialPageState;
  const persisted = getWorkspaceLock();
  const isOrgAdmin = user?.role === "ORG_ADMIN";

  const code = state?.code || persisted?.code || "trial_expired";
  const title = titleForCode(code);
  const defaultMemberMessage =
    "Your organization's access to dashboard, meetings, tasks, and calendar has ended. Please ask your organization admin to upgrade or restore the plan.";
  const defaultAdminMessage =
    "Your organization's access to dashboard, meetings, tasks, and calendar has ended. Contact Meeting Desk AI support to upgrade or restore your plan.";
  const message =
    state?.message?.trim() ||
    persisted?.message?.trim() ||
    (isOrgAdmin ? defaultAdminMessage : defaultMemberMessage);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center py-16 px-4">
      <Card className="w-full space-y-5 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          {code === "billing_overdue" || code === "billing_cancelled" ? (
            <AlertTriangle className="h-7 w-7" />
          ) : (
            <Clock className="h-7 w-7" />
          )}
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-heading font-bold">{title}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">{message}</p>
        </div>

        {!isOrgAdmin ? (
          <p className="rounded-lg border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
            Tell your admin to upgrade or restore the subscription. Until then, only Integrations
            remains available.
          </p>
        ) : (
          <p className="inline-flex items-center justify-center gap-2 rounded-lg border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            Contact support to restore access for {organization?.name ?? "your organization"}.
          </p>
        )}

        <Button asChild className="w-full gap-2">
          <Link to="/settings/integrations">
            <Link2 className="h-4 w-4" />
            Go to Integrations
          </Link>
        </Button>
      </Card>
    </div>
  );
}
