import {
  addPermissionToRole,
  changeUserRole,
  changeUserStatus,
  deleteAdminUser,
  deletePermissionFromRole,
  getAdminUser,
  getAdminUsers,
  getRolesAndPermissions,
} from "../services/adminUserService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAuditRequestContext } from "../utils/auditContext.js";
import {
  validatePermissionUpdate,
  validateRoleUpdate,
  validateStatusUpdate,
} from "../validators/adminUserValidator.js";

export const listAdminUsersController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getAdminUsers(req.query) });
});

export const getAdminUserController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getAdminUser(req.params.id) });
});

export const updateAdminUserRoleController = asyncHandler(async (req, res) => {
  validateRoleUpdate(req.body);
  const data = await changeUserRole({
    actorId: req.user.id,
    userId: req.params.id,
    role: req.body.role,
    auditContext: getAuditRequestContext(req),
  });
  res.json({ success: true, data });
});

export const updateAdminUserStatusController = asyncHandler(async (req, res) => {
  validateStatusUpdate(req.body);
  const data = await changeUserStatus({
    actorId: req.user.id,
    userId: req.params.id,
    isActive: req.body.is_active,
    auditContext: getAuditRequestContext(req),
  });
  res.json({ success: true, data });
});

export const deleteAdminUserController = asyncHandler(async (req, res) => {
  const data = await deleteAdminUser({
    actorId: req.user.id,
    userId: req.params.id,
    auditContext: getAuditRequestContext(req),
  });
  res.json({ success: true, data });
});

export const listAdminRolesController = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await getRolesAndPermissions() });
});

export const addRolePermissionController = asyncHandler(async (req, res) => {
  validatePermissionUpdate(req.body);
  const data = await addPermissionToRole({
    actorId: req.user.id,
    roleId: req.params.roleId,
    permissionId: req.body.permissionId,
    auditContext: getAuditRequestContext(req),
  });
  res.json({ success: true, data });
});

export const removeRolePermissionController = asyncHandler(async (req, res) => {
  const data = await deletePermissionFromRole({
    actorId: req.user.id,
    roleId: req.params.roleId,
    permissionId: req.params.permissionId,
    auditContext: getAuditRequestContext(req),
  });
  res.json({ success: true, data });
});
