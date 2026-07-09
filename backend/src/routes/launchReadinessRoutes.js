import { Router } from "express";
import { getLaunchReadinessController } from "../controllers/launchReadinessController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate, authorizeRoles("Admin", "Manager"));

/**
 * @openapi
 * /admin/launch-readiness:
 *   get:
 *     summary: Get production readiness and launch mode checks
 *     tags:
 *       - Admin Launch Readiness
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Production readiness status for database, payments, email, catalog, orders and infrastructure.
 *       403:
 *         description: Admin or Manager role is required.
 */
router.get("/", getLaunchReadinessController);

export default router;
