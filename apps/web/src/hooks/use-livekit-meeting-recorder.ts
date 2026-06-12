import { useRoomContext } from "@livekit/components-react";
import { ConnectionState, RoomEvent } from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createLiveKitAudioMixRecorder } from "@/lib/livekit-audio-mix";

export function useLiveKitMeetingRecorder(enabled: boolean) {
  const room = useRoomContext();
  const recorderRef = useRef<ReturnType<typeof createLiveKitAudioMixRecorder> | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [participantAudioTracks, setParticipantAudioTracks] = useState(0);

  const ensureRecorder = useCallback(() => {
    if (!recorderRef.current) {
      recorderRef.current = createLiveKitAudioMixRecorder(room);
    }
    return recorderRef.current;
  }, [room]);

  const startRecording = useCallback(async () => {
    if (!enabled || room.state !== ConnectionState.Connected) return;
    const recorder = ensureRecorder();
    if (recorder.isActive()) return;
    await recorder.start();
    setIsRecording(true);
    setParticipantAudioTracks(recorder.getAttachedTrackCount());
  }, [enabled, ensureRecorder, room.state]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    const recorder = recorderRef.current;
    if (!recorder) return null;
    const blob = await recorder.stop();
    setIsRecording(false);
    setParticipantAudioTracks(0);
    return blob;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const tryStart = () => {
      if (room.state === ConnectionState.Connected) {
        void startRecording().catch(() => {
          /* host may not have published mic yet — TrackSubscribed will add tracks */
        });
      }
    };

    tryStart();
    room.on(RoomEvent.Connected, tryStart);
    room.on(RoomEvent.Reconnected, tryStart);

    const refreshTrackCount = () => {
      if (recorderRef.current?.isActive()) {
        setParticipantAudioTracks(recorderRef.current.getAttachedTrackCount());
      }
    };
    room.on(RoomEvent.TrackSubscribed, refreshTrackCount);
    room.on(RoomEvent.LocalTrackPublished, refreshTrackCount);
    room.on(RoomEvent.TrackUnsubscribed, refreshTrackCount);

    return () => {
      room.off(RoomEvent.Connected, tryStart);
      room.off(RoomEvent.Reconnected, tryStart);
      room.off(RoomEvent.TrackSubscribed, refreshTrackCount);
      room.off(RoomEvent.LocalTrackPublished, refreshTrackCount);
      room.off(RoomEvent.TrackUnsubscribed, refreshTrackCount);
    };
  }, [enabled, room, startRecording]);

  useEffect(() => {
    return () => {
      recorderRef.current?.dispose();
      recorderRef.current = null;
    };
  }, []);

  return {
    isRecording,
    participantAudioTracks,
    stopRecording,
  };
}
