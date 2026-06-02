import { Router } from "express";
import {
  addCartItemController,
  clearCartController,
  getCartController,
  removeCartItemController,
  updateCartItemController,
} from "../controllers/cartController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateCartItem } from "../validators/commerceValidator.js";

const router = Router();

router.use(authenticate);
router.get("/", getCartController);
router.post("/items", validateRequest(validateCartItem), addCartItemController);
router.put("/items/:productId", updateCartItemController);
router.delete("/items/:productId", removeCartItemController);
router.delete("/", clearCartController);

export default router;
