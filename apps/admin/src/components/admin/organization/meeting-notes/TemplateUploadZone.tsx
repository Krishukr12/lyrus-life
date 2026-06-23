import { FileUp, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TemplateUploadZoneProps = {
  file: File | null | undefined;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
};

const ACCEPT = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function TemplateUploadZone({ file, onFileSelect, disabled }: TemplateUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(files: FileList | null) {
    const selected = files?.[0];
    if (!selected) return;
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(selected.type)) return;
    onFileSelect(selected);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative rounded-[22px] border-2 border-dashed p-8 text-center transition-all duration-300",
          dragOver
            ? "border-blue-400 bg-blue-50/50"
            : "border-slate-200 bg-slate-50/50 hover:border-slate-300",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
          {disabled ? (
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          ) : (
            <FileUp className="h-5 w-5 text-blue-600" />
          )}
        </div>
        <p className="text-sm font-semibold text-slate-800">Upload your existing format</p>
        <p className="mt-1 text-xs text-slate-500">DOCX or PDF up to 25 MB. We&apos;ll extract headings to match your layout.</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 rounded-xl"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          Choose file
        </Button>
      </div>

      {file ? (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB · ready to upload after provisioning</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-lg"
            onClick={() => onFileSelect(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
