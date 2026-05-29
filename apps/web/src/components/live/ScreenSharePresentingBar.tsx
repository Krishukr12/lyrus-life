import { useTrackToggle, useLocalParticipant } from "@livekit/components-react";
import { Track } from "livekit-client";
import { MonitorUp, X } from "lucide-react";

/** Google Meet–style banner while the local user is presenting their screen. */
export function ScreenSharePresentingBar() {
  const { isScreenShareEnabled } = useLocalParticipant();
  const { buttonProps, enabled } = useTrackToggle({
    source: Track.Source.ScreenShare,
    captureOptions: {
      audio: true,
      selfBrowserSurface: "include",
      surfaceSwitching: "include",
      monitorTypeSurfaces: "include",
    },
  });

  if (!isScreenShareEnabled && !enabled) {
    return null;
  }

  return (
    <div className="absolute top-0 inset-x-0 z-30 flex justify-center p-3 pointer-events-none">
      <div
        className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 rounded-xl border border-sky-400/40 bg-[#1e3a5f]/95 px-4 py-2.5 shadow-[0_4px_24px_rgba(14,116,214,0.35)] backdrop-blur-md max-w-lg"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 text-sky-100">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
          </span>
          <MonitorUp className="h-4 w-4 text-sky-300" />
          <span className="text-sm font-medium">You&apos;re presenting to everyone</span>
        </div>
        <p className="text-[11px] text-sky-200/70 w-full text-center sm:w-auto sm:text-left">
          Switch apps freely — others still see your shared screen
        </p>
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 text-xs font-medium text-white hover:bg-white/20 transition-colors"
          onClick={buttonProps.onClick}
          disabled={buttonProps.disabled}
        >
          <X className="h-3.5 w-3.5" />
          Stop presenting
        </button>
      </div>
    </div>
  );
}
