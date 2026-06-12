import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Users, UserCheck, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orgApi } from "@/services/tenant-api";

export default function OrgDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["org", "dashboard"],
    queryFn: () => orgApi.getDashboard(),
  });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Organization dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Your team and meeting activity.</p>
      </div>

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

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentAudit.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {data.recentAudit.map((entry) => (
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
        </>
      ) : null}
    </div>
  );
}
