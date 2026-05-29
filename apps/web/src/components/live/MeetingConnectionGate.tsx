import { useConnectionState } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import type { ReactNode } from "react";
import { Loader2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type MeetingConnectionGateProps = {
  children: (mediaReady: boolean) => ReactNode;
  onReconnect?: () => void | Promise<void>;
  reconnecting?: boolean;
};

export function MeetingConnectionGate({
  children,
  onReconnect,
  reconnecting = false,
}: MeetingConnectionGateProps) {
  const connectionState = useConnectionState();
  const mediaReady = connectionState === ConnectionState.Connected;

  if (connectionState === ConnectionState.Connecting || reconnecting) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 min-h-0 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/15 border border-secondary/25">
          <Loader2 className="h-7 w-7 animate-spin text-secondary" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-white">Connecting to the video room…</p>
          <p className="text-xs text-white/50 max-w-sm">
            Turn on camera and microphone after the status shows Connected.
          </p>
        </div>
      </div>
    );
  }

  if (connectionState === ConnectionState.Disconnected) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 min-h-0 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
          <WifiOff className="h-7 w-7 text-red-300/80" />
        </div>
        <div className="space-y-1 max-w-md">
          <p className="font-medium text-white">Could not connect to the video server</p>
          <p className="text-sm text-white/50">
            Start LiveKit with{" "}
            <code className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-white/80">
              docker compose up livekit -d
            </code>{" "}
            and confirm <code className="text-xs text-secondary">LIVEKIT_URL</code> in your{" "}
            <code className="text-xs text-secondary">.env</code> matches how you open this app.
          </p>
        </div>
        {onReconnect && (
          <Button
            variant="secondary"
            size="sm"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            disabled={reconnecting}
            onClick={() => void onReconnect()}
          >
            {reconnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Try again
          </Button>
        )}
      </div>
    );
  }

  return <>{children(mediaReady)}</>;
}
