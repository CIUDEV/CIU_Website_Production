"use client";

import { pickScrollAnimation, type AosScrollAnimation } from "@/components/aos/config";
import { useIsMobile } from "@/components/motion/useSubtleMotion";
import { useScrollReveal } from "@/components/motion/useScrollReveal";
import {
  getScrollAnimationVariants,
  mobileSectionTransition,
  sectionTransition,
} from "@/components/motion/variants";
import { motion, useReducedMotion } from "framer-motion";

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
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { ref, isVisible } = useScrollReveal({
    fallbackMs: isMobile ? 700 : 900,
  });

  if (reduceMotion) {
    return className ? <div className={className}>{children}</div> : <>{children}</>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={getScrollAnimationVariants(animation)}
      transition={{
        ...(isMobile ? mobileSectionTransition : sectionTransition),
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  );
}
