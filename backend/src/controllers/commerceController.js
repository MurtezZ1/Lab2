import {
  addPayment,
  addProductReview,
  addReturn,
  addShipment,
  getProductReviews,
  getReturns,
  getShippingMethods,
  getWishlist,
  saveShippingMethod,
  toggleWishlist,
} from "../services/commerceService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isAdmin = (req) => req.user?.roles?.some((role) => ["Admin", "Manager"].includes(role));

export const getWishlistController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getWishlist(req.user.id) });
});

export const toggleWishlistController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await toggleWishlist(req.user.id, (req.body ?? {}).productId) });
});

export const getReviewsController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getProductReviews(req.params.productId) });
});

export const createReviewController = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await addProductReview(req.user.id, req.params.productId, req.body) });
});

export const createPaymentController = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await addPayment(req.params.orderId, req.body, req.user.id) });
});

export const listShippingMethodsController = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await getShippingMethods() });
});

export const saveShippingMethodController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await saveShippingMethod(req.body, req.user.id) });
});

export const createShipmentController = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await addShipment(req.params.orderId, req.body, req.user.id) });
});

export const createReturnController = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await addReturn(req.params.orderId, req.body, req.user.id) });
});

export const listReturnsController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getReturns(req.user.id, isAdmin(req)) });
});
