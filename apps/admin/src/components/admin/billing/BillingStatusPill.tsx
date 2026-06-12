import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  PENDING: "bg-amber-50 text-amber-800 ring-amber-600/20",
  OVERDUE: "bg-red-50 text-red-700 ring-red-600/20",
  TRIAL: "bg-blue-50 text-blue-700 ring-blue-600/20",
};

export function BillingStatusPill({ status }: { status: string }) {
  const key = status in styles ? status : "PENDING";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
        styles[key],
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
