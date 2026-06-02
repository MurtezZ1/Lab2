import { prisma } from "../config/prisma.js";

const orderInclude = {
  items: { include: { product: { include: { category: true, brand: true, images: true, inventory: true } } } },
  payments: { include: { logs: true } },
  shipments: true,
  returns: true,
};

export async function createOrderWithItems({ userId, items, addressId = null }) {
  const subtotal = items.reduce((total, item) => total + Number(item.unit_price) * item.quantity, 0);
  const taxTotal = Number((subtotal * 0.08).toFixed(2));
  const shippingTotal = 0;
  const total = Number((subtotal + taxTotal + shippingTotal).toFixed(2));

  return prisma.order.create({
    data: {
      user_id: userId,
      address_id: addressId,
      order_number: `SUN-${Date.now()}`,
      status: "PROCESSING",
      subtotal,
      tax_total: taxTotal,
      shipping_total: shippingTotal,
      discount_total: 0,
      total,
      created_by: userId,
      updated_by: userId,
      items: {
        create: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: Number(item.unit_price),
          total_price: Number(item.unit_price) * item.quantity,
          created_by: userId,
          updated_by: userId,
        })),
      },
      payments: {
        create: {
          provider: "Manual",
          amount: total,
          status: "PENDING",
          created_by: userId,
          updated_by: userId,
          logs: { create: { event: "ORDER_CREATED", payload: { source: "checkout" }, created_by: userId } },
        },
      },
    },
    include: orderInclude,
  });
}

export async function listOrders({ userId, isAdmin = false, status, page = 1, pageSize = 20 }) {
  const where = {
    ...(isAdmin ? {} : { user_id: userId }),
    ...(status ? { status } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);
  return { items, total, page, pageSize };
}

export async function findOrder(id, userId, isAdmin = false) {
  return prisma.order.findFirst({
    where: { id, ...(isAdmin ? {} : { user_id: userId }) },
    include: orderInclude,
  });
}

export async function updateOrderStatus(id, status, userId) {
  return prisma.order.update({
    where: { id },
    data: { status, updated_by: userId },
    include: orderInclude,
  });
}
