import { AosReadyProvider } from "@/components/aos/AosReadyProvider";
import { LightboxProvider } from "@/components/lightbox/LightboxProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import type { ReactNode } from "react";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AosReadyProvider>
        <LightboxProvider>{children}</LightboxProvider>
      </AosReadyProvider>
    </ToastProvider>
  );
}
