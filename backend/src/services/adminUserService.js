import {
  assignPermissionToRole,
  countActiveAdmins,
  findAdminUserById,
  listAdminUsers,
  listPermissions,
  listRolesWithPermissions,
  removePermissionFromRole,
  setUserRole,
  setUserStatus,
  softDeleteUser,
} from "../repositories/adminUserRepository.js";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
  recordAuditLogSafe,
} from "./auditLogService.js";
import { AppError } from "../utils/AppError.js";

export async function getAdminUsers(query = {}) {
  const page = Math.max(Number(query.page ?? 1), 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize ?? 10), 1), 100);
  const result = await listAdminUsers({
    search: String(query.search ?? "").trim(),
    role: String(query.role ?? "").trim(),
    status: String(query.status ?? "").trim(),
    page,
    pageSize,
  });
  return { ...result, items: result.items.map(serializeUser) };
}

export async function getAdminUser(id) {
  const user = await findAdminUserById(id);
  if (!user) throw new AppError("User not found.", 404);
  return serializeUser(user);
}

export async function changeUserRole({ actorId, userId, role, auditContext = {} }) {
  const previous = await findAdminUserById(userId);
  if (!previous) throw new AppError("User not found.", 404);
  if (actorId === userId && previous.role === "Admin" && role !== "Admin") {
    throw new AppError("You cannot remove your own Admin role.", 400);
  }
  if (previous.role === "Admin" && role !== "Admin" && (await countActiveAdmins()) <= 1) {
    throw new AppError("Cannot remove the last active Admin.", 400);
  }

  const updated = await setUserRole({ userId, roleName: role, actorId });
  if (!updated) throw new AppError("Role not found.", 404);

  await recordAuditLogSafe({
    userId: actorId,
    action: AUDIT_ACTIONS.USER_ROLE_CHANGE,
    entity: AUDIT_ENTITIES.USER,
    entityId: userId,
    oldValue: { role: previous.role },
    newValue: { role },
    metadata: { targetUser: { id: previous.id, email: previous.email, username: previous.username } },
    ...auditContext,
  });

  return serializeUser(updated);
}

export async function changeUserStatus({ actorId, userId, isActive, auditContext = {} }) {
  const previous = await findAdminUserById(userId);
  if (!previous) throw new AppError("User not found.", 404);
  if (actorId === userId && !isActive) throw new AppError("You cannot deactivate yourself.", 400);
  if (previous.role === "Admin" && previous.active === 1 && !isActive && (await countActiveAdmins()) <= 1) {
    throw new AppError("Cannot deactivate the last active Admin.", 400);
  }

  const updated = await setUserStatus({ userId, isActive, actorId });
  await recordAuditLogSafe({
    userId: actorId,
    action: "User Status Change",
    entity: AUDIT_ENTITIES.USER,
    entityId: userId,
    oldValue: { active: previous.active, status: previous.status },
    newValue: { active: updated.active, status: updated.status },
    metadata: { targetUser: { id: previous.id, email: previous.email, username: previous.username } },
    ...auditContext,
  });

  return serializeUser(updated);
}

export async function deleteAdminUser({ actorId, userId, auditContext = {} }) {
  const previous = await findAdminUserById(userId);
  if (!previous) throw new AppError("User not found.", 404);
  if (actorId === userId) throw new AppError("You cannot delete yourself.", 400);
  if (previous.role === "Admin" && previous.active === 1 && (await countActiveAdmins()) <= 1) {
    throw new AppError("Cannot delete the last active Admin.", 400);
  }

  const updated = await softDeleteUser({ userId, actorId });
  await recordAuditLogSafe({
    userId: actorId,
    action: "User Delete",
    entity: AUDIT_ENTITIES.USER,
    entityId: userId,
    oldValue: { active: previous.active, status: previous.status },
    newValue: { active: updated.active, status: updated.status },
    metadata: { targetUser: { id: previous.id, email: previous.email, username: previous.username } },
    ...auditContext,
  });

  return serializeUser(updated);
}

export async function getRolesAndPermissions() {
  const [roles, permissions] = await Promise.all([listRolesWithPermissions(), listPermissions()]);
  return {
    roles: roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
      usersCount: role._count?.users ?? 0,
      permissions: role.permissions.map((item) => item.permission),
    })),
    permissions,
  };
}

export async function addPermissionToRole({ actorId, roleId, permissionId, auditContext = {} }) {
  const result = await assignPermissionToRole({ roleId, permissionId, actorId });
  await recordAuditLogSafe({
    userId: actorId,
    action: "Role Permission Add",
    entity: "RolePermission",
    entityId: result.id,
    newValue: { role: result.role.name, permission: result.permission.name },
    ...auditContext,
  });
  return getRolesAndPermissions();
}

export async function deletePermissionFromRole({ actorId, roleId, permissionId, auditContext = {} }) {
  const result = await removePermissionFromRole({ roleId, permissionId });
  await recordAuditLogSafe({
    userId: actorId,
    action: "Role Permission Remove",
    entity: "RolePermission",
    entityId: result.id,
    oldValue: { role: result.role.name, permission: result.permission.name },
    ...auditContext,
  });
  return getRolesAndPermissions();
}

function serializeUser(user) {
  return {
    id: user.id,
    username: user.username,
    fullName: user.username,
    email: user.email,
    role: user.role,
    active: user.active,
    status: user.status,
    roles: user.roles?.map((entry) => entry.role.name) ?? [],
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}
