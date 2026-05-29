import { useConnectionState } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { cn } from "@/lib/utils";

const stateConfig: Record<
  ConnectionState,
  { label: string; dot: string; text: string; ring: string }
> = {
  [ConnectionState.Connected]: {
    label: "Connected",
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    text: "text-emerald-100",
    ring: "border-emerald-500/30 bg-emerald-500/10",
  },
  [ConnectionState.Connecting]: {
    label: "Connecting",
    dot: "bg-amber-400 animate-pulse",
    text: "text-amber-100",
    ring: "border-amber-500/30 bg-amber-500/10",
  },
  [ConnectionState.Reconnecting]: {
    label: "Reconnecting",
    dot: "bg-amber-400 animate-pulse",
    text: "text-amber-100",
    ring: "border-amber-500/30 bg-amber-500/10",
  },
  [ConnectionState.Disconnected]: {
    label: "Offline",
    dot: "bg-red-400",
    text: "text-red-100",
    ring: "border-red-500/30 bg-red-500/10",
  },
};

export function MeetingConnectionBadge({ className }: { className?: string }) {
  const connectionState = useConnectionState();
  const config = stateConfig[connectionState] ?? stateConfig[ConnectionState.Disconnected];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md",
        config.ring,
        config.text,
        className,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full shrink-0", config.dot)} />
      {config.label}
    </span>
  );
}
