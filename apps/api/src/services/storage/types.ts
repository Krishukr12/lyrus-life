import { AudioStorageBackend } from "@lyrus/db";

type AudioStorageBackendValue =
  (typeof AudioStorageBackend)[keyof typeof AudioStorageBackend];

export type SavedAudio = {
  storageKey: string;
  storageBackend: AudioStorageBackendValue;
  /** Path on disk for transcription (local file or temp download). */
  filePath: string;
  /** Set when stored in S3 — used to skip re-upload for AWS Transcribe. */
  s3Key?: string;
  s3Bucket?: string;
  /** Call after pipeline finishes when filePath is a temp download. */
  cleanup?: () => Promise<void>;
};
