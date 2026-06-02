import type { CartItem, Order, User } from "@/types";

const ordersKey = (user: User | null) => `sunspot_orders_${user?.id ?? "guest"}`;

export function getOrders(user: User | null): Order[] {
  const value = window.localStorage.getItem(ordersKey(user));
  return value ? (JSON.parse(value) as Order[]) : [];
}

export function createOrder(user: User | null, items: CartItem[], total: number) {
  const orders = getOrders(user);
  const order: Order = {
    id: crypto.randomUUID(),
    orderNumber: `SUN-${Date.now()}`,
    status: "Processing",
    total,
    createdAt: new Date().toISOString(),
    items,
  };
  const nextOrders = [order, ...orders];
  window.localStorage.setItem(ordersKey(user), JSON.stringify(nextOrders));
  return order;
}
