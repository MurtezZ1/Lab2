import type { Product, User } from "@/types";
import { apiClient } from "@/services/apiClient";

export async function getWishlist(user: User | null): Promise<Product[]> {
  if (!user) return [];
  const { data } = await apiClient.get("/wishlist");
  return data.data;
}

export async function toggleWishlist(user: User | null, product: Product) {
  if (!user) {
    throw new Error("You must be signed in to use the wishlist.");
  }
  const { data } = await apiClient.post("/wishlist", { productId: product.id });
  return data.data as Product[];
}
