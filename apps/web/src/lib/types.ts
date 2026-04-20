export interface Stakeholder {
    name: string;
    email: string;
  }
  
  export type MeetingStatus = "upcoming" | "ongoing" | "completed";
  export type MeetingTag = "internal" | "client" | "vendor";
  
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
  