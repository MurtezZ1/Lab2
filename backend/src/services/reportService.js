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

export async function getReports(filters = {}) {
  const cacheKey = `reports:summary:${JSON.stringify(filters)}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const dateWhere = {
    ...(filters.dateFrom ? { gte: new Date(filters.dateFrom) } : {}),
    ...(filters.dateTo ? { lte: new Date(filters.dateTo) } : {}),
  };
  const orderWhere = {
    ...(Object.keys(dateWhere).length ? { created_at: dateWhere } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.customerId ? { user_id: filters.customerId } : {}),
  };
  const productWhere = {
    ...(filters.categoryId ? { category_id: filters.categoryId } : {}),
    ...(filters.productId ? { id: filters.productId } : {}),
  };

  const [stats, revenue, ordersByStatus, topProducts, lowInventory] = await Promise.all([
    getDashboardStats(),
    prisma.order.aggregate({ where: orderWhere, _sum: { total: true, subtotal: true, tax_total: true } }),
    prisma.order.groupBy({ by: ["status"], where: orderWhere, _count: { id: true }, _sum: { total: true } }),
    prisma.orderItem.groupBy({
      by: ["product_id"],
      where: filters.productId ? { product_id: filters.productId } : {},
      _sum: { quantity: true, total_price: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
    }),
    prisma.inventory.findMany({
      where: { stock_quantity: { lte: 5 }, product: productWhere },
      include: { product: true },
      orderBy: { stock_quantity: "asc" },
      take: 20,
    }),
  ]);

  const reports = {
    sales: {
      totalOrders: stats.orders,
      filteredOrders: ordersByStatus.reduce((sum, row) => sum + row._count.id, 0),
      byStatus: ordersByStatus.map((row) => ({
        status: row.status,
        orders: row._count.id,
        revenue: Number(row._sum.total ?? 0),
      })),
    },
    revenue: {
      totalRevenue: Number(revenue._sum.total ?? 0),
      subtotal: Number(revenue._sum.subtotal ?? 0),
      tax: Number(revenue._sum.tax_total ?? 0),
    },
    products: {
      totalProducts: stats.products,
      topProducts: topProducts.map((row) => ({
        productId: row.product_id,
        unitsSold: row._sum.quantity ?? 0,
        revenue: Number(row._sum.total_price ?? 0),
      })),
    },
    customers: { totalCustomers: stats.users },
    inventory: {
      alerts: stats.inventoryAlerts,
      lowStock: lowInventory.map((item) => ({
        productId: item.product_id,
        name: item.product.name,
        stockQuantity: item.stock_quantity,
        reorderLevel: item.reorder_level,
      })),
    },
  };
  await cacheSet(cacheKey, reports, 300);
  return reports;
}
