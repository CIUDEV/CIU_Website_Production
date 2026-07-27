"use client";

import type { AosScrollAnimation } from "@/components/aos/config";
import type { ReactNode } from "react";

export function MotionStagger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function MotionItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  animation?: AosScrollAnimation;
  delay?: number;
}) {
  return <div className={className}>{children}</div>;
}
