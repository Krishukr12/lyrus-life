export interface TranscribeAudioInput {
  filePath: string;
  mimeType: string;
  participants: string[];
  meetingNotes?: string;
  meetingId?: string;
}
