import { format } from "date-fns";
import { History } from "lucide-react";
import type { PricingChangeLogEntry } from "@/lib/billing-types";
import { formatInr } from "@/lib/format-inr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FIELD_LABELS: Record<string, string> = {
  starterMonthlyInr: "Starter monthly",
  starterYearlyInr: "Starter yearly",
  growthMonthlyInr: "Growth monthly",
  growthYearlyInr: "Growth yearly",
  enterpriseBaseMonthlyInr: "Enterprise base",
  extraUserMonthlyInr: "Extra user",
  extraLocationMonthlyInr: "Extra location",
  gstPercent: "GST %",
  freeTrialDays: "Trial days",
};

function formatFieldValue(key: string, value: unknown): string {
  if (value == null) return "—";
  if (key === "gstPercent") return `${value}%`;
  if (key === "freeTrialDays") return `${value} days`;
  if (typeof value === "number") return formatInr(value);
  return String(value);
}

function summarizeChanges(entry: PricingChangeLogEntry): string[] {
  const lines: string[] = [];
  const prev = entry.previous;
  const next = entry.next;
  for (const key of Object.keys(FIELD_LABELS)) {
    const k = key as keyof typeof prev;
    if (prev[k] !== next[k]) {
      lines.push(
        `${FIELD_LABELS[key]}: ${formatFieldValue(key, prev[k])} → ${formatFieldValue(key, next[k])}`,
      );
    }
  }
  return lines.length > 0 ? lines : ["Pricing updated"];
}

export function PricingHistoryTable({ entries }: { entries: PricingChangeLogEntry[] }) {
  return (
    <section className="admin-card-accent overflow-hidden mb-6">
      <div className="admin-panel-header">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
          <div>
            <h2 className="admin-panel-title">Pricing change history</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Platform-wide pricing updates stored in the database
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
                <TableHead className="text-xs font-semibold text-slate-500">Changes</TableHead>
                <TableHead className="text-xs font-semibold text-slate-500">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} className="border-[#e5e7eb]">
                  <TableCell className="text-sm text-slate-700 align-top">
                    {entry.actorName ?? "System"}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 align-top">
                    <ul className="space-y-0.5">
                      {summarizeChanges(entry).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap align-top">
                    {format(new Date(entry.createdAt), "MMM d, yyyy · h:mm a")}
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
