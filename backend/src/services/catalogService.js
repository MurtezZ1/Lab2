import {
  createProduct,
  createProductImage,
  deleteProduct,
  findProductIdentifier,
  listBrands,
  listCategories,
  listProducts,
  updateInventory,
  updateProduct,
  upsertBrand,
  upsertCategory,
} from "../repositories/catalogRepository.js";
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

export async function createCatalogProduct(data, userId) {
  return serializeProduct(await createProduct(data, userId));
}

export async function updateCatalogProduct(id, data, userId) {
  const product = await updateProduct(id, data, userId);
  if (!product) throw new AppError("Product not found.", 404);
  return serializeProduct(product);
}

export async function removeCatalogProduct(id, userId) {
  const product = await deleteProduct(id, userId);
  if (!product) throw new AppError("Product not found.", 404);
  return serializeProduct(product);
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
