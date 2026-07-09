import { Router } from "express";
import { getSystemMonitorController } from "../controllers/systemMonitorController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate, authorizeRoles("Admin", "Manager"));
router.get("/", getSystemMonitorController);

export default router;
