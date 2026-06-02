import { addToCart, emptyCart, readCart, removeFromCart, updateCartQuantity } from "../services/cartService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCartController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await readCart(req.user.id) });
});

export const addCartItemController = asyncHandler(async (req, res) => {
  const body = req.body ?? {};
  res.json({ success: true, data: await addToCart(req.user.id, body.productId, body.quantity ?? 1) });
});

export const updateCartItemController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await updateCartQuantity(req.user.id, req.params.productId, (req.body ?? {}).quantity) });
});

export const removeCartItemController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await removeFromCart(req.user.id, req.params.productId) });
});

export const clearCartController = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await emptyCart(req.user.id) });
});
