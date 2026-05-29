import { Loader2, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MeetingLobbyOverlayProps = {
  isHost: boolean;
  starting?: boolean;
  onStartMeeting?: () => void;
  className?: string;
};

/** Compact top banner — video/audio stay visible underneath for pre-start chat. */
export function MeetingLobbyBanner({
  isHost,
  starting = false,
  onStartMeeting,
  className,
}: MeetingLobbyOverlayProps) {
  return (
    <div
      className={cn(
        "absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-3",
        "rounded-xl border border-amber-400/25 bg-amber-950/90 px-4 py-2.5 shadow-lg backdrop-blur-md",
        className,
      )}
    >
      <div className="text-left min-w-0">
        <p className="text-xs font-semibold text-amber-100">Waiting room</p>
        <p className="text-[11px] text-amber-100/70 truncate">
          {isHost
            ? "You can talk with others now. Start the meeting when ready for the official live session."
            : "You can use mic and camera with others here. The host will start the official session when ready."}
        </p>
      </div>
      {isHost && onStartMeeting && (
        <Button
          type="button"
          size="sm"
          className="shrink-0 gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-8"
          disabled={starting}
          onClick={onStartMeeting}
        >
          {starting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Radio className="h-3.5 w-3.5" />
          )}
          Start for everyone
        </Button>
      )}
    </div>
  );
}
