import { Router } from "express";
import { adminCheckController, reportsCheckController } from "../controllers/rbacController.js";
import { authenticate, authorizePermissions, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/admin-only", authenticate, authorizeRoles("Admin"), adminCheckController);
router.get("/reports", authenticate, authorizePermissions("View Reports"), reportsCheckController);

export default router;
