import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileText,
  IndianRupee,
  LayoutDashboard,
  Settings,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";
import { Button } from "@/components/ui/button";

type NavItem = { href: string; label: string; icon: LucideIcon; end?: boolean };

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Platform",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
      { href: "/organizations", label: "Organizations", icon: Building2 },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/organization-requests", label: "Requests", icon: ClipboardList },
      { href: "/subscriptions", label: "Subscriptions", icon: CreditCard },
      { href: "/users", label: "Users", icon: Users },
      { href: "/meetings", label: "Meetings", icon: Video },
      { href: "/audit-logs", label: "Audit Logs", icon: FileText },
    ],
  },
  {
    label: "Billing",
    items: [{ href: "/billing", label: "Billing & Pricing", icon: IndianRupee }],
  },
  {
    label: "Settings",
    items: [{ href: "/settings", label: "Settings", icon: Settings }],
  },
];

export function AdminSidebar() {
  const { pathname } = useLocation();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "admin-sidebar fixed inset-y-0 left-0 z-30 hidden h-screen lg:flex flex-col transition-[width] duration-200 ease-out",
        collapsed ? "w-[4.5rem]" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-white/10 px-3",
          collapsed ? "justify-center" : "gap-3 px-4",
        )}
      >
        {collapsed ? (
          <BrandMark variant="dark" iconOnly iconSize={36} />
        ) : (
          <BrandMark variant="dark" className="min-w-0 flex-1" />
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden p-3 pt-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed ? (
              <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {section.label}
              </p>
            ) : (
              <div className="mb-2 mx-auto h-px w-6 bg-white/10" aria-hidden />
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = item.end
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "admin-sidebar-link shrink-0",
                      active && "admin-sidebar-link-active",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                    {!collapsed ? <span className="truncate">{item.label}</span> : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggle}
          className={cn(
            "w-full text-slate-400 hover:text-white hover:bg-white/10 rounded-xl",
            collapsed && "px-0 justify-center",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
