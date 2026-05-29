import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function formatMeetingElapsed(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${pad2(m)}:${pad2(s)}`;
  return `${pad2(m)}:${pad2(s)}`;
}

type MeetingElapsedTimerProps = {
  /** ISO timestamp when the waiting room / session opened (server `liveStartedAt`). */
  sessionStartedAt: string | null;
  isLive?: boolean;
  className?: string;
};

export function MeetingElapsedTimer({
  sessionStartedAt,
  isLive = true,
  className,
}: MeetingElapsedTimerProps) {
  const [elapsed, setElapsed] = useState("00:00");

  useEffect(() => {
    if (!sessionStartedAt) {
      setElapsed("00:00");
      return;
    }

    const startMs = new Date(sessionStartedAt).getTime();
    if (Number.isNaN(startMs)) {
      setElapsed("00:00");
      return;
    }

    const tick = () => setElapsed(formatMeetingElapsed(Date.now() - startMs));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [sessionStartedAt]);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs tabular-nums",
        isLive
          ? "border-white/15 bg-white/5 text-white/90"
          : "border-amber-400/25 bg-amber-500/10 text-amber-100",
        className,
      )}
      title={isLive ? "Time in this meeting" : "Time in waiting room"}
    >
      <Clock className="h-3 w-3 shrink-0 opacity-70" />
      {elapsed}
    </div>
  );
}
