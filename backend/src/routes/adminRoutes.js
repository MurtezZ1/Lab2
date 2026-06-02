import { Router } from "express";
import { listUsersController, updateUserController } from "../controllers/adminController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate, authorizeRoles("Admin", "Manager"));
router.get("/users", listUsersController);
router.put("/users/:id", updateUserController);

export default router;
