import { Users, UserPlus, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlanUsage } from "@/services/tenant-api";
import { formatInr } from "@/lib/currency";

interface SeatUsageDashboardProps {
  usage: PlanUsage;
}

export function SeatUsageDashboard({ usage }: SeatUsageDashboardProps) {
  const overLimit = usage.additionalUsers > 0;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Included seats</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{usage.includedUsers}</p>
          <p className="text-xs text-muted-foreground mt-1">{usage.planLabel ?? usage.subscriptionPlan}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Used seats</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{usage.usedSeats ?? usage.activeUsers}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {usage.activeUsers} active
            {(usage.pendingInvitations ?? 0) > 0
              ? ` · ${usage.pendingInvitations} pending`
              : ""}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{usage.availableSeats ?? 0}</p>
          {overLimit ? (
            <p className="text-xs text-amber-600 mt-1">
              +{usage.additionalUsers} additional @ {formatInr(usage.extraSeatPriceMonthlyInr ?? 0)}/mo
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">Within plan limit</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Monthly estimate</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatInr(usage.monthlyAmountInr)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {usage.billingCycle === "yearly" ? "Yearly billing" : "Monthly billing"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
