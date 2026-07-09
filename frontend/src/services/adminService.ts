import { apiClient } from "@/services/apiClient";
import type { AuditLogListResult, AuditLogQuery, Product, Order, SupportTicket, User } from "@/types";

export type AdminUsersQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  status?: string;
};

export type AdminUsersResult = {
  items: User[];
  total: number;
  page: number;
  pageSize: number;
};

export type AdminPermission = {
  id: string;
  name: string;
  description?: string;
};

export type AdminRole = {
  id: string;
  name: string;
  description?: string;
  usersCount: number;
  permissions: AdminPermission[];
};

export async function getAdminUsers(query: AdminUsersQuery = {}) {
  const { data } = await apiClient.get("/admin/users", { params: cleanParams(query) });
  return data.data as AdminUsersResult;
}

export async function getAdminUser(id: string) {
  const { data } = await apiClient.get(`/admin/users/${id}`);
  return data.data as User;
}

export async function changeAdminUserRole(id: string, role: "Admin" | "Manager" | "Customer") {
  const { data } = await apiClient.patch(`/admin/users/${id}/role`, { role });
  return data.data as User;
}

export async function changeAdminUserStatus(id: string, isActive: boolean) {
  const { data } = await apiClient.patch(`/admin/users/${id}/status`, { is_active: isActive });
  return data.data as User;
}

export async function deleteAdminUser(id: string) {
  const { data } = await apiClient.delete(`/admin/users/${id}`);
  return data.data as User;
}

export async function getAdminRoles() {
  const { data } = await apiClient.get("/admin/roles");
  return data.data as { roles: AdminRole[]; permissions: AdminPermission[] };
}

export async function addRolePermission(roleId: string, permissionId: string) {
  const { data } = await apiClient.post(`/admin/roles/${roleId}/permissions`, { permissionId });
  return data.data as { roles: AdminRole[]; permissions: AdminPermission[] };
}

export async function removeRolePermission(roleId: string, permissionId: string) {
  const { data } = await apiClient.delete(`/admin/roles/${roleId}/permissions/${permissionId}`);
  return data.data as { roles: AdminRole[]; permissions: AdminPermission[] };
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

export async function updateProductInventory(productId: string | number, stockQuantity: number) {
  const { data } = await apiClient.put(`/products/${productId}/inventory`, {
    stock_quantity: stockQuantity,
  });
  return data.data;
}

export async function seedAdminDemoData() {
  const { data } = await apiClient.post("/admin/demo-data/seed");
  return data.data as {
    users: Array<{ id: string; email: string; role: string }>;
    order: { id: string; orderNumber: string; total: number } | null;
    invoice: { id: string; invoiceNumber: string } | null;
    password: string;
  };
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
