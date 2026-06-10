import { Router } from "express";
import {
  downloadInvoiceController,
  generateInvoiceController,
  getInvoiceController,
  listInvoicesController,
} from "../controllers/invoiceController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /invoices:
 *   get:
 *     summary: List invoices for current user, or all invoices for Admin/Manager
 *     tags:
 *       - Invoices
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLETED, FAILED, REFUNDED]
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Paginated invoice list.
 */
router.get("/", listInvoicesController);

/**
 * @openapi
 * /invoices/generate/{orderId}:
 *   post:
 *     summary: Generate an invoice for a paid order
 *     tags:
 *       - Invoices
 *     security:
 *       - bearerAuth: []
 */
router.post("/generate/:orderId", generateInvoiceController);

/**
 * @openapi
 * /invoices/{orderId}:
 *   get:
 *     summary: Get invoice metadata for an order
 *     tags:
 *       - Invoices
 *     security:
 *       - bearerAuth: []
 */
router.get("/:orderId", getInvoiceController);

/**
 * @openapi
 * /invoices/{orderId}/download:
 *   get:
 *     summary: Download invoice PDF for an order
 *     tags:
 *       - Invoices
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF invoice.
 */
router.get("/:orderId/download", downloadInvoiceController);

export default router;
