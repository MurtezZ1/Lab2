import type { Product } from "@/types";

export type DemandLevel = "High" | "Medium" | "Low";

export type DemandForecast = {
  level: DemandLevel;
  confidence: number;
  score: number;
  stockAction: string;
  inventorySignal: "success" | "warning" | "danger";
};

export function calculateDemandForecast(product: Product): DemandForecast {
  const rating = Number(product.rating_average ?? 0);
  const stock = Number(product.stock_quantity ?? 0);
  const discount = Number(product.discount_percentage ?? 0);
  const aiScore = Number(product.aiProductScore ?? product.recommendationScore ?? product.similarityScore ?? 0);
  const specCompleteness = [
    product.processor,
    product.ram_size,
    product.storage,
    product.display,
    product.battery,
    product.camera,
    product.additional_features,
  ].filter(Boolean).length;

  const stockSignal = stock <= 5 ? 22 : stock <= 15 ? 16 : stock <= 35 ? 10 : 4;
  const ratingSignal = Math.min(26, rating * 5.2);
  const discountSignal = Math.min(12, discount * 0.45);
  const specSignal = Math.min(14, specCompleteness * 2);
  const aiSignal = Math.min(16, aiScore * 0.16);
  const priceSignal = product.price >= 900 ? 6 : product.price >= 500 ? 9 : 12;
  const score = Math.round(Math.min(100, stockSignal + ratingSignal + discountSignal + specSignal + aiSignal + priceSignal + 18));

  const level: DemandLevel = score >= 72 ? "High" : score >= 48 ? "Medium" : "Low";
  const confidence = Math.max(68, Math.min(96, Math.round(score * 0.72 + specCompleteness * 3 + (rating > 0 ? 8 : 0))));

  if (stock <= 0) {
    return {
      level,
      confidence,
      score,
      stockAction: "Out of stock. Replenish before promoting this product.",
      inventorySignal: "danger",
    };
  }

  if (level === "High" && stock <= 12) {
    return {
      level,
      confidence,
      score,
      stockAction: "Restock soon. Demand is strong and available inventory is limited.",
      inventorySignal: "danger",
    };
  }

  if (level === "Low" && stock >= 25) {
    return {
      level,
      confidence,
      score,
      stockAction: "Recommend 10-15% discount to reduce slow-moving stock.",
      inventorySignal: "warning",
    };
  }

  if (level === "High") {
    return {
      level,
      confidence,
      score,
      stockAction: "Keep visibility high and monitor inventory daily.",
      inventorySignal: "success",
    };
  }

  if (level === "Medium") {
    return {
      level,
      confidence,
      score,
      stockAction: "Monitor sales velocity and reorder when stock falls below 10.",
      inventorySignal: "warning",
    };
  }

  return {
    level,
    confidence,
    score,
    stockAction: "Use bundle offers or seasonal promotion to improve demand.",
    inventorySignal: "warning",
  };
}

