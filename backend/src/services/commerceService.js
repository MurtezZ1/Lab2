import { findProductIdentifier } from "../repositories/catalogRepository.js";
import {
  createPayment,
  createReturn,
  createReview,
  createShipment,
  listReturns,
  listReviews,
  listShippingMethods,
  listWishlist,
  toggleWishlistItem,
  upsertShippingMethod,
} from "../repositories/commerceRepository.js";
import { AppError } from "../utils/AppError.js";
import { serializeProduct } from "../utils/serializers.js";

export async function getWishlist(userId) {
  const items = await listWishlist(userId);
  return items.map((item) => serializeProduct(item.product));
}

export async function toggleWishlist(userId, productIdentifier) {
  const product = await findProductIdentifier(productIdentifier);
  if (!product) throw new AppError("Product not found.", 404);
  await toggleWishlistItem(userId, product.id);
  return getWishlist(userId);
}

export async function getProductReviews(productIdentifier) {
  const product = await findProductIdentifier(productIdentifier);
  if (!product) throw new AppError("Product not found.", 404);
  return listReviews(product.id);
}

export async function addProductReview(userId, productIdentifier, data) {
  const product = await findProductIdentifier(productIdentifier);
  if (!product) throw new AppError("Product not found.", 404);
  return createReview(userId, product.id, data);
}

export const addPayment = createPayment;
export const getShippingMethods = listShippingMethods;
export const saveShippingMethod = upsertShippingMethod;
export const addShipment = createShipment;
export const addReturn = createReturn;
export const getReturns = listReturns;
