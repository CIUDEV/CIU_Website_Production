"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PageLoader } from "@/components/ui/PageLoader";

const MIN_VISIBLE_MS = 350;

function isInternalNavigationLink(anchor: HTMLAnchorElement, pathname: string) {
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return false;
  }

  if (url.origin !== window.location.origin) return false;

  const nextPath = `${url.pathname}${url.search}`;
  const currentPath = `${pathname}${window.location.search}`;
  return nextPath !== currentPath;
}

export function PageLoadingOverlay() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const loadingStartedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!loadingStartedAtRef.current) {
      setIsLoading(false);
      return;
    }

    const elapsed = Date.now() - loadingStartedAtRef.current;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
    const timer = window.setTimeout(() => {
      setIsLoading(false);
      loadingStartedAtRef.current = null;
    }, remaining);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const startLoading = () => {
      loadingStartedAtRef.current = Date.now();
      setIsLoading(true);
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor || !isInternalNavigationLink(anchor, pathname)) return;

      startLoading();
    };

    const onPopState = () => startLoading();

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="page-loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <PageLoader />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
