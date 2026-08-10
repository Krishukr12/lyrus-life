import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import TrialExpiredPage from "@/pages/TrialExpiredPage";
import { ApiError, getMeetings } from "@/lib/api";
import {
  getWorkspaceLock,
  isIntegrationsPath,
  isWorkspaceLocked,
  setWorkspaceLock,
} from "@/lib/workspace-access";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { organization, isLoading } = useAuth();
  const [blocked, setBlocked] = useState(() => Boolean(getWorkspaceLock()));
  const [probeDone, setProbeDone] = useState(false);

  const locked =
    blocked || isWorkspaceLocked(organization) || Boolean(getWorkspaceLock());
  const onIntegrations = isIntegrationsPath(location.pathname);
  // Always swap dashboard/etc for the trial screen in-place (keeps sidebar).
  const showTrialScreen = locked && !onIntegrations;

  useEffect(() => {
    if (isLoading || probeDone) return;

    if (isWorkspaceLocked(organization) || getWorkspaceLock()) {
      setBlocked(true);
      setProbeDone(true);
      if (!isIntegrationsPath(location.pathname)) {
        navigate("/trial-expired", { replace: true });
      }
      return;
    }

    let cancelled = false;
    void getMeetings()
      .then(() => {
        if (!cancelled) setProbeDone(true);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const status = err instanceof ApiError ? err.status : 0;
        const message = err instanceof Error ? err.message : "";
        const code = err instanceof ApiError ? err.code : undefined;
        if (
          status === 403 ||
          /not authorized|trial|upgrade|billing|subscription/i.test(message)
        ) {
          setWorkspaceLock(
            /not authorized/i.test(message)
              ? "Your organization's trial or subscription access has ended. Please ask your admin to upgrade."
              : message || "Your trial period has ended.",
            code ?? "trial_expired",
          );
          setBlocked(true);
          if (!isIntegrationsPath(window.location.pathname)) {
            navigate("/trial-expired", { replace: true });
          }
        }
        setProbeDone(true);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoading, organization, probeDone, location.pathname, navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b border-border/50 bg-card/60 backdrop-blur-md px-4 sticky top-0 z-10 shadow-[0_1px_0_rgba(16,24,40,0.02)]">
            <SidebarTrigger className="mr-4 rounded-lg transition-colors hover:bg-accent/70" />
            <div className="h-1 absolute inset-x-0 -bottom-px bg-gradient-to-r from-transparent via-secondary/25 to-transparent pointer-events-none" />
          </header>
          <main className="flex-1 p-6 md:p-8 overflow-auto">
            <div key={showTrialScreen ? "trial" : location.pathname} className="page-enter">
              {showTrialScreen ? <TrialExpiredPage /> : children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
