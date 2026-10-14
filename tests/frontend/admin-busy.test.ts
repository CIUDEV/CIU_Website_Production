import { describe, expect, it } from "vitest";
import { busyCopyForAdminRequest, isQuietAdminPath } from "@frontend/portal/admin-busy";

describe("admin busy copy", () => {
  it("skips sign-in and session heartbeat calls", () => {
    expect(isQuietAdminPath("/api/me")).toBe(true);
    expect(isQuietAdminPath("/api/admin/session")).toBe(true);
    expect(busyCopyForAdminRequest("/api/me", "GET")).toBeNull();
    expect(busyCopyForAdminRequest("/api/admin/session", "POST")).toBeNull();
    expect(busyCopyForAdminRequest("/api/admin/events", "GET", false)).toBeNull();
  });

  it("labels portal work so the overlay can block the screen", () => {
    expect(busyCopyForAdminRequest("/api/admin/events", "GET")).toMatchObject({ title: "Loading" });
    expect(busyCopyForAdminRequest("/api/admin/events", "POST")).toMatchObject({ title: "Saving" });
    expect(busyCopyForAdminRequest("/api/admin/events/1", "DELETE")).toMatchObject({ title: "Removing" });
    expect(busyCopyForAdminRequest("/api/admin/outreach/campaigns/1/send", "POST")).toMatchObject({
      title: "Sending",
    });
    expect(busyCopyForAdminRequest("/api/admin/outreach/preview", "POST")).toMatchObject({
      title: "Checking recipients",
    });
    expect(busyCopyForAdminRequest("/api/admin/events", "POST", "Uploading poster")).toMatchObject({
      title: "Uploading poster",
    });
  });
});
