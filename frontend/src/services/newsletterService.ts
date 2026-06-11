import { apiClient } from "@/services/apiClient";

export async function subscribeNewsletter(email: string) {
  const { data } = await apiClient.post("/newsletter/subscribe", { email });
  return data.data as { id: string; email: string; isActive: boolean };
}
