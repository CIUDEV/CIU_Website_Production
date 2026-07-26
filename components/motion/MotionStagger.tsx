"use client";

import { Children, createContext, useContext, type ReactNode } from "react";
import {
  aosDefaults,
  getAosDuration,
  getAosStaggerStep,
  pickScrollAnimation,
  type AosScrollAnimation,
} from "@/components/aos/config";
import { useAosReady } from "@/components/aos/useAosReady";
import { useIsMobile } from "@/components/motion/useSubtleMotion";
import { useReducedScrollMotion } from "@/components/motion/useReducedScrollMotion";
import { useAosRefresh } from "@/components/aos/useAosRefresh";

const StaggerIndexContext = createContext(0);

export function MotionStagger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedScrollMotion();
  const aosReady = useAosReady();
  const animate = aosReady && !reduceMotion;
  useAosRefresh(animate);
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {animate
        ? items.map((child, index) => (
            <StaggerIndexContext.Provider key={index} value={index}>
              {child}
            </StaggerIndexContext.Provider>
          ))
        : children}
    </div>
  );
}

export function MotionItem({
  children,
  className = "",
  animation,
  delay,
}: {
  children: ReactNode;
  className?: string;
  animation?: AosScrollAnimation;
  delay?: number;
}) {
  const reduceMotion = useReducedScrollMotion();
  const isMobile = useIsMobile();
  const aosReady = useAosReady();
  const staggerIndex = useContext(StaggerIndexContext);
  const resolvedAnimation = animation ?? pickScrollAnimation(staggerIndex, isMobile);
  const resolvedDelay = delay ?? staggerIndex * getAosStaggerStep(isMobile);
  const animate = aosReady && !reduceMotion;

  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={className}
      data-aos={resolvedAnimation}
      data-aos-duration={getAosDuration(isMobile)}
      data-aos-delay={resolvedDelay}
      data-aos-easing={aosDefaults.easing}
      data-aos-once="true"
    >
      {children}
    </div>
  );
}
