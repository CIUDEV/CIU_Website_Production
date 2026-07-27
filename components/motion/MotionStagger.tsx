"use client";

import {
  getAosStaggerStep,
  pickScrollAnimation,
  type AosScrollAnimation,
} from "@/components/aos/config";
import { useIsMobile } from "@/components/motion/useSubtleMotion";
import { useScrollReveal } from "@/components/motion/useScrollReveal";
import {
  getScrollAnimationVariants,
  getStaggerContainerVariants,
  itemTransition,
  mobileItemTransition,
} from "@/components/motion/variants";
import { motion, useReducedMotion } from "framer-motion";
import { Children, createContext, useContext, type ReactNode } from "react";

const StaggerIndexContext = createContext(0);
const InsideStaggerContext = createContext(false);

export function MotionStagger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { ref, isVisible } = useScrollReveal({
    fallbackMs: isMobile ? 700 : 900,
  });
  const items = Children.toArray(children);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={getStaggerContainerVariants(isMobile)}
    >
      {items.map((child, index) => (
        <InsideStaggerContext.Provider key={index} value={true}>
          <StaggerIndexContext.Provider value={index}>{child}</StaggerIndexContext.Provider>
        </InsideStaggerContext.Provider>
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
  const insideStagger = useContext(InsideStaggerContext);
  const staggerIndex = useContext(StaggerIndexContext);
  const resolvedAnimation = animation ?? pickScrollAnimation(staggerIndex, isMobile);
  const resolvedDelay =
    delay ?? staggerIndex * getAosStaggerStep(isMobile);
  const { ref, isVisible } = useScrollReveal({
    fallbackMs: isMobile ? 600 : 800,
    amount: 0.01,
  });

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={insideStagger ? undefined : ref}
      className={className}
      initial="hidden"
      animate={insideStagger ? undefined : isVisible ? "visible" : "hidden"}
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
