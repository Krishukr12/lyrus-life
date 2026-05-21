import { addDays, nextFriday, nextWednesday, parseISO, isValid } from "date-fns";

export function parseActionDeadline(text: string, meetingDate: Date): Date | null {
  if (!text?.trim() || text === "TBD") return null;

  const iso = parseISO(text);
  if (isValid(iso)) return iso;

  const lower = text.toLowerCase();
  const base = new Date(meetingDate);

  if (lower.includes("tomorrow")) return addDays(base, 1);
  if (lower.includes("next friday") || lower.includes("end of week")) return nextFriday(base);
  if (lower.includes("next wednesday")) return nextWednesday(base);
  if (lower.includes("next monday")) return addDays(base, ((8 - base.getDay()) % 7) || 7);
  if (lower.includes("friday")) return nextFriday(base);
  if (lower.includes("wednesday")) return nextWednesday(base);

  return addDays(base, 7);
}
