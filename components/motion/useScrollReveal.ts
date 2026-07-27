"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";

type ScrollRevealOptions = {
  fallbackMs?: number;
  margin?: `${number}px ${number}px ${number}px ${number}px`;
  amount?: number;
};

function isElementInViewport(element: Element) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < viewportHeight * 0.98 && rect.bottom > 0;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
): { ref: RefObject<T | null>; isVisible: boolean } {
  const {
    fallbackMs = 900,
    margin = "0px 0px 80px 0px",
    amount = 0.05,
  } = options;
  const ref = useRef<T>(null);
  const isInView = useInView(ref, { once: true, amount, margin });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (element && isElementInViewport(element)) {
      setRevealed(true);
    }

    const fallback = window.setTimeout(() => setRevealed(true), fallbackMs);
    return () => window.clearTimeout(fallback);
  }, [fallbackMs]);

  return { ref, isVisible: isInView || revealed };
}
