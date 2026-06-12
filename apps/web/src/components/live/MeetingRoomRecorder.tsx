import { useLiveKitMeetingRecorder } from "@/hooks/use-livekit-meeting-recorder";
import { forwardRef, useEffect, useImperativeHandle } from "react";

export type MeetingRoomRecorderHandle = {
  stopRecording: () => Promise<Blob | null>;
};

type MeetingRoomRecorderProps = {
  enabled: boolean;
  onRecordingChange?: (active: boolean, trackCount: number) => void;
};

export const MeetingRoomRecorder = forwardRef<MeetingRoomRecorderHandle, MeetingRoomRecorderProps>(
  function MeetingRoomRecorder({ enabled, onRecordingChange }, ref) {
    const { isRecording, participantAudioTracks, stopRecording } = useLiveKitMeetingRecorder(enabled);

    useImperativeHandle(ref, () => ({ stopRecording }), [stopRecording]);

    useEffect(() => {
      onRecordingChange?.(isRecording, participantAudioTracks);
    }, [isRecording, onRecordingChange, participantAudioTracks]);

    return null;
  },
);
