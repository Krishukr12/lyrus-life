import { FileText, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type MeetingLiveNotesPanelProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  shared?: boolean;
};

export function MeetingLiveNotesPanel({
  value,
  onChange,
  className,
  shared = true,
}: MeetingLiveNotesPanelProps) {
  return (
    <aside
      className={cn(
        "meeting-notes-panel flex flex-col shrink-0 w-full sm:w-[min(100%,22rem)] lg:w-80 xl:w-[22rem]",
        "rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-2xl",
        "animate-in slide-in-from-right-4 duration-300",
        className,
      )}
    >
      <div className="flex items-start gap-3 px-4 pt-4 pb-3 border-b border-white/10">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
          <FileText className="h-4 w-4" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <h2 className="font-heading text-sm font-semibold text-white">Live notes</h2>
          <p className="text-[11px] leading-snug text-white/50">
            {shared
              ? "Shared with everyone in the room. Used for your minutes after the call."
              : "Personal scratch pad during this call."}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 min-h-0">
        <Label htmlFor="live-notes" className="sr-only">
          Live meeting notes
        </Label>
        <Textarea
          id="live-notes"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            "Alice: budget by Friday\nBob: pilot moved to Q3\n• Decision: approve phase 2"
          }
          className={cn(
            "flex-1 min-h-[200px] resize-none rounded-xl border-white/10",
            "bg-black/25 text-white placeholder:text-white/30",
            "focus-visible:ring-secondary/50 focus-visible:border-secondary/40",
            "text-sm leading-relaxed",
          )}
        />
        <p className="flex items-center gap-1.5 text-[11px] text-white/40">
          <Sparkles className="h-3 w-3 text-secondary/80 shrink-0" />
          Ending the meeting runs transcription and MOM generation.
        </p>
      </div>
    </aside>
  );
}
