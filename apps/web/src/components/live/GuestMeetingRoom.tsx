import { useEffect, useState } from "react";
import { LiveKitRoom, useRoomContext } from "@livekit/components-react";
import "@livekit/components-styles";
import { LiveMeetingStage } from "@/components/live/LiveMeetingStage";
import { MeetingConnectionGate } from "@/components/live/MeetingConnectionGate";
import { MeetingLobbyBanner } from "@/components/live/MeetingLobbyOverlay";
import { meetingLiveKitRoomProps } from "@/components/live/livekit-room-props";
import {
  getJoinMeetingPreview,
  joinMeetingAsGuest,
  type GuestJoinSession,
} from "@/lib/live-api";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { LogoIcon } from "@/components/BrandMark";

type GuestMeetingRoomProps = {
  slug: string;
  session: GuestJoinSession;
  guestName: string;
  guestEmail: string;
  onLeave: () => void;
};

export function GuestMeetingRoom({ slug, session, guestName, guestEmail, onLeave }: GuestMeetingRoomProps) {
  const [isLive, setIsLive] = useState(session.isLive);

  useEffect(() => {
    if (isLive) return;
    const timer = setInterval(() => {
      void getJoinMeetingPreview(slug)
        .then((preview) => {
          if (preview.isLive) {
            setIsLive(true);
            toast.success("Meeting is now live");
          }
        })
        .catch(() => {
          /* ignore transient poll errors */
        });
    }, 5000);
    return () => clearInterval(timer);
  }, [slug, isLive]);

  return (
    <div className="fixed inset-0 z-50 meeting-room-root">
      <LiveKitRoom
        serverUrl={session.livekitUrl}
        token={session.token}
        className="h-full w-full flex flex-col lk-room"
        data-lk-theme="default"
        {...meetingLiveKitRoomProps}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <LogoIcon size={28} className="shrink-0 ring-1 ring-white/10" />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.12em] text-white/40">Guest session</p>
              <h1 className="text-sm font-heading font-semibold text-white truncate">{session.title}</h1>
            </div>
          </div>
          <span className="text-xs text-white/50 truncate hidden sm:block">{guestName} · {guestEmail}</span>
        </div>
        <GuestRoomStage
          slug={slug}
          guestName={guestName}
          guestEmail={guestEmail}
          isLive={isLive}
          onLeave={onLeave}
        />
      </LiveKitRoom>
    </div>
  );
}

function GuestRoomStage({
  slug,
  guestName,
  guestEmail,
  isLive,
  onLeave,
}: {
  slug: string;
  guestName: string;
  guestEmail: string;
  isLive: boolean;
  onLeave: () => void;
}) {
  const room = useRoomContext();
  const [reconnecting, setReconnecting] = useState(false);

  const handleReconnect = async () => {
    setReconnecting(true);
    try {
      const next = await joinMeetingAsGuest(slug, guestName, guestEmail);
      await room.connect(next.livekitUrl, next.token);
      toast.success("Reconnected to the meeting");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reconnect");
    } finally {
      setReconnecting(false);
    }
  };

  const handleLeave = () => {
    void room.disconnect();
    onLeave();
  };

  return (
    <div className="relative flex flex-1 flex-col min-h-0 min-w-0">
      <MeetingConnectionGate onReconnect={() => void handleReconnect()} reconnecting={reconnecting}>
        {(mediaReady) => (
          <LiveMeetingStage
            mediaReady={mediaReady}
            controlBarExtras={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="meeting-action-btn meeting-action-btn--leave"
                onClick={handleLeave}
              >
                <LogOut className="h-4 w-4" />
                Leave
              </Button>
            }
          />
        )}
      </MeetingConnectionGate>

      {!isLive && <MeetingLobbyBanner isHost={false} />}
    </div>
  );
}
