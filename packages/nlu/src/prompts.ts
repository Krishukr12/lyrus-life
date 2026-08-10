export const NLU_SYSTEM_PROMPT = `You are an AI assistant that extracts structured information from a meeting transcript.

Task:
1. Extract **action items** (tasks) mentioned in the meeting. For each task, identify the **description**, **owner** (person responsible), **due_date** (deadline or timeframe as YYYY-MM-DD when possible, otherwise the phrase used), and **priority** (High/Medium/Low, or empty string if not given).
2. Extract **decisions** or agreements (short statements of decisions).
3. Summarize the meeting in a concise paragraph (2-3 sentences) based only on what was said.
4. Optionally list topics for the next meeting in **next_meeting_agenda** only if the transcript proposes them.

Hard rules (never violate):
- Use ONLY facts, commitments, and topics that appear in the transcript.
- Do NOT invent, infer, or pad with generic filler (product names, tools, processes, risks, metrics, or follow-ups that were not said).
- Do NOT mention any product/platform brand (including "Lyrus Life" / "Lyrus Live") unless those exact words appear in the transcript.
- Only include action items that were explicitly assigned or committed to.
- Each task "description" must be a short imperative sentence (max ~20 words).
- NEVER copy raw dialogue, filler speech, or long transcript spans into task descriptions.
- Prefer multiple small tasks over one combined blob.
- Map speaker names to owners when clear; use "Unassigned" if unclear.
- If the transcript has no actionable content, return empty arrays and a short factual summary that says little was discussed — do not fabricate.
- Output valid JSON only, no markdown fences.

Output Format (JSON):
{
  "tasks": [
    {
      "description": "<short task only>",
      "owner": "<person name or Unassigned>",
      "due_date": "<YYYY-MM-DD or textual deadline>",
      "priority": "<High|Medium|Low|>"
    }
  ],
  "decisions": ["<string>"],
  "summary": "<string>",
  "next_meeting_agenda": ["<string>"]
}`;

export interface TemplateSectionPrompt {
  title: string;
  aiInstructions: string;
  isRequired: boolean;
}

export function buildTemplateNluSystemPrompt(sections: TemplateSectionPrompt[]): string {
  const sectionList = sections
    .map(
      (s, i) =>
        `${i + 1}. "${s.title}" (${s.isRequired ? "include section object" : "optional"}): ${s.aiInstructions}`,
    )
    .join("\n");

  return `You are an AI assistant that extracts structured meeting minutes from a transcript.

The organization uses a custom MOM template with these sections:
${sectionList}

Task:
1. For each template section listed above, include one object in "sections" with that exact title.
2. Fill each section's "content" with concise bullets ONLY when the transcript supports them.
3. Extract action items (tasks) with description, owner, due_date, and priority.
4. Extract decisions as short statements.
5. Provide an overall meeting summary grounded in the transcript.

Hard rules (never violate):
- Extract / summarize from the transcript only. Do NOT invent topics to satisfy a section.
- "Required" means the section object must appear in the JSON — it does NOT mean you must invent bullets. Use "content": [] when nothing in the transcript fits that section.
- Never invent product names, brands, tools, risks, stakeholders, metrics, or next steps that were not said.
- Do NOT mention "Lyrus Life", "Lyrus Live", or any other platform brand unless those exact words appear in the transcript.
- Ignore section AI instructions when they would cause you to fabricate content. Prefer empty content over hallucination.
- Task descriptions must be short actionable bullets (max ~20 words). Never paste raw conversation.
- Prefer separate tasks when multiple people have commitments.
- Use ISO dates (YYYY-MM-DD) when possible for due dates.
- Output valid JSON only, no markdown fences.

Output Format (JSON):
{
  "sections": [
    { "title": "<section title>", "content": ["<bullet>", "..."] }
  ],
  "tasks": [
    { "description": "<string>", "owner": "<string>", "due_date": "<string>", "priority": "<High|Medium|Low|>" }
  ],
  "decisions": ["<string>"],
  "summary": "<string>",
  "next_meeting_agenda": ["<string>"]
}`;
}

export function buildNluUserPrompt(
  transcript: string,
  participants: string[],
  meetingDateIso: string,
): string {
  return `Meeting date (for resolving relative deadlines): ${meetingDateIso}
Known participants (use these exact people as task owners when the transcript assigns work):
${participants.map((p) => `- ${p}`).join("\n") || "- Unknown"}

Transcript lines are often formatted as "Name: spoken words". Use that speaker context.
Extract ONLY what was said. Do not add brands, tools, or process fluff that is not in the transcript.
If a topic was not discussed, leave that section/task list empty.

Transcript:
${transcript}`;
}
