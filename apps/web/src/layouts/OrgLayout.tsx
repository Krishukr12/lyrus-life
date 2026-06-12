import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Video, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function OrgLayout() {
  const { pathname } = useLocation();
  const { user, organization, logout } = useAuth();
  const isAdmin = user?.role === "ORG_ADMIN";

  const nav = [
    { href: "/org", label: "Dashboard", icon: LayoutDashboard },
    ...(isAdmin
      ? [
          { href: "/org/employees", label: "Employees", icon: Users },
          { href: "/org/settings", label: "Settings", icon: Settings },
        ]
      : []),
    { href: "/", label: "Meetings", icon: Video },
  ];

  const orgLabel = organization?.name ?? "Your organization";

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="w-56 border-r bg-card flex flex-col">
        <div className="p-4 border-b">
          {organization?.logoUrl ? (
            <img
              src={organization.logoUrl}
              alt=""
              className="h-8 w-auto mb-2 object-contain"
            />
          ) : null}
          <p className="font-semibold text-sm truncate" title={orgLabel}>
            {orgLabel}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.name}</p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t">
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => void logout()}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
