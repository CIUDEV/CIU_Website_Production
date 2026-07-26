import AOS from "aos";

function shouldSkipAos() {
  return (
    typeof window === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Re-scan the DOM and trigger in-view AOS animations. */
export function refreshAos() {
  if (shouldSkipAos()) return;

  try {
    AOS.refresh();
  } catch {
    // AOS may not be initialized yet on the first pass.
  }
}

/** Run several refreshes so late-mounted [data-aos] nodes still animate in. */
export function scheduleAosRefreshes() {
  if (shouldSkipAos()) return;

  refreshAos();

  requestAnimationFrame(() => {
    requestAnimationFrame(refreshAos);
  });

  for (const delay of [50, 150, 350, 700, 1200]) {
    window.setTimeout(refreshAos, delay);
  }
}
