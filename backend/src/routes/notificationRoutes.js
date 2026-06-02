import { Router } from "express";
import {
  createNotificationController,
  listNotificationsController,
  markNotificationsReadController,
} from "../controllers/notificationController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);
router.get("/", listNotificationsController);
router.put("/read", markNotificationsReadController);
router.post("/:userId", authorizeRoles("Admin", "Manager"), createNotificationController);

export default router;
