import { apiClient } from "@/services/apiClient";

export async function getReviews(productId: number | string) {
  const { data } = await apiClient.get(`/products/${productId}/reviews`);
  return data.data as Array<{ rating: number; comment?: string; title?: string }>;
}

export async function createReview(productId: number | string, input: { rating: number; comment?: string }) {
  const { data } = await apiClient.post(`/products/${productId}/reviews`, input);
  return data.data;
}
