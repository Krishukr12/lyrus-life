import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Plus,
  ListChecks,
  ChartNoAxesCombined,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const companyName = import.meta.env.VITE_COMPANY_NAME ?? "Lyrus Life";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Meetings", url: "/meetings", icon: Users },
  { title: "Tasks", url: "/tasks", icon: ListChecks },
  { title: "Calendar", url: "/calendar", icon: CalendarDays },
  { title: "Insights", url: "/insights", icon: ChartNoAxesCombined },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { user, organization, logout } = useAuth();
  const headerTitle = organization?.name ?? companyName;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="pt-6 flex flex-col h-full">
        <div className={`px-4 mb-8 ${collapsed ? "text-center" : ""}`}>
          <h1
            className="font-heading text-sidebar-primary font-bold text-xl tracking-tight truncate"
            title={headerTitle}
          >
            {collapsed ? headerTitle.slice(0, 2).toUpperCase() : headerTitle}
          </h1>
          {!collapsed && (
            <p className="text-xs text-sidebar-foreground/60 mt-0.5">Meeting Management</p>
          )}
        </div>

        {!collapsed && (
          <div className="px-4 mb-6">
            <Button
              onClick={() => navigate("/schedule")}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/50 text-sidebar-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className={`mt-auto px-4 pb-6 ${collapsed ? "text-center" : ""}`}>
          {!collapsed && user && (
            <p className="text-xs text-sidebar-foreground/70 truncate mb-2" title={user.email}>
              {user.name}
            </p>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground"
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
