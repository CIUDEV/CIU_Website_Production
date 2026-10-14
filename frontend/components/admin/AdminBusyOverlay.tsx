"use client";

import { useEffect, useId, useLayoutEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { setAdminBusyListener, type AdminBusyCopy } from "@frontend/portal/admin-busy";

export function AdminBusyProvider({ children }: { children: ReactNode }) {
  const [busy, setBusy] = useState<AdminBusyCopy | null>(null);

  useLayoutEffect(() => {
    let count = 0;
    setAdminBusyListener({
      begin(copy) {
        count += 1;
        if (count === 1) setBusy(copy);
      },
      end() {
        count = Math.max(0, count - 1);
        if (count === 0) setBusy(null);
      },
    });
    return () => {
      setAdminBusyListener(null);
    };
  }, []);

  return (
    <>
      {children}
      <AdminBusyOverlay busy={busy} />
    </>
  );
}

function AdminBusyOverlay({ busy }: { busy: AdminBusyCopy | null }) {
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    if (!busy) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [busy]);

  if (typeof document === "undefined" || !busy) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      aria-busy="true"
      className="fixed inset-0 z-[400] flex items-center justify-center px-4 py-8"
    >
      <div className="absolute inset-0 bg-brand-dark/50 backdrop-blur-md" />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface shadow-xl">
        <div className="h-1 bg-brand" aria-hidden="true" />
        <div className="px-6 py-8 text-center sm:px-8">
          <span className="mx-auto inline-flex rounded-2xl bg-brand/10 p-3 text-brand">
            <span
              aria-hidden="true"
              className="h-7 w-7 animate-spin rounded-full border-2 border-brand/20 border-t-brand"
            />
          </span>
          <h2 id={titleId} className="mt-5 text-xl font-semibold text-foreground sm:text-2xl">
            {busy.title}
          </h2>
          <p id={messageId} className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            {busy.message}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
