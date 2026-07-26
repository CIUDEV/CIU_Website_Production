"use client";

import {
  aosDefaults,
  getAosDuration,
  type AosScrollAnimation,
} from "@/components/aos/config";
import { useAosReady } from "@/components/aos/useAosReady";
import { useIsMobile } from "@/components/motion/useSubtleMotion";
import { useReducedScrollMotion } from "@/components/motion/useReducedScrollMotion";
import { useAosRefresh } from "@/components/aos/useAosRefresh";

export default function MotionSection({
  children,
  className = "",
  delay = 0,
  animation = "fade-up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: AosScrollAnimation;
}) {
  const reduceMotion = useReducedScrollMotion();
  const isMobile = useIsMobile();
  const aosReady = useAosReady();
  const animate = aosReady && !reduceMotion;
  useAosRefresh(animate);

  if (!animate) {
    return className ? <div className={className}>{children}</div> : <>{children}</>;
  }

  return (
    <div
      className={className}
      data-aos={animation}
      data-aos-duration={getAosDuration(isMobile)}
      data-aos-delay={delay}
      data-aos-easing={aosDefaults.easing}
      data-aos-once="true"
    >
      {children}
    </div>
  );
}
