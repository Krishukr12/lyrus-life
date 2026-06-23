import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ScrollText } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
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
    <div className="space-y-7 max-w-5xl">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Organization</p>
        <h1 className="text-[26px] leading-tight font-heading font-bold mt-1">
          <span className="text-gradient">Activity Log</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Audit trail of actions across your organization.
        </p>
      </div>

      <Card className="p-6 animate-fade-in-up">
        <h2 className="text-base font-heading font-semibold flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <ScrollText className="h-3.5 w-3.5" />
          </span>
          Recent events
        </h2>
        <div className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : !data?.recentAudit.length ? (
            <div className="rounded-xl border border-dashed border-border/70 py-10 text-center">
              <ScrollText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/50">
              {data.recentAudit.map((entry, idx) => (
                <motion.li
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                  className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondary" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="soft" className="font-normal">
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
                  </div>
                  <time className="text-xs text-muted-foreground shrink-0 tabular-nums pt-0.5">
                    {format(new Date(entry.createdAt), "MMM d, yyyy · h:mm a")}
                  </time>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
