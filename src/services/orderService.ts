import type { CartItem, Order, User } from "@/types";
import { apiClient } from "@/services/apiClient";

export async function getOrders(user: User | null): Promise<Order[]> {
  if (!user) return [];
  const { data } = await apiClient.get("/orders");
  return data.data.items;
}

export async function createOrder(user: User | null, items: CartItem[], total?: number) {
  if (!user) throw new Error("You must be signed in to place an order.");
  const { data } = await apiClient.post("/orders", {
    items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    total,
  });
  return data.data as Order;
}

export async function getOrderDetails(id: string) {
  const { data } = await apiClient.get(`/orders/${id}`);
  return data.data as Order;
}

export async function updateOrderStatus(id: string, status: string) {
  const { data } = await apiClient.put(`/orders/${id}/status`, { status });
  return data.data as Order;
}
