import type { Product } from "@/types";
import { apiClient } from "@/services/apiClient";
import { normalizeProduct } from "@/utils/products";

export async function getSimilarProducts(productId?: number | string) {
  const { data } = await apiClient.get(`/recommendations/${productId ?? 1}`);
  return (data.data.similarProducts ?? []).map(normalizeProduct) as Product[];
}

export async function getPersonalizedRecommendations() {
  const { data } = await apiClient.get("/recommendations/1");
  return (data.data.personalized ?? []).map(normalizeProduct) as Product[];
}
