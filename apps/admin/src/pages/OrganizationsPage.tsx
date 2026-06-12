import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Filter,
  FlaskConical,
  IndianRupee,
  Plus,
  Search,
} from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { PageContainer } from "@/components/admin/PageContainer";
import { ExecutiveMetricCard } from "@/components/admin/ExecutiveMetricCard";
import { OrganizationsTable } from "@/components/admin/organization/OrganizationsTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApi } from "@/services/api";
import { useGlobalSearch } from "@/contexts/GlobalSearchContext";
import { formatInr } from "@/lib/format-inr";
import {
  organizationsFilterSchema,
  type OrganizationsFilterValues,
} from "@/lib/schemas";

export default function OrganizationsPage() {
  const [searchParams] = useSearchParams();
  const { setQuery: setGlobalSearch } = useGlobalSearch();
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const urlSearch = searchParams.get("search") ?? "";
  const urlStatus = searchParams.get("status");
  const initialStatus =
    urlStatus === "ACTIVE" || urlStatus === "SUSPENDED" || urlStatus === "PENDING"
      ? urlStatus
      : "all";

  const filterForm = useForm<OrganizationsFilterValues>({
    resolver: zodResolver(organizationsFilterSchema),
    defaultValues: { search: urlSearch, status: initialStatus },
    mode: "onChange",
  });

  useEffect(() => {
    if (filterForm.getValues("search") !== urlSearch) {
      filterForm.setValue("search", urlSearch);
    }
  }, [urlSearch, filterForm]);

  const searchValue = filterForm.watch("search");
  const statusFilter = filterForm.watch("status");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchValue?.trim() ?? "");
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    const param = searchParams.get("search") ?? "";
    if (debouncedSearch !== param) {
      setGlobalSearch(debouncedSearch);
    }
  }, [debouncedSearch, searchParams, setGlobalSearch]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const apiStatus =
    statusFilter === "all" ? undefined : (statusFilter as "ACTIVE" | "SUSPENDED" | "PENDING");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin", "organizations", debouncedSearch, page, apiStatus],
    queryFn: () =>
      adminApi.listOrganizations({
        search: debouncedSearch || undefined,
        page,
        status: apiStatus,
      }),
  });

  const { data: dashboard } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminApi.getDashboard(),
  });

  const revenueByOrg = useMemo(() => {
    const map = new Map<string, number>();
    for (const row of dashboard?.charts.revenueByCustomer ?? []) {
      map.set(row.organizationId, row.amountInr);
    }
    return map;
  }, [dashboard]);

  const rows = data?.items ?? [];

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Tenants"
        title="Organizations"
        description="Manage customer tenants, subscriptions, and lifecycle from a premium control center."
        actions={
          <Button
            className="rounded-xl bg-blue-600 shadow-sm shadow-blue-600/20 hover:bg-blue-700"
            asChild
          >
            <Link to="/organizations/new">
              <Plus className="mr-2 h-4 w-4" />
              Onboard organization
            </Link>
          </Button>
        }
      />

      {/* KPI summary */}
      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ExecutiveMetricCard
          label="Total Organizations"
          value={dashboard?.organizations.total ?? data?.total ?? "—"}
          icon={Building2}
          accent="blue"
          loading={!dashboard && isLoading}
        />
        <ExecutiveMetricCard
          label="Active Organizations"
          value={dashboard?.organizations.active ?? "—"}
          icon={Building2}
          accent="emerald"
          loading={!dashboard}
        />
        <ExecutiveMetricCard
          label="Trial Organizations"
          value={dashboard?.billing.trialAccounts ?? "—"}
          icon={FlaskConical}
          accent="violet"
          loading={!dashboard}
        />
        <ExecutiveMetricCard
          label="Monthly Revenue"
          value={dashboard ? formatInr(dashboard.billing.mrrInr) : "—"}
          icon={IndianRupee}
          accent="blue"
          featured
          loading={!dashboard}
        />
      </section>

      {/* Filters */}
      <Form {...filterForm}>
        <div className="mb-6 flex flex-col gap-3 rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <FormField
            control={filterForm.control}
            name="search"
            render={({ field }) => (
              <FormItem className="w-full flex-1 space-y-0">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <FormControl>
                    <Input
                      placeholder="Search by name, slug, or email…"
                      className="h-11 w-full rounded-xl border-slate-200/80 bg-slate-50/50 pl-9 focus:bg-white"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={filterForm.control}
            name="status"
            render={({ field }) => (
              <FormItem className="w-full space-y-0 sm:w-[200px]">
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full rounded-xl border-slate-200/80 bg-slate-50/50">
                      <Filter className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>

      {isLoading ? (
        <div className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No organizations found"
          description="Create your first organization to start onboarding customers on the platform."
          action={
            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700" asChild>
              <Link to="/organizations/new">Onboard organization</Link>
            </Button>
          }
        />
      ) : (
        <>
          <OrganizationsTable rows={rows} revenueByOrg={revenueByOrg} />

          <div className="mt-4 flex flex-col gap-3 rounded-[18px] border border-slate-200/80 bg-white px-5 py-3.5 text-sm text-slate-500 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <span>
              {data?.total ?? 0} total · Page {data?.page ?? 1}
              {isFetching ? " · Updating…" : ""}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                disabled={!data || data.items.length < (data.pageSize ?? 25)}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

    </PageContainer>
  );
}
