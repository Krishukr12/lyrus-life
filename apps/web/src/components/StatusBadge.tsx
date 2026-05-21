import { Badge } from "@/components/ui/badge";
import { MeetingStatus, MeetingTag } from "@/lib/types";

const statusConfig: Record<MeetingStatus, { label: string; className: string }> = {
  upcoming: { label: "Upcoming", className: "bg-accent text-accent-foreground border-ring/30" },
  ongoing: { label: "Ongoing", className: "bg-warning/15 text-warning border-warning/30" },
  completed: { label: "Completed", className: "bg-success/15 text-success border-success/30" },
};

const tagConfig: Record<MeetingTag, { label: string; className: string }> = {
  internal: { label: "Internal", className: "bg-primary/10 text-primary border-primary/20" },
  client: { label: "Client", className: "bg-secondary/15 text-secondary border-secondary/30" },
  vendor: { label: "Vendor", className: "bg-warning/15 text-warning border-warning/30" },
};

export function StatusBadge({ status }: { status: MeetingStatus }) {
  const cfg = statusConfig[status] ?? statusConfig.upcoming;
  return <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>;
}

export function TagBadge({ tag }: { tag: MeetingTag }) {
  const cfg = tagConfig[tag] ?? tagConfig.internal;
  return <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>;
}
