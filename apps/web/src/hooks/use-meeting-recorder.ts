import { useCallback, useEffect, useRef, useState } from "react";

export interface MeetingRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  error: string | null;
  durationSeconds: number;
  hasPermission: boolean;
}

export function useMeetingRecorder() {
  const [state, setState] = useState<MeetingRecorderState>({
    isRecording: false,
    isPaused: false,
    error: null,
    durationSeconds: 0,
    hasPermission: false,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
        video: false,
      });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start(1000);
      timerRef.current = setInterval(() => {
        setState((s) => ({ ...s, durationSeconds: s.durationSeconds + 1 }));
      }, 1000);

      setState({
        isRecording: true,
        isPaused: false,
        error: null,
        durationSeconds: 0,
        hasPermission: true,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Microphone permission denied or unavailable";
      setState((s) => ({ ...s, error: message, hasPermission: false }));
      throw err;
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    clearInterval(timerRef.current);

    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      stopTracks();
      setState((s) => ({ ...s, isRecording: false, isPaused: false }));
      return null;
    }

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const blob =
          chunksRef.current.length > 0
            ? new Blob(chunksRef.current, { type: mimeType })
            : null;
        chunksRef.current = [];
        mediaRecorderRef.current = null;
        stopTracks();
        setState((s) => ({ ...s, isRecording: false, isPaused: false }));
        resolve(blob);
      };
      recorder.stop();
    });
  }, [stopTracks]);

  const setMuted = useCallback((muted: boolean) => {
    streamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !muted;
    });
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        try {
          recorder.stop();
        } catch {
          // Already stopped or stream torn down
        }
      }
      mediaRecorderRef.current = null;
      stopTracks();
    };
  }, [stopTracks]);

  return {
    state,
    startRecording,
    stopRecording,
    setMuted,
    previewStream: streamRef,
  };
}
