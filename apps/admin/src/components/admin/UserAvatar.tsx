import { cn } from "@/lib/utils";

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function gradientFromSeed(seed: string): string {
  const hue = seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return `linear-gradient(135deg, hsl(${hue} 58% 48%) 0%, hsl(${(hue + 36) % 360} 52% 40%) 100%)`;
}

export function UserAvatar({
  name,
  email,
  className,
  size = "md",
}: {
  name?: string | null;
  email?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const label = name?.trim() || email?.trim() || "User";
  const initials = initialsFromName(label) || "U";
  const seed = email || name || "user";

  const sizeClass =
    size === "sm" ? "h-8 w-8 text-[11px] rounded-lg" : size === "lg" ? "h-11 w-11 text-sm rounded-xl" : "h-9 w-9 text-xs rounded-lg";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center font-semibold text-white shadow-sm ring-1 ring-black/5",
        sizeClass,
        className,
      )}
      style={{ background: gradientFromSeed(seed) }}
      aria-hidden
    >
      {initials}
    </div>
  );
}
