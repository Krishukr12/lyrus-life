import {
  isTrackReference,
  ParticipantName,
  ParticipantTile,
  TrackMutedIndicator,
  useMaybeTrackRefContext,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Crown, MonitorUp } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMeetingHost } from "./MeetingHostContext";

/** Participant video tile with Meet/Zoom-style overlays. */
export function MeetingParticipantTile() {
  const { hostUserId } = useMeetingHost();
  const trackRef = useMaybeTrackRefContext();
  const isHostParticipant =
    trackRef &&
    isTrackReference(trackRef) &&
    Boolean(hostUserId && trackRef.participant.identity === hostUserId);
  const isScreen =
    trackRef &&
    isTrackReference(trackRef) &&
    trackRef.publication?.source === Track.Source.ScreenShare;
  const isCamera =
    trackRef &&
    isTrackReference(trackRef) &&
    trackRef.source === Track.Source.Camera;

  return (
    <div className="meeting-tile-container group h-full w-full">
      <ParticipantTile className="meeting-participant-tile h-full w-full" disableSpeakingIndicator />

      {isScreen && (
        <div className="meeting-tile-presenting-badge">
          <MonitorUp className="h-3 w-3" />
          Presenting
        </div>
      )}

      {isHostParticipant && (
        <div className="meeting-tile-host-badge">
          <Crown className="h-3 w-3" />
          Host
        </div>
      )}

      {isCamera && trackRef && isTrackReference(trackRef) && (
        <div className="meeting-tile-footer">
          <div className="flex items-center gap-1.5 min-w-0">
            {isHostParticipant && <Crown className="h-3 w-3 shrink-0 text-amber-300" />}
            <ParticipantName className="meeting-tile-name-text truncate" />
          </div>
          <TrackMutedIndicator
            trackRef={{
              participant: trackRef.participant,
              source: Track.Source.Microphone,
            }}
            show="muted"
            className="meeting-tile-muted-icon"
          />
        </div>
      )}
    </div>
  );
}

export function MeetingVideoStageFrame({
  presenting,
  children,
  className,
}: {
  presenting: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col min-h-0 min-w-0 h-full",
        presenting && "meeting-video-stage--presenting",
        className,
      )}
    >
      {children}
    </div>
  );
}
