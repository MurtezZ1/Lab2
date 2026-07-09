import { getMongoStatus } from "../config/mongo.js";
import { prisma } from "../config/prisma.js";
import { getRedisStatus } from "../config/redis.js";

export async function getSystemMonitor() {
  const generatedAt = new Date().toISOString();
  const [database, totals, recentAuditLogs, paymentIssues, orderIssues, catalogIssues] = await Promise.all([
    checkDatabase(),
    getTotals(),
    getRecentAuditLogs(),
    getPaymentIssues(),
    getOrderIssues(),
    getCatalogIssues(),
  ]);

  return {
    generatedAt,
    services: {
      database,
      mongo: serviceStatus({
        name: "MongoDB",
        status: getMongoStatus().connected ? "online" : "fallback",
        message: getMongoStatus().connected
          ? "MongoDB is connected for activity tracking."
          : "MongoDB fallback mode is active locally.",
      }),
      redis: serviceStatus({
        name: "Redis",
        status: getRedisStatus().connected ? "online" : "fallback",
        message: getRedisStatus().connected ? "Redis cache is connected." : "Redis fallback mode is active locally.",
      }),
      api: serviceStatus({ name: "API", status: "online", message: "Express API is responding." }),
    },
    totals,
    recentAuditLogs,
    paymentIssues,
    orderIssues,
    catalogIssues,
  };
}

async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return serviceStatus({ name: "PostgreSQL", status: "online", message: "Database connection is healthy." });
  } catch (error) {
    return serviceStatus({ name: "PostgreSQL", status: "offline", message: error.message });
  }
}

async function getTotals() {
  const [users, products, orders, payments, auditLogs, invoices] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.payment.count(),
    prisma.auditLog.count(),
    prisma.invoice.count(),
  ]);

  return { users, products, orders, payments, auditLogs, invoices };
}

async function getRecentAuditLogs() {
  return prisma.auditLog.findMany({
    take: 12,
    orderBy: { created_at: "desc" },
    include: { user: { select: { email: true, username: true, role: true } } },
  });
}

async function getPaymentIssues() {
  const [failedPayments, recentFailedLogs] = await Promise.all([
    prisma.payment.findMany({
      where: { status: "FAILED" },
      select: { id: true, order_id: true, provider: true, transaction_id: true, amount: true, created_at: true },
      take: 8,
      orderBy: { created_at: "desc" },
    }),
    prisma.paymentLog.findMany({
      where: { event: { contains: "FAILED", mode: "insensitive" } },
      select: { id: true, event: true, payment_id: true, created_at: true },
      take: 8,
      orderBy: { created_at: "desc" },
    }),
  ]);

  return {
    failedPayments: failedPayments.map((payment) => ({ ...payment, amount: Number(payment.amount) })),
    recentFailedLogs,
  };
}

async function getOrderIssues() {
  const [pending, processing, recent] = await Promise.all([
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "PROCESSING" } }),
    prisma.order.findMany({
      where: { status: { in: ["PENDING", "PROCESSING"] } },
      select: { id: true, order_number: true, status: true, total: true, created_at: true },
      take: 8,
      orderBy: { created_at: "desc" },
    }),
  ]);

  return {
    pending,
    processing,
    recent: recent.map((order) => ({ ...order, total: Number(order.total) })),
  };
}

async function getCatalogIssues() {
  const products = await prisma.product.findMany({
    where: { is_active: true },
    select: {
      id: true,
      legacy_id: true,
      name: true,
      image: true,
      inventory: { select: { stock_quantity: true } },
    },
    orderBy: { updated_at: "desc" },
  });

  const missingImages = products.filter((product) => !product.image || product.image === "/file.svg").slice(0, 10);
  const withoutStock = products.filter((product) => !product.inventory || product.inventory.stock_quantity <= 0).slice(0, 10);
  const imageGroups = new Map();

  products.forEach((product) => {
    if (!product.image || product.image === "/file.svg") return;
    const items = imageGroups.get(product.image) ?? [];
    items.push({ id: product.id, legacy_id: product.legacy_id, name: product.name });
    imageGroups.set(product.image, items);
  });

  const duplicateImages = [...imageGroups.entries()]
    .filter(([, items]) => items.length > 1)
    .slice(0, 10)
    .map(([image, items]) => ({ image, count: items.length, items }));

  return {
    missingImages,
    withoutStock,
    duplicateImages,
  };
}

function serviceStatus({ name, status, message }) {
  return {
    name,
    status,
    ok: status === "online",
    message,
  };
}
