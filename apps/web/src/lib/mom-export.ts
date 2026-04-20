import { Packer, Paragraph, TextRun, AlignmentType, Table, TableCell, TableRow, WidthType, BorderStyle } from "docx";
import { jsPDF } from "jspdf";
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

export async function createMomPdfBlob(meeting: Meeting, mom: MOM): Promise<Blob> {
  const fields = getTemplateFields(meeting, mom);
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const left = 48;
  let y = 52;
  const pageWidth = 595.28;
  const pageHeight = 841.89;

  // Outer frame to match template page border
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

  return pdf.output("blob");
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
