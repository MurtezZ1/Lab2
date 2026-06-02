import type { CartItem, Product, User } from "@/types";
import { apiClient } from "@/services/apiClient";

export async function getCartItems(user: User | null): Promise<CartItem[]> {
  if (!user) return [];
  const { data } = await apiClient.get("/cart");
  return data.data.items;
}

export async function saveCartItems(user: User | null, items: CartItem[]) {
  if (!user) {
    return [];
  }
  if (items.length === 0) {
    const { data } = await apiClient.delete("/cart");
    return data.data.items;
  }
  return getCartItems(user);
}

export async function addProductToCart(user: User | null, product: Product) {
  if (!user) {
    throw new Error("You must be signed in to use the cart.");
  }

  const { data } = await apiClient.post("/cart/items", { productId: product.id, quantity: 1 });
  return data.data.items as CartItem[];
}

export async function removeOneFromCart(user: User | null, productId: number | string) {
  const items = await getCartItems(user);
  const item = items.find((entry) => entry.productId === productId);
  if (!item) return items;
  const nextQuantity = item.quantity - 1;

  if (!user) return [];

  const { data } = await apiClient.put(`/cart/items/${productId}`, { quantity: nextQuantity });
  return data.data.items as CartItem[];
}

export async function removeProductFromCart(user: User | null, productId: number | string) {
  if (!user) {
    return [];
  }
  const { data } = await apiClient.delete(`/cart/items/${productId}`);
  return data.data.items as CartItem[];
}

export function getCartSummary(items: CartItem[]) {
  const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
  const tax = subtotal * 0.08;
  return { subtotal, tax, total: subtotal + tax };
}
