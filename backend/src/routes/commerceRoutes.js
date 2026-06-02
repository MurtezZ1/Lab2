import { Router } from "express";
import {
  createPaymentController,
  createReturnController,
  createReviewController,
  createShipmentController,
  getReviewsController,
  getWishlistController,
  listReturnsController,
  listShippingMethodsController,
  saveShippingMethodController,
  toggleWishlistController,
} from "../controllers/commerceController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateReview } from "../validators/commerceValidator.js";

const router = Router();
const adminOnly = [authenticate, authorizeRoles("Admin", "Manager")];

router.get("/wishlist", authenticate, getWishlistController);
router.post("/wishlist", authenticate, toggleWishlistController);

router.get("/products/:productId/reviews", getReviewsController);
router.post("/products/:productId/reviews", authenticate, validateRequest(validateReview), createReviewController);

router.post("/orders/:orderId/payments", authenticate, createPaymentController);
router.get("/shipping-methods", listShippingMethodsController);
router.post("/shipping-methods", ...adminOnly, saveShippingMethodController);
router.post("/orders/:orderId/shipments", ...adminOnly, createShipmentController);
router.post("/orders/:orderId/returns", authenticate, createReturnController);
router.get("/returns", authenticate, listReturnsController);

export default router;
