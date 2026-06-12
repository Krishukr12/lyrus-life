import { jsPDF } from "jspdf";

export interface MomPdfActionItem {
  task: string;
  assignee: string;
  deadline: string;
}

export interface MomPdfSection {
  title: string;
  content: string[];
}

export interface MomPdfBranding {
  brandName?: string;
  tagline?: string;
  accentRgb?: [number, number, number];
}

export interface MomPdfInput {
  meetingTitle: string;
  meetingDate: string;
  durationMinutes: number;
  branding?: MomPdfBranding;
  sections?: MomPdfSection[];
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

function ensurePageSpace(pdf: jsPDF, y: number, needed: number, pageHeight: number): number {
  if (y + needed > pageHeight - 48) {
    pdf.addPage();
    return 52;
  }
  return y;
}

/** Organization-configurable MOM PDF with optional template sections. */
export function generateMomPdfBytes(input: MomPdfInput): Uint8Array {
  const fields = getTemplateFields(input);
  const branding = input.branding ?? {};
  const brandName = branding.brandName ?? "LYRUS";
  const tagline = branding.tagline ?? "Think • Design • Deliver";
  const accent = branding.accentRgb ?? [28, 141, 149];

  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const left = 48;
  let y = 52;
  const pageWidth = 595.28;
  const pageHeight = 841.89;

  pdf.setDrawColor(150, 150, 150);
  pdf.setLineWidth(0.6);
  pdf.rect(24, 24, pageWidth - 48, pageHeight - 48);

  pdf.setTextColor(accent[0], accent[1], accent[2]);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text(brandName.toUpperCase(), 297, y, { align: "center" });
  y += 14;
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(9);
  pdf.text(tagline, 297, y, { align: "center" });
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
    y = ensurePageSpace(pdf, y, 14, pageHeight);
    pdf.text(`${index + 1}. ${attendee}`, left + 14, y);
    y += 14;
  });

  const templateSections =
    input.sections && input.sections.length > 0
      ? input.sections
      : [
          { title: "Key Discussion Points", content: fields.keyPoints },
          {
            title: "Action Items",
            content: fields.actionItems.map(
              (item) =>
                `${item.slNo}. ${item.actionItem} — ${item.responsibility} (${item.timeline})`,
            ),
          },
          { title: "Next Steps", content: fields.nextSteps },
        ];

  for (const section of templateSections) {
    y += 10;
    y = ensurePageSpace(pdf, y, 30, pageHeight);
    pdf.setFont("helvetica", "bold");
    pdf.text(section.title, left, y);
    y += 16;
    pdf.setFont("helvetica", "normal");
    const bullets = section.content.length > 0 ? section.content : ["—"];
    for (const point of bullets) {
      const wrapped = pdf.splitTextToSize(`• ${point}`, 500);
      y = ensurePageSpace(pdf, y, 14 * wrapped.length, pageHeight);
      pdf.text(wrapped, left + 14, y);
      y += 14 * wrapped.length;
    }
  }

  y += 18;
  y = ensurePageSpace(pdf, y, 20, pageHeight);
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(9);
  pdf.text(`Generated On: ${fields.generatedOn}`, left, y);

  return new Uint8Array(pdf.output("arraybuffer"));
}

export function momPdfFilename(meetingTitle: string): string {
  const safe = meetingTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${safe || "meeting"}-mom.pdf`;
}
