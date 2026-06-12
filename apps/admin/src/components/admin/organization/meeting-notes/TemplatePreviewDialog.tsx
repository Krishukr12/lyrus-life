import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MomTemplateSectionDraft } from "@/lib/mom-template-types";

type TemplatePreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  sections: MomTemplateSectionDraft[] | Array<{
    title: string;
    description?: string;
    aiInstructions: string;
    isRequired: boolean;
  }>;
};

export function TemplatePreviewDialog({
  open,
  onOpenChange,
  title,
  description,
  sections,
}: TemplatePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto rounded-[22px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            {title}
          </DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Document structure
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Generated MOM documents will follow this section order and AI guidance.
            </p>
          </div>

          {sections.map((section, index) => (
            <div
              key={`${section.title}-${index}`}
              className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  {index + 1}. {section.title}
                </p>
                <Badge
                  variant="outline"
                  className={
                    section.isRequired
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-500"
                  }
                >
                  {section.isRequired ? "Required" : "Optional"}
                </Badge>
              </div>
              {"description" in section && section.description ? (
                <p className="mt-1 text-xs text-slate-500">{section.description}</p>
              ) : null}
              <p className="mt-3 rounded-xl bg-blue-50/60 px-3 py-2 text-xs leading-relaxed text-slate-600">
                <span className="font-semibold text-blue-700">AI: </span>
                {section.aiInstructions}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
