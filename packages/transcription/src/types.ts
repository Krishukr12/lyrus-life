import type { TranscriptionResult } from "@lyrus/shared";

export type TranscriptionSource =
  | "openai_whisper"
  | "aws_transcribe"
  | "notes"
  | "mock"
  | "unavailable";

export interface TranscriptionOutput extends TranscriptionResult {
  source: TranscriptionSource;
}
