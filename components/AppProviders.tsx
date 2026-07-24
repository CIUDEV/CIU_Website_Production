"use client";

import { LightboxProvider } from "@/components/lightbox/LightboxProvider";
import type { ReactNode } from "react";

export default function AppProviders({ children }: { children: ReactNode }) {
  return <LightboxProvider>{children}</LightboxProvider>;
}
