import { z } from "zod";

/** Indian mobile: optional +91, then 10 digits starting 6–9. */
export const indianPhoneSchema = z
  .string()
  .trim()
  .min(10, "Enter a valid phone number")
  .max(20, "Phone number is too long")
  .refine(
    (value) => {
      const digits = value.replace(/\D/g, "");
      if (digits.length === 10) return /^[6-9]/.test(digits);
      if (digits.length === 12 && digits.startsWith("91")) return /^91[6-9]/.test(digits);
      return false;
    },
    { message: "Enter a valid Indian mobile number (e.g. +91 98765 43210)" },
  );

export const optionalIndianPhoneSchema = z
  .union([z.literal(""), indianPhoneSchema])
  .optional();
