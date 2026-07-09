import { env } from "../config/env.js";
import { getMongoStatus } from "../config/mongo.js";
import { prisma } from "../config/prisma.js";
import { getRedisStatus } from "../config/redis.js";

export async function getLaunchReadiness() {
  const generatedAt = new Date().toISOString();
  const database = await checkDatabase();
  const stripe = await checkStripe();
  const email = checkEmail();
  const [catalog, orders, users, invoices, recentErrors] = await Promise.all([
    checkCatalog(),
    checkOrders(),
    checkUsers(),
    checkInvoices(),
    getRecentErrors(),
  ]);

  const infrastructure = {
    database,
    mongo: statusCard({
      id: "mongo",
      title: "MongoDB",
      ok: getMongoStatus().connected,
      mode: getMongoStatus().configured ? (getMongoStatus().connected ? "connected" : "fallback") : "not_configured",
      message: getMongoStatus().connected
        ? "MongoDB is connected for activity and product view history."
        : "MongoDB is not active; fallback mode is being used locally.",
    }),
    redis: statusCard({
      id: "redis",
      title: "Redis",
      ok: getRedisStatus().connected,
      mode: getRedisStatus().configured ? (getRedisStatus().connected ? "connected" : "fallback") : "not_configured",
      message: getRedisStatus().connected
        ? "Redis cache is active."
        : "Redis is not active; dashboard and catalog caching use fallback behavior.",
    }),
    api: statusCard({
      id: "api",
      title: "API Health",
      ok: true,
      mode: env.nodeEnv,
      message: "Backend API is responding.",
    }),
  };

  const checks = [
    infrastructure.database,
    infrastructure.mongo,
    infrastructure.redis,
    infrastructure.api,
    stripe,
    email,
    catalog.missingImages,
    catalog.duplicateImages,
    catalog.withoutStock,
    orders.pending,
    invoices.coverage,
  ];

  const blockingIssues = checks.filter((item) => item.severity === "critical").length;
  const warnings = checks.filter((item) => item.severity === "warning").length;
  const readyChecks = checks.filter((item) => item.ok).length;
  const productionScore = Math.round((readyChecks / checks.length) * 100);
  const readinessScore = Math.max(0, Math.min(100, 100 - blockingIssues * 30 - warnings * 3));

  return {
    generatedAt,
    launchMode: stripe.mode === "live" && email.ok && database.ok ? "production" : "demo",
    readinessScore,
    productionScore,
    summary: {
      readyChecks,
      totalChecks: checks.length,
      warnings,
      blockingIssues,
      recommendation:
        blockingIssues > 0
          ? "Fix critical items before public launch."
          : warnings > 0
            ? "Good for presentation; complete warnings before production launch."
            : "Ready for launch.",
    },
    infrastructure,
    payments: {
      stripe,
      demoPayments: await countDemoPayments(),
    },
    email,
    catalog,
    orders,
    users,
    invoices,
    recentErrors,
    checklist: checks,
  };
}

async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return statusCard({
      id: "database",
      title: "PostgreSQL Database",
      ok: true,
      mode: "connected",
      message: "PostgreSQL connection is healthy.",
    });
  } catch (error) {
    return statusCard({
      id: "database",
      title: "PostgreSQL Database",
      ok: false,
      severity: "critical",
      mode: "offline",
      message: error.message,
    });
  }
}

async function checkStripe() {
  const hasSecret = Boolean(env.stripeSecretKey);
  const hasPublishable = Boolean(env.stripePublishableKey);
  const isLive = env.stripeSecretKey.startsWith("sk_live_") && env.stripePublishableKey.startsWith("pk_live_");
  const isTest = env.stripeSecretKey.startsWith("sk_test_") && env.stripePublishableKey.startsWith("pk_test_");
  const mode = isLive ? "live" : isTest ? "test" : hasSecret || hasPublishable ? "partial" : "demo";

  return statusCard({
    id: "stripe",
    title: "Stripe Payments",
    ok: hasSecret && hasPublishable,
    severity: hasSecret && hasPublishable ? "ok" : "warning",
    mode,
    message: hasSecret && hasPublishable
      ? `Stripe is configured in ${mode} mode.`
      : "Stripe keys are missing; checkout completes with local demo payments.",
  });
}

function checkEmail() {
  const configured = Boolean(env.smtpHost && env.smtpUser && env.smtpPassword && env.smtpFrom);
  return statusCard({
    id: "email",
    title: "Email System",
    ok: configured,
    severity: configured ? "ok" : "warning",
    mode: configured ? "configured" : "not_configured",
    message: configured
      ? "SMTP is configured for customer emails."
      : "SMTP is not configured; welcome, order, payment and invoice emails are not production-ready.",
  });
}

