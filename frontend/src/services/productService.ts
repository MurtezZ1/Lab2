import type { Product } from "@/types";
import { normalizeProduct } from "@/utils/products";
import { apiClient } from "@/services/apiClient";

export type ProductQuery = {
  take?: number;
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  brand?: string;
  sort?: string;
  order?: "asc" | "desc";
};

export async function getProducts(options?: ProductQuery): Promise<Product[]> {
  const { data } = await apiClient.get("/products", { params: options });
  const items = data.data?.items ?? data.data ?? [];
  return items.map(normalizeProduct);
}

export async function getProductsPage(options?: ProductQuery) {
  const { data } = await apiClient.get("/products", { params: options });
  return {
    ...data.data,
    items: (data.data.items ?? []).map(normalizeProduct),
  };
}

export async function getProductById(id: number | string): Promise<Product | null> {
  const { data } = await apiClient.get(`/products/${id}`);
  return data.data ? normalizeProduct(data.data) : null;
}

export async function searchProducts(search: string, options?: ProductQuery) {
  return getProducts({ ...options, search });
}

export async function createProduct(payload: Partial<Product>) {
  const { data } = await apiClient.post("/products", payload);
  return normalizeProduct(data.data);
}

export async function updateProduct(id: number | string, payload: Partial<Product>) {
  const { data } = await apiClient.put(`/products/${id}`, payload);
  return normalizeProduct(data.data);
}

export async function deleteProduct(id: number | string) {
  const { data } = await apiClient.delete(`/products/${id}`);
  return normalizeProduct(data.data);
}

export async function getCategories() {
  const { data } = await apiClient.get("/categories");
  return data.data;
}

export async function getBrands() {
  const { data } = await apiClient.get("/brands");
  return data.data;
}
