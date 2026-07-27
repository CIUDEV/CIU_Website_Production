"use client";

import {
  getAosStaggerStep,
  pickScrollAnimation,
  type AosScrollAnimation,
} from "@/components/aos/config";
import { useIsMobile } from "@/components/motion/useSubtleMotion";
import {
  getScrollAnimationVariants,
  getStaggerContainerVariants,
  itemTransition,
  mobileItemTransition,
  mobileScrollViewport,
  scrollViewport,
} from "@/components/motion/variants";
import { motion, useReducedMotion } from "framer-motion";
import { Children, createContext, useContext, type ReactNode } from "react";

const StaggerIndexContext = createContext(0);

export function MotionStagger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const items = Children.toArray(children);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={isMobile ? mobileScrollViewport : scrollViewport}
      variants={getStaggerContainerVariants(isMobile)}
    >
      {items.map((child, index) => (
        <StaggerIndexContext.Provider key={index} value={index}>
          {child}
        </StaggerIndexContext.Provider>
      ))}
    </motion.div>
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
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const staggerIndex = useContext(StaggerIndexContext);
  const resolvedAnimation = animation ?? pickScrollAnimation(staggerIndex, isMobile);
  const resolvedDelay =
    delay ?? staggerIndex * getAosStaggerStep(isMobile);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={getScrollAnimationVariants(resolvedAnimation)}
      transition={{
        ...(isMobile ? mobileItemTransition : itemTransition),
        delay: resolvedDelay / 1000,
      }}
      style={
        resolvedAnimation === "flip-up"
          ? { transformPerspective: 900, transformStyle: "preserve-3d" }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
