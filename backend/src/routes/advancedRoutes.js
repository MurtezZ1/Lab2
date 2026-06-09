import { Router } from "express";
import multer from "multer";
import {
  dashboardController,
  emitTestNotificationController,
  emitTestOrderController,
  exportReportController,
  getCmsController,
  personalizedRecommendationsController,
  recommendationsController,
  reportsController,
  searchController,
  similarProductsController,
  trackProductViewController,
  updateCmsController,
  uploadController,
} from "../controllers/advancedController.js";
import { authenticate, authorizePermissions, authorizeRoles, optionalAuthenticate } from "../middleware/authMiddleware.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.get("/search", optionalAuthenticate, searchController);

/**
 * @openapi
 * /recommendations/similar/{productId}:
 *   get:
 *     summary: Get similar product recommendations
 *     tags:
 *       - Recommendations
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Similar products with similarity scores.
 */
router.get("/recommendations/similar/:productId", similarProductsController);

/**
 * @openapi
 * /recommendations/personalized:
 *   get:
 *     summary: Get personalized and trending recommendations
 *     tags:
 *       - Recommendations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personalized, frequently bought together, and trending products.
 */
router.get("/recommendations/personalized", optionalAuthenticate, personalizedRecommendationsController);
router.get("/recommendations/:productId", recommendationsController);
router.post("/recommendations/view", optionalAuthenticate, trackProductViewController);
router.get("/reports", reportsController);
router.get("/reports/export/:format", exportReportController);
router.get("/dashboard", dashboardController);
router.get("/cms", getCmsController);
router.put("/cms", authenticate, authorizeRoles("Admin", "Manager"), updateCmsController);
router.post("/files/upload", authenticate, upload.single("file"), uploadController);
router.post("/notifications/test", emitTestNotificationController);
router.post("/orders/test-update", emitTestOrderController);

export default router;
