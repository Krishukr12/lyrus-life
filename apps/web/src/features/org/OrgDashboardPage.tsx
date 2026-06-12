import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Building2, Users, UserCheck, Video, UserCog, Settings, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          {organization?.name ?? "Organization"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your team, seats, and meeting activity.
        </p>
      </div>

      {planUsage ? <SeatUsageDashboard usage={planUsage} /> : null}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : data ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total employees
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{data.totalEmployees}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active employees
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{data.activeEmployees}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Meetings this month
                </CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{data.meetingsThisMonth}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button variant="outline" className="justify-between" asChild>
                  <Link to="/organization/users">
                    <span className="flex items-center gap-2">
                      <UserCog className="h-4 w-4" />
                      Manage users
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="justify-between" asChild>
                  <Link to="/organization/settings">
                    <span className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Organization settings
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recent activity</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/organization/activity">View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {data.recentAudit.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent activity.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {data.recentAudit.slice(0, 5).map((entry) => (
                      <li key={entry.id} className="flex justify-between gap-4 border-b pb-2 last:border-0">
                        <span>
                          <span className="font-medium">{entry.action}</span>
                          {entry.user ? (
                            <span className="text-muted-foreground"> — {entry.user.name}</span>
                          ) : null}
                        </span>
                        <span className="text-muted-foreground shrink-0">
                          {format(new Date(entry.createdAt), "MMM d, h:mm a")}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
