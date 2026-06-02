import { apiClient } from "@/services/apiClient";
import type { Product, Order, SupportTicket } from "@/types";

export async function getAdminUsers() {
  const { data } = await apiClient.get("/admin/users");
  return data.data.items as Array<{ id: string; email: string; username: string; role: string; status: string }>;
}

export async function getAdminOrders() {
  const { data } = await apiClient.get("/orders");
  return data.data.items as Order[];
}

export async function updateAdminOrderStatus(id: string, status: string) {
  const { data } = await apiClient.put(`/orders/${id}/status`, { status });
  return data.data as Order;
}

export async function getAdminSupportTickets() {
  const { data } = await apiClient.get("/support-tickets");
  return data.data as SupportTicket[];
}

export async function saveCategory(name: string) {
  const { data } = await apiClient.post("/categories", { name });
  return data.data;
}

export async function saveBrand(name: string) {
  const { data } = await apiClient.post("/brands", { name });
  return data.data;
}

export async function saveProduct(product: Partial<Product>) {
  const { data } = await apiClient.post("/products", product);
  return data.data as Product;
}
