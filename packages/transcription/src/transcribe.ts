import { createReadStream, statSync } from "node:fs";
import OpenAI from "openai";
import type { TranscribeAudioInput } from "./transcribe-input.js";
import type { TranscriptionOutput, TranscriptionSource } from "./types.js";
import {
  awsTranscribeAvailable,
  labeledTranscriptFromSegments,
  transcribeWithAws,
} from "./aws-transcribe.js";

export type { TranscribeAudioInput } from "./transcribe-input.js";
export type { TranscriptionOutput, TranscriptionSource } from "./types.js";

function getFileSize(filePath: string): number {
  try {
    return statSync(filePath).size;
  } catch {
    return 0;
  }
}

function mockTranscription(input: TranscribeAudioInput): TranscriptionOutput {
  const names = input.participants.length > 0 ? input.participants : ["Speaker 1", "Speaker 2"];
  const [a, b, c] = names;

  const scripted = [
    `${a}: Thanks everyone for joining. Let's review progress on the current milestones.`,
    `${b}: I will compile the updated expense data by Friday.`,
    `${a}: We should finalize the budget report by next Wednesday.`,
    `${c ?? b}: We also decided to postpone the pilot project to Q3.`,
  ];

  if (input.meetingNotes?.trim()) {
    scripted.push(`${a}: ${input.meetingNotes.trim().slice(0, 300)}`);
  }

  const segments = scripted.map((line, index) => {
    const speaker = line.split(":")[0] ?? `Speaker ${index + 1}`;
    const text = line.includes(":") ? line.slice(line.indexOf(":") + 1).trim() : line;
    const startTime = index * 12;
    return {
      speaker,
      startTime,
      endTime: startTime + 11,
      text,
      confidence: 0.5,
    };
  });

  return {
    fullText: labeledTranscriptFromSegments(segments),
    language: "en",
    segments,
    source: "mock",
  };
}

async function transcribeWithOpenAI(input: TranscribeAudioInput): Promise<TranscriptionOutput> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const file = createReadStream(input.filePath);

  const result = await client.audio.transcriptions.create({
    file,
    model: process.env.OPENAI_TRANSCRIBE_MODEL ?? "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["segment"],
  });

  // Whisper has no true diarization — keep neutral speakers (do not round-robin stakeholders).
  const segments =
    "segments" in result && Array.isArray(result.segments)
      ? result.segments.map((seg, index) => ({
          speaker: "Speaker",
          startTime: seg.start ?? index * 10,
          endTime: seg.end ?? (seg.start ?? index * 10) + 10,
          text: seg.text?.trim() ?? "",
          confidence: 0.92,
        }))
      : [
          {
            speaker: "Speaker",
            startTime: 0,
            endTime: 60,
            text: result.text,
            confidence: 0.92,
          },
        ];

  const clean = segments.filter((s) => s.text.length > 0);
  return {
    fullText: labeledTranscriptFromSegments(clean),
    language: "en",
    segments: clean,
    source: "openai_whisper",
  };
}

/**
 * Prefer AWS when configured — it provides speaker diarization, which is required
 * for reliable task assignee extraction. Whisper is fallback (ASR only).
 */
function resolveProvider(): "openai" | "aws" | "mock" {
  const pref = (process.env.TRANSCRIPTION_PROVIDER ?? "auto").toLowerCase();
  if (pref === "openai" && process.env.OPENAI_API_KEY) return "openai";
  if (pref === "aws" && awsTranscribeAvailable()) return "aws";
  if (pref === "mock") return "mock";
  if (pref === "auto" || pref === "") {
    if (awsTranscribeAvailable()) return "aws";
    if (process.env.OPENAI_API_KEY) return "openai";
    return "mock";
  }
  if (process.env.OPENAI_API_KEY) return "openai";
  if (awsTranscribeAvailable()) return "aws";
  return "mock";
}

export async function transcribeAudio(input: TranscribeAudioInput): Promise<TranscriptionOutput> {
  const fileSize = getFileSize(input.filePath);
  const hasRealRecording = fileSize > 8_000;
  const provider = resolveProvider();

  if (provider === "aws") {
    try {
      return await transcribeWithAws(
        input.filePath,
        input.meetingId ?? "unknown",
        input.participants,
        {
          existingS3Key: input.s3Key,
          existingS3Bucket: input.s3Bucket,
        },
      );
    } catch (awsErr) {
      if (process.env.OPENAI_API_KEY) {
        console.warn(
          "[transcription] AWS failed, falling back to OpenAI Whisper:",
          awsErr instanceof Error ? awsErr.message : awsErr,
        );
        return transcribeWithOpenAI(input);
      }
      throw awsErr;
    }
  }

  if (provider === "openai") {
    return transcribeWithOpenAI(input);
  }

  if (hasRealRecording) {
    throw new Error(
      "A meeting recording was captured but no transcription service is configured. " +
        "Set OPENAI_API_KEY or AWS_REGION + AWS_S3_BUCKET + credentials in .env",
    );
  }

  return mockTranscription(input);
}
