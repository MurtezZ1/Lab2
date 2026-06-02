import axios from "axios";
import type { Product } from "@/types";
import { normalizeProduct } from "@/utils/products";

export async function getProducts(options?: { take?: number }): Promise<Product[]> {
  const { data } = await axios.get<Record<string, unknown>[]>("/sunspot_products.json");
  const products = data.map(normalizeProduct);
  return options?.take ? products.slice(0, options.take) : products;
}

export async function getProductById(id: number): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => product.id === id) ?? null;
}
