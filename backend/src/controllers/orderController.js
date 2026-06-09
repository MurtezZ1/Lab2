import {
  changeOrderStatus,
  createCheckoutOrder,
  getOrderDetails,
  getOrders,
} from "../services/orderService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAuditRequestContext } from "../utils/auditContext.js";

const isAdmin = (req) => req.user?.roles?.some((role) => ["Admin", "Manager"].includes(role));

export const createOrderController = asyncHandler(async (req, res) => {
  res.status(201).json({
    success: true,
    data: await createCheckoutOrder(req.user.id, req.body, getAuditRequestContext(req)),
  });
});

export const listOrdersController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getOrders(req.user.id, req.query, isAdmin(req)) });
});

export const getOrderController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getOrderDetails(req.params.id, req.user.id, isAdmin(req)) });
});

export const updateOrderStatusController = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: await changeOrderStatus(req.params.id, req.body.status, req.user.id, getAuditRequestContext(req)),
  });
});
