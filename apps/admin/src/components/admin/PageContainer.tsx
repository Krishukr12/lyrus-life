import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
  narrow,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div className={cn("w-full mx-auto", narrow ? "max-w-4xl" : "max-w-7xl", className)}>
      {children}
    </div>
  );
}
