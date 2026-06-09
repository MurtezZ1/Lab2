import { prisma } from "../config/prisma.js";
import { ProductViewHistory, SearchHistory } from "../models/mongoModels.js";
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

const RECOMMENDATION_LIMIT = 4;

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
    .slice(0, RECOMMENDATION_LIMIT);
}

export async function getFrequentlyBoughtTogether(productId) {
  const similar = await getSimilarProducts(productId);
  return similar.slice(0, 3);
}

export async function getPersonalizedRecommendations(userId) {
  const bundle = await getPersonalizedRecommendationBundle(userId);
  return bundle.personalizedProducts;
}

export async function getPersonalizedRecommendationBundle(userId) {
  const trendingProducts = await getTrendingProducts(RECOMMENDATION_LIMIT);
  if (!userId) {
    return {
      personalizedProducts: trendingProducts,
      frequentlyBoughtTogether: [],
      trendingProducts,
      fallback: true,
      signals: [],
    };
  }

  const signals = await collectUserSignals(userId);
  const seedProductIds = [
    ...signals.purchaseProductIds,
    ...signals.cartProductIds,
    ...signals.wishlistProductIds,
    ...signals.viewProductIds,
    ...signals.searchProductIds,
  ];

  if (!seedProductIds.length) {
    return {
      personalizedProducts: trendingProducts,
      frequentlyBoughtTogether: [],
      trendingProducts,
      fallback: true,
      signals: [],
    };
  }

  const personalizedProducts = await rankPersonalizedProducts(seedProductIds);
  const seedProductId = seedProductIds[0];
  const frequentlyBoughtTogether = seedProductId
    ? await getFrequentlyBoughtTogether(seedProductId)
    : [];

  return {
    personalizedProducts: personalizedProducts.length ? personalizedProducts : trendingProducts,
    frequentlyBoughtTogether,
    trendingProducts,
    fallback: personalizedProducts.length === 0,
    signals: signals.usedSignals,
  };
}

export async function getTrendingProducts(limit = RECOMMENDATION_LIMIT) {
  const orderedRows = await prisma.orderItem.groupBy({
    by: ["product_id"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit * 3,
  });
  const orderedIds = orderedRows.map((row) => row.product_id);
  const productsByOrder = orderedIds.length
    ? await prisma.product.findMany({
        where: { id: { in: orderedIds }, is_active: true },
        include: recommendationInclude,
      })
    : [];
  const orderedProducts = orderedIds
    .map((id) => productsByOrder.find((product) => product.id === id))
    .filter(Boolean)
    .map((product, index) => ({
      ...serializeProduct(product),
      recommendationScore: Number((1 - index / Math.max(orderedIds.length, 1)).toFixed(4)),
    }));

  if (orderedProducts.length >= limit) return orderedProducts.slice(0, limit);

  const remaining = await prisma.product.findMany({
    where: {
      is_active: true,
      id: { notIn: orderedProducts.map((product) => product.uuid ?? String(product.id)) },
    },
    include: recommendationInclude,
    orderBy: [{ rating_average: "desc" }, { created_at: "desc" }],
    take: limit - orderedProducts.length,
  });

  return [
    ...orderedProducts,
    ...remaining.map((product) => ({
      ...serializeProduct(product),
      recommendationScore: Number(product.rating_average ?? 0) / 5,
    })),
  ].slice(0, limit);
}

async function collectUserSignals(userId) {
  const [orders, cart, wishlist, views, searches] = await Promise.all([
    prisma.order.findMany({
      where: { user_id: userId },
      include: { items: true },
      orderBy: { created_at: "desc" },
      take: 10,
    }),
    prisma.cart.findUnique({
      where: { user_id: userId },
      include: { items: true },
    }),
    prisma.wishlist.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      take: 10,
    }),
    mongoose.connection.readyState === 1
      ? ProductViewHistory.find({ userId }).sort({ createdAt: -1 }).limit(10).catch(() => [])
      : [],
    mongoose.connection.readyState === 1
      ? SearchHistory.find({ userId, scope: "products" }).sort({ createdAt: -1 }).limit(8).catch(() => [])
      : [],
  ]);

  const searchProductIds = await productIdsFromSearches(searches);
  const purchaseProductIds = unique(orders.flatMap((order) => order.items.map((item) => item.product_id)));
  const cartProductIds = unique(cart?.items?.map((item) => item.product_id) ?? []);
  const wishlistProductIds = unique(wishlist.map((item) => item.product_id));
  const viewProductIds = unique(views.map((view) => String(view.productId)));

  return {
    purchaseProductIds,
    cartProductIds,
    wishlistProductIds,
    viewProductIds,
    searchProductIds,
    usedSignals: [
      ...(purchaseProductIds.length ? ["Purchase History"] : []),
      ...(cartProductIds.length ? ["Cart History"] : []),
      ...(wishlistProductIds.length ? ["Wishlist"] : []),
      ...(viewProductIds.length ? ["Product Views"] : []),
      ...(searchProductIds.length ? ["Search History"] : []),
    ],
  };
}

async function rankPersonalizedProducts(seedProductIds) {
  const seedProducts = await prisma.product.findMany({
    where: { OR: seedProductIds.map(productIdentifierWhere) },
    include: recommendationInclude,
  });
  if (!seedProducts.length) return [];

  const candidates = await prisma.product.findMany({
    where: {
      is_active: true,
      id: { notIn: seedProducts.map((product) => product.id) },
    },
    include: recommendationInclude,
    take: 120,
  });

  return candidates
    .map((candidate) => {
      const score = Math.max(
        ...seedProducts.map((seedProduct) => calculateSimilarityScore(seedProduct, candidate)),
      );
      return {
        ...serializeProduct(candidate),
        recommendationScore: score,
      };
    })
    .sort((left, right) => right.recommendationScore - left.recommendationScore)
    .slice(0, RECOMMENDATION_LIMIT);
}

async function productIdsFromSearches(searches) {
  const queries = unique(searches.map((search) => String(search.query ?? "").trim()).filter(Boolean));
  if (!queries.length) return [];

  const products = await prisma.product.findMany({
    where: {
      is_active: true,
      OR: queries.flatMap((query) => [
        { name: { contains: query, mode: "insensitive" } },
        { manufacturer: { contains: query, mode: "insensitive" } },
        { model: { contains: query, mode: "insensitive" } },
        { type: { contains: query, mode: "insensitive" } },
      ]),
    },
    select: { id: true },
    take: 12,
  });

  return products.map((product) => product.id);
}

function productIdentifierWhere(productId) {
  const numericProductId = Number(productId);
  return Number.isInteger(numericProductId)
    ? { OR: [{ id: String(productId) }, { legacy_id: numericProductId }] }
    : { id: String(productId) };
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
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
