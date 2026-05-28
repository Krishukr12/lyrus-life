import { jsPDF } from "jspdf";

export interface MomPdfActionItem {
  task: string;
  assignee: string;
  deadline: string;
}

export interface MomPdfInput {
  meetingTitle: string;
  meetingDate: string;
  durationMinutes: number;
  mom: {
    createdAt: string;
    participants: string[];
    keyPoints: string[];
    actionItems: MomPdfActionItem[];
  };
}

const STATUS_ROTATION = ["Open", "Closed", "In Progress"] as const;

function getTemplateFields(input: MomPdfInput) {
  const nowDate = new Date(input.mom.createdAt);
  const attendees = input.mom.participants.length > 0 ? input.mom.participants : ["-"];
  const actionItems =
    input.mom.actionItems.length > 0
      ? input.mom.actionItems.map((item, index) => ({
          slNo: index + 1,
          actionItem: item.task,
          responsibility: item.assignee || "Owner Name",
          status: STATUS_ROTATION[index % STATUS_ROTATION.length],
          timeline: item.deadline || "Due Date",
        }))
      : [
          {
            slNo: 1,
            actionItem: "Add new action item",
            responsibility: "Owner Name",
            status: "Open" as const,
            timeline: "Due Date",
          },
        ];

  return {
    date: input.meetingDate,
    meetingTitle: input.meetingTitle,
    attendees,
    keyPoints:
      input.mom.keyPoints.length > 0 ? input.mom.keyPoints : ["Brief summary of main topic"],
    actionItems,
    nextSteps: [
      "Immediate follow-up actions",
      input.durationMinutes > 0
        ? `Next review meeting in ${input.durationMinutes} minutes cadence`
        : "Next meeting date if applicable",
    ],
    generatedOn: nowDate.toLocaleString(),
  };
}

/** Lyrus Life branded MOM PDF (same layout as the web review template). */
export function generateMomPdfBytes(input: MomPdfInput): Uint8Array {
  const fields = getTemplateFields(input);
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const left = 48;
  let y = 52;
  const pageWidth = 595.28;
  const pageHeight = 841.89;

  pdf.setDrawColor(150, 150, 150);
  pdf.setLineWidth(0.6);
  pdf.rect(24, 24, pageWidth - 48, pageHeight - 48);

  pdf.setTextColor(28, 141, 149);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("LYRUS", 297, y, { align: "center" });
  y += 14;
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(9);
  pdf.text("Think • Design • Deliver", 297, y, { align: "center" });
  y += 22;

  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("Minutes of Meeting", 297, y, { align: "center" });

  y += 36;
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("Date:", left, y);
  pdf.setFont("helvetica", "normal");
  pdf.text(fields.date, left + 90, y);

  y += 18;
  pdf.setFont("helvetica", "bold");
  pdf.text("Meeting Title:", left, y);
  pdf.setFont("helvetica", "normal");
  pdf.text(fields.meetingTitle, left + 90, y);

  y += 22;
  pdf.setFont("helvetica", "bold");
  pdf.text("Attendees:", left, y);
  y += 16;
  pdf.setFont("helvetica", "normal");
  fields.attendees.forEach((attendee, index) => {
    pdf.text(`${index + 1}. ${attendee}`, left + 14, y);
    y += 14;
  });

  y += 8;
  pdf.setFont("helvetica", "bold");
  pdf.text("Key Discussion Points", left, y);
  y += 16;
  pdf.setFont("helvetica", "normal");
  fields.keyPoints.forEach((point) => {
    const wrapped = pdf.splitTextToSize(`[${point}]`, 500);
    pdf.text(wrapped, left + 14, y);
    y += 14 * wrapped.length;
  });

  y += 10;
  pdf.setFont("helvetica", "bold");
  pdf.text("Action Items", left, y);
  y += 18;

  const headers = ["Sl No", "Action Item", "Responsibility", "Status", "Timeline"];
  const widths = [44, 204, 100, 70, 80];
  let x = left;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  headers.forEach((header, i) => {
    pdf.rect(x, y, widths[i], 20);
    pdf.text(header, x + 4, y + 14);
    x += widths[i];
  });
  y += 20;

  pdf.setFont("helvetica", "normal");
  fields.actionItems.forEach((item) => {
    const row = [String(item.slNo), item.actionItem, item.responsibility, item.status, item.timeline];
    x = left;
    row.forEach((cell, i) => {
      pdf.rect(x, y, widths[i], 22);
      const text = pdf.splitTextToSize(cell, widths[i] - 8)[0] ?? "";
      pdf.text(text, x + 4, y + 14);
      x += widths[i];
    });
    y += 22;
  });

  y += 14;
  pdf.setFont("helvetica", "bold");
  pdf.text("Next Steps", left, y);
  y += 16;
  pdf.setFont("helvetica", "normal");
  fields.nextSteps.forEach((step) => {
    pdf.text(`[${step}]`, left + 14, y);
    y += 14;
  });

  y += 18;
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(9);
  pdf.text(`Generated On: ${fields.generatedOn}`, left, y);
  pdf.text("Page 1 of 1", pageWidth - 60, pageHeight - 32, { align: "right" });

  return new Uint8Array(pdf.output("arraybuffer"));
}

export function momPdfFilename(meetingTitle: string): string {
  const safe = meetingTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${safe || "meeting"}-mom.pdf`;
}
