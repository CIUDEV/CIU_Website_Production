"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import { aosDefaults } from "@/components/aos/config";
import { refreshAos, scheduleAosRefreshes } from "@/lib/aosRefresh";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function shouldDisableAos() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getAosOffset() {
  return window.innerWidth < 768 ? 32 : aosDefaults.offset;
}

function initAos() {
  if (shouldDisableAos()) return;

  AOS.init({
    duration: aosDefaults.duration,
    easing: aosDefaults.easing,
    offset: getAosOffset(),
    once: aosDefaults.once,
    disable: false,
    mirror: false,
    disableMutationObserver: false,
  });
  refreshAos();
}

export default function AosInit() {
  const pathname = usePathname();

  useEffect(() => {
    initAos();

    const refreshSoon = window.setTimeout(() => initAos(), 120);
    const refreshLater = window.setTimeout(() => scheduleAosRefreshes(), 450);

    const handleResize = () => initAos();
    const handleOrientation = () => window.setTimeout(() => scheduleAosRefreshes(), 100);

    const onLoad = () => scheduleAosRefreshes();

    window.addEventListener("load", onLoad);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientation);

    return () => {
      window.clearTimeout(refreshSoon);
      window.clearTimeout(refreshLater);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientation);
    };
  }, []);

  useEffect(() => {
    scheduleAosRefreshes();
  }, [pathname]);

  return null;
}
