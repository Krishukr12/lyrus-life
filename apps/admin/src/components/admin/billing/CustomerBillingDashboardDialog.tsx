import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Download, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { CustomerBillingRow } from "@/lib/billing-types";
import { formatInr } from "@/lib/format-inr";
import { adminApi } from "@/services/api";
import { BillingStatusPill } from "@/components/admin/billing/BillingStatusPill";
import { PlanBadge } from "@/components/admin/billing/PlanBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-[#e5e7eb] bg-slate-50/50 px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900">{value}</p>
    </div>
  );
}

export function CustomerBillingDashboardDialog({
  open,
  onOpenChange,
  row,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: CustomerBillingRow | null;
}) {
  const queryClient = useQueryClient();
  const orgId = row?.organizationId;

  const dashboardQuery = useQuery({
    queryKey: ["admin", "billing", "dashboard", orgId],
    queryFn: () => adminApi.getBillingDashboard(orgId!),
    enabled: open && !!orgId,
  });

  const sendInvoice = useMutation({
    mutationFn: () => adminApi.sendLatestInvoice(orgId!),
    onSuccess: () => {
      toast.success("Invoice generated and sent");
      void queryClient.invalidateQueries({ queryKey: ["admin", "billing"] });
      void dashboardQuery.refetch();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resendInvoice = useMutation({
    mutationFn: (invoiceId: string) => adminApi.sendInvoice(orgId!, invoiceId),
    onSuccess: () => {
      toast.success("Invoice resent");
      void dashboardQuery.refetch();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const dashboard = dashboardQuery.data?.dashboard;

  async function downloadPdf(invoiceId: string, invoiceNumber: string) {
    try {
      await adminApi.downloadInvoicePdf(orgId!, invoiceId, invoiceNumber);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Download failed");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[14px]">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            Billing dashboard — {row?.organizationName}
            {dashboard ? <BillingStatusPill status={dashboard.billingStatus} /> : null}
          </DialogTitle>
        </DialogHeader>

        {dashboardQuery.isLoading ? (
          <div className="space-y-3 py-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : dashboard ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <PlanBadge plan={dashboard.currentPlan} />
                <span className="text-sm text-slate-500 capitalize">{dashboard.billingCycle}</span>
              </div>
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={sendInvoice.isPending}
                onClick={() => sendInvoice.mutate()}
              >
                <Mail className="h-4 w-4 mr-2" />
                {sendInvoice.isPending ? "Sending…" : "Send invoice"}
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Monthly cost" value={formatInr(dashboard.monthlyCostInr)} />
              <MetricCard label="Annual cost" value={formatInr(dashboard.annualCostInr)} />
              <MetricCard
                label="Seats"
                value={`${dashboard.activeUsers} / ${dashboard.includedUsers} incl.`}
              />
              <MetricCard
                label="Additional seats"
                value={String(dashboard.additionalUsers)}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard
                label="Renewal date"
                value={
                  dashboard.nextBillingDate
                    ? format(new Date(dashboard.nextBillingDate), "MMM d, yyyy")
                    : "—"
                }
              />
              <MetricCard
                label="Upcoming invoice"
                value={
                  dashboard.upcomingInvoice
                    ? `${dashboard.upcomingInvoice.invoiceNumber} · ${formatInr(dashboard.upcomingInvoice.totalInr)}`
                    : "None outstanding"
                }
              />
            </div>

            <section>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Invoice history</h3>
              {dashboard.invoices.length === 0 ? (
                <p className="text-sm text-slate-500 py-4">No invoices yet.</p>
              ) : (
                <div className="admin-table-wrap">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Issued</TableHead>
                        <TableHead className="w-[120px]" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboard.invoices.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                          <TableCell>{inv.status}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatInr(inv.totalInr)}
                          </TableCell>
                          <TableCell className="text-xs text-slate-500">
                            {inv.issuedAt
                              ? format(new Date(inv.issuedAt), "MMM d, yyyy")
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Download PDF"
                                onClick={() => void downloadPdf(inv.id, inv.invoiceNumber)}
                              >
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Resend"
                                disabled={resendInvoice.isPending}
                                onClick={() => resendInvoice.mutate(inv.id)}
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </section>

            <section>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Payment history</h3>
              {dashboard.payments.length === 0 ? (
                <p className="text-sm text-slate-500 py-4">No payments recorded.</p>
              ) : (
                <div className="admin-table-wrap">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboard.payments.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="text-xs text-slate-500">
                            {format(new Date(p.paidAt), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>{p.invoiceNumber ?? "—"}</TableCell>
                          <TableCell>{p.method ?? "—"}</TableCell>
                          <TableCell className="text-right tabular-nums font-medium">
                            {formatInr(p.amountInr)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </section>
          </div>
        ) : (
          <p className="text-sm text-slate-500 py-6">Unable to load billing dashboard.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
