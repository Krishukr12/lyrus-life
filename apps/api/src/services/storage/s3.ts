import { mkdtemp, unlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Bucket, s3ObjectKey, s3Region } from "./config.js";

let client: S3Client | null = null;

function getClient(): S3Client {
  if (!client) {
    client = new S3Client({ region: s3Region() });
  }
  return client;
}

/** Upload with no public ACL — rely on bucket Block Public Access + IAM. */
export async function putPrivateObject(
  key: string,
  body: Buffer,
  mimeType: string,
): Promise<void> {
  await getClient().send(
    new PutObjectCommand({
      Bucket: s3Bucket(),
      Key: key,
      Body: body,
      ContentType: mimeType,
      ServerSideEncryption: "AES256",
    }),
  );
}

export async function downloadToTempFile(key: string, suffix: string): Promise<string> {
  const response = await getClient().send(
    new GetObjectCommand({
      Bucket: s3Bucket(),
      Key: key,
    }),
  );

  const bytes = await response.Body?.transformToByteArray();
  if (!bytes?.length) {
    throw new Error(`S3 object is empty: ${key}`);
  }

  const dir = await mkdtemp(path.join(os.tmpdir(), "lyrus-audio-"));
  const filePath = path.join(dir, `audio${suffix}`);
  await writeFile(filePath, bytes);
  return filePath;
}

export async function createPresignedDownloadUrl(
  key: string,
  expiresInSeconds = 900,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: s3Bucket(),
    Key: key,
  });
  return getSignedUrl(getClient(), command, { expiresIn: expiresInSeconds });
}

export function buildS3Key(meetingId: string, filename: string): string {
  return s3ObjectKey(meetingId, filename);
}

export async function saveToS3(
  meetingId: string,
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<{ storageKey: string; filePath: string; s3Key: string; s3Bucket: string }> {
  const storageKey = buildS3Key(meetingId, filename);
  await putPrivateObject(storageKey, buffer, mimeType);

  const dir = await mkdtemp(path.join(os.tmpdir(), "lyrus-audio-"));
  const ext = path.extname(filename) || ".webm";
  const filePath = path.join(dir, `upload${ext}`);
  await writeFile(filePath, buffer);

  return {
    storageKey,
    filePath,
    s3Key: storageKey,
    s3Bucket: s3Bucket(),
  };
}

export async function materializeS3Audio(
  storageKey: string,
  mimeType: string,
): Promise<{ filePath: string; cleanup: () => Promise<void> }> {
  const ext = mimeType.includes("webm") ? ".webm" : path.extname(storageKey) || ".bin";
  const filePath = await downloadToTempFile(storageKey, ext);
  return {
    filePath,
    cleanup: async () => {
      try {
        await unlink(filePath);
      } catch {
        /* ignore */
      }
    },
  };
}
