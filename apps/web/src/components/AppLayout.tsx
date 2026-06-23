import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

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
            <div key={location.pathname} className="page-enter">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
