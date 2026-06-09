import { prisma } from "../config/prisma.js";
import { ProductViewHistory, UserActivity } from "../models/mongoModels.js";
import mongoose from "mongoose";

const productInclude = {
  product: {
    include: {
      category: true,
      brand: true,
    },
  },
  order: true,
};

export function countUsers(where = {}) {
  return prisma.user.count({ where });
}

export function countProducts(where = {}) {
  return prisma.product.count({ where });
}

export function countOrders(where = {}) {
  return prisma.order.count({ where });
}

export function countActiveCustomers(orderWhere = {}) {
  return prisma.order.findMany({
    where: orderWhere,
    select: { user_id: true },
    distinct: ["user_id"],
  });
}

export function sumCompletedRevenue(paymentWhere = {}) {
  return prisma.payment.aggregate({
    where: { status: "COMPLETED", ...paymentWhere },
    _sum: { amount: true },
    _avg: { amount: true },
    _count: { id: true },
  });
}

export function listOrders(where = {}) {
  return prisma.order.findMany({
    where,
    select: {
      id: true,
      status: true,
      total: true,
      created_at: true,
      user_id: true,
    },
    orderBy: { created_at: "asc" },
  });
}

export function listCompletedPayments(where = {}) {
  return prisma.payment.findMany({
    where: { status: "COMPLETED", ...where },
    select: {
      id: true,
      amount: true,
      paid_at: true,
      created_at: true,
      order_id: true,
    },
    orderBy: { created_at: "asc" },
  });
}

export function listUsers(where = {}) {
  return prisma.user.findMany({
    where,
    select: { id: true, created_at: true },
    orderBy: { created_at: "asc" },
  });
}

export function listOrderItems(orderWhere = {}) {
  return prisma.orderItem.findMany({
    where: { order: { is: orderWhere } },
    include: productInclude,
  });
}

export async function getMongoAnalytics({ dateFrom, dateTo }) {
  if (mongoose.connection.readyState !== 1) {
    return { productViews: 0, userActivities: 0, activeMongoUsers: 0 };
  }

  const createdAt = {
    ...(dateFrom ? { $gte: dateFrom } : {}),
    ...(dateTo ? { $lte: dateTo } : {}),
  };
  const filter = Object.keys(createdAt).length ? { createdAt } : {};
  const [productViews, userActivities, viewUsers, activityUsers] = await Promise.all([
    ProductViewHistory.countDocuments(filter).catch(() => 0),
    UserActivity.countDocuments(filter).catch(() => 0),
    ProductViewHistory.distinct("userId", filter).catch(() => []),
    UserActivity.distinct("userId", filter).catch(() => []),
  ]);

  return {
    productViews,
    userActivities,
    activeMongoUsers: new Set([...viewUsers, ...activityUsers].filter(Boolean)).size,
  };
}
