import { Router } from "express";
import {
  exportAnalyticsDashboardController,
  getAnalyticsDashboardController,
} from "../controllers/analyticsController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate, authorizeRoles("Admin", "Manager"));

/**
 * @openapi
 * /admin/analytics/dashboard:
 *   get:
 *     summary: Get admin analytics dashboard data
 *     tags:
 *       - Admin Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: range
 *         schema:
 *           type: string
 *           enum: [today, last7Days, last30Days, last90Days, thisYear, custom]
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
 *     responses:
 *       200:
 *         description: KPI cards and chart data from PostgreSQL, MongoDB, and Redis cache metadata.
 *       403:
 *         description: Admin or Manager role is required.
 */
router.get("/dashboard", getAnalyticsDashboardController);

/**
 * @openapi
 * /admin/analytics/dashboard/export/{format}:
 *   get:
 *     summary: Export current admin analytics dashboard data
 *     tags:
 *       - Admin Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: format
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pdf, excel, csv]
 *       - in: query
 *         name: range
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
 *     responses:
 *       200:
 *         description: PDF, Excel, or CSV export.
 */
router.get("/dashboard/export/:format", exportAnalyticsDashboardController);

export default router;
