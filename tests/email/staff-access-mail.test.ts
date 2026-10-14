import { afterEach, describe, expect, it, vi } from "vitest";
import { setEmailTransportForTests } from "@email/send-mail";

const listActiveSuperAdmins = vi.fn();

vi.mock("@backend/sql/sql-store", () => ({
  listActiveSuperAdmins,
}));

const envKeys = ["AZURE_COMMUNICATION_SERVICES_ENDPOINT", "AZURE_EMAIL_SENDER"] as const;
const previous = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));

afterEach(() => {
  setEmailTransportForTests(undefined);
  vi.restoreAllMocks();
  listActiveSuperAdmins.mockReset();
  for (const key of envKeys) {
    if (previous[key] === undefined) delete process.env[key];
    else process.env[key] = previous[key];
  }
});

describe("staff access emails", () => {
  it("emails every super admin, the actor, and the new admin once", async () => {
    process.env.AZURE_COMMUNICATION_SERVICES_ENDPOINT = "https://ciu-acs-dev.canada.communication.azure.com";
    process.env.AZURE_EMAIL_SENDER = "donotreply@ciucanada.ca";
    listActiveSuperAdmins.mockResolvedValueOnce([
      { email: "shorif.jaber@ciucanada.ca", displayName: "Shorif Jaber" },
      { email: "fuwad.oladega@ciucanada.ca", displayName: "Fuwad Oladega" },
    ]);

    const sent: Array<{ to: string[]; purpose?: string; subject: string; html?: string; text?: string }> = [];
    setEmailTransportForTests({
      async send(message) {
        sent.push({
          to: message.to,
          purpose: message.purpose,
          subject: message.subject,
          html: message.html,
          text: message.text,
        });
        return { messageId: "ok", status: "Succeeded" };
      },
    });

    const { sendStaffAccessChangeEmails, formatStaffAccessTime } = await import("@email/staff-access-mail");
    const occurredAt = "2026-10-15T10:31:00.000Z";

    await sendStaffAccessChangeEmails({
      action: "added",
      actor: { email: "fuwad.oladega@ciucanada.ca", displayName: "Fuwad Oladega" },
      target: { email: "amina@ciucanada.ca", displayName: "Amina <script>" },
      nextRole: "regularadmin",
      occurredAt,
    });

    expect(sent).toHaveLength(1);
    expect(sent[0]?.purpose).toBe("staff-access");
    expect(sent[0]?.to).toEqual([
      "shorif.jaber@ciucanada.ca",
      "fuwad.oladega@ciucanada.ca",
      "amina@ciucanada.ca",
    ]);
    expect(sent[0]?.subject).toContain("added as Regular admin");
    expect(sent[0]?.html).toContain("cid:ciu-logo");
    expect(sent[0]?.html).toContain("Amina &lt;script&gt;");
    expect(sent[0]?.html).not.toContain("<script>");
    expect(sent[0]?.html).toContain("added");
    expect(sent[0]?.text).toContain("Performed by: Fuwad Oladega");
    expect(sent[0]?.text).toContain(`Time: ${formatStaffAccessTime(occurredAt)}`);
    expect(sent[0]?.html).not.toContain("Previous access");
  });

  it("includes previous access on promote and demote", async () => {
    process.env.AZURE_COMMUNICATION_SERVICES_ENDPOINT = "https://ciu-acs-dev.canada.communication.azure.com";
    process.env.AZURE_EMAIL_SENDER = "donotreply@ciucanada.ca";
    listActiveSuperAdmins.mockResolvedValue([{ email: "imam.ashraf@ciucanada.ca", displayName: "Imam Ashraf" }]);

    const sent: Array<{ subject: string; html?: string }> = [];
    setEmailTransportForTests({
      async send(message) {
        sent.push({ subject: message.subject, html: message.html });
        return { messageId: "ok", status: "Succeeded" };
      },
    });

    const { sendStaffAccessChangeEmails } = await import("@email/staff-access-mail");

    await sendStaffAccessChangeEmails({
      action: "promoted",
      actor: { email: "fuwad.oladega@ciucanada.ca", displayName: "Fuwad" },
      target: { email: "staff@ciucanada.ca", displayName: "Staff" },
      previousRole: "regularadmin",
      nextRole: "intermediateadmin",
      occurredAt: "2026-10-15T10:31:00.000Z",
    });
    await sendStaffAccessChangeEmails({
      action: "demoted",
      actor: { email: "fuwad.oladega@ciucanada.ca", displayName: "Fuwad" },
      target: { email: "staff@ciucanada.ca", displayName: "Staff" },
      previousRole: "intermediateadmin",
      nextRole: "regularadmin",
      occurredAt: "2026-10-15T10:31:00.000Z",
    });

    expect(sent[0]?.subject).toContain("promoted to Intermediate admin");
    expect(sent[0]?.html).toContain("Previous access");
    expect(sent[0]?.html).toContain("Regular admin");
    expect(sent[0]?.html).toContain("Intermediate admin");
    expect(sent[1]?.subject).toContain("demoted to Regular admin");
    expect(sent[1]?.html).toContain("Intermediate admin");
  });

  it("includes account status on deactivate and restore", async () => {
    process.env.AZURE_COMMUNICATION_SERVICES_ENDPOINT = "https://ciu-acs-dev.canada.communication.azure.com";
    process.env.AZURE_EMAIL_SENDER = "donotreply@ciucanada.ca";
    listActiveSuperAdmins.mockResolvedValue([{ email: "imam.ashraf@ciucanada.ca", displayName: "Imam Ashraf" }]);

    const sent: Array<{ subject: string; html?: string; text?: string }> = [];
    setEmailTransportForTests({
      async send(message) {
        sent.push({ subject: message.subject, html: message.html, text: message.text });
        return { messageId: "ok", status: "Succeeded" };
      },
    });

    const { sendStaffAccessChangeEmails } = await import("@email/staff-access-mail");

    await sendStaffAccessChangeEmails({
      action: "deactivated",
      actor: { email: "fuwad.oladega@ciucanada.ca", displayName: "Fuwad" },
      target: { email: "staff@ciucanada.ca", displayName: "Staff" },
      nextRole: "regularadmin",
      previousActive: true,
      nextActive: false,
      occurredAt: "2026-10-15T10:31:00.000Z",
    });
    await sendStaffAccessChangeEmails({
      action: "restored",
      actor: { email: "fuwad.oladega@ciucanada.ca", displayName: "Fuwad" },
      target: { email: "staff@ciucanada.ca", displayName: "Staff" },
      nextRole: "regularadmin",
      previousActive: false,
      nextActive: true,
      occurredAt: "2026-10-15T10:31:00.000Z",
    });

    expect(sent[0]?.subject).toContain("deactivated");
    expect(sent[0]?.html).toContain("Previous status");
    expect(sent[0]?.html).toContain("Deactivated");
    expect(sent[0]?.html).toContain("Regular admin");
    expect(sent[0]?.html).not.toContain("Previous access");
    expect(sent[1]?.subject).toContain("restored");
    expect(sent[1]?.text).toContain("New status: Active");
  });

  it("still completes the access change if ACS is down", async () => {
    process.env.AZURE_COMMUNICATION_SERVICES_ENDPOINT = "https://ciu-acs-dev.canada.communication.azure.com";
    process.env.AZURE_EMAIL_SENDER = "donotreply@ciucanada.ca";
    listActiveSuperAdmins.mockResolvedValueOnce([]);
    const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);

    setEmailTransportForTests({
      async send() {
        throw new Error("ACS down");
      },
    });

    const { sendStaffAccessChangeEmails } = await import("@email/staff-access-mail");
    await expect(
      sendStaffAccessChangeEmails({
        action: "added",
        actor: { email: "fuwad.oladega@ciucanada.ca", displayName: "Fuwad" },
        target: { email: "staff@ciucanada.ca", displayName: "Staff" },
        nextRole: "regularadmin",
      })
    ).resolves.toBeUndefined();
    expect(logged).toHaveBeenCalled();
  });
});
