"use client";

import { useLightbox } from "@/components/lightbox/LightboxProvider";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";

type LightboxTriggerProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  children: ReactNode;
};

export default function LightboxTrigger({
  src,
  alt,
  caption,
  className = "",
  children,
}: LightboxTriggerProps) {
  const { openLightbox } = useLightbox();

  const open = () => {
    openLightbox({ src, alt, caption });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  };

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    open();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View larger image: ${alt}`}
      className={`cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${className}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
}
