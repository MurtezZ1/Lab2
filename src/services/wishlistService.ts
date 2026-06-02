import type { Product, User } from "@/types";

const wishlistKey = (user: User | null) => `sunspot_wishlist_${user?.id ?? "guest"}`;

export function getWishlist(user: User | null): Product[] {
  const value = window.localStorage.getItem(wishlistKey(user));
  return value ? (JSON.parse(value) as Product[]) : [];
}

export function toggleWishlist(user: User | null, product: Product) {
  const items = getWishlist(user);
  const exists = items.some((item) => item.id === product.id);
  const nextItems = exists ? items.filter((item) => item.id !== product.id) : [...items, product];
  window.localStorage.setItem(wishlistKey(user), JSON.stringify(nextItems));
  return nextItems;
}
