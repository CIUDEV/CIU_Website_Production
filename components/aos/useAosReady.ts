"use client";

import { useEffect, useState } from "react";

/** Avoid SSR/client mismatch — AOS mutates className after init. */
export function useAosReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return ready;
}
