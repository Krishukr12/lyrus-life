import {
  Briefcase,
  ClipboardCheck,
  Code2,
  Crown,
  Eye,
  Kanban,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  onPreview: (preset: MomTemplatePreset) => void;
  onSelect: (preset: MomTemplatePreset) => void;
};

export function TemplatePresetGrid({
  presets,
  isLoading,
  onPreview,
  onSelect,
}: TemplatePresetGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-52 animate-pulse rounded-[22px] border border-slate-200/80 bg-slate-100/60"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {presets.map((preset) => {
        const Icon = ICON_MAP[preset.icon as keyof typeof ICON_MAP] ?? Briefcase;
        return (
          <article
            key={preset.key}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-[22px] border border-slate-200/80 bg-white",
              "shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
            )}
          >
            <div
              className="h-1.5 w-full"
              style={{ background: `linear-gradient(90deg, ${preset.accentColor}, ${preset.accentColor}88)` }}
            />
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm"
                  style={{ backgroundColor: preset.accentColor }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-wide">
                  {preset.sections.length} sections
                </Badge>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{preset.name}</h3>
              <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-500">{preset.description}</p>
              <div className="mt-4 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl"
                  onClick={() => onPreview(preset)}
                >
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                  Preview
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700"
                  onClick={() => onSelect(preset)}
                >
                  Use template
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
