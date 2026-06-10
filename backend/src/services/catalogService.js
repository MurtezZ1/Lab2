import {
  createProduct,
  createProductImage,
  deleteProduct,
  findProductIdentifier,
  findProductsForComparison,
  listBrands,
  listCategories,
  listProducts,
  updateInventory,
  updateProduct,
  upsertBrand,
  upsertCategory,
} from "../repositories/catalogRepository.js";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
  recordAuditLogSafe,
} from "./auditLogService.js";
import { notifyAnalyticsDashboardChanged } from "./analyticsService.js";
import { AppError } from "../utils/AppError.js";
import { serializeProduct } from "../utils/serializers.js";

export async function getProducts(query) {
  const result = await listProducts(query);
  return {
    ...result,
    items: result.items.map(serializeProduct),
    pageCount: Math.max(1, Math.ceil(result.total / result.pageSize)),
  };
}

export async function getProduct(id) {
  const product = await findProductIdentifier(id);
  if (!product) throw new AppError("Product not found.", 404);
  return serializeProduct(product);
}

export async function compareProducts(ids = "") {
  const identifiers = String(ids)
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (identifiers.length < 2) throw new AppError("At least 2 products are required for comparison.", 400);

  const products = await findProductsForComparison(identifiers);
  const order = new Map(identifiers.map((id, index) => [id, index]));
  return products
    .map(serializeComparisonProduct)
    .sort((left, right) => {
      const leftIndex = Math.min(
        order.get(String(left.id)) ?? Number.MAX_SAFE_INTEGER,
        order.get(String(left.uuid)) ?? Number.MAX_SAFE_INTEGER,
      );
      const rightIndex = Math.min(
        order.get(String(right.id)) ?? Number.MAX_SAFE_INTEGER,
        order.get(String(right.uuid)) ?? Number.MAX_SAFE_INTEGER,
      );
      return leftIndex - rightIndex;
    });
}

export async function createCatalogProduct(data, userId, auditContext = {}) {
  const product = serializeProduct(await createProduct(data, userId));
  await recordAuditLogSafe({
    userId,
    action: AUDIT_ACTIONS.PRODUCT_CREATE,
    entity: AUDIT_ENTITIES.PRODUCT,
    entityId: product.uuid ?? String(product.id),
    newValue: product,
    ...auditContext,
  });
  notifyAnalyticsDashboardChanged("product_created", { productId: product.uuid ?? product.id }).catch(() => {});
  return product;
}

export async function updateCatalogProduct(id, data, userId, auditContext = {}) {
  const previousProduct = await findProductIdentifier(id);
  if (!previousProduct) throw new AppError("Product not found.", 404);
  const product = await updateProduct(id, data, userId);
  const serializedProduct = serializeProduct(product);
  await recordAuditLogSafe({
    userId,
    action: AUDIT_ACTIONS.PRODUCT_UPDATE,
    entity: AUDIT_ENTITIES.PRODUCT,
    entityId: serializedProduct.uuid ?? String(serializedProduct.id),
    oldValue: serializeProduct(previousProduct),
    newValue: serializedProduct,
    ...auditContext,
  });
  notifyAnalyticsDashboardChanged("product_updated", {
    productId: serializedProduct.uuid ?? serializedProduct.id,
  }).catch(() => {});
  return serializedProduct;
}

export async function removeCatalogProduct(id, userId, auditContext = {}) {
  const previousProduct = await findProductIdentifier(id);
  if (!previousProduct) throw new AppError("Product not found.", 404);
  const product = await deleteProduct(id, userId);
  const serializedProduct = serializeProduct(product);
  await recordAuditLogSafe({
    userId,
    action: AUDIT_ACTIONS.PRODUCT_DELETE,
    entity: AUDIT_ENTITIES.PRODUCT,
    entityId: serializedProduct.uuid ?? String(serializedProduct.id),
    oldValue: serializeProduct(previousProduct),
    newValue: serializedProduct,
    ...auditContext,
  });
  notifyAnalyticsDashboardChanged("product_deleted", {
    productId: serializedProduct.uuid ?? serializedProduct.id,
  }).catch(() => {});
  return serializedProduct;
}

export const getCategories = listCategories;
export const saveCategory = upsertCategory;
export const getBrands = listBrands;
export const saveBrand = upsertBrand;

export async function addProductImage(productId, data, userId) {
  const image = await createProductImage(productId, data, userId);
  if (!image) throw new AppError("Product not found.", 404);
  return image;
}

export async function saveInventory(productId, data, userId) {
  const inventory = await updateInventory(productId, data, userId);
  if (!inventory) throw new AppError("Product not found.", 404);
  return inventory;
}

function serializeComparisonProduct(product) {
  const serialized = serializeProduct(product);
  return {
    ...serialized,
    brand: serialized.brand?.name ?? serialized.manufacturer,
    category: serialized.category?.name ?? serialized.type,
    rating: serialized.rating_average ?? 0,
    reviewsCount: product._count?.reviews ?? 0,
    stock: serialized.stock_quantity ?? 0,
    discount: serialized.discount_percentage ?? 0,
    specifications: {
      processor: serialized.processor,
      ram: serialized.ram_size,
      storage: serialized.storage,
      display: serialized.display,
      os: serialized.os,
      battery: serialized.battery,
      weight: serialized.weight,
      dimensions: serialized.dimensions,
      keyboard: serialized.keyboard,
      ports: serialized.ports,
      connectivity: serialized.connectivity,
      camera: serialized.camera,
    },
    features: serialized.additional_features,
    productImage: serialized.image,
  };
}
