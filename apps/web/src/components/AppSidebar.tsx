import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Plus,
  ListChecks,
  FileText,
  ChartNoAxesCombined,
  LogOut,
  Building2,
  UserCog,
  Settings,
  ScrollText,
  Link2,
} from "lucide-react";
import { LogoIcon } from "@/components/BrandMark";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { getWorkspaceLock, isWorkspaceLocked } from "@/lib/workspace-access";

const workspaceNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, requiresActiveWorkspace: true },
  { title: "Meetings", url: "/meetings", icon: Users, requiresActiveWorkspace: true },
  { title: "MOM inbox", url: "/mom", icon: FileText, requiresActiveWorkspace: true },
  { title: "Tasks", url: "/tasks", icon: ListChecks, requiresActiveWorkspace: true },
  { title: "Calendar", url: "/calendar", icon: CalendarDays, requiresActiveWorkspace: true },
  { title: "Integrations", url: "/settings/integrations", icon: Link2, requiresActiveWorkspace: false },
];

const organizationNavItems = [
  { title: "Overview", url: "/organization", icon: Building2, end: true },
  { title: "Insights", url: "/insights", icon: ChartNoAxesCombined, end: true },
  {
    title: "User Management",
    url: "/organization/users",
    icon: UserCog,
    end: true,
  },
  {
    title: "Settings",
    url: "/organization/settings",
    icon: Settings,
    end: true,
  },
  {
    title: "Activity Log",
    url: "/organization/activity",
    icon: ScrollText,
    end: true,
  },
];

const navLinkBase =
  "group/nav relative rounded-lg text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground hover:translate-x-0.5";
const navLinkActive =
  "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-[inset_2px_0_0_hsl(var(--sidebar-primary))]";

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { user, organization, logout } = useAuth();
  const headerTitle = organization?.name ?? APP_NAME;
  const isOrgAdmin = user?.role === "ORG_ADMIN";
  const workspaceLocked = isWorkspaceLocked(organization) || Boolean(getWorkspaceLock());
  const visibleWorkspaceNav = workspaceNavItems.filter(
    (item) => !item.requiresActiveWorkspace || !workspaceLocked,
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="relative pt-6 flex flex-col h-full overflow-hidden">
        {/* Ambient glow accents */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-20 h-56 w-56 rounded-full bg-sidebar-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 -right-24 h-64 w-64 rounded-full bg-blue-500/[0.07] blur-3xl"
        />

        <div className={`relative px-4 mb-8 ${collapsed ? "text-center" : ""}`}>
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-2xl border border-sidebar-border/40 bg-sidebar-accent/30 px-3 py-2.5",
              collapsed ? "justify-center px-2" : "",
            )}
          >
            {collapsed ? (
              <LogoIcon size={32} className="rounded-xl" />
            ) : (
              <>
                <LogoIcon size={36} className="rounded-xl ring-1 ring-sidebar-border/50" />
                <div className="min-w-0 flex-1">
                  <h1
                    className="font-heading text-sidebar-accent-foreground font-bold text-base tracking-tight truncate leading-tight"
                    title={headerTitle}
                  >
                    {headerTitle}
                  </h1>
                  {organization?.name ? (
                    <p className="mt-1 truncate text-xs leading-snug">
                      <span className="text-sidebar-foreground/55">on </span>
                      <span className="font-semibold text-sidebar-primary">{APP_NAME}</span>
                    </p>
                  ) : (
                    <p className="mt-0.5 truncate text-xs leading-snug text-sidebar-foreground/70">
                      {APP_TAGLINE}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {!collapsed && !workspaceLocked && (
          <div className="relative px-4 mb-6">
            <Button
              onClick={() => navigate("/schedule")}
              variant="secondary"
              className="w-full font-medium gap-2 shine"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
        )}

        {workspaceLocked && !collapsed ? (
          <div className="relative mx-4 mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-[11px] leading-snug text-amber-700 dark:text-amber-300">
            Trial ended. Ask your admin to upgrade. Integrations still work.
          </div>
        ) : null}

        <SidebarGroup className="relative">
          {!collapsed && (
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.14em] text-sidebar-foreground/45">
              Workspace
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleWorkspaceNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={navLinkBase}
                      activeClassName={navLinkActive}
                    >
                      <item.icon className="mr-3 h-4 w-4 transition-transform duration-200 group-hover/nav:scale-110" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isOrgAdmin && !workspaceLocked ? (
          <SidebarGroup className="relative mt-2">
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.14em] text-sidebar-foreground/45">
                Organization
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {organizationNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.end}
                        className={navLinkBase}
                        activeClassName={navLinkActive}
                      >
                        <item.icon className="mr-3 h-4 w-4 transition-transform duration-200 group-hover/nav:scale-110" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        <div
          className={`relative mt-auto px-3 pb-5 ${collapsed ? "text-center" : ""}`}
        >
          {!collapsed && user ? (
            <div className="mb-2 flex items-center gap-2.5 rounded-xl border border-sidebar-border/70 bg-sidebar-accent/40 px-3 py-2.5 backdrop-blur-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sidebar-primary/80 to-teal-700 text-[11px] font-bold text-sidebar-primary-foreground shadow-md">
                {initialsOf(user.name)}
              </div>
              <div className="min-w-0">
                <p
                  className="truncate text-xs font-medium text-sidebar-accent-foreground"
                  title={user.name}
                >
                  {user.name}
                </p>
                <p
                  className="truncate text-[10px] text-sidebar-foreground/55"
                  title={user.email}
                >
                  {user.email}
                </p>
              </div>
            </div>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start rounded-lg text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            onClick={() => void logout()}
          >
            <LogOut className="h-4 w-4 mr-2 shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
