import {
  AudioStorageBackend,
  MeetingStatus,
  MeetingTag,
  PipelineStep,
  TaskPriority,
  TaskStatus,
} from "@lyrus/db";

export type MeetingStatusType = (typeof MeetingStatus)[keyof typeof MeetingStatus];
export type MeetingTagType = (typeof MeetingTag)[keyof typeof MeetingTag];
export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];
export type TaskPriorityType = (typeof TaskPriority)[keyof typeof TaskPriority];
export type PipelineStepType = (typeof PipelineStep)[keyof typeof PipelineStep];
export type AudioStorageBackendType =
  (typeof AudioStorageBackend)[keyof typeof AudioStorageBackend];
