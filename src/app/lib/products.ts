import fallbackProductsJson from "../../../public/old_php_backup/data.json";
import { prisma } from "@/lib/prisma";

type FallbackProduct = (typeof fallbackProductsJson)[number];

export type StoreProduct = {
  id: number;
  name: string;
  manufacturer: string;
  model: string;
  type: string;
  year: number | null;
  price: number;
  processor: string | null;
  ram_size: string | null;
  storage: string | null;
  display: string | null;
  os: string | null;
  battery: string | null;
  weight: string | null;
  dimensions: string | null;
  keyboard: string | null;
  ports: string | null;
  connectivity: string | null;
  camera: string | null;
  additional_features: string | null;
  image: string;
  description: string | null;
};

const stringifySpec = (value: unknown): string | null => {
  if (value == null) return null;
  return typeof value === "string" ? value : JSON.stringify(value);
};

const normalizeFallbackProduct = (product: FallbackProduct): StoreProduct => ({
  id: product.id,
  name: product.name,
  manufacturer: product.manufacturer,
  model: product.model,
  type: product.type,
  year: product.year ?? null,
  price: Number(product.price),
  processor: product.processor ?? null,
  ram_size: product.ram_size ?? null,
  storage: product.storage ?? null,
  display: stringifySpec(product.display),
  os: product.os ?? null,
  battery: product.battery ?? null,
  weight: product.weight ?? null,
  dimensions: stringifySpec(product.dimensions),
  keyboard: product.keyboard ?? null,
  ports: stringifySpec(product.ports),
  connectivity: stringifySpec(product.connectivity),
  camera: stringifySpec(product.camera),
  additional_features: stringifySpec(product.additional_features),
  image: product.image,
  description: product.description ?? null,
});

const fallbackProducts = fallbackProductsJson.map(normalizeFallbackProduct);

const normalizePrismaProduct = (product: Omit<StoreProduct, "type"> & { type?: string }): StoreProduct => ({
  ...product,
  type: product.type ?? "laptop",
  price: Number(product.price),
});

export async function getProducts(options?: { take?: number }) {
  try {
    const products = await prisma.products.findMany({
      take: options?.take,
    });

    return products.map(normalizePrismaProduct);
  } catch {
    return options?.take ? fallbackProducts.slice(0, options.take) : fallbackProducts;
  }
}

export async function getProductById(id: number) {
  try {
    const product = await prisma.products.findUnique({
      where: { id },
    });

    return product ? normalizePrismaProduct(product) : null;
  } catch {
    return fallbackProducts.find((product) => product.id === id) ?? null;
  }
}
