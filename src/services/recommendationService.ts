import { getProducts } from "@/services/productService";

export async function getSimilarProducts(productId?: number) {
  const products = await getProducts();
  const current = products.find((product) => product.id === productId);
  if (!current) return products.slice(0, 4);
  return products
    .filter(
      (product) =>
        product.id !== current.id &&
        (product.type === current.type || product.manufacturer === current.manufacturer),
    )
    .slice(0, 4);
}

export async function getPersonalizedRecommendations() {
  const products = await getProducts();
  return products.slice(0, 4);
}
