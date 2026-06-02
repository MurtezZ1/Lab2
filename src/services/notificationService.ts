import type { Notification } from "@/types";

const KEY = "sunspot_notifications";

const initialNotifications: Notification[] = [
  {
    id: "stock-alert",
    title: "Stock alert",
    message: "A saved product is almost out of stock.",
    unread: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "order-update",
    title: "Order update",
    message: "Your latest order status will appear here.",
    unread: false,
    createdAt: new Date().toISOString(),
  },
];

export function getNotifications() {
  const value = window.localStorage.getItem(KEY);
  if (!value) {
    window.localStorage.setItem(KEY, JSON.stringify(initialNotifications));
    return initialNotifications;
  }
  return JSON.parse(value) as Notification[];
}

export function markNotificationsRead() {
  const next = getNotifications().map((item) => ({ ...item, unread: false }));
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
