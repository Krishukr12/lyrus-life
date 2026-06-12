import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { OrganizationAvatar } from "@/components/admin/OrganizationAvatar";
import { PlanBadge } from "@/components/admin/billing/PlanBadge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatInr } from "@/lib/format-inr";
import type { OrganizationSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

type OrganizationsTableProps = {
  rows: OrganizationSummary[];
  revenueByOrg: Map<string, number>;
};

export function OrganizationsTable({ rows, revenueByOrg }: OrganizationsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-sm">
      <div className="admin-table-wrap">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200/80 hover:bg-transparent">
              <TableHead className="min-w-[220px] text-xs font-semibold text-slate-500">
                Organization
              </TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Status</TableHead>
              <TableHead className="text-xs font-semibold text-slate-500">Plan</TableHead>
              <TableHead className="hidden text-xs font-semibold text-slate-500 md:table-cell">
                Industry
              </TableHead>
              <TableHead className="text-right text-xs font-semibold text-slate-500">
                Employees
              </TableHead>
              <TableHead className="text-right text-xs font-semibold text-slate-500">
                Meetings
              </TableHead>
              <TableHead className="hidden text-right text-xs font-semibold text-slate-500 lg:table-cell">
                MRR
              </TableHead>
              <TableHead className="hidden text-xs font-semibold text-slate-500 sm:table-cell">
                Created
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((org) => {
              const mrr = revenueByOrg.get(org.id);
              return (
                <TableRow
                  key={org.id}
                  className={cn(
                    "cursor-pointer border-slate-100/80 transition-colors",
                    "hover:bg-blue-50/40",
                  )}
                  onClick={() => navigate(`/organizations/${org.id}`)}
                >
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3">
                      <OrganizationAvatar
                        name={org.name}
                        className="h-9 w-9 rounded-xl text-xs shadow-sm"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{org.name}</p>
                        <p className="truncate text-xs text-slate-500">{org.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={org.status} />
                  </TableCell>
                  <TableCell>
                    <PlanBadge plan={org.subscriptionPlan} />
                  </TableCell>
                  <TableCell className="hidden text-sm text-slate-600 md:table-cell">
                    {org.industry ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums text-slate-700">
                    {org.counts?.users ?? 0}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums text-slate-700">
                    {org.counts?.meetings ?? 0}
                  </TableCell>
                  <TableCell className="hidden text-right text-sm tabular-nums text-slate-700 lg:table-cell">
                    {mrr != null ? formatInr(mrr) : "—"}
                  </TableCell>
                  <TableCell className="hidden text-sm text-slate-600 sm:table-cell">
                    {format(new Date(org.createdAt), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
