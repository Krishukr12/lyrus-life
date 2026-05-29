import type { LiveKitRoomProps } from "@livekit/components-react";
import { toast } from "sonner";

/** Shared LiveKitRoom settings — do not auto-publish tracks before the engine is ready. */
export const meetingLiveKitRoomProps: Pick<
  LiveKitRoomProps,
  "connect" | "connectOptions" | "onError" | "onDisconnected"
> = {
  connect: true,
  connectOptions: {
    autoSubscribe: true,
  },
  onError: (error) => {
    const message = error.message.toLowerCase();
    if (message.includes("engine not connected") || message.includes("timeout")) {
      toast.error("Video room is still connecting. Wait for “connected”, then turn on camera or mic.");
      return;
    }
    if (message.includes("failed to fetch") || message.includes("websocket")) {
      toast.error(
        "Cannot reach LiveKit. Run: docker compose up livekit -d — then check LIVEKIT_URL in .env.",
      );
      return;
    }
    toast.error(`Video connection error: ${error.message}`);
  },
  onDisconnected: () => {
    toast.message("Left the video room");
  },
};
