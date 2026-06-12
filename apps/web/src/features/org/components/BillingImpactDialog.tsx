import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import type { SeatBillingPreview } from "@/services/tenant-api";
import { formatInr } from "@/lib/currency";

interface BillingImpactDialogProps {
  open: boolean;
  preview: SeatBillingPreview | null;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

export function BillingImpactDialog({
  open,
  preview,
  onConfirm,
  onCancel,
  isPending,
}: BillingImpactDialogProps) {
  if (!preview) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Additional seat charges
          </DialogTitle>
          <DialogDescription>
            Adding this user will exceed your included seats. Review the billing impact before
            continuing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2 rounded-lg border p-3 bg-muted/30">
            <div>
              <p className="text-muted-foreground">Current plan</p>
              <p className="font-medium">{preview.planLabel}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Billing cycle</p>
              <p className="font-medium capitalize">{preview.billingCycle}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Included seats</p>
              <p className="font-medium">{preview.includedSeats}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Active seats</p>
              <p className="font-medium">{preview.activeSeats}</p>
            </div>
            <div>
              <p className="text-muted-foreground">After adding</p>
              <p className="font-medium">{preview.activeSeats + 1} seats</p>
            </div>
            <div>
              <p className="text-muted-foreground">Additional seats</p>
              <p className="font-medium text-amber-600">{preview.additionalSeatsAfter}</p>
            </div>
          </div>

          <div className="rounded-lg border p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Extra seat price</span>
              <span>{formatInr(preview.extraSeatPriceMonthlyInr)}/seat/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Additional monthly cost</span>
              <span className="font-medium text-amber-600">
                +{formatInr(preview.additionalMonthlyCostInr)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Additional annual cost</span>
              <span>+{formatInr(preview.additionalAnnualCostInr)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>New monthly estimate</span>
              <span>{formatInr(preview.projectedMonthlySubtotalInr)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>New total (incl. GST)</span>
              <span>{formatInr(preview.projectedTotalInr)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending ? "Processing…" : "Confirm & continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
