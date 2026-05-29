import {
  CarouselLayout,
  FocusLayout,
  FocusLayoutContainer,
  GridLayout,
  LayoutContextProvider,
  RoomAudioRenderer,
  isTrackReference,
  useCreateLayoutContext,
  useLocalParticipant,
  usePinnedTracks,
  useTracks,
  type TrackReferenceOrPlaceholder,
} from "@livekit/components-react";
import { RoomEvent, Track } from "livekit-client";
import { useEffect, useRef, type ReactNode } from "react";
import { MeetingControlBar } from "./MeetingControlBar";
import { MeetingParticipantTile } from "./MeetingParticipantTile";
import { MeetingVideoStageFrame } from "./MeetingParticipantTile";
import { ScreenSharePresentingBar } from "./ScreenSharePresentingBar";

type LiveMeetingStageProps = {
  controlBarExtras?: ReactNode;
  mediaReady?: boolean;
};

export function LiveMeetingStage({ controlBarExtras, mediaReady = true }: LiveMeetingStageProps) {
  const { isScreenShareEnabled } = useLocalParticipant();
  const lastAutoFocusedScreenShareTrack = useRef<TrackReferenceOrPlaceholder | null>(null);

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false },
  );

  const layoutContext = useCreateLayoutContext();

  const screenShareTracks = tracks
    .filter(isTrackReference)
    .filter((track) => track.publication.source === Track.Source.ScreenShare);

  const focusTrack = usePinnedTracks(layoutContext)?.[0];
  const carouselTracks = tracks.filter((track) => {
    if (!focusTrack) return true;
    if (isTrackReference(track) && isTrackReference(focusTrack)) {
      return track.publication.trackSid !== focusTrack.publication.trackSid;
    }
    return (
      track.participant.identity !== focusTrack.participant.identity ||
      track.source !== focusTrack.source
    );
  });

  useEffect(() => {
    if (
      screenShareTracks.some((track) => track.publication.isSubscribed) &&
      lastAutoFocusedScreenShareTrack.current === null
    ) {
      layoutContext.pin.dispatch?.({ msg: "set_pin", trackReference: screenShareTracks[0] });
      lastAutoFocusedScreenShareTrack.current = screenShareTracks[0];
    } else if (
      lastAutoFocusedScreenShareTrack.current &&
      !screenShareTracks.some(
        (track) =>
          track.publication.trackSid ===
          lastAutoFocusedScreenShareTrack.current?.publication?.trackSid,
      )
    ) {
      layoutContext.pin.dispatch?.({ msg: "clear_pin" });
      lastAutoFocusedScreenShareTrack.current = null;
    }
    if (focusTrack && !isTrackReference(focusTrack)) {
      const updatedFocusTrack = tracks.find(
        (tr) =>
          tr.participant.identity === focusTrack.participant.identity &&
          tr.source === focusTrack.source,
      );
      if (updatedFocusTrack !== focusTrack && isTrackReference(updatedFocusTrack)) {
        layoutContext.pin.dispatch?.({ msg: "set_pin", trackReference: updatedFocusTrack });
      }
    }
  }, [
    screenShareTracks
      .map((ref) => `${ref.publication.trackSid}_${ref.publication.isSubscribed}`)
      .join(),
    focusTrack?.publication?.trackSid,
    tracks,
    layoutContext.pin,
  ]);

  return (
    <MeetingVideoStageFrame presenting={isScreenShareEnabled}>
      <div className="lk-meeting-stage flex flex-col flex-1 min-h-0 min-w-0 h-full">
        <LayoutContextProvider value={layoutContext}>
          <div className="lk-meeting-stage-inner flex flex-col flex-1 min-h-0 relative">
            <ScreenSharePresentingBar />

            {!focusTrack ? (
              <div className="lk-grid-layout-wrapper flex-1 min-h-0">
                <GridLayout tracks={tracks}>
                  <MeetingParticipantTile />
                </GridLayout>
              </div>
            ) : (
              <div className="lk-focus-layout-wrapper flex-1 min-h-0">
                <FocusLayoutContainer>
                  <CarouselLayout tracks={carouselTracks}>
                    <MeetingParticipantTile />
                  </CarouselLayout>
                  {focusTrack && <FocusLayout trackRef={focusTrack} />}
                </FocusLayoutContainer>
              </div>
            )}

            <MeetingControlBar extraControls={controlBarExtras} mediaReady={mediaReady} />
          </div>
        </LayoutContextProvider>
        <RoomAudioRenderer />
      </div>
    </MeetingVideoStageFrame>
  );
}
