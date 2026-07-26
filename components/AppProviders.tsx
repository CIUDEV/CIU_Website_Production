import { LightboxProvider } from "@/components/lightbox/LightboxProvider";
import { PageLoadingOverlay } from "@/components/ui/PageLoadingOverlay";
import { ToastProvider } from "@/components/ui/ToastProvider";
import type { ReactNode } from "react";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <PageLoadingOverlay />
      <LightboxProvider>{children}</LightboxProvider>
    </ToastProvider>
  );
}
