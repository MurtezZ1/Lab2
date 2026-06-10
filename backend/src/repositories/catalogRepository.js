import { prisma } from "../config/prisma.js";

const productInclude = {
  category: true,
  brand: true,
  images: { orderBy: { sort_order: "asc" } },
  inventory: true,
};

export async function findProductIdentifier(identifier) {
  const numericId = Number(identifier);
  return prisma.product.findFirst({
    where: Number.isInteger(numericId)
      ? { OR: [{ legacy_id: numericId }, { id: String(identifier) }] }
      : { id: String(identifier) },
    include: productInclude,
  });
}

export async function listProducts(query = {}) {
  const page = Math.max(Number(query.page ?? 1), 1);
  const pageSize = Math.min(Math.max(Number(query.pageSize ?? query.take ?? 12), 1), 100);
  const search = String(query.search ?? query.query ?? query.q ?? "").trim();
  const sort = String(query.sort ?? query.sortBy ?? "name");
  const order = String(query.order ?? "asc").toLowerCase() === "desc" ? "desc" : "asc";
  const where = {
    is_active: query.includeInactive === "true" ? undefined : true,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { manufacturer: { contains: search, mode: "insensitive" } },
            { model: { contains: search, mode: "insensitive" } },
            { type: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(query.category ? { OR: [{ category_id: String(query.category) }, { category: { slug: String(query.category) } }, { type: String(query.category) }] } : {}),
    ...(query.brand ? { OR: [{ brand_id: String(query.brand) }, { brand: { slug: String(query.brand) } }, { manufacturer: String(query.brand) }] } : {}),
  };

  const orderBy =
    sort === "price-low"
      ? { price: "asc" }
      : sort === "price-high"
        ? { price: "desc" }
        : sort === "brand"
          ? { manufacturer: order }
          : sort === "created"
            ? { created_at: "desc" }
            : { name: order };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function createProduct(data, userId) {
  return prisma.product.create({
    data: productData(data, userId),
    include: productInclude,
  });
}

export async function updateProduct(id, data, userId) {
  const product = await findProductIdentifier(id);
  if (!product) return null;
  return prisma.product.update({
    where: { id: product.id },
    data: productData(data, userId, true),
    include: productInclude,
  });
}

export async function deleteProduct(id, userId) {
  const product = await findProductIdentifier(id);
  if (!product) return null;
  return prisma.product.update({
    where: { id: product.id },
    data: { is_active: false, updated_by: userId },
    include: productInclude,
  });
}

export async function listCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function upsertCategory(data, userId) {
  return prisma.category.upsert({
    where: { slug: data.slug ?? slugify(data.name) },
    update: { name: data.name, description: data.description, is_active: data.is_active ?? true, updated_by: userId },
    create: { name: data.name, slug: data.slug ?? slugify(data.name), description: data.description, created_by: userId, updated_by: userId },
  });
}

export async function listBrands() {
  return prisma.brand.findMany({ orderBy: { name: "asc" } });
}

export async function upsertBrand(data, userId) {
  return prisma.brand.upsert({
    where: { slug: data.slug ?? slugify(data.name) },
    update: { name: data.name, description: data.description, is_active: data.is_active ?? true, updated_by: userId },
    create: { name: data.name, slug: data.slug ?? slugify(data.name), description: data.description, created_by: userId, updated_by: userId },
  });
}

export async function createProductImage(productId, data, userId) {
  const product = await findProductIdentifier(productId);
  if (!product) return null;
  return prisma.productImage.create({
    data: {
      product_id: product.id,
      url: data.url,
      alt_text: data.alt_text,
      sort_order: Number(data.sort_order ?? 0),
      is_primary: Boolean(data.is_primary),
      created_by: userId,
      updated_by: userId,
    },
  });
}

export async function updateInventory(productId, data, userId) {
  const product = await findProductIdentifier(productId);
  if (!product) return null;
  return prisma.inventory.upsert({
    where: { product_id: product.id },
    update: {
      stock_quantity: Number(data.stock_quantity ?? data.stockQuantity ?? 0),
      reserved_qty: Number(data.reserved_qty ?? data.reservedQty ?? 0),
      reorder_level: Number(data.reorder_level ?? data.reorderLevel ?? 5),
      updated_by: userId,
    },
    create: {
      product_id: product.id,
      stock_quantity: Number(data.stock_quantity ?? data.stockQuantity ?? 0),
      reserved_qty: Number(data.reserved_qty ?? data.reservedQty ?? 0),
      reorder_level: Number(data.reorder_level ?? data.reorderLevel ?? 5),
      created_by: userId,
      updated_by: userId,
    },
  });
}

function productData(data, userId, update = false) {
  const name = data.name ?? data.ProductName;
  const slug = data.slug ?? (name ? slugify(name) : undefined);
  return {
    ...(name ? { name } : {}),
    ...(data.category_id || data.categoryId ? { category_id: data.category_id ?? data.categoryId } : {}),
    ...(data.brand_id || data.brandId ? { brand_id: data.brand_id ?? data.brandId } : {}),
    ...(data.manufacturer ? { manufacturer: data.manufacturer } : {}),
    ...(data.model ? { model: data.model } : {}),
    ...(data.type ? { type: data.type } : {}),
    ...(data.year != null ? { year: Number(data.year) } : {}),
    ...(slug ? { slug } : {}),
    ...(data.sku ? { sku: data.sku } : {}),
    ...(data.description ? { description: data.description } : {}),
    ...(data.price != null ? { price: Number(data.price) } : {}),
    ...(data.processor ? { processor: data.processor } : {}),
    ...(data.ram_size ? { ram_size: data.ram_size } : {}),
    ...(data.storage ? { storage: data.storage } : {}),
    ...(data.display ? { display: data.display } : {}),
    ...(data.os ? { os: data.os } : {}),
    ...(data.battery ? { battery: data.battery } : {}),
    ...(data.weight ? { weight: data.weight } : {}),
    ...(data.dimensions ? { dimensions: data.dimensions } : {}),
    ...(data.keyboard ? { keyboard: data.keyboard } : {}),
    ...(data.ports ? { ports: data.ports } : {}),
    ...(data.connectivity ? { connectivity: data.connectivity } : {}),
    ...(data.camera ? { camera: data.camera } : {}),
    ...(data.additional_features ? { additional_features: data.additional_features } : {}),
    ...(data.image ? { image: data.image } : {}),
    ...(data.discount_percentage != null ? { discount_percentage: Number(data.discount_percentage) } : {}),
    ...(data.rating_average != null ? { rating_average: Number(data.rating_average) } : {}),
    ...(data.is_active != null ? { is_active: Boolean(data.is_active) } : {}),
    ...(update ? { updated_by: userId } : { created_by: userId, updated_by: userId }),
  };
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
