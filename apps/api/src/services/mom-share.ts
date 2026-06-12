import { MeetingStatus, PipelineStep, prisma } from "@lyrus/db";
import type { MomPdfActionItem } from "@lyrus/mom-pdf";
import {
  getOrganizerEmail,
  mapMomShareToInviteResults,
  sendMomToStakeholders,
  type InviteResult,
} from "@lyrus/notifications";
import { formatDateTime } from "../lib/mappers.js";
import { logAudit } from "./audit.js";

export async function sendMomToStakeholdersOnApproval(
  meetingId: string,
  approvedBy: string,
): Promise<InviteResult[]> {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: {
      participants: true,
      organizer: true,
      mom: true,
      organization: { select: { name: true } },
    },
  });

  if (!meeting?.mom) {
    throw new Error("MOM not found");
  }

  if (meeting.status !== MeetingStatus.COMPLETED) {
    throw new Error("Meeting must be completed before sharing MOM with stakeholders");
  }

  if (meeting.mom.shared) {
    return [];
  }

  if (meeting.participants.length === 0) {
    return [];
  }

  const keyPoints = Array.isArray(meeting.mom.keyPoints) ? (meeting.mom.keyPoints as string[]) : [];
  const actionItems = Array.isArray(meeting.mom.actionItems)
    ? (meeting.mom.actionItems as unknown as MomPdfActionItem[])
    : [];
  const sections = Array.isArray(meeting.mom.sections)
    ? (meeting.mom.sections as Array<{ title: string; content: string[] }>)
    : undefined;

  const { date } = formatDateTime(meeting.scheduledAt);
  const organizerEmail = meeting.organizer?.email ?? getOrganizerEmail();

  const results = await sendMomToStakeholders({
    meetingId: meeting.id,
    meetingTitle: meeting.title,
    approvedBy,
    organizerEmail,
    pdfInput: {
      meetingTitle: meeting.title,
      meetingDate: date,
      durationMinutes: meeting.durationMinutes,
      branding: meeting.organization?.name
        ? { brandName: meeting.organization.name, tagline: "Minutes of Meeting" }
        : undefined,
      sections,
      mom: {
        createdAt: meeting.mom.createdAt.toISOString(),
        participants: Array.isArray(meeting.mom.participants)
          ? (meeting.mom.participants as string[])
          : [],
        keyPoints,
        actionItems,
      },
    },
    stakeholders: meeting.participants.map((p) => ({
      name: p.name,
      email: p.email,
    })),
  });

  const inviteResults = mapMomShareToInviteResults(results);

  await logAudit(meetingId, PipelineStep.NOTIFICATION_SENT, {
    type: "mom_share",
    approvedBy,
    sent: inviteResults.filter((r) => r.status === "sent" || r.status === "logged").length,
    failed: inviteResults.filter((r) => r.status === "failed").length,
    recipients: inviteResults.map((r) => r.email),
  });

  return inviteResults;
}
