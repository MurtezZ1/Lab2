import { Router } from "express";
import authRoutes from "./authRoutes.js";
import rbacRoutes from "./rbacRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/rbac", rbacRoutes);

export default router;
