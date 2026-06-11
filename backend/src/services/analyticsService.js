import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { stringify } from "csv-stringify/sync";
import { emitDashboardUpdate } from "../config/socket.js";
import { cacheDeleteByPrefix, cacheGet, cacheSet } from "../config/redis.js";
import {
  countActiveCustomers,
  countOrders,
  countProducts,
  countUsers,
  getMongoAnalytics,
  listCompletedPayments,
  listOrderItems,
  listOrders,
  listUsers,
  sumCompletedRevenue,
} from "../repositories/analyticsRepository.js";
import { AppError } from "../utils/AppError.js";

const CACHE_PREFIX = "analytics:dashboard:";
const CACHE_TTL_SECONDS = 180;
const RANGE_LABELS = {
  today: "Today",
  last7Days: "Last 7 Days",
  last30Days: "Last 30 Days",
  last90Days: "Last 90 Days",
  thisYear: "This Year",
  custom: "Custom Range",
};

export async function getAnalyticsDashboard(query = {}) {
  const filters = normalizeFilters(query);
  const cacheKey = `${CACHE_PREFIX}${JSON.stringify(filters.cache)}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return { ...cached, cache: { hit: true, key: cacheKey, ttlSeconds: CACHE_TTL_SECONDS } };

  const dashboard = await buildAnalyticsDashboard(filters);
  await cacheSet(cacheKey, dashboard, CACHE_TTL_SECONDS);
  return { ...dashboard, cache: { hit: false, key: cacheKey, ttlSeconds: CACHE_TTL_SECONDS } };
}

export async function exportAnalyticsDashboard(query = {}, format = "csv") {
  if (!["csv", "excel", "pdf"].includes(format)) {
    throw new AppError("Analytics dashboard can only be exported as csv, excel, or pdf.", 400);
  }

  const dashboard = await getAnalyticsDashboard(query);
  const rows = exportRows(dashboard);

  if (format === "csv") {
    return {
      body: stringify(rows, { header: true }),
      contentType: "text/csv",
      filename: "admin-analytics-dashboard.csv",
    };
  }

  if (format === "excel") {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Sunspot";
    const sheet = workbook.addWorksheet("Analytics Dashboard");
    sheet.columns = [
      { header: "Section", key: "section", width: 24 },
      { header: "Metric", key: "metric", width: 32 },
      { header: "Value", key: "value", width: 32 },
    ];
    sheet.addRows(rows);
    sheet.getRow(1).font = { bold: true };
    return {
      body: await workbook.xlsx.writeBuffer(),
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      filename: "admin-analytics-dashboard.xlsx",
    };
  }

  const doc = new PDFDocument({ margin: 40 });
  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));
  const done = new Promise((resolve) => doc.on("end", resolve));
  doc.fontSize(18).text("Admin Analytics Dashboard");
  doc.moveDown().fontSize(10).text(`Range: ${dashboard.filters.label}`);
  rows.forEach((row) => {
    doc.moveDown(0.4).fontSize(10).text(`${row.section} - ${row.metric}: ${row.value}`);
  });
  doc.end();
  await done;
  return {
    body: Buffer.concat(chunks),
    contentType: "application/pdf",
    filename: "admin-analytics-dashboard.pdf",
  };
}

export async function invalidateAnalyticsCache() {
  await cacheDeleteByPrefix(CACHE_PREFIX);
}

export async function notifyAnalyticsDashboardChanged(reason, payload = {}) {
  await invalidateAnalyticsCache();
  emitDashboardUpdate({ type: "analytics:refresh", reason, payload, timestamp: new Date().toISOString() });
}

async function buildAnalyticsDashboard(filters) {
  const { dateFrom, dateTo, previousFrom, previousTo, monthStart, monthEnd } = filters;
  const orderWhere = dateWhere("created_at", dateFrom, dateTo);
  const previousOrderWhere = dateWhere("created_at", previousFrom, previousTo);
  const paymentWhere = dateWhere("created_at", dateFrom, dateTo);
  const previousPaymentWhere = dateWhere("created_at", previousFrom, previousTo);
  const userWhere = dateWhere("created_at", dateFrom, dateTo);
  const previousUserWhere = dateWhere("created_at", previousFrom, previousTo);
  const monthUserWhere = dateWhere("created_at", monthStart, monthEnd);
  const monthPaymentWhere = dateWhere("created_at", monthStart, monthEnd);

  const [
    totalUsers,
    totalOrders,
    totalRevenue,
    totalProducts,
    newUsersThisMonth,
    revenueThisMonth,
    activeCustomers,
    previousOrders,
    previousRevenue,
    previousUsers,
    previousActiveCustomers,
    orders,
    payments,
    users,
    orderItems,
    mongo,
  ] = await Promise.all([
    countUsers(),
    countOrders(orderWhere),
    sumCompletedRevenue(paymentWhere),
    countProducts({ is_active: true }),
    countUsers(monthUserWhere),
    sumCompletedRevenue(monthPaymentWhere),
    countActiveCustomers(orderWhere),
    countOrders(previousOrderWhere),
    sumCompletedRevenue(previousPaymentWhere),
    countUsers(previousUserWhere),
    countActiveCustomers(previousOrderWhere),
    listOrders(orderWhere),
    listCompletedPayments(paymentWhere),
    listUsers(userWhere),
    listOrderItems(orderWhere),
    getMongoAnalytics({ dateFrom, dateTo }),
  ]);

  const revenueValue = money(totalRevenue._sum.amount);
  const revenueMonthValue = money(revenueThisMonth._sum.amount);
  const averageOrderValue = totalOrders ? revenueValue / totalOrders : 0;
  const activeCustomerCount = new Set([
    ...activeCustomers.map((row) => row.user_id),
  ]).size + mongo.activeMongoUsers;

  return {
    filters: {
      range: filters.range,
      label: filters.label,
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
    },
    kpis: [
      kpi("totalUsers", "Total Users", totalUsers, trend(countUsersFromRows(users), previousUsers), "users"),
      kpi("totalOrders", "Total Orders", totalOrders, trend(totalOrders, previousOrders), "orders"),
      kpi("totalRevenue", "Total Revenue", revenueValue, trend(revenueValue, money(previousRevenue._sum.amount)), "currency"),
      kpi("totalProducts", "Total Products", totalProducts, { value: 0, direction: "neutral" }, "products"),
      kpi("newUsersThisMonth", "New Users This Month", newUsersThisMonth, trend(newUsersThisMonth, previousUsers), "users"),
      kpi("revenueThisMonth", "Revenue This Month", revenueMonthValue, trend(revenueMonthValue, money(previousRevenue._sum.amount)), "currency"),
      kpi("averageOrderValue", "Average Order Value", averageOrderValue, trend(averageOrderValue, safeAverage(previousRevenue, previousOrders)), "currency"),
      kpi("activeCustomers", "Active Customers", activeCustomerCount, trend(activeCustomerCount, previousActiveCustomers.length), "users"),
    ],
    charts: {
      ordersPerMonth: monthlyCount(orders, "created_at", "Orders"),
      revenuePerMonth: monthlySum(payments, "created_at", "amount", "Revenue"),
      userGrowth: monthlyCount(users, "created_at", "Users"),
      demandForecast: demandForecast(orderItems, mongo),
      topSellingProducts: topSellingProducts(orderItems),
      topCategories: topCategories(orderItems),
      ordersByStatus: ordersByStatus(orders),
    },
    engagement: {
      productViews: mongo.productViews,
      userActivities: mongo.userActivities,
      activeMongoUsers: mongo.activeMongoUsers,
    },
    generatedAt: new Date().toISOString(),
  };
}

function normalizeFilters(query) {
  const range = String(query.range ?? "last30Days");
  const now = new Date();
  let dateFrom;
  let dateTo = endOfDay(now);

  if (range === "today") dateFrom = startOfDay(now);
  else if (range === "last7Days") dateFrom = startOfDay(addDays(now, -6));
  else if (range === "last90Days") dateFrom = startOfDay(addDays(now, -89));
  else if (range === "thisYear") dateFrom = new Date(now.getFullYear(), 0, 1);
  else if (range === "custom") {
    dateFrom = parseDate(query.dateFrom, false) ?? startOfDay(addDays(now, -29));
    dateTo = parseDate(query.dateTo, true) ?? endOfDay(now);
  } else dateFrom = startOfDay(addDays(now, -29));

  const duration = dateTo.getTime() - dateFrom.getTime();
  const previousTo = new Date(dateFrom.getTime() - 1);
  const previousFrom = new Date(previousTo.getTime() - duration);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = endOfDay(now);

  return {
    range: RANGE_LABELS[range] ? range : "last30Days",
    label: RANGE_LABELS[range] ?? RANGE_LABELS.last30Days,
    dateFrom,
    dateTo,
    previousFrom,
    previousTo,
    monthStart,
    monthEnd,
    cache: {
      range,
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
    },
  };
}

function dateWhere(field, from, to) {
  return {
    [field]: {
      ...(from ? { gte: from } : {}),
      ...(to ? { lte: to } : {}),
    },
  };
}

function kpi(id, title, value, trendValue, format) {
  return { id, title, value: Number.isFinite(value) ? value : 0, trend: trendValue, format };
}

function trend(current, previous) {
  const currentValue = Number(current ?? 0);
  const previousValue = Number(previous ?? 0);
  if (!previousValue && !currentValue) return { value: 0, direction: "neutral" };
  if (!previousValue) return { value: 100, direction: "up" };
  const value = Number((((currentValue - previousValue) / previousValue) * 100).toFixed(1));
  return { value: Math.abs(value), direction: value > 0 ? "up" : value < 0 ? "down" : "neutral" };
}

function monthlyCount(rows, dateKey, label) {
  const buckets = new Map();
  rows.forEach((row) => {
    const key = monthKey(row[dateKey]);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  });
  return [...buckets.entries()].map(([month, value]) => ({ month, label, value }));
}

function monthlySum(rows, dateKey, valueKey, label) {
  const buckets = new Map();
  rows.forEach((row) => {
    const key = monthKey(row[dateKey]);
    buckets.set(key, (buckets.get(key) ?? 0) + Number(row[valueKey] ?? 0));
  });
  return [...buckets.entries()].map(([month, value]) => ({ month, label, value: money(value) }));
}

function topSellingProducts(orderItems) {
  const buckets = new Map();
  orderItems.forEach((item) => {
    const product = item.product;
    const current = buckets.get(item.product_id) ?? { name: product?.name ?? "Unknown Product", units: 0, revenue: 0 };
    current.units += Number(item.quantity ?? 0);
    current.revenue += Number(item.total_price ?? 0);
    buckets.set(item.product_id, current);
  });
  return [...buckets.values()].sort((left, right) => right.units - left.units).slice(0, 8);
}

function topCategories(orderItems) {
  const buckets = new Map();
  orderItems.forEach((item) => {
    const category = item.product?.category?.name ?? item.product?.type ?? "Uncategorized";
    const current = buckets.get(category) ?? { name: category, units: 0, revenue: 0 };
    current.units += Number(item.quantity ?? 0);
    current.revenue += Number(item.total_price ?? 0);
    buckets.set(category, current);
  });
  return [...buckets.values()].sort((left, right) => right.revenue - left.revenue).slice(0, 8);
}

function ordersByStatus(orders) {
  const buckets = new Map();
  orders.forEach((order) => buckets.set(order.status, (buckets.get(order.status) ?? 0) + 1));
  return [...buckets.entries()].map(([status, value]) => ({ status, value }));
}

function demandForecast(orderItems, mongo) {
  const soldUnits = orderItems.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0);
  const productViews = Number(mongo.productViews ?? 0);
  const userActivities = Number(mongo.userActivities ?? 0);
  const baseDemand = Math.max(5, soldUnits + productViews * 0.12 + userActivities * 0.08);
  const growthSignal = soldUnits > 0 ? 1.04 : productViews > 0 ? 1.03 : 1.01;
  const now = new Date();

  return Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() + index + 1, 1);
    const seasonalMultiplier = 1 + Math.sin((index + 1) / 6 * Math.PI) * 0.08;
    const value = Math.round(baseDemand * Math.pow(growthSignal, index + 1) * seasonalMultiplier);
    return {
      month: monthKey(date),
      label: "AI Forecast Demand",
      value,
    };
  });
}

function exportRows(dashboard) {
  return [
    ...dashboard.kpis.map((item) => ({ section: "KPI", metric: item.title, value: item.value })),
    ...dashboard.charts.ordersPerMonth.map((item) => ({ section: "Orders Per Month", metric: item.month, value: item.value })),
    ...dashboard.charts.revenuePerMonth.map((item) => ({ section: "Revenue Per Month", metric: item.month, value: item.value })),
    ...dashboard.charts.userGrowth.map((item) => ({ section: "User Growth", metric: item.month, value: item.value })),
    ...dashboard.charts.demandForecast.map((item) => ({ section: "AI Demand Forecast", metric: item.month, value: item.value })),
    ...dashboard.charts.topSellingProducts.map((item) => ({ section: "Top Selling Products", metric: item.name, value: `${item.units} units / ${money(item.revenue)}` })),
    ...dashboard.charts.topCategories.map((item) => ({ section: "Top Categories", metric: item.name, value: `${item.units} units / ${money(item.revenue)}` })),
    ...dashboard.charts.ordersByStatus.map((item) => ({ section: "Orders By Status", metric: item.status, value: item.value })),
    { section: "MongoDB", metric: "Product Views", value: dashboard.engagement.productViews },
    { section: "MongoDB", metric: "User Activities", value: dashboard.engagement.userActivities },
  ];
}

function safeAverage(revenueAggregate, count) {
  return count ? money(revenueAggregate._sum.amount) / count : 0;
}

function countUsersFromRows(rows) {
  return rows.length;
}

function money(value) {
  return Number(value ?? 0);
}

function monthKey(value) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function parseDate(value, end = false) {
  if (!value) return null;
  const text = String(value);
  const date = new Date(text.includes("T") ? text : `${text}T${end ? "23:59:59.999" : "00:00:00.000"}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}
