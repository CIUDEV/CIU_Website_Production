export type AdminBusyCopy = {
  title: string;
  message: string;
};

export type AdminBusyOption = boolean | string | AdminBusyCopy;

type AdminBusyListener = {
  begin: (copy: AdminBusyCopy) => void;
  end: () => void;
};

let listener: AdminBusyListener | null = null;

const WAIT_MESSAGE = "Please wait. Do not click again or leave this page.";

const QUIET_PATHS = ["/api/me", "/api/admin/session", "/api/admin/identity", "/api/admin/entra-public"];

export function setAdminBusyListener(next: AdminBusyListener | null) {
  listener = next;
}

export function beginAdminBusy(copy: AdminBusyCopy) {
  listener?.begin(copy);
}

export function endAdminBusy() {
  listener?.end();
}

export function isQuietAdminPath(path: string) {
  return QUIET_PATHS.some((prefix) => path === prefix || path.startsWith(`${prefix}?`));
}

export function busyCopyForAdminRequest(
  path: string,
  method: string,
  busy?: AdminBusyOption
): AdminBusyCopy | null {
  if (busy === false) return null;
  if (typeof busy === "string" && busy.trim()) {
    return { title: busy.trim(), message: WAIT_MESSAGE };
  }
  if (busy && typeof busy === "object") {
    return {
      title: busy.title.trim() || "Please wait",
      message: busy.message.trim() || WAIT_MESSAGE,
    };
  }
  if (isQuietAdminPath(path)) return null;

  const verb = method.toUpperCase();
  if (path.includes("/send")) {
    return { title: "Sending", message: "Please wait. Do not close this page or click again." };
  }
  if (path.includes("/preview")) {
    return { title: "Checking recipients", message: "Please wait while we count unique people." };
  }
  if (verb === "DELETE") {
    return { title: "Removing", message: WAIT_MESSAGE };
  }
  if (verb === "POST" || verb === "PATCH" || verb === "PUT") {
    return { title: "Saving", message: WAIT_MESSAGE };
  }
  return { title: "Loading", message: "Please wait a moment." };
}
