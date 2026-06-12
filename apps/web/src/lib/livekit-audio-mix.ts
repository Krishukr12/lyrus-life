import type { LocalTrackPublication, RemoteTrack, RemoteTrackPublication, Room } from "livekit-client";
import { ConnectionState, RoomEvent, Track } from "livekit-client";

function pickRecordingMimeType(): string {
  if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
    return "audio/webm;codecs=opus";
  }
  if (MediaRecorder.isTypeSupported("audio/webm")) {
    return "audio/webm";
  }
  return "audio/mp4";
}

function isMixableAudioPublication(
  publication: { kind: Track.Kind; source: Track.Source },
): boolean {
  if (publication.kind !== Track.Kind.Audio) return false;
  return (
    publication.source === Track.Source.Microphone ||
    publication.source === Track.Source.ScreenShareAudio ||
    publication.source === Track.Source.Unknown
  );
}

export type LiveKitAudioMixRecorder = {
  start: () => Promise<void>;
  stop: () => Promise<Blob | null>;
  isActive: () => boolean;
  getAttachedTrackCount: () => number;
  dispose: () => void;
};

export function createLiveKitAudioMixRecorder(room: Room): LiveKitAudioMixRecorder {
  let audioContext: AudioContext | null = null;
  let destination: MediaStreamAudioDestinationNode | null = null;
  let mediaRecorder: MediaRecorder | null = null;
  const sources = new Map<string, MediaStreamAudioSourceNode>();
  const chunks: Blob[] = [];
  let active = false;

  const eventHandlers: Array<{ event: RoomEvent; handler: (...args: unknown[]) => void }> = [];

  function attachTrack(trackSid: string, mediaStreamTrack: MediaStreamTrack) {
    if (!audioContext || !destination) return;
    if (sources.has(trackSid)) return;
    if (mediaStreamTrack.kind !== "audio") return;

    const source = audioContext.createMediaStreamSource(new MediaStream([mediaStreamTrack]));
    source.connect(destination);
    sources.set(trackSid, source);
  }

  function detachTrack(trackSid: string) {
    const source = sources.get(trackSid);
    if (!source) return;
    source.disconnect();
    sources.delete(trackSid);
  }

  function attachExistingTracks() {
    for (const publication of room.localParticipant.audioTrackPublications.values()) {
      if (!isMixableAudioPublication(publication)) continue;
      const track = publication.track?.mediaStreamTrack;
      if (track) attachTrack(publication.trackSid, track);
    }

    for (const participant of room.remoteParticipants.values()) {
      for (const publication of participant.audioTrackPublications.values()) {
        if (!isMixableAudioPublication(publication) || !publication.isSubscribed) continue;
        const track = publication.track?.mediaStreamTrack;
        if (track) attachTrack(publication.trackSid, track);
      }
    }
  }

  function bindRoomEvents() {
    const onTrackSubscribed = (
      track: RemoteTrack,
      publication: RemoteTrackPublication,
    ) => {
      if (!isMixableAudioPublication(publication)) return;
      const mediaStreamTrack = track.mediaStreamTrack;
      if (mediaStreamTrack) attachTrack(publication.trackSid, mediaStreamTrack);
    };

    const onTrackUnsubscribed = (_track: RemoteTrack, publication: RemoteTrackPublication) => {
      detachTrack(publication.trackSid);
    };

    const onLocalTrackPublished = (publication: LocalTrackPublication) => {
      if (!isMixableAudioPublication(publication)) return;
      const mediaStreamTrack = publication.track?.mediaStreamTrack;
      if (mediaStreamTrack) attachTrack(publication.trackSid, mediaStreamTrack);
    };

    const onLocalTrackUnpublished = (publication: LocalTrackPublication) => {
      detachTrack(publication.trackSid);
    };

    room.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
    room.on(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);
    room.on(RoomEvent.LocalTrackPublished, onLocalTrackPublished);
    room.on(RoomEvent.LocalTrackUnpublished, onLocalTrackUnpublished);

    eventHandlers.push(
      { event: RoomEvent.TrackSubscribed, handler: onTrackSubscribed as (...args: unknown[]) => void },
      { event: RoomEvent.TrackUnsubscribed, handler: onTrackUnsubscribed as (...args: unknown[]) => void },
      { event: RoomEvent.LocalTrackPublished, handler: onLocalTrackPublished as (...args: unknown[]) => void },
      { event: RoomEvent.LocalTrackUnpublished, handler: onLocalTrackUnpublished as (...args: unknown[]) => void },
    );
  }

  function unbindRoomEvents() {
    for (const { event, handler } of eventHandlers) {
      room.off(event, handler);
    }
    eventHandlers.length = 0;
  }

  function cleanupAudioGraph() {
    for (const source of sources.values()) {
      source.disconnect();
    }
    sources.clear();
    destination = null;
    void audioContext?.close();
    audioContext = null;
  }

  return {
    async start() {
      if (active || room.state !== ConnectionState.Connected) return;

      chunks.length = 0;
      audioContext = new AudioContext();
      await audioContext.resume();
      destination = audioContext.createMediaStreamDestination();

      attachExistingTracks();
      bindRoomEvents();

      const mimeType = pickRecordingMimeType();
      mediaRecorder = new MediaRecorder(destination.stream, { mimeType });
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      mediaRecorder.start(1000);
      active = true;
    },

    async stop(): Promise<Blob | null> {
      if (!active) {
        cleanupAudioGraph();
        unbindRoomEvents();
        return null;
      }

      const recorder = mediaRecorder;
      if (!recorder || recorder.state === "inactive") {
        active = false;
        mediaRecorder = null;
        cleanupAudioGraph();
        unbindRoomEvents();
        return chunks.length > 0 ? new Blob(chunks, { type: pickRecordingMimeType() }) : null;
      }

      return new Promise((resolve) => {
        recorder.onstop = () => {
          const mimeType = recorder.mimeType || pickRecordingMimeType();
          const blob = chunks.length > 0 ? new Blob(chunks, { type: mimeType }) : null;
          chunks.length = 0;
          mediaRecorder = null;
          active = false;
          cleanupAudioGraph();
          unbindRoomEvents();
          resolve(blob);
        };
        recorder.stop();
      });
    },

    isActive() {
      return active;
    },

    getAttachedTrackCount() {
      return sources.size;
    },

    dispose() {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        try {
          mediaRecorder.stop();
        } catch {
          // ignore
        }
      }
      mediaRecorder = null;
      chunks.length = 0;
      active = false;
      cleanupAudioGraph();
      unbindRoomEvents();
    },
  };
}
