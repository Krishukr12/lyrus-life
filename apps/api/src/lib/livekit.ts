import { AccessToken } from "livekit-server-sdk";

export function getLiveKitConfig() {
  const url = process.env.LIVEKIT_URL ?? "ws://localhost:7880";
  const apiKey = process.env.LIVEKIT_API_KEY ?? "devkey";
  const apiSecret = process.env.LIVEKIT_API_SECRET ?? "secret";
  return { url, apiKey, apiSecret };
}

/**
 * WebSocket URL returned to browsers. Rewrites localhost to the page host when the
 * app is opened via a LAN IP so LiveKit is reachable from the same machine/network.
 */
export function resolveLiveKitClientUrl(requestHost?: string): string {
  const configured = normalizeLiveKitClientUrl(
    process.env.LIVEKIT_PUBLIC_URL ?? process.env.LIVEKIT_URL ?? "ws://127.0.0.1:7880",
  );

  if (process.env.LIVEKIT_PUBLIC_URL) {
    return configured;
  }

  if (!requestHost) {
    return configured;
  }

  const pageHost = requestHost.split(":")[0]?.toLowerCase();
  if (!pageHost || pageHost === "localhost" || pageHost === "127.0.0.1") {
    return configured;
  }

  if (/localhost|127\.0\.0\.1/.test(configured)) {
    return configured.replace(/localhost|127\.0\.0\.1/g, pageHost);
  }

  return configured;
}

/** Normalize ws/wss URL for the LiveKit JS client. */
export function normalizeLiveKitClientUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith("http://")) return trimmed.replace(/^http:\/\//, "ws://");
  if (trimmed.startsWith("https://")) return trimmed.replace(/^https:\/\//, "wss://");
  return trimmed;
}

export function isLiveKitConfigured(): boolean {
  return Boolean(
    process.env.LIVEKIT_API_KEY &&
      process.env.LIVEKIT_API_SECRET &&
      process.env.LIVEKIT_URL,
  );
}

export async function createLiveKitToken(input: {
  roomName: string;
  participantName: string;
  participantIdentity: string;
  canEndMeeting?: boolean;
}): Promise<string> {
  const { apiKey, apiSecret } = getLiveKitConfig();

  const token = new AccessToken(apiKey, apiSecret, {
    identity: input.participantIdentity,
    name: input.participantName,
    ttl: "4h",
  });

  token.addGrant({
    roomJoin: true,
    room: input.roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    roomAdmin: input.canEndMeeting ?? false,
  });

  return token.toJwt();
}
