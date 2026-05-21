import OpenAI from "openai";
import { nluExtractionSchema, type NluExtraction } from "@lyrus/shared";
import { buildNluUserPrompt, NLU_SYSTEM_PROMPT } from "./prompts.js";

export interface ExtractMeetingInsightsInput {
  transcript: string;
  participants: string[];
  meetingDateIso: string;
}

function heuristicExtraction(
  transcript: string,
  participants: string[],
): NluExtraction {
  const lines = transcript.split("\n").filter(Boolean);
  const tasks: NluExtraction["tasks"] = [];
  const decisions: string[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes("decided") || lower.includes("agreed") || lower.includes("decision:")) {
      decisions.push(line.replace(/^[^:]+:\s*/, "").trim());
    }
    if (
      lower.includes("will ") ||
      lower.includes("by friday") ||
      lower.includes("by next") ||
      lower.includes("should ")
    ) {
      const speaker = line.match(/^([^:]+):/)?.[1]?.trim() ?? participants[0] ?? "Unassigned";
      const description = line.replace(/^[^:]+:\s*/, "").trim();
      tasks.push({
        description,
        owner: speaker,
        due_date: "",
        priority: "",
      });
    }
  }

  return {
    tasks: tasks.slice(0, 8),
    decisions: decisions.slice(0, 5),
    summary:
      lines.length > 0
        ? `Meeting covered ${lines.length} discussion points with ${tasks.length} action items identified.`
        : "No substantive transcript content was available for summarization.",
    next_meeting_agenda: [],
  };
}

export async function extractMeetingInsights(
  input: ExtractMeetingInsightsInput,
): Promise<NluExtraction> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return heuristicExtraction(input.transcript, input.participants);
  }

  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_NLU_MODEL ?? "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: NLU_SYSTEM_PROMPT },
      {
        role: "user",
        content: buildNluUserPrompt(
          input.transcript,
          input.participants,
          input.meetingDateIso,
        ),
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    return heuristicExtraction(input.transcript, input.participants);
  }

  try {
    const parsed = JSON.parse(content) as unknown;
    return nluExtractionSchema.parse(parsed);
  } catch {
    return heuristicExtraction(input.transcript, input.participants);
  }
}
