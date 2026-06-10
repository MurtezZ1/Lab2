import { env } from "../config/env.js";
import { findAssistantProducts, getAIChatAnalytics, saveAIChatHistory } from "../repositories/aiRepository.js";
import { serializeProduct } from "../utils/serializers.js";

const categoryAliases = {
  laptop: ["laptop", "programming", "machine learning", "gaming laptop", "notebook"],
  smartphone: ["phone", "smartphone", "camera phone", "samsung phones", "iphone"],
  headphones: ["headphones", "travel", "noise cancelling", "wireless audio"],
  camera: ["camera", "photography", "creator"],
  tablet: ["tablet", "ipad", "surface"],
  monitor: ["monitor", "display", "screen"],
  speaker: ["speaker", "bluetooth speaker"],
  "gaming console": ["gaming console", "console", "nintendo"],
  tv: ["tv", "television", "oled"],
  "fitness tracker": ["fitness", "tracker", "watch"],
};

const brandAliases = ["apple", "samsung", "sony", "lenovo", "hp", "dell", "acer", "fitbit", "canon", "nintendo", "lg", "bose", "microsoft"];

export async function answerShoppingAssistant({ message, userId = null }) {
  const products = (await findAssistantProducts()).map(serializeProduct);
  const intent = extractIntent(message);
  const ranked = rankProducts(products, intent);
  const topProducts = ranked.slice(0, 3);
  const followUp = getFollowUpQuestion(intent, ranked.length);
  const openAIAnswer = await getOpenAIAnswer({ message, intent, products: topProducts }).catch(() => "");
  const answer = openAIAnswer || buildLocalAnswer({ intent, products: topProducts, followUp });

  await saveAIChatHistory({
    userId,
    question: message,
    response: answer,
    extractedIntent: intent,
    productIds: topProducts.map((product) => String(product.uuid ?? product.id)),
  });

  return {
    answer,
    products: topProducts,
    extracted: intent,
    followUp,
    mode: env.openAIApiKey ? "openai" : "local",
  };
}

export function getAIAnalytics() {
  return getAIChatAnalytics();
}

function extractIntent(message = "") {
  const text = message.toLowerCase();
  const budgetMatch = text.match(/(?:under|below|less than|max|budget|up to)\s*(?:€|eur|euro|euros|\$)?\s*(\d+(?:\.\d+)?)/i)
    ?? text.match(/(\d+(?:\.\d+)?)\s*(?:€|eur|euro|euros|\$)/i);
  const budget = budgetMatch ? Number(budgetMatch[1]) : null;
  const category = Object.entries(categoryAliases).find(([, aliases]) => aliases.some((alias) => text.includes(alias)))?.[0] ?? null;
  const brand = brandAliases.find((item) => text.includes(item)) ?? null;
  const purpose = extractPurpose(text);
  const features = extractFeatures(text);

  return {
    category,
    budget,
    brand,
    purpose,
    features,
    rawMessage: message,
  };
}

function extractPurpose(text) {
  if (text.includes("programming") || text.includes("coding") || text.includes("developer")) return "programming";
  if (text.includes("machine learning") || text.includes("ai") || text.includes("data science")) return "machine learning";
  if (text.includes("gaming") || text.includes("game")) return "gaming";
  if (text.includes("travel") || text.includes("trip")) return "travel";
  if (text.includes("camera") || text.includes("photo") || text.includes("video")) return "camera";
  if (text.includes("budget") || text.includes("cheap") || text.includes("value")) return "budget";
  return null;
}

function extractFeatures(text) {
  return [
    ["battery", "long battery"],
    ["camera", "best camera"],
    ["storage", "storage"],
    ["ram", "ram"],
    ["noise cancellation", "noise cancelling"],
    ["portable", "portable"],
    ["oled", "oled"],
  ]
    .filter(([feature, alias]) => text.includes(feature) || text.includes(alias))
    .map(([feature]) => feature);
}

