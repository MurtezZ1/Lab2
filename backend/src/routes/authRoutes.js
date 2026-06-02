import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  meController,
  refreshController,
  registerController,
  resetPasswordController,
  verifyEmailController,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateLogin, validateRegister } from "../validators/authValidator.js";

const router = Router();

router.post("/register", validateRequest(validateRegister), registerController);
router.post("/login", validateRequest(validateLogin), loginController);
router.post("/logout", logoutController);
router.post("/refresh-token", refreshController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/verify-email", verifyEmailController);
router.get("/me", authenticate, meController);

export default router;
