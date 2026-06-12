import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ScrollText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { orgApi } from "@/services/tenant-api";

function formatAction(action: string): string {
  return action
    .replace(/\./g, " · ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function OrgActivityPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["org", "dashboard"],
    queryFn: () => orgApi.getDashboard(),
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ScrollText className="h-6 w-6 text-primary" />
          Activity Log
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Audit trail of actions across your organization.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent events</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading activity…</p>
          ) : !data?.recentAudit.length ? (
            <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
          ) : (
            <ul className="divide-y">
              {data.recentAudit.map((entry) => (
                <li key={entry.id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="font-normal">
                        {formatAction(entry.action)}
                      </Badge>
                      {entry.user ? (
                        <span className="text-sm text-muted-foreground truncate">
                          {entry.user.name}
                          <span className="hidden sm:inline"> · {entry.user.email}</span>
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">System</span>
                      )}
                    </div>
                  </div>
                  <time className="text-xs text-muted-foreground shrink-0 tabular-nums">
                    {format(new Date(entry.createdAt), "MMM d, yyyy · h:mm a")}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
