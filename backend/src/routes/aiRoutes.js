import { Router } from "express";
import {
  aiAnalyticsController,
  shoppingAssistantController,
} from "../controllers/aiShoppingAssistantController.js";
import { authenticate, authorizeRoles, optionalAuthenticate } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * @openapi
 * /api/ai/shopping-assistant:
 *   post:
 *     summary: Ask the AI Shopping Assistant for product recommendations
 *     tags:
 *       - AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: I need a laptop for programming under 800 euros
 *     responses:
 *       200:
 *         description: AI answer and recommended products
 */
router.post("/shopping-assistant", optionalAuthenticate, shoppingAssistantController);

/**
 * @openapi
 * /api/ai/analytics:
 *   get:
 *     summary: Get AI assistant usage analytics
 *     tags:
 *       - AI
 *     responses:
 *       200:
 *         description: AI chat counts, requested categories, and common questions
 */
router.get("/analytics", authenticate, authorizeRoles("Admin", "Manager"), aiAnalyticsController);

export default router;
