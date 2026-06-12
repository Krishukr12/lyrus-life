import type { ReactNode } from "react";
import { Copy, Crown, PanelRightClose, PanelRightOpen, Radio, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { MeetingConnectionBadge } from "./MeetingConnectionBadge";
import { MeetingElapsedTimer } from "./MeetingElapsedTimer";
import { MeetingLiveNotesPanel } from "./MeetingLiveNotesPanel";
import type { LiveMeetingParticipant } from "@/hooks/use-live-meeting-socket";

export type MeetingRoomLayoutProps = {
  title: string;
  hostUserId: string | null;
  hostName: string | null;
  isLocalHost: boolean;
  localUserId?: string | null;
  participants: LiveMeetingParticipant[];
  notesOpen: boolean;
  onNotesOpenChange: (open: boolean) => void;
  liveNotes: string;
  onNotesChange: (value: string) => void;
  joinUrl?: string | null;
  onCopyJoinLink?: () => void;
  recordingActive?: boolean;
  recordingTrackCount?: number;
  sessionStartedAt?: string | null;
  isLive?: boolean;
  video: ReactNode;
  className?: string;
};

export function MeetingRoomLayout({
  title,
  hostUserId,
  hostName,
  isLocalHost,
  localUserId,
  participants,
  notesOpen,
  onNotesOpenChange,
  liveNotes,
  onNotesChange,
  joinUrl,
  onCopyJoinLink,
  recordingActive,
  recordingTrackCount,
  sessionStartedAt,
  isLive = true,
  video,
  className,
}: MeetingRoomLayoutProps) {
  const participantCount = participants.length;

  return (
    <div className={cn("meeting-room flex flex-col flex-1 min-h-0 h-full w-full", className)}>
      <div className="meeting-room-ambient pointer-events-none" aria-hidden />

      <header className="relative z-10 shrink-0 border-b border-white/10 bg-black/25 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-[10px] font-bold tracking-widest border",
                  isLive
                    ? "bg-red-500/15 text-red-300 border-red-500/25"
                    : "bg-amber-500/15 text-amber-200 border-amber-500/25",
                )}
              >
                {isLive ? "LIVE" : "WAITING"}
              </span>
              <MeetingElapsedTimer sessionStartedAt={sessionStartedAt ?? null} isLive={isLive} />
            </div>
            <div className="min-w-0 border-l border-white/10 pl-3">
              <p className="font-heading text-sm sm:text-base font-semibold text-white truncate">{title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {recordingActive && (
              <Badge
                variant="outline"
                className="gap-1.5 border-red-500/30 bg-red-500/10 text-red-200 text-[10px] font-medium hidden sm:flex"
              >
                <Radio className="h-3 w-3 animate-pulse" />
                Recording
                {(recordingTrackCount ?? 0) > 0
                  ? ` · ${recordingTrackCount} audio${recordingTrackCount === 1 ? "" : " tracks"}`
                  : ""}
              </Badge>
            )}
            <MeetingConnectionBadge />
            {joinUrl && onCopyJoinLink && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCopyJoinLink}
                className="h-8 gap-1.5 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white text-xs hidden md:inline-flex"
              >
                <Copy className="h-3.5 w-3.5" />
                Invite
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-4 pb-2.5 sm:px-5">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            {hostName && (
              <div
                className={cn(
                  "meeting-host-pill inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                  isLocalHost
                    ? "bg-amber-500/15 text-amber-100 border border-amber-400/35"
                    : "bg-white/5 text-white/80 border border-white/10",
                )}
              >
                <Crown className={cn("h-3.5 w-3.5", isLocalHost ? "text-amber-300" : "text-amber-400/80")} />
                <span>
                  Host: <span className="font-semibold">{hostName}</span>
                  {isLocalHost && <span className="text-amber-200/80"> (you)</span>}
                </span>
              </div>
            )}
            {participantCount > 0 && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/55">
                <Users className="h-3 w-3" />
                {participantCount} in call
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNotesOpenChange(!notesOpen)}
              className={cn(
                "meeting-notes-toggle inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors",
                notesOpen
                  ? "bg-secondary/20 text-secondary border border-secondary/35"
                  : "bg-white/5 text-white/65 border border-white/10 hover:bg-white/10",
              )}
            >
              {notesOpen ? (
                <PanelRightClose className="h-3.5 w-3.5" />
              ) : (
                <PanelRightOpen className="h-3.5 w-3.5" />
              )}
              Notes
            </button>
            <Switch
              id="notes-toggle"
              checked={notesOpen}
              onCheckedChange={onNotesOpenChange}
              className="sr-only"
              aria-label="Toggle meeting notes panel"
            />
          </div>
        </div>

        {participants.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto px-4 pb-2.5 sm:px-5 scrollbar-none">
            {participants.map((p) => {
              const isHost = Boolean(hostUserId && p.userId === hostUserId);
              const isYou = Boolean(localUserId && p.userId === localUserId);
              return (
                <span
                  key={p.userId}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] border",
                    isHost
                      ? "bg-amber-500/10 text-amber-100 border-amber-400/25"
                      : "bg-white/5 text-white/60 border-white/10",
                  )}
                >
                  {isHost && <Crown className="h-2.5 w-2.5 text-amber-300" />}
                  {p.userName}
                  {isYou && !isHost && <span className="text-white/35">· you</span>}
                </span>
              );
            })}
          </div>
        )}
      </header>

      <main className="relative z-10 flex flex-1 min-h-0 p-3 sm:p-4 gap-3 sm:gap-4">
        <section
          className={cn(
            "meeting-video-shell flex flex-1 flex-col min-w-0 min-h-0 rounded-2xl overflow-hidden",
            "border border-white/[0.08] bg-[#0a0e14]/80 shadow-[0_12px_48px_rgba(0,0,0,0.5)]",
          )}
        >
          {video}
        </section>

        {notesOpen && (
          <MeetingLiveNotesPanel
            value={liveNotes}
            onChange={onNotesChange}
            shared
            className="hidden sm:flex"
          />
        )}
      </main>

      {notesOpen && (
        <div className="sm:hidden relative z-20 border-t border-white/10 bg-black/30 backdrop-blur-xl p-3 max-h-[40vh] flex flex-col">
          <MeetingLiveNotesPanel
            value={liveNotes}
            onChange={onNotesChange}
            shared
            className="w-full max-h-full animate-none shadow-none border-white/10"
          />
        </div>
      )}
    </div>
  );
}
