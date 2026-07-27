"use client";

import type { AosScrollAnimation } from "@/components/aos/config";

export default function MotionSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: AosScrollAnimation;
}) {
  if (className) {
    return <div className={className}>{children}</div>;
  }

  return <>{children}</>;
}
