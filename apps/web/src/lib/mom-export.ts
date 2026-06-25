import { generateMomPdfBytes } from "@lyrus/mom-pdf";
import { Packer, Paragraph, TextRun, AlignmentType, Table, TableCell, TableRow, WidthType, BorderStyle } from "docx";
import { Meeting, MOM } from "./types";

type SupportedMomFormat = "docx" | "pdf" | "txt" | "json";

interface TemplateActionItem {
  slNo: number;
  actionItem: string;
  responsibility: string;
  status: string;
  timeline: string;
}

const STATUS_ROTATION = ["Open", "Closed", "In Progress"] as const;

function safeFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getTemplateFields(meeting: Meeting, mom: MOM) {
  const nowDate = new Date(mom.createdAt);
  const attendees = mom.participants.length > 0 ? mom.participants : ["-"];
  const actionItems: TemplateActionItem[] =
    mom.actionItems.length > 0
      ? mom.actionItems.map((item, index) => ({
          slNo: index + 1,
          actionItem: item.task,
          responsibility: item.assignee || "Owner Name",
          status: STATUS_ROTATION[index % STATUS_ROTATION.length],
          timeline: item.deadline || "Due Date",
        }))
      : [
          { slNo: 1, actionItem: "Add new action item", responsibility: "Owner Name", status: "Open", timeline: "Due Date" },
        ];

  return {
    date: `${meeting.date}`,
    meetingTitle: meeting.title,
    attendees,
    keyPoints: mom.keyPoints.length > 0 ? mom.keyPoints : ["Brief summary of main topic"],
    actionItems,
    nextSteps: [
      "Immediate follow-up actions",
      meeting.duration > 0 ? `Next review meeting in ${meeting.duration} minutes cadence` : "Next meeting date if applicable",
    ],
    generatedOn: nowDate.toLocaleString(),
  };
}

function createHeadingCell(text: string) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 20 })], alignment: AlignmentType.CENTER })],
    shading: { fill: "F2F2F2" },
  });
}

async function createDocxBlob(meeting: Meeting, mom: MOM): Promise<Blob> {
  const fields = getTemplateFields(meeting, mom);
  const actionHeader = ["Sl No", "Action Item", "Responsibility", "Status", "Timeline"];

  const tableRows = [
    new TableRow({
      children: actionHeader.map((header) => createHeadingCell(header)),
    }),
    ...fields.actionItems.map(
      (item) =>
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(String(item.slNo))] }),
            new TableCell({ children: [new Paragraph(item.actionItem)] }),
            new TableCell({ children: [new Paragraph(item.responsibility)] }),
            new TableCell({ children: [new Paragraph(item.status)] }),
            new TableCell({ children: [new Paragraph(item.timeline)] }),
          ],
        }),
    ),
  ];

  const templateTable = new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "7A7A7A" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "7A7A7A" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "7A7A7A" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "7A7A7A" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "7A7A7A" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "7A7A7A" },
    },
  });

  const paragraphs = [
    new Paragraph({
      children: [new TextRun({ text: "LYRUS", bold: true, color: "1C8D95", size: 28 })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [new TextRun({ text: "Think • Design • Deliver", italics: true, color: "1C8D95", size: 16 })],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph(""),
    new Paragraph({
      text: "Minutes of Meeting",
      heading: "Heading1",
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph(""),
    new Paragraph({ children: [new TextRun({ text: "Date: ", bold: true }), new TextRun(fields.date)] }),
    new Paragraph({ children: [new TextRun({ text: "Meeting Title: ", bold: true }), new TextRun(fields.meetingTitle)] }),
    new Paragraph({ children: [new TextRun({ text: "Attendees:", bold: true })] }),
    ...fields.attendees.map((attendee, index) => new Paragraph(`  ${index + 1}. ${attendee}`)),
    new Paragraph(""),
    new Paragraph({ children: [new TextRun({ text: "Key Discussion Points", bold: true })] }),
    ...fields.keyPoints.map((point) => new Paragraph(`  [${point}]`)),
    new Paragraph(""),
    new Paragraph({ children: [new TextRun({ text: "Action Items", bold: true })] }),
    new Paragraph(""),
  ];

  const closingParagraphs = [
    new Paragraph(""),
    new Paragraph({ children: [new TextRun({ text: "Next Steps", bold: true })] }),
    ...fields.nextSteps.map((step) => new Paragraph(`  [${step}]`)),
    new Paragraph(""),
    new Paragraph({ children: [new TextRun({ text: `Generated On: ${fields.generatedOn}`, italics: true, size: 18 })] }),
    new Paragraph({
      children: [new TextRun({ text: "Page 1 of 1", italics: true, size: 16 })],
      alignment: AlignmentType.RIGHT,
    }),
  ];

  const doc = {
    sections: [
      {
        children: [...paragraphs, templateTable, ...closingParagraphs],
      },
    ],
  };

  return Packer.toBlob(doc);
}

function createTextBlob(meeting: Meeting, mom: MOM): Blob {
  const fields = getTemplateFields(meeting, mom);
  const lines = [
    "Minutes of Meeting",
    "==================",
    "LYRUS | Think - Design - Deliver",
    "",
    `Date: ${fields.date}`,
    `Meeting Title: ${fields.meetingTitle}`,
    "Attendees:",
    ...fields.attendees.map((attendee) => `- ${attendee}`),
    "",
    "Key Discussion Points:",
    ...fields.keyPoints.map((point) => `- ${point}`),
    "",
    "Action Items:",
    ...fields.actionItems.map(
      (item) => `${item.slNo}. ${item.actionItem} | Responsibility: ${item.responsibility} | Status: ${item.status} | Timeline: ${item.timeline}`,
    ),
    "",
    "Next Steps:",
    ...fields.nextSteps.map((step) => `- ${step}`),
    "",
    `Generated On: ${fields.generatedOn}`,
  ];

  return new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
}

function createJsonBlob(meeting: Meeting, mom: MOM): Blob {
  const fields = getTemplateFields(meeting, mom);
  return new Blob([JSON.stringify(fields, null, 2)], { type: "application/json;charset=utf-8" });
}

function toMomPdfInput(meeting: Meeting, mom: MOM) {
  return {
    meetingTitle: meeting.title,
    meetingDate: `${meeting.date}`,
    durationMinutes: meeting.duration,
    sections: mom.sections?.length ? mom.sections : undefined,
    mom: {
      createdAt: mom.createdAt,
      participants: mom.participants,
      keyPoints: mom.keyPoints,
      actionItems: mom.actionItems,
    },
  };
}

export async function createMomPdfBlob(meeting: Meeting, mom: MOM): Promise<Blob> {
  const bytes = generateMomPdfBytes(toMomPdfInput(meeting, mom));
  return new Blob([bytes], { type: "application/pdf" });
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function downloadMomFile(meeting: Meeting, mom: MOM, format: SupportedMomFormat) {
  const base = safeFilename(`${meeting.title}-mom`) || "meeting-mom";

  if (format === "docx") {
    const docxBlob = await createDocxBlob(meeting, mom);
    triggerDownload(docxBlob, `${base}.docx`);
    return;
  }

  if (format === "pdf") {
    const pdfBlob = await createMomPdfBlob(meeting, mom);
    triggerDownload(pdfBlob, `${base}.pdf`);
    return;
  }

  if (format === "txt") {
    triggerDownload(createTextBlob(meeting, mom), `${base}.txt`);
    return;
  }

  triggerDownload(createJsonBlob(meeting, mom), `${base}.json`);
}
