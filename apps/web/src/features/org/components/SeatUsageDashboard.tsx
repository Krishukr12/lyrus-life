import { Users, UserPlus, CreditCard, Armchair } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { PlanUsage } from "@/services/tenant-api";
import { formatInr } from "@/lib/currency";

interface SeatUsageDashboardProps {
  usage: PlanUsage;
}

export function SeatUsageDashboard({ usage }: SeatUsageDashboardProps) {
  const overLimit = usage.additionalUsers > 0;

  const cards = [
    {
      label: "Included seats",
      value: String(usage.includedUsers),
      hint: usage.planLabel ?? usage.subscriptionPlan,
      hintTone: "text-muted-foreground",
      icon: Users,
      iconBg: "bg-primary/10 text-primary",
    },
    {
      label: "Used seats",
      value: String(usage.usedSeats ?? usage.activeUsers),
      hint: `${usage.activeUsers} active${(usage.pendingInvitations ?? 0) > 0 ? ` · ${usage.pendingInvitations} pending` : ""}`,
      hintTone: "text-muted-foreground",
      icon: UserPlus,
      iconBg: "bg-secondary/10 text-secondary",
    },
    {
      label: "Available",
      value: String(usage.availableSeats ?? 0),
      hint: overLimit
        ? `+${usage.additionalUsers} additional @ ${formatInr(usage.extraSeatPriceMonthlyInr ?? 0)}/mo`
        : "Within plan limit",
      hintTone: overLimit ? "text-warning" : "text-muted-foreground",
      icon: Armchair,
      iconBg: "bg-success/10 text-success",
    },
    {
      label: "Monthly estimate",
      value: formatInr(usage.monthlyAmountInr),
      hint: usage.billingCycle === "yearly" ? "Yearly billing" : "Monthly billing",
      hintTone: "text-muted-foreground",
      icon: CreditCard,
      iconBg: "bg-warning/10 text-warning",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.4, ease: [0.21, 0.6, 0.35, 1] }}
        >
          <Card className="stat-card h-full">
            <div className="flex items-start justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{c.label}</p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.iconBg}`}>
                <c.icon className="h-[18px] w-[18px]" />
              </div>
            </div>
            <p className="text-2xl font-heading font-bold tabular-nums mt-2">{c.value}</p>
            <p className={`text-xs mt-2 pt-2 border-t border-border/50 ${c.hintTone}`}>{c.hint}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
