import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

export function localUploadDir(): string {
  return UPLOAD_DIR;
}

export function localFilePath(storageKey: string): string {
  return path.join(UPLOAD_DIR, storageKey);
}

export async function saveToLocal(
  meetingId: string,
  buffer: Buffer,
  filename: string,
): Promise<{ storageKey: string; filePath: string }> {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(filename) || ".webm";
  const storageKey = `${meetingId}/${Date.now()}${ext}`;
  const filePath = localFilePath(storageKey);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);
  return { storageKey, filePath };
}
