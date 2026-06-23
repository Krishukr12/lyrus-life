export const APP_NAME = import.meta.env.VITE_COMPANY_NAME ?? "Meeting Desk AI";
export const APP_TAGLINE = "Where Meetings Become Decisions.";

/** Optimized icon for UI + favicon (fast load, no flash). */
export const APP_ICON_SRC = "/app-icon.png?v=2";
/** Full-size asset for social previews only. */
export const APP_OG_IMAGE_SRC = "/meeting_desk_ai_logo.png?v=2";

/** @deprecated Use APP_ICON_SRC */
export const APP_LOGO_SRC = APP_ICON_SRC;
