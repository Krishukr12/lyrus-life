import {
  Briefcase,
  Check,
  ClipboardCheck,
  Code2,
  Crown,
  Kanban,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MomTemplatePreset } from "@/lib/mom-template-types";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  briefcase: Briefcase,
  code: Code2,
  kanban: Kanban,
  "trending-up": TrendingUp,
  users: Users,
  crown: Crown,
  "clipboard-check": ClipboardCheck,
  sparkles: Sparkles,
} as const;

type TemplatePresetGridProps = {
  presets: MomTemplatePreset[];
  isLoading?: boolean;
  selectedKey?: string | null;
  onSelect: (preset: MomTemplatePreset) => void;
};

export function TemplatePresetGrid({
  presets,
  isLoading,
  selectedKey,
  onSelect,
}: TemplatePresetGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-xl border border-slate-200/80 bg-slate-100/60"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {presets.map((preset) => {
        const Icon = ICON_MAP[preset.icon as keyof typeof ICON_MAP] ?? Briefcase;
        const selected = selectedKey === preset.key;

        return (
          <button
            key={preset.key}
            type="button"
            onClick={() => onSelect(preset)}
            className={cn(
              "group relative flex flex-col rounded-xl border bg-white p-4 text-left transition-all duration-200",
              selected
                ? "border-blue-300 bg-blue-50/30 ring-2 ring-blue-500/20"
                : "border-slate-200/80 hover:border-blue-200 hover:shadow-sm",
            )}
          >
            {selected ? (
              <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                <Check className="h-3 w-3" />
              </span>
            ) : null}

            <div className="flex items-start gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
                style={{ backgroundColor: preset.accentColor }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 pr-6">
                <h3 className="text-sm font-semibold text-slate-900">{preset.name}</h3>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
                  {preset.description}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {preset.sections.slice(0, 4).map((section) => (
                <Badge
                  key={section.title}
                  variant="outline"
                  className="rounded-md px-1.5 py-0 text-[10px] font-normal text-slate-600"
                >
                  {section.title}
                </Badge>
              ))}
              {preset.sections.length > 4 ? (
                <Badge
                  variant="outline"
                  className="rounded-md px-1.5 py-0 text-[10px] font-normal text-slate-500"
                >
                  +{preset.sections.length - 4} more
                </Badge>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
