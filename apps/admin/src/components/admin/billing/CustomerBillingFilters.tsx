import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type BillingTableFilters = {
  search: string;
  plan: string;
  billingStatus: string;
  trialStatus: string;
  dateFrom: string;
  dateTo: string;
};

export function CustomerBillingFilters({
  filters,
  onChange,
}: {
  filters: BillingTableFilters;
  onChange: (patch: Partial<BillingTableFilters>) => void;
}) {
  return (
    <div className="border-b border-[#e5e7eb] bg-slate-50/40 px-4 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search organization name…"
            className="h-9 pl-9 rounded-[10px] border-[#e5e7eb] bg-white"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
          />
        </div>
        <Select value={filters.plan} onValueChange={(v) => onChange({ plan: v })}>
          <SelectTrigger className="h-9 w-full sm:w-[140px] rounded-[10px] bg-white">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All plans</SelectItem>
            <SelectItem value="STARTER">Starter</SelectItem>
            <SelectItem value="PROFESSIONAL">Growth</SelectItem>
            <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.billingStatus}
          onValueChange={(v) => onChange({ billingStatus: v })}
        >
          <SelectTrigger className="h-9 w-full sm:w-[150px] rounded-[10px] bg-white">
            <SelectValue placeholder="Billing status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
            <SelectItem value="TRIAL">Trial</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.trialStatus} onValueChange={(v) => onChange({ trialStatus: v })}>
          <SelectTrigger className="h-9 w-full sm:w-[130px] rounded-[10px] bg-white">
            <SelectValue placeholder="Trial" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="trial">On trial</SelectItem>
            <SelectItem value="paid">Not on trial</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="date"
            className="h-9 w-[150px] rounded-[10px] bg-white text-sm"
            value={filters.dateFrom}
            onChange={(e) => onChange({ dateFrom: e.target.value })}
            aria-label="Next billing from"
          />
          <span className="text-xs text-slate-400">to</span>
          <Input
            type="date"
            className="h-9 w-[150px] rounded-[10px] bg-white text-sm"
            value={filters.dateTo}
            onChange={(e) => onChange({ dateTo: e.target.value })}
            aria-label="Next billing to"
          />
        </div>
      </div>
    </div>
  );
}

export function filterBillingRows(
  items: import("@/lib/billing-types").CustomerBillingRow[],
  filters: BillingTableFilters,
) {
  return items.filter((row) => {
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      if (
        !row.organizationName.toLowerCase().includes(q) &&
        !row.slug.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (filters.plan !== "all" && row.currentPlan !== filters.plan) return false;
    if (filters.billingStatus !== "all" && row.billingStatus !== filters.billingStatus) {
      return false;
    }
    if (filters.trialStatus === "trial" && row.billingStatus !== "TRIAL") return false;
    if (filters.trialStatus === "paid" && row.billingStatus === "TRIAL") return false;
    if (filters.dateFrom && row.nextBillingDate) {
      if (row.nextBillingDate.slice(0, 10) < filters.dateFrom) return false;
    }
    if (filters.dateTo && row.nextBillingDate) {
      if (row.nextBillingDate.slice(0, 10) > filters.dateTo) return false;
    }
    return true;
  });
}
