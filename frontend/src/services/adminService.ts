import { apiClient } from "@/services/apiClient";
import type { AuditLogListResult, AuditLogQuery, Product, Order, SupportTicket } from "@/types";

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

export async function getAdminAuditLogs(filters: AuditLogQuery = {}) {
  const { data } = await apiClient.get("/admin/audit-logs", { params: cleanParams(filters) });
  return data.data as AuditLogListResult;
}

export async function downloadAdminAuditLogs(format: "csv" | "excel", filters: AuditLogQuery = {}) {
  const response = await apiClient.get<Blob>(`/admin/audit-logs/export/${format}`, {
    params: cleanParams(filters),
    responseType: "blob",
  });
  const extension = format === "excel" ? "xlsx" : "csv";
  const contentType = response.headers["content-type"];
  const blob = new Blob([response.data], {
    type: typeof contentType === "string" ? contentType : "application/octet-stream",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `audit-logs.${extension}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function cleanParams(filters: AuditLogQuery) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
}
