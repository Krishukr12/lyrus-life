/**
 * Run transcription in isolation (same code path as the API pipeline).
 *
 * Usage:
 *   pnpm test:transcription path/to/audio.webm
 *   pnpm test:transcription ./uploads/<meeting-id>/meeting-xxx.webm
 *
 * Loads .env from repo root (OPENAI_API_KEY, AWS_*, TRANSCRIPTION_PROVIDER).
 */
import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { transcribeAudio } from "@lyrus/transcription";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
config({ path: resolve(root, ".env") });

const audioPath = process.argv[2];

if (!audioPath) {
  console.error("Usage: pnpm test:transcription <path-to-audio.webm>");
  process.exit(1);
}

const absolutePath = resolve(process.cwd(), audioPath);
if (!existsSync(absolutePath)) {
  console.error(`File not found: ${absolutePath}`);
  process.exit(1);
}

const provider = process.env.TRANSCRIPTION_PROVIDER ?? "auto";
console.log("--- Transcription test ---");
console.log("File:", absolutePath);
console.log("TRANSCRIPTION_PROVIDER:", provider);
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "(set)" : "(missing)");
console.log(
  "AWS:",
  process.env.AWS_REGION && process.env.AWS_S3_BUCKET ? "(configured)" : "(missing)",
);
console.log("");

const start = Date.now();

transcribeAudio({
  filePath: absolutePath,
  mimeType: "audio/webm",
  participants: ["Alice", "Bob"],
  meetingNotes: "Optional notes passed to mock fallback only",
  meetingId: "test-meeting",
})
  .then((result) => {
    console.log("Source:", result.source);
    console.log("Language:", result.language);
    console.log("Duration:", `${((Date.now() - start) / 1000).toFixed(1)}s`);
    console.log("\n--- Full text ---\n");
    console.log(result.fullText);
    console.log("\n--- Segments ---\n");
    for (const seg of result.segments) {
      console.log(
        `[${seg.startTime.toFixed(1)}s - ${seg.endTime.toFixed(1)}s] ${seg.speaker}: ${seg.text}`,
      );
    }
  })
  .catch((err) => {
    console.error("Failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
