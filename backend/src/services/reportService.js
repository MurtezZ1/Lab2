import { prisma } from "../config/prisma.js";
import { cacheGet, cacheSet } from "../config/redis.js";

export async function getDashboardStats() {
  const cached = await cacheGet("dashboard:stats");
  if (cached) return cached;

  const [products, users, orders, inventoryAlerts] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.count(),
    prisma.inventory.count({ where: { stock_quantity: { lte: 5 } } }),
  ]);

  const stats = { products, users, orders, inventoryAlerts };
  await cacheSet("dashboard:stats", stats, 300);
  return stats;
}

export async function getReports() {
  const cached = await cacheGet("reports:summary");
  if (cached) return cached;

  const stats = await getDashboardStats();
  const reports = {
    sales: { totalOrders: stats.orders },
    revenue: { totalRevenue: 0 },
    products: { totalProducts: stats.products },
    customers: { totalCustomers: stats.users },
    inventory: { alerts: stats.inventoryAlerts },
  };
  await cacheSet("reports:summary", reports, 300);
  return reports;
}
