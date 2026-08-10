/** App scheduling timezone — India Standard Time (no DST). */
export const APP_TIMEZONE = "Asia/Kolkata";
export const APP_TIMEZONE_LABEL = "IST";
export const APP_TIMEZONE_LONG = "India Standard Time (IST)";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function zonedParts(
  input: Date,
  timeZone: string = APP_TIMEZONE,
): { year: string; month: string; day: string; hour: string; minute: string; weekday: string } {
  const dtf = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hourCycle: "h23",
  });
  const map = Object.fromEntries(
    dtf
      .formatToParts(input)
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, p.value]),
  );
  return {
    year: map.year ?? "1970",
    month: map.month ?? "01",
    day: map.day ?? "01",
    hour: map.hour ?? "00",
    minute: map.minute ?? "00",
    weekday: map.weekday ?? "",
  };
}

/** Calendar date YYYY-MM-DD in India time. */
export function toLocalDateKey(input: Date | string): string {
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "";
  const p = zonedParts(d);
  return `${p.year}-${p.month}-${p.day}`;
}

/** Clock time HH:mm in India time. */
export function toLocalTime(input: Date | string): string {
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return "";
  const p = zonedParts(d);
  return `${p.hour}:${p.minute}`;
}

export function todayLocalDateKey(): string {
  return toLocalDateKey(new Date());
}

/** Next 15-minute slot in IST as HH:mm (at least ~5 minutes ahead). */
export function nextQuarterHourIst(): string {
  const now = new Date();
  // Work in IST offset (+05:30 = 330 minutes)
  const istMs = now.getTime() + 330 * 60_000;
  const ist = new Date(istMs);
  let minutes = ist.getUTCMinutes();
  let hours = ist.getUTCHours();
  const rounded = Math.ceil((minutes + 5) / 15) * 15;
  if (rounded >= 60) {
    hours = (hours + 1) % 24;
    minutes = 0;
  } else {
    minutes = rounded;
  }
  return `${pad2(hours)}:${pad2(minutes)}`;
}

/** Prefer absolute scheduledAt so UI matches India time. */
export function meetingDateKey(meeting: { date: string; scheduledAt?: string }): string {
  if (meeting.scheduledAt) return toLocalDateKey(meeting.scheduledAt);
  return meeting.date;
}

export function meetingTimeLabel(meeting: { time: string; scheduledAt?: string }): string {
  if (meeting.scheduledAt) return toLocalTime(meeting.scheduledAt);
  return meeting.time;
}

export function addDaysToDateKey(dateKey: string, days: number): string {
  // Noon IST avoids DST edge cases (IST has none) when shifting calendar days.
  const [y, m, d] = dateKey.split("-").map(Number);
  const utc = Date.UTC(y, m - 1, d, 12 - 5, 0 - 30) + days * 86_400_000;
  return toLocalDateKey(new Date(utc));
}

export function formatFriendlyDate(dateKey: string, todayKey = todayLocalDateKey()): string {
  if (dateKey === todayKey) return "Today";
  if (dateKey === addDaysToDateKey(todayKey, 1)) return "Tomorrow";
  if (dateKey === addDaysToDateKey(todayKey, -1)) return "Yesterday";
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

/** e.g. "Today · Sun, 9 Aug 2026" */
export function formatScheduleDateHeading(dateKey: string, todayKey = todayLocalDateKey()): string {
  const relative = formatFriendlyDate(dateKey, todayKey);
  const absolute = new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (relative === "Today" || relative === "Tomorrow" || relative === "Yesterday") {
    return `${relative} · ${absolute}`;
  }
  return absolute;
}

export function formatTime12h(timeHHmm: string): string {
  const [hRaw, mRaw] = timeHHmm.split(":").map(Number);
  if (Number.isNaN(hRaw) || Number.isNaN(mRaw)) return timeHHmm;
  const period = hRaw >= 12 ? "PM" : "AM";
  const h12 = hRaw % 12 === 0 ? 12 : hRaw % 12;
  return `${h12}:${pad2(mRaw)} ${period}`;
}

/** Full when-preview for schedule form. */
export function formatScheduleWhenPreview(
  dateKey: string,
  timeHHmm: string,
  durationMinutes: number,
  todayKey = todayLocalDateKey(),
): string {
  if (!dateKey || !timeHHmm) return "Pick a date and start time";
  const [hh, mm] = timeHHmm.split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return "Pick a date and start time";

  const startUtc = Date.UTC(
    Number(dateKey.slice(0, 4)),
    Number(dateKey.slice(5, 7)) - 1,
    Number(dateKey.slice(8, 10)),
    hh,
    mm,
  ) - 330 * 60_000;
  const end = new Date(startUtc + durationMinutes * 60_000);
  const endTime = toLocalTime(end);

  return `${formatScheduleDateHeading(dateKey, todayKey)} · ${formatTime12h(timeHHmm)} – ${formatTime12h(endTime)} ${APP_TIMEZONE_LABEL}`;
}

export function formatShortWeekday(dateKey: string): string {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-IN", { weekday: "short" });
}

export function formatDayNumber(dateKey: string): string {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric" });
}

/** Normalize Meet / conference URLs for equality checks after import. */
export function normalizeMeetingUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    u.hash = "";
    u.search = "";
    const path = u.pathname.replace(/\/+$/, "");
    return `${u.protocol}//${u.host.toLowerCase()}${path}`.toLowerCase();
  } catch {
    return url.trim().replace(/\/+$/, "").toLowerCase();
  }
}
