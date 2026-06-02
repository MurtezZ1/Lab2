import { clearCart, getOrCreateCart } from "../repositories/cartRepository.js";
import { findProductIdentifier } from "../repositories/catalogRepository.js";
import {
  createOrderWithItems,
  findOrder,
  listOrders,
  updateOrderStatus,
} from "../repositories/orderRepository.js";
import { AppError } from "../utils/AppError.js";
import { serializeOrder } from "../utils/serializers.js";

export async function createCheckoutOrder(userId, payload = {}) {
  const cart = await getOrCreateCart(userId);
  let items = cart.items ?? [];

  if (payload.items?.length) {
    items = await Promise.all(
      payload.items.map(async (item) => {
        const product = await findProductIdentifier(item.productId ?? item.product_id);
        if (!product) throw new AppError("Product not found.", 404);
        return {
          product_id: product.id,
          quantity: Math.max(Number(item.quantity ?? 1), 1),
          unit_price: Number(product.price),
        };
      }),
    );
  }

  if (!items.length) throw new AppError("Cart is empty.", 400);
  const order = await createOrderWithItems({
    userId,
    items: items.map((item) => ({
      product_id: item.product_id,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
    })),
    addressId: payload.addressId,
  });

  await clearCart(cart.id);
  return serializeOrder(order);
}

export async function getOrders(userId, query = {}, isAdmin = false) {
  const result = await listOrders({
    userId,
    isAdmin,
    status: query.status,
    page: Number(query.page ?? 1),
    pageSize: Number(query.pageSize ?? 20),
  });
  return { ...result, items: result.items.map(serializeOrder) };
}

export async function getOrderDetails(id, userId, isAdmin = false) {
  const order = await findOrder(id, userId, isAdmin);
  if (!order) throw new AppError("Order not found.", 404);
  return serializeOrder(order);
}

export async function changeOrderStatus(id, status, userId) {
  return serializeOrder(await updateOrderStatus(id, status, userId));
}
