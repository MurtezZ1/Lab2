import { prisma } from "../config/prisma.js";
import { ProductViewHistory } from "../models/mongoModels.js";
import { serializeProduct } from "../utils/serializers.js";
import mongoose from "mongoose";

const recommendationInclude = {
  category: true,
  brand: true,
  images: { orderBy: { sort_order: "asc" } },
  inventory: true,
};

const featureFields = [
  "processor",
  "ram_size",
  "storage",
  "display",
  "os",
  "battery",
  "weight",
  "dimensions",
  "keyboard",
  "ports",
  "connectivity",
  "camera",
  "additional_features",
  "type",
  "model",
];

export async function getSimilarProducts(productId) {
  const numericProductId = Number(productId);
  const product = await prisma.product.findFirst({
    where: Number.isInteger(numericProductId)
      ? { OR: [{ id: String(productId) }, { legacy_id: numericProductId }] }
      : { id: String(productId) },
    include: recommendationInclude,
  });
  if (!product) return [];

  const candidates = await prisma.product.findMany({
    where: {
      is_active: true,
      id: { not: product.id },
    },
    include: recommendationInclude,
    take: 80,
  });

  return candidates
    .map((candidate) => ({
      ...serializeProduct(candidate),
      similarityScore: calculateSimilarityScore(product, candidate),
    }))
    .sort((left, right) => right.similarityScore - left.similarityScore)
    .slice(0, 4);
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
  const latestProducts = await prisma.product.findMany({
    where: { is_active: true },
    include: recommendationInclude,
    orderBy: { created_at: "desc" },
    take: 4,
  });
  return latestProducts.map((product) => ({ ...serializeProduct(product), similarityScore: 0 }));
}

export function trackProductView({ userId, productId, productName }) {
  if (mongoose.connection.readyState === 1) {
    ProductViewHistory.create({ userId, productId, productName }).catch(() => {});
  }
}

function calculateSimilarityScore(product, candidate) {
  const categoryScore = product.category_id && product.category_id === candidate.category_id ? 1 : 0;
  const brandScore = product.brand_id && product.brand_id === candidate.brand_id ? 1 : 0;
  const priceScore = numericCloseness(product.price, candidate.price);
  const ratingScore = numericCloseness(product.rating_average, candidate.rating_average, 5);
  const featureScore = featureSimilarity(product, candidate);

  const score =
    categoryScore * 0.25 +
    brandScore * 0.2 +
    priceScore * 0.15 +
    ratingScore * 0.15 +
    featureScore * 0.25;

  return Number(score.toFixed(4));
}

function numericCloseness(left, right, fixedScale = null) {
  const leftValue = Number(left ?? 0);
  const rightValue = Number(right ?? 0);
  if (!leftValue && !rightValue) return 1;

  const scale = fixedScale ?? Math.max(Math.abs(leftValue), Math.abs(rightValue), 1);
  const closeness = 1 - Math.abs(leftValue - rightValue) / scale;
  return Math.max(0, Math.min(1, closeness));
}

function featureSimilarity(product, candidate) {
  const targetTokens = productFeatureTokens(product);
  const candidateTokens = productFeatureTokens(candidate);
  if (!targetTokens.size && !candidateTokens.size) return 0;

  const intersection = [...targetTokens].filter((token) => candidateTokens.has(token)).length;
  const union = new Set([...targetTokens, ...candidateTokens]).size;
  return union ? intersection / union : 0;
}

function productFeatureTokens(product) {
  const text = featureFields
    .map((field) => product[field])
    .filter(Boolean)
    .join(" ");

  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .filter((token) => token.length > 1),
  );
}
