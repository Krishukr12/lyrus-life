import mammoth from "mammoth";

export interface ExtractedHeading {
  level: number;
  text: string;
}

const PDF_HEADING_PATTERNS = [
  /^(\d+\.)\s+(.+)$/,
  /^([A-Z][A-Z\s&/-]{2,})$/,
  /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*):$/,
];

function isLikelyHeading(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length < 3 || trimmed.length > 120) return false;
  return PDF_HEADING_PATTERNS.some((p) => p.test(trimmed));
}

function parsePdfText(text: string): ExtractedHeading[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const headings: ExtractedHeading[] = [];

  for (const line of lines) {
    if (!isLikelyHeading(line)) continue;
    const numbered = line.match(/^(\d+\.)\s+(.+)$/);
    if (numbered?.[2]) {
      headings.push({ level: 1, text: numbered[2] });
      continue;
    }
    headings.push({ level: line === line.toUpperCase() ? 1 : 2, text: line.replace(/:$/, "") });
  }

  return headings.slice(0, 30);
}

async function extractFromDocx(buffer: Buffer): Promise<ExtractedHeading[]> {
  const result = await mammoth.convertToHtml({ buffer });
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
  const headings: ExtractedHeading[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(result.value)) !== null) {
    const level = Number(match[1] ?? 1);
    const text = (match[2] ?? "").replace(/<[^>]+>/g, "").trim();
    if (text) headings.push({ level, text });
  }

  if (headings.length > 0) return headings.slice(0, 30);

  const textResult = await mammoth.extractRawText({ buffer });
  return parsePdfText(textResult.value);
}

async function extractFromPdf(buffer: Buffer): Promise<ExtractedHeading[]> {
  const pdfParse = (await import("pdf-parse")).default;
  const parsed = await pdfParse(buffer);
  return parsePdfText(parsed.text);
}

export async function extractTemplateStructure(
  buffer: Buffer,
  mimeType: string,
): Promise<ExtractedHeading[]> {
  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    return extractFromDocx(buffer);
  }

  if (mimeType === "application/pdf") {
    return extractFromPdf(buffer);
  }

  return [];
}

export function headingsToSections(headings: ExtractedHeading[]) {
  return headings.map((h, index) => ({
    title: h.text,
    description: `Content for ${h.text}`,
    aiInstructions: `Extract content relevant to "${h.text}" only if discussed in the transcript. Leave empty if not discussed.`,
    isRequired: h.level <= 2,
    sortOrder: index,
  }));
}
