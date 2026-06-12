declare module "mammoth" {
  export function convertToHtml(input: { buffer: Buffer }): Promise<{ value: string }>;
  export function extractRawText(input: { buffer: Buffer }): Promise<{ value: string }>;
}

declare module "pdf-parse" {
  export default function pdfParse(buffer: Buffer): Promise<{ text: string }>;
}
