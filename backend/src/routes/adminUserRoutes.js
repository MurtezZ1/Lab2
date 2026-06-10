import { Router } from "express";
import {
  addRolePermissionController,
  deleteAdminUserController,
  getAdminUserController,
  listAdminRolesController,
  listAdminUsersController,
  removeRolePermissionController,
  updateAdminUserRoleController,
  updateAdminUserStatusController,
} from "../controllers/adminUserController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate, authorizeRoles("Admin"));

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: List users for Admin management
 *     tags: [Admin Users]
 */
router.get("/users", listAdminUsersController);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get one user account
 *     tags: [Admin Users]
 */
router.get("/users/:id", getAdminUserController);

/**
 * @openapi
 * /api/admin/users/{id}/role:
 *   patch:
 *     summary: Change a user's role with self-demotion and last-admin protection
 *     tags: [Admin Users]
 */
router.patch("/users/:id/role", updateAdminUserRoleController);

/**
 * @openapi
 * /api/admin/users/{id}/status:
 *   patch:
 *     summary: Activate or deactivate a user account
 *     tags: [Admin Users]
 */
router.patch("/users/:id/status", updateAdminUserStatusController);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Safely delete a user by suspending the account
 *     tags: [Admin Users]
 */
router.delete("/users/:id", deleteAdminUserController);

/**
 * @openapi
 * /api/admin/roles:
 *   get:
 *     summary: List roles and permissions
 *     tags: [Admin Roles]
 */
router.get("/roles", listAdminRolesController);

/**
 * @openapi
 * /api/admin/roles/{roleId}/permissions:
 *   post:
 *     summary: Assign a permission to a role
 *     tags: [Admin Roles]
 */
router.post("/roles/:roleId/permissions", addRolePermissionController);

/**
 * @openapi
 * /api/admin/roles/{roleId}/permissions/{permissionId}:
 *   delete:
 *     summary: Remove a permission from a role
 *     tags: [Admin Roles]
 */
router.delete("/roles/:roleId/permissions/:permissionId", removeRolePermissionController);

export default router;
