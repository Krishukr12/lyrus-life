import { cn } from "@/lib/utils";

export function OrganizationAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const hue = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <div
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-xs font-semibold text-white shadow-sm",
        className,
      )}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 65% 45%) 0%, hsl(${(hue + 40) % 360} 60% 38%) 100%)`,
      }}
      aria-hidden
    >
      {initials || "?"}
    </div>
  );
}
