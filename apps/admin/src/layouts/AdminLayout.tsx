import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { GlobalSearchProvider } from "@/contexts/GlobalSearchContext";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

function AdminLayoutShell() {
  const { collapsed } = useSidebar();

  return (
    <div className="admin-shell min-h-screen">
      <AdminSidebar />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[margin-left] duration-200 ease-out",
          collapsed ? "lg:ml-[4.5rem]" : "lg:ml-64",
        )}
      >
        <AdminTopbar />
        <main className="admin-main flex-1 overflow-auto px-4 lg:px-8 py-6 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminLayout() {
  return (
    <SidebarProvider>
      <GlobalSearchProvider>
        <AdminLayoutShell />
      </GlobalSearchProvider>
    </SidebarProvider>
  );
}
