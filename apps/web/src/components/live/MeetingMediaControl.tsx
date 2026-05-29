import { MediaDeviceSelect, useTrackToggle } from "@livekit/components-react";
import type { CaptureOptionsBySource, ToggleSource } from "@livekit/components-core";
import { Track } from "livekit-client";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type MeetingMediaControlProps<T extends ToggleSource> = {
  source: T;
  label: string;
  icon: LucideIcon;
  offIcon?: LucideIcon;
  mediaReady?: boolean;
  deviceKind?: MediaDeviceKind;
  captureOptions?: CaptureOptionsBySource<T>;
  /** Mic/camera turn red when disabled (Zoom-style). */
  dangerWhenOff?: boolean;
  /** Screen share uses highlight when active. */
  presentWhenOn?: boolean;
};

function onDeviceError(source: Track.Source, error: Error) {
  const label =
    source === Track.Source.Microphone
      ? "Microphone"
      : source === Track.Source.Camera
        ? "Camera"
        : "Screen share";
  const message = error.message.toLowerCase();
  if (message.includes("engine not connected") || message.includes("timeout")) {
    toast.error(`${label}: wait until Connected, then try again.`);
    return;
  }
  toast.error(`${label}: ${error.message}`);
}

export function MeetingMediaControl<T extends ToggleSource>({
  source,
  label,
  icon: Icon,
  offIcon: OffIcon,
  mediaReady = true,
  deviceKind,
  captureOptions,
  dangerWhenOff = false,
  presentWhenOn = false,
}: MeetingMediaControlProps<T>) {
  const [devicesOpen, setDevicesOpen] = useState(false);
  const { buttonProps, enabled } = useTrackToggle({
    source,
    captureOptions,
    onDeviceError: (error) => onDeviceError(source as Track.Source, error),
  });

  const DisplayIcon = !enabled && OffIcon ? OffIcon : Icon;
  const showDanger = dangerWhenOff && !enabled;
  const showPresent = presentWhenOn && enabled;
  const { className: _lkClass, ...toggleProps } = buttonProps;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center">
        <button
          type="button"
          {...toggleProps}
          disabled={!mediaReady || toggleProps.disabled}
          aria-label={label}
          aria-pressed={enabled}
          className={cn(
            "meeting-media-btn",
            showDanger && "meeting-media-btn--danger",
            showPresent && "meeting-media-btn--present",
            enabled && !showDanger && !showPresent && "meeting-media-btn--active",
            !mediaReady && "opacity-40 pointer-events-none",
          )}
        >
          <DisplayIcon className="h-5 w-5" strokeWidth={2} />
        </button>

        {deviceKind && mediaReady && (
          <Popover open={devicesOpen} onOpenChange={setDevicesOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="meeting-media-chevron"
                aria-label={`${label} settings`}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              side="top"
              className="w-64 p-2 border-white/10 bg-[#1a1f2e] text-white"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40 px-2 py-1">
                {deviceKind === "audioinput" ? "Microphone" : "Camera"}
              </p>
              <MediaDeviceSelect
                kind={deviceKind}
                requestPermissions
                className="meeting-device-list"
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
      <span
        className={cn(
          "text-[10px] font-medium leading-none",
          showDanger ? "text-red-300" : showPresent ? "text-sky-300" : "text-white/55",
        )}
      >
        {label}
      </span>
    </div>
  );
}
