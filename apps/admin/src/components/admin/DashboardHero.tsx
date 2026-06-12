import { Link } from "react-router-dom";
import { ClipboardList, IndianRupee, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardHero({ userName }: { userName?: string }) {
  const firstName = userName?.split(" ")[0] ?? "Super Admin";

  return (
    <section className="relative mb-8 overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_40px_rgba(15,23,42,0.08)]">
      <div className="pointer-events-none absolute inset-0 admin-hero-mesh" aria-hidden />
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl"
        aria-hidden
      />

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="flex items-start gap-3">
          <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 ring-1 ring-blue-500/20">
            <Sparkles className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[1.75rem] sm:text-3xl lg:text-[2rem] font-bold tracking-tight text-slate-900">
              {getGreeting()}, {firstName}{" "}
              <span className="inline-block" aria-hidden>
                👋
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] sm:text-base leading-relaxed text-slate-600">
              Manage organizations, subscriptions, revenue, users and platform operations from one
              place.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/30 transition-all"
            asChild
          >
            <Link to="/organizations/new">
              <Plus className="h-4 w-4 mr-2" />
              New Organization
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-xl border-slate-200/80 bg-white/90 px-5 text-sm font-medium shadow-sm hover:bg-white hover:shadow"
            asChild
          >
            <Link to="/organization-requests">
              <ClipboardList className="h-4 w-4 mr-2" />
              View Requests
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-xl border-slate-200/80 bg-white/90 px-5 text-sm font-medium shadow-sm hover:bg-white hover:shadow"
            asChild
          >
            <Link to="/billing">
              <IndianRupee className="h-4 w-4 mr-2" />
              Billing Center
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
