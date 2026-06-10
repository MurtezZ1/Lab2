import { prisma } from "../config/prisma.js";
import { SearchHistory } from "../models/mongoModels.js";
import mongoose from "mongoose";

const contains = (query) => ({ contains: query, mode: "insensitive" });

export async function advancedSearch({ scope = "products", query = "", q = "", userId = null }) {
  query = String(query || q || "").trim();
  if (query) {
    if (mongoose.connection.readyState === 1) {
      SearchHistory.create({ userId, scope, query }).catch(() => {});
    }
  }

  if (scope === "orders") {
    return prisma.order.findMany({ where: { order_number: contains(query) }, take: 20 });
  }
  if (scope === "users") {
    return prisma.user.findMany({ where: { OR: [{ email: contains(query) }, { username: contains(query) }] }, take: 20 });
  }
  if (scope === "reviews") {
    return prisma.review.findMany({ where: { OR: [{ title: contains(query) }, { comment: contains(query) }] }, take: 20 });
  }
  if (scope === "supportTickets") {
    return prisma.supportTicket.findMany({ where: { subject: contains(query) }, take: 20 });
  }
  return prisma.product.findMany({
    where: {
      OR: [{ name: contains(query) }, { manufacturer: contains(query) }, { model: contains(query) }],
    },
    take: 20,
  });
}
