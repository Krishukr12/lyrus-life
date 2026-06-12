import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { TemplateFileStorageBackend } from "@lyrus/db";
import { resolveStorageBackend } from "./storage/config.js";
import { saveToS3 } from "./storage/s3.js";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

export async function saveMomTemplateFile(
  organizationId: string,
  templateId: string,
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<{ storageKey: string; storageBackend: "LOCAL" | "S3" }> {
  const backend = resolveStorageBackend();

  if (backend === "s3") {
    const saved = await saveToS3(
      `mom-templates/${organizationId}/${templateId}`,
      buffer,
      filename,
      mimeType,
    );
    return {
      storageKey: saved.storageKey,
      storageBackend: TemplateFileStorageBackend.S3,
    };
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(filename) || ".bin";
  const storageKey = `mom-templates/${organizationId}/${templateId}/${Date.now()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, storageKey);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);

  return {
    storageKey,
    storageBackend: TemplateFileStorageBackend.LOCAL,
  };
}
