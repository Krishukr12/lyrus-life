import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Users, UserCheck, Video, UserCog, Settings, ArrowRight, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { orgApi } from "@/services/tenant-api";
import { SeatUsageDashboard } from "./components/SeatUsageDashboard";
import { useAuth } from "@/contexts/AuthContext";

export default function OrgDashboardPage() {
  const { organization } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["org", "dashboard"],
    queryFn: () => orgApi.getDashboard(),
  });

  const { data: planUsage } = useQuery({
    queryKey: ["org", "plan-usage"],
    queryFn: orgApi.getPlanUsage,
  });

  return (
    <div className="space-y-7 max-w-6xl">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Organization</p>
          <h1 className="text-[26px] leading-tight font-heading font-bold mt-1">
            <span className="text-gradient">{organization?.name ?? "Organization"}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of your team, seats, and meeting activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-1.5 shine" asChild>
            <Link to="/organization/users">
              <UserCog className="h-4 w-4" /> Manage Users
            </Link>
          </Button>
          <Button variant="outline" className="gap-1.5" asChild>
            <Link to="/organization/settings">
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </Button>
        </div>
      </div>

      {planUsage ? <SeatUsageDashboard usage={planUsage} /> : null}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Total employees", value: data.totalEmployees, icon: Users, iconBg: "bg-primary/10 text-primary", hint: "All registered members" },
              { label: "Active employees", value: data.activeEmployees, icon: UserCheck, iconBg: "bg-success/10 text-success", hint: "Currently enabled accounts" },
              { label: "Meetings this month", value: data.meetingsThisMonth, icon: Video, iconBg: "bg-secondary/10 text-secondary", hint: "Across the organization" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.21, 0.6, 0.35, 1] }}
              >
                <Card className="stat-card h-full">
                  <div className="flex items-start justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{s.label}</p>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.iconBg}`}>
                      <s.icon className="h-[18px] w-[18px]" />
                    </div>
                  </div>
                  <p className="text-3xl font-heading font-bold tabular-nums mt-2">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">{s.hint}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-base font-heading font-semibold flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <UserCog className="h-3.5 w-3.5" />
                </span>
                Quick actions
              </h2>
              <div className="mt-4 space-y-2">
                <Link
                  to="/organization/users"
                  className="group/link flex items-center justify-between rounded-xl border border-border/60 px-4 py-3.5 transition-all hover:border-ring/30 hover:bg-muted/30"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <UserCog className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium">Manage users</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">Invite, edit roles, and monitor seats</span>
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover/link:translate-x-1" />
                </Link>
                <Link
                  to="/organization/settings"
                  className="group/link flex items-center justify-between rounded-xl border border-border/60 px-4 py-3.5 transition-all hover:border-ring/30 hover:bg-muted/30"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <Settings className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium">Organization settings</span>
                      <span className="block text-xs text-muted-foreground mt-0.5">Branding, defaults, and contact details</span>
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-heading font-semibold flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <Activity className="h-3.5 w-3.5" />
                  </span>
                  Recent activity
                </h2>
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" asChild>
                  <Link to="/organization/activity">
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
              {data.recentAudit.length === 0 ? (
                <p className="text-sm text-muted-foreground mt-4">No recent activity.</p>
              ) : (
                <ul className="mt-4 divide-y divide-border/50 text-sm">
                  {data.recentAudit.slice(0, 5).map((entry) => (
                    <li key={entry.id} className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
                      <span className="min-w-0 truncate">
                        <span className="font-medium">{entry.action}</span>
                        {entry.user ? (
                          <span className="text-muted-foreground"> — {entry.user.name}</span>
                        ) : null}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                        {format(new Date(entry.createdAt), "MMM d, h:mm a")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
