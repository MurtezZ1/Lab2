import { Router } from "express";
import multer from "multer";
import {
  dashboardController,
  emitTestNotificationController,
  emitTestOrderController,
  exportReportController,
  getCmsController,
  recommendationsController,
  reportsController,
  searchController,
  trackProductViewController,
  updateCmsController,
  uploadController,
} from "../controllers/advancedController.js";
import { authenticate, authorizePermissions, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.get("/search", searchController);
router.get("/recommendations/:productId", recommendationsController);
router.post("/recommendations/view", trackProductViewController);
router.get("/reports", reportsController);
router.get("/reports/export/:format", exportReportController);
router.get("/dashboard", dashboardController);
router.get("/cms", getCmsController);
router.put("/cms", authenticate, authorizeRoles("Admin", "Manager"), updateCmsController);
router.post("/files/upload", authenticate, upload.single("file"), uploadController);
router.post("/notifications/test", emitTestNotificationController);
router.post("/orders/test-update", emitTestOrderController);

export default router;
