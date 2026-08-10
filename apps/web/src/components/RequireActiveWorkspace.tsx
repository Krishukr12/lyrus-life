import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkspaceLock, isIntegrationsPath, isWorkspaceLocked } from "@/lib/workspace-access";

/** Blocks workspace pages when the org trial/billing has ended. Integrations stay open. */
export function RequireActiveWorkspace({ children }: { children: React.ReactNode }) {
  const { organization, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    );
  }

  const locked = isWorkspaceLocked(organization) || Boolean(getWorkspaceLock());
  if (locked && !isIntegrationsPath(location.pathname)) {
    return <Navigate to="/trial-expired" replace />;
  }

  return <>{children}</>;
}
