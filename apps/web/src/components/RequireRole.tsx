import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { homePathForRole, isExternalRedirect } from "@/lib/role-routes";

export function RequireRole({
  allowed,
  children,
}: {
  allowed: string[];
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(user.role)) {
    const target = homePathForRole(user.role);
    if (isExternalRedirect(target)) {
      window.location.href = target;
      return null;
    }
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
}
