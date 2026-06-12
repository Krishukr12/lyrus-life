import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  STARTER: "bg-slate-100 text-slate-700 ring-slate-200",
  Starter: "bg-slate-100 text-slate-700 ring-slate-200",
  PROFESSIONAL: "bg-violet-50 text-violet-700 ring-violet-200",
  Growth: "bg-violet-50 text-violet-700 ring-violet-200",
  ENTERPRISE: "bg-blue-50 text-blue-700 ring-blue-200",
  Enterprise: "bg-blue-50 text-blue-700 ring-blue-200",
  Platform: "bg-amber-50 text-amber-800 ring-amber-200",
};

export function PlanBadge({ plan }: { plan: string }) {
  if (plan === "Platform") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
          styles.Platform,
        )}
      >
        Platform
      </span>
    );
  }

  const key =
    plan in styles
      ? plan
      : plan === "PROFESSIONAL"
        ? "PROFESSIONAL"
        : plan.toUpperCase() in styles
          ? plan.toUpperCase()
          : "STARTER";
  const label =
    plan === "PROFESSIONAL" || plan === "Growth"
      ? "Growth"
      : plan === "STARTER" || plan === "Starter"
        ? "Starter"
        : plan === "ENTERPRISE" || plan === "Enterprise"
          ? "Enterprise"
          : plan;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
        styles[key] ?? styles.STARTER,
      )}
    >
      {label}
    </span>
  );
}
