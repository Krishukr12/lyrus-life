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
  }
  
  export interface MOM {
    id: string;
    meetingId: string;
    title: string;
    dateTime: string;
    participants: string[];
    keyPoints: string[];
    actionItems: ActionItem[];
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
  