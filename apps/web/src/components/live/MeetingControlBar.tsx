import { StartMediaButton, useLocalParticipant } from "@livekit/components-react";
import { Track } from "livekit-client";
import {
  Mic,
  MicOff,
  MonitorUp,
  Video,
  VideoOff,
} from "lucide-react";
import type { ReactNode } from "react";
import { MeetingMediaControl } from "./MeetingMediaControl";
import { cn } from "@/lib/utils";

type MeetingControlBarProps = {
  extraControls?: ReactNode;
  className?: string;
  mediaReady?: boolean;
};

function browserSupportsScreenShare() {
  return typeof navigator !== "undefined" && "getDisplayMedia" in navigator.mediaDevices;
}

const screenCaptureOptions = {
  audio: true,
  selfBrowserSurface: "include" as const,
  surfaceSwitching: "include" as const,
  monitorTypeSurfaces: "include" as const,
};

export function MeetingControlBar({
  extraControls,
  className,
  mediaReady = true,
}: MeetingControlBarProps) {
  const screenShareSupported = browserSupportsScreenShare();
  const { isScreenShareEnabled } = useLocalParticipant();

  return (
    <div className={cn("meeting-control-dock", className)} aria-disabled={!mediaReady}>
      {!mediaReady && (
        <p className="meeting-control-dock-hint">Waiting for connection — controls unlock when Connected</p>
      )}

      <div className={cn("meeting-control-dock-inner", !mediaReady && "opacity-50 pointer-events-none")}>
        <div className="meeting-control-group">
          <MeetingMediaControl
            source={Track.Source.Microphone}
            label="Mic"
            icon={Mic}
            offIcon={MicOff}
            deviceKind="audioinput"
            mediaReady={mediaReady}
            dangerWhenOff
          />
          <MeetingMediaControl
            source={Track.Source.Camera}
            label="Camera"
            icon={Video}
            offIcon={VideoOff}
            deviceKind="videoinput"
            mediaReady={mediaReady}
            dangerWhenOff
          />
          {screenShareSupported && (
            <MeetingMediaControl
              source={Track.Source.ScreenShare}
              label={isScreenShareEnabled ? "Sharing" : "Share"}
              icon={MonitorUp}
              mediaReady={mediaReady}
              presentWhenOn
              captureOptions={screenCaptureOptions}
            />
          )}
        </div>

        <div className="meeting-control-divider" aria-hidden />

        <div className="meeting-control-actions">{extraControls}</div>
      </div>

      <StartMediaButton className="sr-only" />
    </div>
  );
}
