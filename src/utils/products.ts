import type { Product } from "@/types";

type RawProduct = Record<string, unknown>;

const stringifySpec = (value: unknown): string | null => {
  if (value == null) return null;
  return typeof value === "string" ? value : JSON.stringify(value);
};

export const normalizeProduct = (product: RawProduct): Product => ({
  id: Number.isNaN(Number(product.id)) ? String(product.id) : Number(product.id),
  uuid: product.uuid == null ? undefined : String(product.uuid),
  name: String(product.name ?? ""),
  manufacturer: String(product.manufacturer ?? (product.brand as { name?: string } | null)?.name ?? ""),
  model: String(product.model ?? ""),
  type: String(product.type ?? (product.category as { slug?: string; name?: string } | null)?.slug ?? "laptop"),
  year: product.year == null ? null : Number(product.year),
  price: Number(product.price ?? 0),
  processor: product.processor == null ? null : String(product.processor),
  ram_size: product.ram_size == null ? null : String(product.ram_size),
  storage: product.storage == null ? null : String(product.storage),
  display: stringifySpec(product.display),
  os: product.os == null ? null : String(product.os),
  battery: product.battery == null ? null : String(product.battery),
  weight: product.weight == null ? null : String(product.weight),
  dimensions: stringifySpec(product.dimensions),
  keyboard: product.keyboard == null ? null : String(product.keyboard),
  ports: stringifySpec(product.ports),
  connectivity: stringifySpec(product.connectivity),
  camera: stringifySpec(product.camera),
  additional_features: stringifySpec(product.additional_features),
  image: String(product.image ?? "/file.svg"),
  description: product.description == null ? null : String(product.description),
});

export const formatPrice = (price: number) => `$${price.toFixed(2)}`;
