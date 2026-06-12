import { RoomServiceClient } from "livekit-server-sdk";
import { getLiveKitConfig, isLiveKitConfigured } from "./livekit.js";

function getLiveKitHttpUrl(): string {
  const { url } = getLiveKitConfig();
  return url.replace(/^ws:\/\//, "http://").replace(/^wss:\/\//, "https://");
}

export type LiveKitMonitorResult = {
  configured: boolean;
  status: "healthy" | "monitoring" | "down";
  label: string;
  activeRooms: number;
  activeParticipants: number;
  webhookConfigured: boolean;
};

export async function getLiveKitMonitorStats(): Promise<LiveKitMonitorResult> {
  const webhookConfigured = Boolean(process.env.LIVEKIT_WEBHOOK_KEY?.trim());

  if (!isLiveKitConfigured()) {
    return {
      configured: false,
      status: "down",
      label: "Not configured",
      activeRooms: 0,
      activeParticipants: 0,
      webhookConfigured,
    };
  }

  try {
    const { apiKey, apiSecret } = getLiveKitConfig();
    const client = new RoomServiceClient(getLiveKitHttpUrl(), apiKey, apiSecret);
    const rooms = await client.listRooms();
    const activeParticipants = rooms.reduce((sum, room) => sum + room.numParticipants, 0);

    return {
      configured: true,
      status: "healthy",
      label: `${rooms.length} active room${rooms.length === 1 ? "" : "s"}`,
      activeRooms: rooms.length,
      activeParticipants,
      webhookConfigured,
    };
  } catch {
    return {
      configured: true,
      status: "down",
      label: "Unreachable",
      activeRooms: 0,
      activeParticipants: 0,
      webhookConfigured,
    };
  }
}
