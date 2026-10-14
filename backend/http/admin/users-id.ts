import { requireAdminActor } from "@backend/auth/admin-auth";
import { denyUpdateAdmin } from "@backend/auth/admin-policy";
import {
  adminActiveChangeAction,
  adminRoleChangeAction,
  isCreatableAdminRole,
  requestedCreateRole,
  resolveAdminRole,
} from "@shared/admin-roles";
import { sendStaffAccessChangeEmails } from "@email/staff-access-mail";
import { jsonError, jsonOk, recordHistory, requireAdmin } from "@backend/http/respond";
import { getStaffUserById, updateStaffUserAccess } from "@backend/sql/sql-store";


type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const auth = await requireAdminActor(request);
  if (auth.error) return auth.error;

  const { id } = await params;
  const target = await getStaffUserById(id);
  if (!target) return jsonError("User not found.", 404);

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const denied = denyUpdateAdmin(auth.actor, target, body);
  if (denied) {
    const status = denied === "No admin changes were requested." || denied === "isActive must be true or false." ? 400 : 403;
    return jsonError(denied, status);
  }

  const targetRole = resolveAdminRole(target)!;
  const nextRole = Object.prototype.hasOwnProperty.call(body, "role")
    ? requestedCreateRole(body.role)
    : targetRole;
  if (!isCreatableAdminRole(nextRole)) {
    return jsonError("The application cannot assign the super admin role.", 403);
  }

  const nextActive = Object.prototype.hasOwnProperty.call(body, "isActive")
    ? Boolean(body.isActive)
    : target.isActive;

  try {
    const updated = await updateStaffUserAccess(id, {
      role: nextRole,
      isActive: nextActive,
    });
    if (!updated) return jsonError("User not found.", 404);

    await recordHistory(request, {
      action: "updated",
      area: "users",
      summary:
        nextActive === target.isActive
          ? `Changed ${updated.displayName} to ${updated.role}`
          : `${updated.isActive ? "Restored" : "Deactivated"} admin: ${updated.displayName} (${updated.email})`,
      entityId: updated.id,
    });

    const actor = { email: auth.actor.email, displayName: auth.actor.displayName };
    const person = { email: updated.email, displayName: updated.displayName };
    const accessChange = adminRoleChangeAction(targetRole, updated.role);
    if (accessChange) {
      await sendStaffAccessChangeEmails({
        action: accessChange,
        actor,
        target: person,
        previousRole: targetRole,
        nextRole: updated.role,
        occurredAt: updated.updatedAt,
      });
    }

    const activeChange = adminActiveChangeAction(target.isActive, updated.isActive);
    if (activeChange) {
      await sendStaffAccessChangeEmails({
        action: activeChange,
        actor,
        target: person,
        nextRole: updated.role,
        previousActive: target.isActive,
        nextActive: updated.isActive,
        occurredAt: updated.updatedAt,
      });
    }

    return jsonOk(updated);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Could not update user.", 500);
  }
}
