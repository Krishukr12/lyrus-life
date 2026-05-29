export type StorageBackendName = "local" | "s3";

export function isS3Configured(): boolean {
  return Boolean(
    process.env.AWS_REGION &&
      process.env.AWS_S3_BUCKET &&
      (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_PROFILE),
  );
}

/** Which backend stores new recordings: local | s3 | auto (S3 when configured). */
export function resolveStorageBackend(): StorageBackendName {
  const pref = (process.env.STORAGE_BACKEND ?? "auto").toLowerCase();
  if (pref === "local") return "local";
  if (pref === "s3") {
    if (!isS3Configured()) {
      throw new Error(
        "STORAGE_BACKEND=s3 but AWS is not configured (AWS_REGION, AWS_S3_BUCKET, credentials).",
      );
    }
    return "s3";
  }
  return isS3Configured() ? "s3" : "local";
}

export function s3ObjectKey(meetingId: string, filename: string): string {
  const prefix = (process.env.AWS_S3_PREFIX ?? "recordings").replace(/^\/+|\/+$/g, "");
  const ext = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")) : ".webm";
  const key = `${meetingId}/${Date.now()}${ext}`;
  return prefix ? `${prefix}/${key}` : key;
}

export function s3Bucket(): string {
  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) throw new Error("AWS_S3_BUCKET is not set");
  return bucket;
}

export function s3Region(): string {
  const region = process.env.AWS_REGION;
  if (!region) throw new Error("AWS_REGION is not set");
  return region;
}
