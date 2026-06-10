import { Router } from "express";
import authRoutes from "./authRoutes.js";
import rbacRoutes from "./rbacRoutes.js";
import advancedRoutes from "./advancedRoutes.js";
import adminRoutes from "./adminRoutes.js";
import auditLogRoutes from "./auditLogRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import aiRoutes from "./aiRoutes.js";
import cartRoutes from "./cartRoutes.js";
import catalogRoutes from "./catalogRoutes.js";
import commerceRoutes from "./commerceRoutes.js";
import orderRoutes from "./orderRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import invoiceRoutes from "./invoiceRoutes.js";
import supportRoutes from "./supportRoutes.js";
import notificationRoutes from "./notificationRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/rbac", rbacRoutes);
router.use("/", catalogRoutes);
router.use("/", commerceRoutes);
router.use("/admin/audit-logs", auditLogRoutes);
router.use("/admin/analytics", analyticsRoutes);
router.use("/ai", aiRoutes);
router.use("/admin", adminRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/support-tickets", supportRoutes);
router.use("/notifications", notificationRoutes);
router.use("/", advancedRoutes);

export default router;
