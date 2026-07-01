import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Product app URL — set VITE_APP_URL=https://customer.meetingdesk.in in production */
export const APP_URL = (import.meta.env.VITE_APP_URL as string | undefined)?.replace(/\/$/, "") || "https://customer.meetingdesk.in";

export function appLink(path: string) {
  const base = APP_URL;
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

export const SITE_URL = "https://meetingdesk.in";
