import {
  adminAccountStatusLabel,
  adminRoleLabel,
  type StaffAccessChangeAction,
} from "@shared/admin-roles";
import { renderCiuEmail, siteUrl } from "@email/layout";
import { isValidEmailAddress, sendMail } from "@email/send-mail";
import { listActiveSuperAdmins } from "@backend/sql/sql-store";

const STAFF_ACCESS_TIME_ZONE = "America/Toronto";

export type StaffAccessPerson = {
  email: string;
  displayName: string;
};

export type StaffAccessChangeMail = {
  action: StaffAccessChangeAction;
  actor: StaffAccessPerson;
  target: StaffAccessPerson;
  previousRole?: string;
  nextRole: string;
  previousActive?: boolean;
  nextActive?: boolean;
  occurredAt?: Date | string;
};

export function formatStaffAccessTime(value: Date | string = new Date(), timeZone = STAFF_ACCESS_TIME_ZONE) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    dateStyle: "long",
    timeStyle: "long",
  }).format(date);
}

export function staffAccessRecipientEmails(
  superAdmins: StaffAccessPerson[],
  actor: StaffAccessPerson,
  target: StaffAccessPerson
) {
  const emails = new Set<string>();
  for (const person of [...superAdmins, actor, target]) {
    const email = person.email.trim().toLowerCase();
    if (isValidEmailAddress(email)) emails.add(email);
  }
  return [...emails];
}

function actionCopy(action: StaffAccessChangeAction, nextRoleLabel: string) {
  switch (action) {
    case "added":
      return {
        verb: "added",
        title: `Staff member added as ${nextRoleLabel}`,
        subject: `CIU staff access: added as ${nextRoleLabel}`,
        body: `A new ${nextRoleLabel.toLowerCase()} was added in the CIU staff portal.`,
      };
    case "promoted":
      return {
        verb: "promoted",
        title: `Staff member promoted to ${nextRoleLabel}`,
        subject: `CIU staff access: promoted to ${nextRoleLabel}`,
        body: `A staff member was promoted to ${nextRoleLabel.toLowerCase()} in the CIU staff portal.`,
      };
    case "demoted":
      return {
        verb: "demoted",
        title: `Staff member demoted to ${nextRoleLabel}`,
        subject: `CIU staff access: demoted to ${nextRoleLabel}`,
        body: `A staff member was demoted to ${nextRoleLabel.toLowerCase()} in the CIU staff portal.`,
      };
    case "deactivated":
      return {
        verb: "deactivated",
        title: "Staff member deactivated",
        subject: "CIU staff access: deactivated",
        body: "A staff member's portal access was deactivated.",
      };
    case "restored":
      return {
        verb: "restored",
        title: "Staff member restored",
        subject: "CIU staff access: restored",
        body: "A staff member's portal access was restored.",
      };
  }
}

function changeDetails(input: StaffAccessChangeMail) {
  const nextRoleLabel = adminRoleLabel(input.nextRole);
  const rows: Array<{ label: string; value: string }> = [];
  if (input.action === "promoted" || input.action === "demoted") {
    rows.push({ label: "Previous access", value: adminRoleLabel(input.previousRole ?? "") });
    rows.push({ label: "New access", value: nextRoleLabel });
  } else if (input.action === "deactivated" || input.action === "restored") {
    if (typeof input.previousActive === "boolean") {
      rows.push({ label: "Previous status", value: adminAccountStatusLabel(input.previousActive) });
    }
    if (typeof input.nextActive === "boolean") {
      rows.push({ label: "New status", value: adminAccountStatusLabel(input.nextActive) });
    }
    rows.push({ label: "Access level", value: nextRoleLabel });
  } else {
    rows.push({ label: "New access", value: nextRoleLabel });
  }
  return rows;
}

export function staffAccessChangeText(input: StaffAccessChangeMail & { occurredAt?: Date | string }) {
  const nextRoleLabel = adminRoleLabel(input.nextRole);
  const copy = actionCopy(input.action, nextRoleLabel);
  const time = formatStaffAccessTime(input.occurredAt ?? new Date());
  const actorName = input.actor.displayName.trim() || input.actor.email;
  const targetName = input.target.displayName.trim() || input.target.email;
  const lines = [
    copy.body,
    "",
    `Action: ${copy.verb}`,
    `Staff member: ${targetName}`,
    `Staff email: ${input.target.email.trim().toLowerCase()}`,
    ...changeDetails(input).map((row) => `${row.label}: ${row.value}`),
    `Performed by: ${actorName}`,
    `Performed by email: ${input.actor.email.trim().toLowerCase()}`,
    `Time: ${time}`,
  ];
  return lines.join("\n");
}

export function staffAccessChangeHtml(input: StaffAccessChangeMail & { occurredAt?: Date | string }) {
  const nextRoleLabel = adminRoleLabel(input.nextRole);
  const copy = actionCopy(input.action, nextRoleLabel);
  const time = formatStaffAccessTime(input.occurredAt ?? new Date());
  const actorName = input.actor.displayName.trim() || input.actor.email;
  const targetName = input.target.displayName.trim() || input.target.email;
  const details = [
    { label: "Action", value: copy.verb },
    { label: "Staff member", value: targetName },
    { label: "Staff email", value: input.target.email.trim().toLowerCase() },
    ...changeDetails(input),
    { label: "Performed by", value: actorName },
    { label: "Performed by email", value: input.actor.email.trim().toLowerCase() },
    { label: "Time", value: time },
  ];

  return renderCiuEmail({
    preheader: copy.body,
    eyebrow: "Staff access",
    title: copy.title,
    greeting: "Assalamu Alaikum,",
    paragraphs: [copy.body, "Details of the change are below."],
    details,
    cta: { href: siteUrl("/admin/users"), label: "Open staff users" },
  });
}

async function sendQuietly(input: Parameters<typeof sendMail>[0]) {
  try {
    await sendMail(input);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    console.error("[ciu-email] staff access email failed", { message });
  }
}

export async function sendStaffAccessChangeEmails(input: StaffAccessChangeMail) {
  try {
    const occurredAt = input.occurredAt ?? new Date();
    let superAdmins: StaffAccessPerson[] = [];
    try {
      superAdmins = await listActiveSuperAdmins();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown database error";
      console.error("[ciu-email] could not load super admins for staff access email", { message });
    }

    const to = staffAccessRecipientEmails(superAdmins, input.actor, input.target);
    if (to.length === 0) return;

    const payload = { ...input, occurredAt };
    const nextRoleLabel = adminRoleLabel(input.nextRole);
    const copy = actionCopy(input.action, nextRoleLabel);

    await sendQuietly({
      to,
      subject: `${copy.subject} (${input.target.displayName.trim() || input.target.email})`,
      text: staffAccessChangeText(payload),
      html: staffAccessChangeHtml(payload),
      purpose: "staff-access",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email error";
    console.error("[ciu-email] staff access email failed", { message });
  }
}
