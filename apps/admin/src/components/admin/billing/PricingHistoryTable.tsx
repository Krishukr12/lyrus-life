import { format } from "date-fns";
import { History } from "lucide-react";
import type { PricingHistoryEntry } from "@/lib/pricing-history";
import { PlanBadge } from "@/components/admin/billing/PlanBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PricingHistoryTable({ entries }: { entries: PricingHistoryEntry[] }) {
  return (
    <section className="admin-card-accent overflow-hidden mb-6">
      <div className="admin-panel-header">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
          <div>
            <h2 className="admin-panel-title">Pricing change history</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Local audit log of pricing updates from this admin session
            </p>
          </div>
        </div>
      </div>
      {entries.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-slate-500">
          No pricing changes recorded yet. Updates appear here when you save pricing.
        </p>
      ) : (
        <div className="admin-table-wrap max-h-64">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-[#e5e7eb]">
                <TableHead className="text-xs font-semibold text-slate-500">Changed by</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Plan</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Field</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Old value</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">New value</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} className="border-[#e5e7eb]">
                  <TableCell className="text-sm text-slate-700">{entry.changedBy}</TableCell>
                  <TableCell>
                    <PlanBadge plan={entry.plan} />
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{entry.field}</TableCell>
                  <TableCell className="text-sm tabular-nums text-slate-500">
                    {entry.oldValue}
                  </TableCell>
                  <TableCell className="text-sm tabular-nums font-medium text-slate-900">
                    {entry.newValue}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {format(new Date(entry.date), "MMM d, yyyy · h:mm a")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
