export interface Stakeholder {
    name: string;
    email: string;
  }
  
  export type MeetingStatus = "upcoming" | "ongoing" | "completed";
  export type MeetingTag = "internal" | "client" | "vendor";
  
  export interface TranscriptSegment {
    speaker: string;
    startTime: number;
    endTime: number;
    text: string;
  }

  export interface MeetingTranscript {
    id: string;
    fullText: string;
    language: string;
    source?: string;
    segments: TranscriptSegment[];
  }

  export interface MeetingInviteRecord {
    email: string;
    name: string;
    status: "sent" | "logged" | "failed";
    error?: string;
    sentAt?: string;
  }

  export interface CreateMeetingResponse {
    meeting: Meeting;
    invites: Array<{
      email: string;
      name: string;
      status: "sent" | "logged" | "failed";
      error?: string;
    }>;
  }

  export interface Meeting {
    id: string;
    title: string;
    description: string;
    date: string; // ISO date
    time: string; // HH:mm
    /** Absolute start (ISO). Prefer for local date/time display over date/time. */
    scheduledAt?: string;
    duration: number; // minutes
    stakeholders: Stakeholder[];
    status: MeetingStatus;
    tag: MeetingTag;
    notes: string;
    mom?: MOM;
    transcript?: MeetingTranscript;
    pipelineStatus?: "processing" | "failed" | null;
    invites?: MeetingInviteRecord[];
    joinSlug?: string;
    platform?: "lyrus" | "google_meet" | "microsoft_teams";
    externalMeetingUrl?: string;
    calendarEventId?: string;
    recordingBotStatus?: string | null;
    recordingProgress?: {
      phase: string;
      step: number;
      totalSteps: number;
      title: string;
      detail: string;
      isLive: boolean;
      isProcessing: boolean;
    } | null;
  }
  
  export interface MOM {
    id: string;
    meetingId: string;
    title: string;
    dateTime: string;
    participants: string[];
    keyPoints: string[];
    actionItems: ActionItem[];
    sections?: Array<{ title: string; content: string[] }>;
    createdAt: string;
    shared: boolean;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  lastEditedAt?: string;
  }
  
  export interface ActionItem {
    task: string;
    assignee: string;
    deadline: string;
  }
  
  export type TaskStatus = "pending" | "in_progress" | "completed" | "overdue";
  
  export interface UserTask {
    id: string;
    meetingId: string;
    meetingTitle: string;
    task: string;
    assignee: string;
    deadline: string;
    status: TaskStatus;
    createdAt: string;
    remindedAt?: string;
  }
  