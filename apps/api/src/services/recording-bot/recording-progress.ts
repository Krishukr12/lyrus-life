import type { MeetingStatus } from "@lyrus/db";

export type RecordingProgressPhase =
  | "idle"
  | "scheduling"
  | "joining"
  | "waiting_room"
  | "live"
  | "ending"
  | "transcribing"
  | "generating_mom"
  | "ready"
  | "failed";

export type RecordingProgress = {
  phase: RecordingProgressPhase;
  step: number;
  totalSteps: number;
  title: string;
  detail: string;
  isLive: boolean;
  isProcessing: boolean;
};

const TOTAL = 5;

export function mapRecallCodeToBotStatus(code: string | null): string | null {
  if (!code) return null;
  const c = code.toLowerCase();
  if (c === "in_waiting_room") return "waiting_room";
  if (c === "joining_call" || c === "ready") return "joining";
  if (c === "in_call_not_recording") return "in_call";
  if (c === "in_call_recording" || c === "recording") return "recording";
  if (c === "call_ended") return "call_ended";
  if (c === "done" || c === "completed") return "done";
  if (c === "fatal" || c === "failed" || c === "error") return "failed";
  return c;
}

export function buildRecordingProgress(input: {
  recordingBotStatus?: string | null;
  pipelineStatus?: "processing" | "failed" | null;
  meetingStatus: MeetingStatus | string;
  hasMom: boolean;
  hasTranscript: boolean;
}): RecordingProgress | null {
  const bot = input.recordingBotStatus ?? null;
  if (!bot && !input.pipelineStatus) return null;

  if (bot === "failed" || input.pipelineStatus === "failed") {
    return {
      phase: "failed",
      step: 0,
      totalSteps: TOTAL,
      title: "Recording failed",
      detail: "The bot could not finish recording. Try joining the meeting again or contact support.",
      isLive: false,
      isProcessing: false,
    };
  }

  if (input.hasMom && bot === "done") {
    return {
      phase: "ready",
      step: TOTAL,
      totalSteps: TOTAL,
      title: "MOM draft ready",
      detail: "Review, edit, and approve before sharing with stakeholders.",
      isLive: false,
      isProcessing: false,
    };
  }

  if (
    input.pipelineStatus === "processing" ||
    bot === "processing" ||
    input.meetingStatus === "PROCESSING"
  ) {
    return {
      phase: input.hasTranscript ? "generating_mom" : "transcribing",
      step: 4,
      totalSteps: TOTAL,
      title: input.hasTranscript ? "Generating MOM" : "Transcribing recording",
      detail: input.hasTranscript
        ? "AI is extracting key points, action items, and template sections."
        : "Speech-to-text is running on your meeting audio.",
      isLive: false,
      isProcessing: true,
    };
  }

  if (bot === "call_ended" || bot === "done") {
    return {
      phase: "ending",
      step: 3,
      totalSteps: TOTAL,
      title: "Everyone has left",
      detail: "The recording bot is wrapping up and uploading audio for transcription.",
      isLive: false,
      isProcessing: true,
    };
  }

  if (bot === "recording" || bot === "in_call") {
    return {
      phase: "live",
      step: 2,
      totalSteps: TOTAL,
      title: "Meeting in progress",
      detail:
        bot === "recording"
          ? "The bot is recording. When everyone leaves, it will exit automatically and MOM generation will start."
          : "The bot is in the call. Recording will begin shortly.",
      isLive: true,
      isProcessing: false,
    };
  }

  if (bot === "waiting_room") {
    return {
      phase: "waiting_room",
      step: 1,
      totalSteps: TOTAL,
      title: "Bot in waiting room",
      detail: "Admit “Meeting Desk AI” in Google Meet or Teams so recording can start.",
      isLive: true,
      isProcessing: false,
    };
  }

  if (bot === "joining" || bot === "scheduled" || bot === "scheduling") {
    return {
      phase: bot === "scheduling" || bot === "scheduled" ? "scheduling" : "joining",
      step: 1,
      totalSteps: TOTAL,
      title: bot === "scheduling" || bot === "scheduled" ? "Bot scheduled" : "Bot joining",
      detail: "The recording bot is connecting to your meeting link.",
      isLive: true,
      isProcessing: false,
    };
  }

  return null;
}
