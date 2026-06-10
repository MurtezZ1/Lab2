import { prisma } from "../config/prisma.js";

const invoiceInclude = {
  user: true,
  order: {
    include: {
      user: true,
      address: true,
      items: { include: { product: { include: { category: true, brand: true } } } },
      payments: { orderBy: { created_at: "desc" } },
      shipments: true,
    },
  },
};

export function findInvoiceByOrder(orderId) {
  return prisma.invoice.findUnique({
    where: { order_id: orderId },
    include: invoiceInclude,
  });
}

export function findInvoiceById(id) {
  return prisma.invoice.findUnique({
    where: { id },
    include: invoiceInclude,
  });
}

export function findInvoiceByOrderForUser(orderId, userId, isAdmin = false) {
  return prisma.invoice.findFirst({
    where: {
      order_id: orderId,
      ...(isAdmin ? {} : { user_id: userId }),
    },
    include: invoiceInclude,
  });
}

export function findInvoiceOrder(orderId, userId, isAdmin = false) {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      ...(isAdmin ? {} : { user_id: userId }),
    },
    include: {
      user: true,
      address: true,
      items: { include: { product: { include: { category: true, brand: true } } } },
      payments: { orderBy: { created_at: "desc" } },
      shipments: true,
      invoices: true,
    },
  });
}

export async function createInvoiceRecord(order, invoiceNumber, userId) {
  return prisma.invoice.upsert({
    where: { order_id: order.id },
    update: {
      pdf_url: `/api/invoices/${order.id}/download`,
      generated_at: new Date(),
      updated_by: userId,
    },
    create: {
      invoice_number: invoiceNumber,
      order_id: order.id,
      user_id: order.user_id,
      pdf_url: `/api/invoices/${order.id}/download`,
      created_by: userId,
      updated_by: userId,
    },
    include: invoiceInclude,
  });
}

export async function nextInvoiceSequence(year) {
  const count = await prisma.invoice.count({
    where: {
      invoice_number: {
        startsWith: `INV-${year}-`,
      },
    },
  });
  return count + 1;
}

export async function listInvoices({ isAdmin = false, userId, search = "", dateFrom, dateTo, paymentStatus, page = 1, pageSize = 20 }) {
  const where = {
    ...(isAdmin ? {} : { user_id: userId }),
    ...(search
      ? {
          OR: [
            { invoice_number: { contains: search, mode: "insensitive" } },
            { order: { is: { order_number: { contains: search, mode: "insensitive" } } } },
            { user: { is: { email: { contains: search, mode: "insensitive" } } } },
            { user: { is: { username: { contains: search, mode: "insensitive" } } } },
          ],
        }
      : {}),
    ...(dateFrom || dateTo
      ? {
          generated_at: {
            ...(dateFrom ? { gte: dateFrom } : {}),
            ...(dateTo ? { lte: dateTo } : {}),
          },
        }
      : {}),
    ...(paymentStatus
      ? { order: { is: { payments: { some: { status: paymentStatus } } } } }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: invoiceInclude,
      orderBy: { generated_at: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.invoice.count({ where }),
  ]);

  return { items, total, page, pageSize, pageCount: Math.max(1, Math.ceil(total / pageSize)) };
}
