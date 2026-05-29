import { CheckCircle2, FileWarning, Send, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Meeting } from "@/lib/types";
import {
  getMomStakeholderStatus,
  momStakeholderStatusLabel,
  type MomStakeholderStatus,
} from "@/lib/mom-status";
import { cn } from "@/lib/utils";

const config: Record<
  MomStakeholderStatus,
  { className: string; icon: typeof Clock }
> = {
  none: {
    className: "border-warning/30 bg-warning/10 text-warning hover:bg-warning/10",
    icon: FileWarning,
  },
  awaiting_approval: {
    className: "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 hover:bg-amber-500/10",
    icon: Clock,
  },
  not_shared: {
    className: "border-orange-500/30 bg-orange-500/10 text-orange-800 dark:text-orange-200 hover:bg-orange-500/10",
    icon: Send,
  },
  shared: {
    className: "border-success/30 bg-success/10 text-success hover:bg-success/10",
    icon: CheckCircle2,
  },
};

type MomStakeholderBadgeProps = {
  meeting: Meeting;
  className?: string;
  showIcon?: boolean;
};

export function MomStakeholderBadge({ meeting, className, showIcon = true }: MomStakeholderBadgeProps) {
  const status = getMomStakeholderStatus(meeting);
  const { className: tone, icon: Icon } = config[status];

  return (
    <Badge variant="outline" className={cn("text-[10px] font-medium gap-1", tone, className)}>
      {showIcon && <Icon className="h-3 w-3 shrink-0" />}
      {momStakeholderStatusLabel(status)}
    </Badge>
  );
}
