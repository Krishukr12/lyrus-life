export interface TranscribeAudioInput {
  filePath: string;
  mimeType: string;
  participants: string[];
  meetingNotes?: string;
  meetingId?: string;
  /** When recording is already in S3, skip re-upload for AWS Transcribe. */
  s3Key?: string;
  s3Bucket?: string;
}
