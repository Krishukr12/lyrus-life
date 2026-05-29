import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MomStakeholderBadge } from "@/components/MomStakeholderBadge";
import type { Meeting } from "@/lib/types";
import { filterMeetingsPendingMom } from "@/lib/mom-status";

type PendingMomAlertProps = {
  meetings: Meeting[];
  maxItems?: number;
  className?: string;
};

export function PendingMomAlert({ meetings, maxItems = 5, className }: PendingMomAlertProps) {
  const navigate = useNavigate();
  const pending = filterMeetingsPendingMom(meetings);
  const shown = pending.slice(0, maxItems);

  if (pending.length === 0) return null;

  return (
    <Card className={className}>
      <div className="border-b border-warning/20 bg-warning/5 px-4 py-3 sm:px-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/15 text-warning">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-heading font-semibold">MOM pending for stakeholders</h2>
            <p className="text-xs text-muted-foreground">
              {pending.length} meeting{pending.length === 1 ? "" : "s"} need approval and/or sending
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => navigate("/meetings?mom=pending")}
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
      <ul className="divide-y">
        {shown.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => navigate(`/meetings/${m.id}`)}
              className="w-full flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5 text-left hover:bg-muted/40 transition-colors"
            >
              <div className="min-w-0 flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{m.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.date} · {m.stakeholders.length} stakeholder
                    {m.stakeholders.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <MomStakeholderBadge meeting={m} />
            </button>
          </li>
        ))}
      </ul>
      {pending.length > maxItems && (
        <p className="text-xs text-muted-foreground text-center py-2 border-t">
          +{pending.length - maxItems} more — use &quot;Pending MOM&quot; filter on Meetings
        </p>
      )}
    </Card>
  );
}
