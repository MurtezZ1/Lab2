import type { Product } from "@/types";
import { apiClient } from "@/services/apiClient";
import { normalizeProduct } from "@/utils/products";

export type SimilarProduct = Product & {
  similarityScore: number;
};

export type PersonalizedRecommendationBundle = {
  personalizedProducts: Product[];
  frequentlyBoughtTogether: Product[];
  trendingProducts: Product[];
  fallback: boolean;
  signals: string[];
};

export async function getSimilarProducts(productId?: number | string) {
  const { data } = await apiClient.get(`/recommendations/similar/${productId ?? 1}`);
  return (data.data.similarProducts ?? []).map(normalizeProduct) as SimilarProduct[];
}

export async function getPersonalizedRecommendations() {
  const { data } = await apiClient.get("/recommendations/personalized");
  return normalizeRecommendationBundle(data.data);
}

export async function trackProductView(product: Product) {
  await apiClient.post("/recommendations/view", {
    productId: product.uuid ?? product.id,
    productName: product.name,
  }).catch(() => undefined);
}

function normalizeRecommendationBundle(data: Record<string, unknown>): PersonalizedRecommendationBundle {
  return {
    personalizedProducts: normalizeProducts(data.personalizedProducts),
    frequentlyBoughtTogether: normalizeProducts(data.frequentlyBoughtTogether),
    trendingProducts: normalizeProducts(data.trendingProducts),
    fallback: Boolean(data.fallback),
    signals: Array.isArray(data.signals) ? data.signals.map(String) : [],
  };
}

function normalizeProducts(value: unknown) {
  return Array.isArray(value) ? value.map(normalizeProduct) : [];
}
