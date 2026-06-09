import { Router } from "express";
import {
  exportAuditLogsController,
  listAuditLogsController,
} from "../controllers/auditLogController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate, authorizeRoles("Admin"));

/**
 * @openapi
 * /admin/audit-logs:
 *   get:
 *     summary: List admin audit logs
 *     tags:
 *       - Admin Audit Logs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum:
 *             - Login
 *             - Logout
 *             - Register
 *             - Product Create
 *             - Product Update
 *             - Product Delete
 *             - Order Create
 *             - Order Status Change
 *             - User Role Change
 *             - CMS Update
 *             - Report Export
 *       - in: query
 *         name: entity
 *         schema:
 *           type: string
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Paginated audit log list.
 *       403:
 *         description: Admin role is required.
 */
router.get("/", listAuditLogsController);

/**
 * @openapi
 * /admin/audit-logs/export/{format}:
 *   get:
 *     summary: Export filtered audit logs
 *     tags:
 *       - Admin Audit Logs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: format
 *         required: true
 *         schema:
 *           type: string
 *           enum: [csv, excel]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *       - in: query
 *         name: entity
 *         schema:
 *           type: string
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: CSV or Excel file.
 *       403:
 *         description: Admin role is required.
 */
router.get("/export/:format", exportAuditLogsController);

export default router;
