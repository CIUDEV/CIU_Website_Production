"use client";

import { pickScrollAnimation, type AosScrollAnimation } from "@/components/aos/config";
import { useIsMobile } from "@/components/motion/useSubtleMotion";
import {
  getScrollAnimationVariants,
  mobileScrollViewport,
  mobileSectionTransition,
  scrollViewport,
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

  if (reduceMotion) {
    return className ? <div className={className}>{children}</div> : <>{children}</>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={isMobile ? mobileScrollViewport : scrollViewport}
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
