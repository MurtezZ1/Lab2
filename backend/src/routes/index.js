import { Router } from "express";
import authRoutes from "./authRoutes.js";
import rbacRoutes from "./rbacRoutes.js";
import advancedRoutes from "./advancedRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/rbac", rbacRoutes);
router.use("/", advancedRoutes);

export default router;
