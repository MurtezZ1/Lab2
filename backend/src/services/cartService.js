import { findProductIdentifier } from "../repositories/catalogRepository.js";
import {
  clearCart,
  getCart,
  getOrCreateCart,
  removeCartItem,
  setCartItemQuantity,
  upsertCartItem,
} from "../repositories/cartRepository.js";
import { AppError } from "../utils/AppError.js";
import { serializeCartItem } from "../utils/serializers.js";

export async function readCart(userId) {
  const cart = (await getCart(userId)) ?? (await getOrCreateCart(userId));
  return serializeCart(cart);
}

export async function addToCart(userId, productIdentifier, quantity = 1) {
  const product = await findProductIdentifier(productIdentifier);
  if (!product) throw new AppError("Product not found.", 404);
  const cart = await getOrCreateCart(userId);
  await upsertCartItem({
    cartId: cart.id,
    productId: product.id,
    quantity: Math.max(Number(quantity), 1),
    unitPrice: Number(product.price),
    userId,
  });
  return readCart(userId);
}

export async function updateCartQuantity(userId, productIdentifier, quantity) {
  const product = await findProductIdentifier(productIdentifier);
  if (!product) throw new AppError("Product not found.", 404);
  const cart = await getOrCreateCart(userId);
  await setCartItemQuantity({ cartId: cart.id, productId: product.id, quantity: Number(quantity), userId });
  return readCart(userId);
}

export async function removeFromCart(userId, productIdentifier) {
  const product = await findProductIdentifier(productIdentifier);
  if (!product) throw new AppError("Product not found.", 404);
  const cart = await getOrCreateCart(userId);
  await removeCartItem(cart.id, product.id);
  return readCart(userId);
}

export async function emptyCart(userId) {
  const cart = await getOrCreateCart(userId);
  await clearCart(cart.id);
  return readCart(userId);
}

function serializeCart(cart) {
  const items = cart.items?.map(serializeCartItem) ?? [];
  const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
  const tax = subtotal * 0.08;
  return { id: cart.id, items, summary: { subtotal, tax, total: subtotal + tax } };
}
