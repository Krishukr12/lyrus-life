import { Check, Pencil, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OnboardingMomTemplateDraft } from "@/lib/mom-template-types";
import { cn } from "@/lib/utils";

type ConfiguredTemplatesListProps = {
  templates: OnboardingMomTemplateDraft[];
  activeClientId: string | null;
  onSelect: (clientId: string) => void;
  onSetDefault: (clientId: string) => void;
  onDelete: (clientId: string) => void;
  onEdit: (clientId: string) => void;
};

export function ConfiguredTemplatesList({
  templates,
  activeClientId,
  onSelect,
  onSetDefault,
  onDelete,
  onEdit,
}: ConfiguredTemplatesListProps) {
  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Check className="h-4 w-4 text-emerald-600" />
        <p className="text-sm font-semibold text-slate-800">
          {templates.length} template{templates.length === 1 ? "" : "s"} added
        </p>
      </div>

      <div className="space-y-2">
        {templates.map((template) => {
          const active = template.clientId === activeClientId;

          return (
            <div
              key={template.clientId}
              className={cn(
                "flex flex-wrap items-center gap-2 rounded-lg border bg-white px-3 py-2.5 transition-all",
                active ? "border-blue-200 ring-1 ring-blue-500/10" : "border-slate-200/80",
              )}
            >
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => onSelect(template.clientId)}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="text-sm font-medium text-slate-900">{template.name}</p>
                  {template.isDefault ? (
                    <Badge className="h-5 rounded-full bg-amber-50 px-2 text-[10px] text-amber-700 hover:bg-amber-50">
                      <Star className="mr-0.5 h-2.5 w-2.5 fill-current" />
                      Default
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {template.sections.length} sections
                  {template.pendingUpload ? ` · ${template.pendingUpload.name} to import` : ""}
                </p>
              </button>

              <div className="flex items-center gap-1">
                {!template.isDefault ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 rounded-md px-2 text-[11px] text-slate-600"
                    onClick={() => onSetDefault(template.clientId)}
                  >
                    <Star className="mr-1 h-3 w-3" />
                    Set default
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 rounded-md p-0"
                  onClick={() => onEdit(template.clientId)}
                  aria-label="Edit template"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 rounded-md p-0 text-red-500 hover:text-red-600"
                  onClick={() => onDelete(template.clientId)}
                  aria-label="Remove template"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
