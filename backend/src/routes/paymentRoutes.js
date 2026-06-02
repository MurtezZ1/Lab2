import { Router } from "express";
import {
  createPaymentIntentController,
  verifyPaymentController,
} from "../controllers/paymentController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validatePaymentVerification } from "../validators/paymentValidator.js";

const router = Router();

/**
 * @swagger
 * /api/payments/orders/{orderId}/intent:
 *   post:
 *     summary: Create a Stripe Payment Intent for an order
 *     tags: [Payments]
 */
router.post("/orders/:orderId/intent", authenticate, createPaymentIntentController);

/**
 * @swagger
 * /api/payments/verify:
 *   post:
 *     summary: Verify a Stripe Payment Intent and sync payment/order status
 *     tags: [Payments]
 */
router.post(
  "/verify",
  authenticate,
  asyncHandler(async (req, _res, next) => {
    validatePaymentVerification(req.body);
    next();
  }),
  verifyPaymentController,
);

export default router;