function rankProducts(products, intent) {
  return products
    .map((product) => ({ product, score: scoreProduct(product, intent) }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((item) => ({
      ...item.product,
      aiProductScore: Math.round(item.score),
    }));
}

function scoreProduct(product, intent) {
  const searchable = [
    product.name,
    product.manufacturer,
    product.model,
    product.type,
    product.description,
    product.processor,
    product.ram_size,
    product.storage,
    product.display,
    product.battery,
    product.camera,
    product.additional_features,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let score = 20;
  if (intent.category && (product.type?.toLowerCase() === intent.category || searchable.includes(intent.category))) score += 35;
  if (intent.brand && product.manufacturer?.toLowerCase() === intent.brand) score += 25;
  if (intent.budget) {
    if (Number(product.price) <= intent.budget) score += 30;
    else score -= Math.min(40, (Number(product.price) - intent.budget) / 20);
  }
  if (intent.purpose) score += purposeScore(searchable, intent.purpose);
  for (const feature of intent.features) {
    if (searchable.includes(feature)) score += 10;
  }
  score += Number(product.rating_average ?? 0) * 5;
  score += Math.min(10, Number(product.stock_quantity ?? 0) / 3);
  score += Math.min(10, Number(product.discount_percentage ?? 0));
  return score;
}

function purposeScore(text, purpose) {
  if (purpose === "programming") {
    return ["core i5", "core i7", "ryzen", "m2", "16gb", "ssd", "laptop"].some((term) => text.includes(term)) ? 25 : 0;
  }
  if (purpose === "machine learning") {
    return ["m2", "core i7", "16gb", "ssd", "laptop"].some((term) => text.includes(term)) ? 28 : 0;
  }
  if (purpose === "gaming") {
    return ["gaming", "240hz", "oled", "console", "ryzen", "odyssey"].some((term) => text.includes(term)) ? 25 : 0;
  }
  if (purpose === "travel") {
    return ["noise", "headphones", "portable", "battery", "bluetooth"].some((term) => text.includes(term)) ? 24 : 0;
  }
  if (purpose === "camera") {
    return ["camera", "mp", "4k", "photography", "sensor"].some((term) => text.includes(term)) ? 24 : 0;
  }
  if (purpose === "budget") return 12;
  return 0;
}

function getFollowUpQuestion(intent, resultCount) {
  if (!intent.category) return "What type of product do you want: laptop, phone, headphones, tablet, camera, or something else?";
  if (!intent.budget) return "What is your budget range?";
  if (!intent.purpose && ["laptop", "smartphone", "headphones"].includes(intent.category)) {
    return "Will you use it mostly for gaming, programming, travel, camera quality, or everyday use?";
  }
  if (!resultCount) return "Can you increase the budget or choose another brand/category?";
  return "";
}

function buildLocalAnswer({ intent, products, followUp }) {
  if (!products.length) {
    return `I could not find a strong match for that request. ${followUp || "Try a different budget, brand, or product type."}`;
  }

  const summary = products
    .map((product, index) => `${index + 1}. ${product.name} - ${formatMoney(product.price)} (${product.manufacturer}, score ${product.aiProductScore})`)
    .join("\n");
  const reason = intent.budget
    ? `I focused on products around or below ${formatMoney(intent.budget)} and ranked them by price, specs, stock, rating, and match to your request.`
    : "I ranked products by category match, specs, stock, rating, and value.";
  return `Based on your request, I recommend:\n${summary}\n\n${reason}${followUp ? `\n\n${followUp}` : ""}`;
}

async function getOpenAIAnswer({ message, intent, products }) {
  if (!env.openAIApiKey || !products.length) return "";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openAIApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.openAIModel,
      messages: [
        {
          role: "system",
          content: "You are a concise shopping assistant for an electronics store. Recommend only the provided products and explain why.",
        },
        {
          role: "user",
          content: JSON.stringify({ message, intent, products: products.map((product) => ({ name: product.name, price: product.price, brand: product.manufacturer, category: product.type, specs: product.description })) }),
        },
      ],
      temperature: 0.3,
      max_tokens: 220,
    }),
  });

  if (!response.ok) return "";
  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

function formatMoney(value) {
  return `€${Number(value).toFixed(2)}`;
}
