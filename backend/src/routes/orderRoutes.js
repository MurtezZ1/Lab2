import { Router } from "express";
import {
  createOrderController,
  getOrderController,
  listOrdersController,
  updateOrderStatusController,
} from "../controllers/orderController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateOrder } from "../validators/commerceValidator.js";

const router = Router();

router.use(authenticate);
router.get("/", listOrdersController);
router.post("/", validateRequest(validateOrder), createOrderController);
router.get("/:id", getOrderController);
router.put("/:id/status", authorizeRoles("Admin", "Manager"), updateOrderStatusController);

export default router;
