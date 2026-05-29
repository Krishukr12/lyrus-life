import { readFile } from "node:fs/promises";
import {
  GetTranscriptionJobCommand,
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

  await transcribe.send(
    new StartTranscriptionJobCommand({
      TranscriptionJobName: jobName,
      LanguageCode: "en-US",
      MediaFormat: "webm",
      Media: { MediaFileUri: mediaUri },
      OutputBucketName: bucket,
      Settings: {
        ShowSpeakerLabels: true,
        MaxSpeakerLabels: Math.min(10, Math.max(2, participants.length)),
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
  const json = (await res.json()) as {
    results?: {
      transcripts?: Array<{ transcript?: string }>;
      items?: Array<{ type?: string; alternatives?: Array<{ content?: string }> }>;
    };
  };

  const fullText =
    json.results?.transcripts?.[0]?.transcript?.trim() ??
    "Transcription completed but no text returned.";

  const segments = fullText
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .map((text, index) => ({
      speaker: participants[index % Math.max(participants.length, 1)] ?? "Speaker",
      startTime: index * 8,
      endTime: index * 8 + 7,
      text,
      confidence: 0.88,
    }));

  return {
    fullText,
    language: "en",
    segments: segments.length > 0 ? segments : [{ speaker: "Speaker", startTime: 0, endTime: 10, text: fullText, confidence: 0.88 }],
    source: "aws_transcribe",
  };
}
