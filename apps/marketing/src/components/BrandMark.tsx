import { cn } from "@/lib/utils";

/** Same asset as apps/web — optimized icon for UI + favicon. */
export const APP_ICON_SRC = "/app-icon.png?v=2";

/** Tight square crop — the PNG has large transparent margins around the mascot. */
export function LogoIcon({
  className,
  size = 36,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={cn("relative inline-flex shrink-0 overflow-hidden rounded-xl", className)}
      style={{ width: size, height: size }}
    >
      <img
        src={APP_ICON_SRC}
        alt=""
        aria-hidden
        decoding="sync"
        fetchPriority="high"
        className="absolute left-1/2 top-1/2 h-full w-full max-w-none -translate-x-1/2 -translate-y-1/2 scale-[2.35] object-contain"
      />
    </span>
  );
}
