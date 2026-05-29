import type { ZodError } from "zod";

export function zodErrorMessage(error: ZodError): string {
  const flat = error.flatten();
  for (const messages of Object.values(flat.fieldErrors)) {
    if (messages?.[0]) return messages[0];
  }
  if (flat.formErrors[0]) return flat.formErrors[0];
  return "Please check your input and try again.";
}
