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
          responsibility: item.assignee || "Unassigned",
          status: STATUS_ROTATION[index % STATUS_ROTATION.length],
          timeline: item.deadline || "TBD",
        }))
      : [];

  const nextSteps =
    input.mom.actionItems.length > 0
      ? input.mom.actionItems.slice(0, 5).map((a) => a.task)
      : [];

  return {
    date: input.meetingDate,
    meetingTitle: input.meetingTitle,
    attendees,
    keyPoints:
      input.mom.keyPoints.length > 0
        ? input.mom.keyPoints
        : ["No key discussion points captured from the transcript."],
    actionItems,
    nextSteps:
      nextSteps.length > 0 ? nextSteps : ["No follow-ups captured from the transcript."],
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
  const brandName = branding.brandName?.trim() || "Meeting Desk AI";
  const tagline = branding.tagline?.trim() ?? "";
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
  if (tagline) {
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(9);
    pdf.text(tagline, 297, y, { align: "center" });
    y += 22;
  } else {
    y += 10;
  }

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

  const templateSections = (() => {
    const actionLines = fields.actionItems.map(
      (item) =>
        `${item.slNo}. ${item.actionItem}${item.responsibility ? ` — ${item.responsibility}` : ""}${item.timeline ? ` (${item.timeline})` : ""}`,
    );

    // Always show the user-edited core fields first. Template sections used to
    // hide key points / actions entirely when present.
    const core = [
      { title: "Key Discussion Points", content: fields.keyPoints },
      {
        title: "Action Items",
        content:
          actionLines.length > 0
            ? actionLines
            : ["No action items captured."],
      },
    ];

    const coreTitles = new Set(["key discussion points", "action items", "next steps"]);
    const extras = (input.sections ?? []).filter(
      (section) => !coreTitles.has(section.title.trim().toLowerCase()),
    );

    return [...core, ...extras];
  })();

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
