import { prisma } from "../config/prisma.js";
import { ProductViewHistory } from "../models/mongoModels.js";
import mongoose from "mongoose";

export async function getSimilarProducts(productId) {
  const product = await prisma.product.findFirst({ where: { OR: [{ id: productId }, { legacy_id: Number(productId) || -1 }] } });
  if (!product) return [];
  return prisma.product.findMany({
    where: {
      id: { not: product.id },
      OR: [{ category_id: product.category_id }, { brand_id: product.brand_id }, { type: product.type }],
    },
    take: 4,
  });
}

export async function getFrequentlyBoughtTogether(productId) {
  const similar = await getSimilarProducts(productId);
  return similar.slice(0, 3);
}

export async function getPersonalizedRecommendations(userId) {
  const views =
    mongoose.connection.readyState === 1
      ? await ProductViewHistory.find({ userId }).sort({ createdAt: -1 }).limit(5).catch(() => [])
      : [];
  if (views.length > 0) {
    return getSimilarProducts(String(views[0].productId));
  }
  return prisma.product.findMany({ orderBy: { created_at: "desc" }, take: 4 });
}

export function trackProductView({ userId, productId, productName }) {
  if (mongoose.connection.readyState === 1) {
    ProductViewHistory.create({ userId, productId, productName }).catch(() => {});
  }
}
