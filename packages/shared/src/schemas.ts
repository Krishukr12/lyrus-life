import { z } from "zod";

export const extractedTaskSchema = z.object({
  description: z.string(),
  owner: z.string(),
  due_date: z.string(),
  priority: z.enum(["High", "Medium", "Low", ""]).or(z.string()).optional(),
});

export const nluSectionContentSchema = z.object({
  title: z.string(),
  content: z.array(z.string()),
});

export const nluExtractionSchema = z.object({
  tasks: z.array(extractedTaskSchema),
  decisions: z.array(z.string()),
  summary: z.string(),
  next_meeting_agenda: z.array(z.string()).optional(),
  sections: z.array(nluSectionContentSchema).optional(),
});

export type NluExtraction = z.infer<typeof nluExtractionSchema>;

export const createMeetingSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  duration: z.number().int().positive(),
  tag: z.enum(["internal", "client", "vendor"]).default("internal"),
  stakeholders: z
    .array(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
      }),
    )
    .min(1, "Add at least one stakeholder to send meeting invites"),
  notes: z.string().optional().default(""),
});

export const updateMeetingSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  duration: z.number().int().positive().optional(),
  status: z.enum(["upcoming", "ongoing", "completed"]).optional(),
  tag: z.enum(["internal", "client", "vendor"]).optional(),
  notes: z.string().optional(),
});

export const editMomSchema = z.object({
  keyPoints: z.array(z.string()),
  actionItems: z.array(
    z.object({
      task: z.string(),
      assignee: z.string(),
      deadline: z.string(),
    }),
  ),
});

export const transcriptSegmentSchema = z.object({
  speaker: z.string(),
  startTime: z.number(),
  endTime: z.number(),
  text: z.string(),
  confidence: z.number().optional(),
});

export const transcriptionResultSchema = z.object({
  fullText: z.string(),
  language: z.string().default("en"),
  segments: z.array(transcriptSegmentSchema),
});

export type TranscriptionResult = z.infer<typeof transcriptionResultSchema>;

export const loginPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z
  .object({
    resetToken: z.string().min(1),
    code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code from your email"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });
