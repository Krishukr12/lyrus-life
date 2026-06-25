import { motion } from "framer-motion";
import {
  Bot,
  CheckCircle2,
  FileText,
  Loader2,
  Mic,
  Radio,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Meeting } from "@/lib/types";

const STEPS = [
  { key: "connect", label: "Bot connects", icon: Bot },
  { key: "live", label: "Live meeting", icon: Users },
  { key: "ending", label: "Call ended", icon: Radio },
  { key: "transcribe", label: "Transcribe", icon: Mic },
  { key: "mom", label: "MOM draft", icon: FileText },
] as const;

type ExternalRecordingProgressProps = {
  meeting: Meeting;
  className?: string;
};

export function ExternalRecordingProgress({ meeting, className }: ExternalRecordingProgressProps) {
  const progress = meeting.recordingProgress;
  if (!progress) return null;

  const activeIndex = Math.max(0, Math.min(progress.step - 1, STEPS.length - 1));
  const failed = progress.phase === "failed";
  const ready = progress.phase === "ready";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "overflow-hidden rounded-xl border shadow-sm",
        progress.isLive && "border-secondary/30 bg-gradient-to-br from-secondary/10 via-background to-background",
        progress.isProcessing && "border-primary/25 bg-gradient-to-br from-primary/8 via-background to-background",
        ready && "border-success/30 bg-gradient-to-br from-success/8 via-background to-background",
        failed && "border-destructive/30 bg-gradient-to-br from-destructive/8 via-background to-background",
        className,
      )}
    >
      <div className="p-5 sm:p-6 space-y-5">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              progress.isLive && "bg-secondary/15 text-secondary",
              progress.isProcessing && "bg-primary/12 text-primary",
              ready && "bg-success/12 text-success",
              failed && "bg-destructive/12 text-destructive",
            )}
          >
            {failed ? (
              <XCircle className="h-5 w-5" />
            ) : ready ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : progress.isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : progress.isLive ? (
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-secondary" />
              </span>
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-heading text-base font-semibold tracking-tight">{progress.title}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{progress.detail}</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-muted" aria-hidden />
          <motion.div
            className="absolute left-0 top-5 h-0.5 bg-secondary"
            initial={false}
            animate={{
              width: `${Math.max(0, ((ready ? STEPS.length : activeIndex) / (STEPS.length - 1)) * 100)}%`,
            }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            aria-hidden
          />
          <ol className="relative grid grid-cols-5 gap-1">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const done = ready || index < activeIndex;
              const current = !ready && !failed && index === activeIndex;
              return (
                <li key={step.key} className="flex flex-col items-center gap-2 text-center">
                  <div
                    className={cn(
                      "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background transition-colors",
                      done && "border-secondary bg-secondary text-secondary-foreground",
                      current && "border-secondary bg-background text-secondary shadow-[0_0_0_4px_hsl(var(--secondary)/0.15)]",
                      !done && !current && "border-muted text-muted-foreground",
                      failed && current && "border-destructive text-destructive",
                    )}
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-medium leading-tight sm:text-xs",
                      (done || current) && "text-foreground",
                      !done && !current && "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {progress.isLive && progress.phase === "live" && (
          <p className="rounded-lg border border-secondary/20 bg-secondary/5 px-3 py-2 text-xs text-muted-foreground">
            You can leave the call — the bot stays until everyone else has left, then exits automatically.
          </p>
        )}
      </div>
    </motion.div>
  );
}
