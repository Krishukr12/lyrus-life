import { cn } from "@/lib/utils";
import { APP_ICON_SRC, APP_NAME, APP_TAGLINE } from "@/lib/brand";

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

type BrandMarkProps = {
  variant?: "light" | "dark";
  showTagline?: boolean;
  iconOnly?: boolean;
  iconSize?: number;
  className?: string;
  title?: string;
  subtitle?: string;
};

export function BrandMark({
  variant = "light",
  showTagline = true,
  iconOnly = false,
  iconSize = 36,
  className,
  title = APP_NAME,
  subtitle = APP_TAGLINE,
}: BrandMarkProps) {
  const isDark = variant === "dark";

  if (iconOnly) {
    return <LogoIcon size={iconSize} className={className} />;
  }

  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <LogoIcon
        size={iconSize}
        className={cn(
          isDark
            ? "ring-1 ring-white/15 shadow-sm shadow-black/20"
            : "ring-1 ring-slate-200/80 shadow-sm",
        )}
      />
      <div className="min-w-0">
        <p
          className={cn(
            "truncate text-sm font-bold leading-tight tracking-tight",
            isDark ? "text-white" : "text-slate-900",
          )}
        >
          {title}
        </p>
        {showTagline && subtitle ? (
          <p
            className={cn(
              "mt-0.5 truncate text-[10px] leading-tight",
              isDark ? "text-slate-400" : "text-slate-500",
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** @deprecated Use BrandMark or LogoIcon */
export function AppLogo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const sizes = { xs: 28, sm: 32, md: 40, lg: 48, xl: 56 };
  return <LogoIcon size={sizes[size]} className={className} />;
}