async function checkCatalog() {
  const [totalProducts, missingImagesCount, withoutStockCount, inactiveProducts, missingImages, withoutStock, activeProducts] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({
      where: {
        is_active: true,
        AND: [
          { OR: [{ image: null }, { image: "" }, { image: "/file.svg" }] },
          { images: { none: {} } },
        ],
      },
    }),
    prisma.product.count({
      where: {
        is_active: true,
        OR: [{ inventory: null }, { inventory: { stock_quantity: { lte: 0 } } }],
      },
    }),
    prisma.product.count({ where: { is_active: false } }),
    prisma.product.findMany({
      where: {
        is_active: true,
        AND: [
          { OR: [{ image: null }, { image: "" }, { image: "/file.svg" }] },
          { images: { none: {} } },
        ],
      },
      select: { id: true, legacy_id: true, name: true, image: true },
      take: 10,
      orderBy: { updated_at: "desc" },
    }),
    prisma.product.findMany({
      where: {
        is_active: true,
        OR: [{ inventory: null }, { inventory: { stock_quantity: { lte: 0 } } }],
      },
      select: { id: true, legacy_id: true, name: true, inventory: true },
      take: 10,
      orderBy: { updated_at: "desc" },
    }),
    prisma.product.findMany({
      where: { is_active: true },
      select: { id: true, legacy_id: true, name: true, image: true },
    }),
  ]);
  const duplicateImageGroups = getDuplicateImageGroups(activeProducts);
  const duplicateImagesCount = duplicateImageGroups.reduce((sum, group) => sum + group.count, 0);

  return {
    totalProducts,
    inactiveProducts,
    missingImages: statusCard({
      id: "missingImages",
      title: "Products with Missing Images",
      ok: missingImagesCount === 0,
      severity: missingImagesCount === 0 ? "ok" : "warning",
      value: missingImagesCount,
      message: missingImagesCount === 0 ? "All active products have images." : `${missingImagesCount} active products need product images.`,
      items: missingImages,
    }),
    withoutStock: statusCard({
      id: "withoutStock",
      title: "Products without Stock",
      ok: withoutStockCount === 0,
      severity: withoutStockCount === 0 ? "ok" : "warning",
      value: withoutStockCount,
      message: withoutStockCount === 0 ? "All active products have stock." : `${withoutStockCount} active products have no stock.`,
      items: withoutStock,
    }),
    duplicateImages: statusCard({
      id: "duplicateImages",
      title: "Repeated Product Images",
      ok: duplicateImagesCount === 0,
      severity: duplicateImagesCount === 0 ? "ok" : "warning",
      value: duplicateImagesCount,
      message: duplicateImagesCount === 0
        ? "Product image URLs are unique across the active catalog."
        : `${duplicateImagesCount} products share repeated image URLs. Review catalog photography before launch.`,
      items: duplicateImageGroups,
    }),
  };
}

async function checkOrders() {
  const [total, pendingCount, pendingOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({
      where: { status: "PENDING" },
      select: { id: true, order_number: true, status: true, total: true, created_at: true },
      take: 10,
      orderBy: { created_at: "desc" },
    }),
  ]);

  return {
    total,
    pending: statusCard({
      id: "pendingOrders",
      title: "Orders Pending",
      ok: pendingCount === 0,
      severity: pendingCount === 0 ? "ok" : "warning",
      value: pendingCount,
      message: pendingCount === 0 ? "No pending orders." : `${pendingCount} orders are still pending.`,
      items: pendingOrders,
    }),
  };
}

async function checkUsers() {
  const [total, active, admins] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { active: 1 } }),
    prisma.user.count({ where: { role: "Admin", active: 1 } }),
  ]);
  return { total, active, admins };
}

async function checkInvoices() {
  const [paidOrders, invoices] = await Promise.all([
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.invoice.count(),
  ]);
  return {
    paidOrders,
    totalInvoices: invoices,
    coverage: statusCard({
      id: "invoiceCoverage",
      title: "Invoice Coverage",
      ok: paidOrders === 0 || invoices >= paidOrders,
      severity: paidOrders === 0 || invoices >= paidOrders ? "ok" : "warning",
      value: `${invoices}/${paidOrders}`,
      message: paidOrders === 0 || invoices >= paidOrders
        ? "Invoices are available for paid orders."
        : "Some paid orders do not have invoices yet.",
    }),
  };
}

async function countDemoPayments() {
  return prisma.payment.count({ where: { provider: "Demo" } });
}

async function getRecentErrors() {
  const [failedPayments, failedPaymentLogs] = await Promise.all([
    prisma.payment.findMany({
      where: { status: "FAILED" },
      select: { id: true, order_id: true, provider: true, transaction_id: true, created_at: true },
      take: 5,
      orderBy: { created_at: "desc" },
    }),
    prisma.paymentLog.findMany({
      where: { event: { contains: "FAILED", mode: "insensitive" } },
      select: { id: true, event: true, payment_id: true, created_at: true },
      take: 5,
      orderBy: { created_at: "desc" },
    }),
  ]);
  return { failedPayments, failedPaymentLogs };
}

function statusCard({ id, title, ok, severity = ok ? "ok" : "warning", mode = "", message, value = null, items = [] }) {
  return { id, title, ok, severity, mode, message, value, items };
}

function getDuplicateImageGroups(products) {
  const groups = new Map();
  products.forEach((product) => {
    if (!product.image || product.image === "/file.svg") return;
    const group = groups.get(product.image) ?? [];
    group.push({ id: product.id, legacy_id: product.legacy_id, name: product.name });
    groups.set(product.image, group);
  });

  return [...groups.entries()]
    .filter(([, items]) => items.length > 1)
    .slice(0, 10)
    .map(([image, items]) => ({ image, count: items.length, items }));
}
