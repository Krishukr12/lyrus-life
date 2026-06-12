import { access } from "node:fs/promises";
import { AudioStorageBackend, PipelineStep, type AudioFile, prisma } from "@lyrus/db";
import type { AudioStorageBackendType } from "../../types/enums.js";
import { logAudit } from "../audit.js";
import { resolveStorageBackend } from "./config.js";
import { saveToLocal, localFilePath } from "./local.js";
import { s3Bucket } from "./config.js";
import {
  createPresignedDownloadUrl,
  materializeS3Audio,
  saveToS3,
} from "./s3.js";
import type { SavedAudio } from "./types.js";

export type { SavedAudio } from "./types.js";
export { isS3Configured, resolveStorageBackend } from "./config.js";

export async function saveMeetingRecording(
  meetingId: string,
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<SavedAudio> {
  const backend = resolveStorageBackend();

  let storageKey: string;
  let filePath: string;
  let storageBackend: AudioStorageBackendType;
  let s3Key: string | undefined;
  let s3BucketName: string | undefined;
  let cleanup: (() => Promise<void>) | undefined;

  if (backend === "s3") {
    const saved = await saveToS3(meetingId, buffer, filename, mimeType);
    storageKey = saved.storageKey;
    filePath = saved.filePath;
    storageBackend = AudioStorageBackend.S3;
    s3Key = saved.s3Key;
    s3BucketName = saved.s3Bucket;
    cleanup = async () => {
      const { unlink } = await import("node:fs/promises");
      try {
        await unlink(filePath);
      } catch {
        /* temp upload copy */
      }
    };
  } else {
    const saved = await saveToLocal(meetingId, buffer, filename);
    storageKey = saved.storageKey;
    filePath = saved.filePath;
    storageBackend = AudioStorageBackend.LOCAL;
  }

  await prisma.audioFile.create({
    data: {
      meetingId,
      storageKey,
      storageBackend,
      mimeType,
      sizeBytes: buffer.length,
    },
  });

  await logAudit(meetingId, PipelineStep.AUDIO_UPLOADED, {
    storageKey,
    storageBackend,
    sizeBytes: buffer.length,
  });

  return {
    storageKey,
    storageBackend,
    filePath,
    s3Key,
    s3Bucket: s3BucketName,
    cleanup,
  };
}

/** Resolve a stored recording to a local path for STT (downloads from S3 when needed). */
export async function materializeAudioForProcessing(
  audio: Pick<AudioFile, "storageKey" | "storageBackend" | "mimeType">,
): Promise<SavedAudio> {
  if (audio.storageBackend === AudioStorageBackend.S3) {
    const { filePath, cleanup } = await materializeS3Audio(audio.storageKey, audio.mimeType);
    return {
      storageKey: audio.storageKey,
      storageBackend: AudioStorageBackend.S3,
      filePath,
      s3Key: audio.storageKey,
      s3Bucket: s3Bucket(),
      cleanup,
    };
  }

  const filePath = localFilePath(audio.storageKey);
  try {
    await access(filePath);
  } catch {
    throw new Error("Recording file not found on server");
  }

  return {
    storageKey: audio.storageKey,
    storageBackend: AudioStorageBackend.LOCAL,
    filePath,
  };
}

/** Short-lived HTTPS URL for authorized users (S3 only). */
export async function getSecureRecordingDownloadUrl(
  audio: Pick<AudioFile, "storageKey" | "storageBackend">,
): Promise<{ url: string; expiresInSeconds: number } | null> {
  if (audio.storageBackend !== AudioStorageBackend.S3) {
    return null;
  }
  const expiresInSeconds = Number(process.env.RECORDING_PRESIGN_SECONDS ?? 900);
  const url = await createPresignedDownloadUrl(audio.storageKey, expiresInSeconds);
  return { url, expiresInSeconds };
}
