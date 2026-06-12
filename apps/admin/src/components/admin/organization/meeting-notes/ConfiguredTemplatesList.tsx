import {
  Archive,
  Copy,
  Eye,
  MoreHorizontal,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OnboardingMomTemplateDraft } from "@/lib/mom-template-types";
import { cn } from "@/lib/utils";

type ConfiguredTemplatesListProps = {
  templates: OnboardingMomTemplateDraft[];
  activeClientId: string | null;
  onSelect: (clientId: string) => void;
  onPreview: (template: OnboardingMomTemplateDraft) => void;
  onSetDefault: (clientId: string) => void;
  onDuplicate: (clientId: string) => void;
  onArchive: (clientId: string) => void;
  onDelete: (clientId: string) => void;
  onEdit: (clientId: string) => void;
};

export function ConfiguredTemplatesList({
  templates,
  activeClientId,
  onSelect,
  onPreview,
  onSetDefault,
  onDuplicate,
  onArchive,
  onDelete,
  onEdit,
}: ConfiguredTemplatesListProps) {
  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">Configured templates ({templates.length})</p>
      </div>
      <div className="space-y-2">
        {templates.map((template) => {
          const active = template.clientId === activeClientId;
          return (
            <div
              key={template.clientId}
              className={cn(
                "rounded-2xl border bg-white p-4 transition-all duration-300",
                active
                  ? "border-blue-200 shadow-sm ring-1 ring-blue-500/10"
                  : "border-slate-200/80 hover:border-slate-300",
              )}
            >
              <div className="flex flex-wrap items-start gap-3">
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => onSelect(template.clientId)}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{template.name}</p>
                    {template.isDefault ? (
                      <Badge className="rounded-full bg-amber-50 text-amber-700 hover:bg-amber-50">
                        <Star className="mr-1 h-3 w-3 fill-current" />
                        Default
                      </Badge>
                    ) : null}
                    <Badge variant="outline" className="rounded-full text-[10px] uppercase">
                      {template.source}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {template.sections.length} sections
                    {template.pendingUpload ? ` · ${template.pendingUpload.name} queued` : ""}
                  </p>
                </button>

                <div className="flex flex-wrap gap-1">
                  <Button type="button" variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onPreview(template)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onEdit(template.clientId)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {!template.isDefault ? (
                    <Button type="button" variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onSetDefault(template.clientId)}>
                      <Star className="h-4 w-4" />
                    </Button>
                  ) : null}
                  <Button type="button" variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onDuplicate(template.clientId)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 rounded-lg" onClick={() => onArchive(template.clientId)}>
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-lg text-red-500 hover:text-red-600"
                    onClick={() => onDelete(template.clientId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <MoreHorizontal className="hidden h-4 w-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
