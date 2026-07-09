import { Router } from "express";
import { seedDemoDataController } from "../controllers/demoDataController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate, authorizeRoles("Admin"));
router.post("/seed", seedDemoDataController);

export default router;
