import { prisma } from "../config/prisma.js";
import { AIChatHistory } from "../models/mongoModels.js";

const productInclude = {
  category: true,
  brand: true,
  images: { orderBy: { sort_order: "asc" } },
  inventory: true,
  _count: { select: { reviews: true, order_items: true, wishlist_items: true } },
};

export function findAssistantProducts() {
  return prisma.product.findMany({
    where: { is_active: true },
    include: productInclude,
    orderBy: { name: "asc" },
    take: 100,
  });
}

export async function saveAIChatHistory({ userId, question, response, extractedIntent, productIds }) {
  try {
    await AIChatHistory.create({
      userId,
      question,
      response,
      extractedIntent,
      productIds,
    });
  } catch (_error) {
    // MongoDB is optional locally; the assistant should continue to work with local recommendations.
  }
}

export async function getAIChatAnalytics() {
  try {
    const [totalChats, commonQuestions, requestedCategories] = await Promise.all([
      AIChatHistory.countDocuments(),
      AIChatHistory.aggregate([
        { $group: { _id: "$question", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      AIChatHistory.aggregate([
        { $group: { _id: "$extractedIntent.category", count: { $sum: 1 } } },
        { $match: { _id: { $ne: null } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    return {
      totalChats,
      commonQuestions: commonQuestions.map((item) => ({ question: item._id, count: item.count })),
      requestedCategories: requestedCategories.map((item) => ({ category: item._id, count: item.count })),
    };
  } catch (_error) {
    return { totalChats: 0, commonQuestions: [], requestedCategories: [] };
  }
}
