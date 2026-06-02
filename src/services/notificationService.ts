import type { Notification, User } from "@/types";
import { apiClient } from "@/services/apiClient";

export async function getNotifications(user?: User | null) {
  if (!user) return [] as Notification[];
  const { data } = await apiClient.get("/notifications");
  return data.data as Notification[];
}

export async function markNotificationsRead(user?: User | null) {
  if (!user) return [] as Notification[];
  await apiClient.put("/notifications/read");
  return getNotifications(user);
}
