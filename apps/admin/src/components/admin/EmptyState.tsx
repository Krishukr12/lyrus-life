import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="rounded-[14px] border border-dashed border-slate-200 bg-slate-50/80 p-5 mb-5">
        <Icon className="h-7 w-7 text-slate-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-md leading-relaxed">{description}</p>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}
