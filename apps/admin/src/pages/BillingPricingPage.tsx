import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Eye, FileText, PauseCircle, Pencil, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { PageContainer } from "@/components/admin/PageContainer";
import { PageHeader } from "@/components/admin/PageHeader";
import { BillingActionsMenu } from "@/components/admin/billing/BillingActionsMenu";
import { BillingDetailDialog } from "@/components/admin/billing/BillingDetailDialog";
import { BillingStatusPill } from "@/components/admin/billing/BillingStatusPill";
import {
  CustomerBillingFilters,
  filterBillingRows,
  type BillingTableFilters,
} from "@/components/admin/billing/CustomerBillingFilters";
import {
  EditPricingDialog,
  type PricingEditTarget,
} from "@/components/admin/billing/EditPricingDialog";
import { EditBillingDialog } from "@/components/admin/billing/EditBillingDialog";
import { PlanBadge } from "@/components/admin/billing/PlanBadge";
import { PlatformBillingSettingsCard } from "@/components/admin/billing/PlatformBillingSettingsCard";
import { PricingHistoryTable } from "@/components/admin/billing/PricingHistoryTable";
import { PricingPlanCard } from "@/components/admin/billing/PricingPlanCard";
import { RevenueSummaryCards } from "@/components/admin/billing/RevenueSummaryCards";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DEFAULT_PRICING_FORM,
  pricingConfigFormSchema,
  type PricingConfigFormValues,
} from "@/lib/billing-schemas";
import type { CustomerBillingDetail, CustomerBillingRow, PlatformPricing } from "@/lib/billing-types";
import { formatInr } from "@/lib/format-inr";
import { PLAN_INCLUDED_ALLOWANCES } from "@/lib/plan-allowances";
import { appendPricingHistory, loadPricingHistory } from "@/lib/pricing-history";
import { adminApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const DEFAULT_FILTERS: BillingTableFilters = {
  search: "",
  plan: "all",
  billingStatus: "all",
  trialStatus: "all",
  dateFrom: "",
  dateTo: "",
};

export default function BillingPricingPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [detailRow, setDetailRow] = useState<CustomerBillingDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editRow, setEditRow] = useState<CustomerBillingRow | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editPricingTarget, setEditPricingTarget] = useState<PricingEditTarget | null>(null);
  const [pricingHistory, setPricingHistory] = useState(() => loadPricingHistory());
  const [filters, setFilters] = useState<BillingTableFilters>(DEFAULT_FILTERS);

  const pricingQuery = useQuery({
    queryKey: ["admin", "billing", "pricing"],
    queryFn: () => adminApi.getBillingPricing(),
  });

  const customersQuery = useQuery({
    queryKey: ["admin", "billing", "customers"],
    queryFn: () => adminApi.listCustomerBilling(),
  });

  const form = useForm<PricingConfigFormValues>({
    resolver: zodResolver(pricingConfigFormSchema),
    defaultValues: DEFAULT_PRICING_FORM,
    mode: "onBlur",
  });

  const pricing = form.watch();

  useEffect(() => {
    if (pricingQuery.data?.pricing) {
      form.reset(pricingQuery.data.pricing);
    }
  }, [pricingQuery.data?.pricing, form]);

  const savePricing = useMutation({
    mutationFn: (values: PricingConfigFormValues) =>
      adminApi.updateBillingPricing(values as PlatformPricing),
    onSuccess: (_data, variables) => {
      const previous = pricingQuery.data?.pricing;
      if (previous) {
        setPricingHistory(
          appendPricingHistory(previous, variables as PlatformPricing, user?.name ?? "Super Admin"),
        );
      }
      toast.success("Pricing saved");
      void queryClient.invalidateQueries({ queryKey: ["admin", "billing"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resetPricing = useMutation({
    mutationFn: () => adminApi.resetBillingPricing(),
    onSuccess: (data) => {
      const previous = form.getValues() as PlatformPricing;
      form.reset(data.pricing);
      setPricingHistory(
        appendPricingHistory(previous, data.pricing, user?.name ?? "Super Admin"),
      );
      toast.success("Pricing reset to defaults");
      void queryClient.invalidateQueries({ queryKey: ["admin", "billing"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function handlePlanPricingSave(patch: Record<string, number>) {
    const merged = { ...form.getValues(), ...patch };
    form.reset(merged);
    savePricing.mutate(merged);
    setEditPricingTarget(null);
  }

  function savePlatformSettings() {
    savePricing.mutate(form.getValues());
  }

  async function openDetails(row: CustomerBillingRow) {
    try {
      const { billing } = await adminApi.getCustomerBilling(row.organizationId);
      setDetailRow(billing);
      setDetailOpen(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load details");
    }
  }

  const allItems = customersQuery.data?.items ?? [];
  const filteredItems = useMemo(
    () => filterBillingRows(allItems, filters),
    [allItems, filters],
  );

  const pricingValues = {
    starterMonthlyInr: pricing.starterMonthlyInr,
    starterYearlyInr: pricing.starterYearlyInr,
    growthMonthlyInr: pricing.growthMonthlyInr,
    growthYearlyInr: pricing.growthYearlyInr,
    enterpriseBaseMonthlyInr: pricing.enterpriseBaseMonthlyInr,
    extraUserMonthlyInr: pricing.extraUserMonthlyInr,
    extraLocationMonthlyInr: pricing.extraLocationMonthlyInr,
  };

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Revenue · INR"
        title="Billing & Pricing"
        description="Configure platform pricing, monitor MRR, and manage customer subscriptions for the Indian market."
      />

      <RevenueSummaryCards
        items={allItems}
        loading={customersQuery.isLoading}
      />

      <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Plan pricing</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Display prices in ₹ — edit any plan to update platform-wide configuration
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-[8px] shrink-0"
          disabled={resetPricing.isPending}
          onClick={() => resetPricing.mutate()}
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          Reset all to default
        </Button>
      </div>

      {pricingQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-72 rounded-[14px]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <PricingPlanCard
            planKey="STARTER"
            planLabel="Starter"
            monthlyInr={pricing.starterMonthlyInr}
            yearlyInr={pricing.starterYearlyInr}
            includedUsers={PLAN_INCLUDED_ALLOWANCES.STARTER.users}
            includedLocations={PLAN_INCLUDED_ALLOWANCES.STARTER.locations}
            accent="slate"
            onEdit={() => setEditPricingTarget("starter")}
          />
          <PricingPlanCard
            planKey="PROFESSIONAL"
            planLabel="Growth"
            monthlyInr={pricing.growthMonthlyInr}
            yearlyInr={pricing.growthYearlyInr}
            includedUsers={PLAN_INCLUDED_ALLOWANCES.PROFESSIONAL.users}
            includedLocations={PLAN_INCLUDED_ALLOWANCES.PROFESSIONAL.locations}
            accent="violet"
            onEdit={() => setEditPricingTarget("growth")}
          />
          <PricingPlanCard
            planKey="ENTERPRISE"
            planLabel="Enterprise"
            baseMonthlyInr={pricing.enterpriseBaseMonthlyInr}
            extraUserInr={pricing.extraUserMonthlyInr}
            extraLocationInr={pricing.extraLocationMonthlyInr}
            includedUsers={PLAN_INCLUDED_ALLOWANCES.ENTERPRISE.users}
            includedLocations={PLAN_INCLUDED_ALLOWANCES.ENTERPRISE.locations}
            accent="blue"
            onEdit={() => setEditPricingTarget("enterprise")}
          />
        </div>
      )}

      <PricingHistoryTable entries={pricingHistory} />

      <Form {...form}>
        <div className="mb-6 space-y-4">
          <PlatformBillingSettingsCard control={form.control} />
          <div className="flex justify-end">
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 rounded-[10px] shadow-sm shadow-blue-600/20"
              disabled={savePricing.isPending}
              onClick={savePlatformSettings}
            >
              <Save className="h-4 w-4 mr-2" />
              {savePricing.isPending ? "Saving…" : "Save platform settings"}
            </Button>
          </div>
        </div>
      </Form>

      <section className="admin-card-accent overflow-hidden">
        <div className="admin-panel-header">
          <div>
            <h2 className="admin-panel-title">Customer billing</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {filteredItems.length} of {allItems.length} organizations · amounts include GST
            </p>
          </div>
        </div>

        <CustomerBillingFilters
          filters={filters}
          onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        />

        {customersQuery.isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center px-6">
            <p className="text-sm font-medium text-slate-900">No organizations match filters</p>
            <p className="text-xs text-slate-500 mt-1">
              Adjust filters or onboard customers to see billing here.
            </p>
          </div>
        ) : (
          <div className="admin-table-wrap max-h-[min(70vh,720px)]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-[#e5e7eb]">
                  <TableHead className="text-xs font-semibold text-slate-500 min-w-[160px]">
                    Organization
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500">Plan</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 text-right">
                    Users
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 text-right">
                    Locations
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 text-right">
                    Monthly (INR)
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 text-right">
                    GST (INR)
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 text-right">
                    Total (INR)
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500">Next bill</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((row) => (
                  <TableRow key={row.organizationId} className="border-[#e5e7eb]">
                    <TableCell className="py-3.5">
                      <p className="text-sm font-medium text-slate-900">{row.organizationName}</p>
                      <p className="text-xs text-slate-500">{row.slug}</p>
                    </TableCell>
                    <TableCell>
                      <PlanBadge plan={row.currentPlan} />
                    </TableCell>
                    <TableCell className="text-sm tabular-nums text-right">{row.activeUsers}</TableCell>
                    <TableCell className="text-sm tabular-nums text-right">
                      {row.activeLocations}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums text-right text-slate-700">
                      {formatInr(row.monthlyAmountInr)}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums text-right text-slate-500">
                      {formatInr(row.gstInr)}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums text-right font-semibold text-slate-900">
                      {formatInr(row.totalAmountInr)}
                    </TableCell>
                    <TableCell>
                      <BillingStatusPill status={row.billingStatus} />
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                      {row.nextBillingDate
                        ? format(new Date(row.nextBillingDate), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell className="py-3.5">
                      <BillingActionsMenu
                        actions={[
                          {
                            label: "View billing",
                            icon: <Eye className="h-3.5 w-3.5" />,
                            onClick: () => void openDetails(row),
                          },
                          {
                            label: "Edit plan",
                            icon: <Pencil className="h-3.5 w-3.5" />,
                            onClick: () => {
                              setEditRow(row);
                              setEditOpen(true);
                            },
                          },
                          {
                            label: "Generate invoice",
                            icon: <FileText className="h-3.5 w-3.5" />,
                            onClick: () =>
                              toast.info(
                                "Invoice generation will be available in a future release.",
                              ),
                          },
                          {
                            label: "Suspend billing",
                            icon: <PauseCircle className="h-3.5 w-3.5" />,
                            variant: "danger",
                            onClick: () =>
                              toast.info(
                                "Use Edit plan to set billing status to suspended or overdue.",
                              ),
                          },
                          {
                            label: "Mark as paid",
                            onClick: () =>
                              toast.info(
                                "Payment recording will be available in a future release.",
                              ),
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      <EditPricingDialog
        open={editPricingTarget !== null}
        onOpenChange={(open) => !open && setEditPricingTarget(null)}
        target={editPricingTarget}
        values={pricingValues}
        onSave={handlePlanPricingSave}
        saving={savePricing.isPending}
      />

      <BillingDetailDialog open={detailOpen} onOpenChange={setDetailOpen} billing={detailRow} />

      <EditBillingDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        row={editRow}
        onSaved={() => void queryClient.invalidateQueries({ queryKey: ["admin", "billing"] })}
      />
    </PageContainer>
  );
}
