"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { X } from "lucide-react";

export type LightboxItem = {
  src: string;
  alt: string;
  caption?: string;
};

type LightboxContextValue = {
  openLightbox: (item: LightboxItem) => void;
  closeLightbox: () => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox() {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error("useLightbox must be used within LightboxProvider");
  }
  return context;
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<LightboxItem | null>(null);

  const openLightbox = useCallback((next: LightboxItem) => {
    setItem(next);
  }, []);

  const closeLightbox = useCallback(() => {
    setItem(null);
  }, []);

  useEffect(() => {
    if (!item) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [item, closeLightbox]);

  return (
    <LightboxContext.Provider value={{ openLightbox, closeLightbox }}>
      {children}
      {item ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={item.alt || "Expanded image preview"}
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-[101] rounded-full border border-white/20 bg-white/10 p-2.5 text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:top-6"
            aria-label="Close image preview"
          >
            <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </button>

          <figure
            className="relative max-h-[90vh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Native img for full-resolution preview without Next.js size constraints */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              className="mx-auto max-h-[85vh] w-auto max-w-full rounded-2xl object-contain shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            />
            {item.caption || item.alt ? (
              <figcaption className="mt-4 text-center text-sm leading-relaxed text-white/88 sm:text-base">
                {item.caption || item.alt}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}
    </LightboxContext.Provider>
  );
}
