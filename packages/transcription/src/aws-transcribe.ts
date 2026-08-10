import { readFile } from "node:fs/promises";
import {
  GetTranscriptionJobCommand,
  LanguageCode,
  StartTranscriptionJobCommand,
  TranscribeClient,
} from "@aws-sdk/client-transcribe";
import {
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import type { TranscriptionOutput } from "./types.js";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isAwsConfigured(): boolean {
  return Boolean(
    process.env.AWS_REGION &&
      process.env.AWS_S3_BUCKET &&
      (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_PROFILE),
  );
}

export function awsTranscribeAvailable(): boolean {
  return isAwsConfigured();
}

type AwsTranscriptItem = {
  type?: string;
  start_time?: string;
  end_time?: string;
  alternatives?: Array<{ content?: string; confidence?: string }>;
};

type AwsSpeakerSegment = {
  start_time?: string;
  end_time?: string;
  speaker_label?: string;
  items?: Array<{ start_time?: string; speaker_label?: string }>;
};

type AwsTranscriptJson = {
  results?: {
    transcripts?: Array<{ transcript?: string }>;
    items?: AwsTranscriptItem[];
    speaker_labels?: {
      speakers?: number;
      segments?: AwsSpeakerSegment[];
    };
  };
};

function toNumber(value: string | undefined, fallback = 0): number {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Build diarized segments from AWS speaker_labels + items (word stream). */
function buildDiarizedSegments(
  json: AwsTranscriptJson,
  participants: string[],
): TranscriptionOutput["segments"] {
  const items = json.results?.items ?? [];
  const speakerSegs = json.results?.speaker_labels?.segments ?? [];
  if (speakerSegs.length === 0 || items.length === 0) return [];

  // Map word start times → text tokens (pronunciations + following punctuation).
  const words: Array<{ start: number; end: number; content: string; confidence: number }> = [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i]!;
    if (item.type === "punctuation") continue;
    const content = item.alternatives?.[0]?.content?.trim();
    if (!content) continue;
    let text = content;
    const next = items[i + 1];
    if (next?.type === "punctuation") {
      const punct = next.alternatives?.[0]?.content ?? "";
      text += punct;
    }
    words.push({
      start: toNumber(item.start_time),
      end: toNumber(item.end_time, toNumber(item.start_time)),
      content: text,
      confidence: Number(item.alternatives?.[0]?.confidence ?? 0.9) || 0.9,
    });
  }

  const labelToName = new Map<string, string>();
  let nextParticipant = 0;

  const resolveSpeaker = (label: string): string => {
    const existing = labelToName.get(label);
    if (existing) return existing;
    const name =
      participants[nextParticipant] ??
      `Speaker ${nextParticipant + 1}`;
    nextParticipant += 1;
    labelToName.set(label, name);
    return name;
  };

  const segments: TranscriptionOutput["segments"] = [];

  for (const seg of speakerSegs) {
    const label = seg.speaker_label ?? "spk_0";
    const start = toNumber(seg.start_time);
    const end = toNumber(seg.end_time, start);
    const text = words
      .filter((w) => w.start >= start - 0.05 && w.start < end + 0.05)
      .map((w) => w.content)
      .join(" ")
      .replace(/\s+([,.!?;:])/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) continue;
    const confWords = words.filter((w) => w.start >= start - 0.05 && w.start < end + 0.05);
    const confidence =
      confWords.length > 0
        ? confWords.reduce((sum, w) => sum + w.confidence, 0) / confWords.length
        : 0.88;
    segments.push({
      speaker: resolveSpeaker(label),
      startTime: start,
      endTime: end,
      text,
      confidence,
    });
  }

  return segments;
}

export function labeledTranscriptFromSegments(
  segments: Array<{ speaker: string; text: string }>,
): string {
  return segments
    .map((s) => `${s.speaker}: ${s.text}`.trim())
    .filter((line) => line.length > 3)
    .join("\n");
}

export async function transcribeWithAws(
  filePath: string,
  meetingId: string,
  participants: string[],
  options?: { existingS3Key?: string; existingS3Bucket?: string },
): Promise<TranscriptionOutput> {
  if (!isAwsConfigured()) {
    throw new Error("AWS Transcribe is not configured");
  }

  const region = process.env.AWS_REGION!;
  const bucket = options?.existingS3Bucket ?? process.env.AWS_S3_BUCKET!;
  const s3 = new S3Client({ region });
  const transcribe = new TranscribeClient({ region });

  let key = options?.existingS3Key;
  if (!key) {
    const prefix = (process.env.AWS_S3_PREFIX ?? "recordings").replace(/^\/+|\/+$/g, "");
    key = prefix
      ? `${prefix}/${meetingId}/${Date.now()}.webm`
      : `meetings/${meetingId}/${Date.now()}.webm`;
    const body = await readFile(filePath);
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: "audio/webm",
        ServerSideEncryption: "AES256",
      }),
    );
  }

  const jobName = `lyrus-${meetingId}-${Date.now()}`.replace(/[^a-zA-Z0-9-_]/g, "-");
  const mediaUri = `s3://${bucket}/${key}`;

  const languageCode =
    (process.env.AWS_TRANSCRIBE_LANGUAGE as LanguageCode | undefined) ?? LanguageCode.EN_US;

  await transcribe.send(
    new StartTranscriptionJobCommand({
      TranscriptionJobName: jobName,
      LanguageCode: languageCode,
      MediaFormat: "webm",
      Media: { MediaFileUri: mediaUri },
      OutputBucketName: bucket,
      Settings: {
        ShowSpeakerLabels: true,
        MaxSpeakerLabels: Math.min(10, Math.max(2, participants.length || 2)),
      },
    }),
  );

  let status = "IN_PROGRESS";
  let transcriptUri: string | undefined;

  for (let i = 0; i < 60; i++) {
    await sleep(3000);
    const job = await transcribe.send(
      new GetTranscriptionJobCommand({ TranscriptionJobName: jobName }),
    );
    status = job.TranscriptionJob?.TranscriptionJobStatus ?? "FAILED";
    transcriptUri = job.TranscriptionJob?.Transcript?.TranscriptFileUri;
    if (status === "COMPLETED" || status === "FAILED") break;
  }

  if (status !== "COMPLETED" || !transcriptUri) {
    const failureReason =
      (
        await transcribe.send(
          new GetTranscriptionJobCommand({ TranscriptionJobName: jobName }),
        )
      ).TranscriptionJob?.FailureReason ?? "unknown";
    throw new Error(
      `AWS Transcribe job failed or timed out (${status}): ${failureReason}`,
    );
  }

  const res = await fetch(transcriptUri);
  const json = (await res.json()) as AwsTranscriptJson;

  const plainFullText =
    json.results?.transcripts?.[0]?.transcript?.trim() ??
    "Transcription completed but no text returned.";

  const diarized = buildDiarizedSegments(json, participants);
  const segments =
    diarized.length > 0
      ? diarized
      : plainFullText
          .split(/(?<=[.!?])\s+/)
          .filter(Boolean)
          .map((text, index) => ({
            speaker: participants[index % Math.max(participants.length, 1)] ?? "Speaker",
            startTime: index * 8,
            endTime: index * 8 + 7,
            text,
            confidence: 0.88,
          }));

  const fullText =
    diarized.length > 0 ? labeledTranscriptFromSegments(diarized) : plainFullText;

  return {
    fullText,
    language: "en",
    segments:
      segments.length > 0
        ? segments
        : [
            {
              speaker: "Speaker",
              startTime: 0,
              endTime: 10,
              text: plainFullText,
              confidence: 0.88,
            },
          ],
    source: "aws_transcribe",
  };
}
