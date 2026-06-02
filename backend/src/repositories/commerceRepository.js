import { prisma } from "../config/prisma.js";

export async function listWishlist(userId) {
  return prisma.wishlist.findMany({
    where: { user_id: userId },
    include: { product: { include: { category: true, brand: true, images: true, inventory: true } } },
    orderBy: { created_at: "desc" },
  });
}

export async function toggleWishlistItem(userId, productId) {
  const existing = await prisma.wishlist.findUnique({
    where: { user_id_product_id: { user_id: userId, product_id: productId } },
  });
  if (existing) {
    await prisma.wishlist.delete({ where: { id: existing.id } });
    return { added: false };
  }
  await prisma.wishlist.create({ data: { user_id: userId, product_id: productId, created_by: userId } });
  return { added: true };
}

export async function listReviews(productId) {
  return prisma.review.findMany({
    where: { product_id: productId },
    include: { user: { select: { username: true } } },
    orderBy: { created_at: "desc" },
  });
}

export async function createReview(userId, productId, data) {
  return prisma.review.create({
    data: {
      user_id: userId,
      product_id: productId,
      rating: Number(data.rating),
      title: data.title,
      comment: data.comment,
      is_approved: true,
      created_by: userId,
      updated_by: userId,
    },
  });
}

export async function createPayment(orderId, data, userId) {
  return prisma.payment.create({
    data: {
      order_id: orderId,
      provider: data.provider ?? "Manual",
      transaction_id: data.transactionId,
      amount: Number(data.amount ?? 0),
      status: data.status ?? "PENDING",
      paid_at: data.status === "COMPLETED" ? new Date() : null,
      created_by: userId,
      updated_by: userId,
      logs: { create: { event: "PAYMENT_CREATED", payload: data, created_by: userId } },
    },
    include: { logs: true },
  });
}

export async function listShippingMethods() {
  return prisma.shippingMethod.findMany({ where: { is_active: true }, orderBy: { price: "asc" } });
}

export async function upsertShippingMethod(data, userId) {
  return prisma.shippingMethod.upsert({
    where: { name: data.name },
    update: {
      description: data.description,
      price: Number(data.price ?? 0),
      estimated_days: data.estimated_days ? Number(data.estimated_days) : null,
      is_active: data.is_active ?? true,
      updated_by: userId,
    },
    create: {
      name: data.name,
      description: data.description,
      price: Number(data.price ?? 0),
      estimated_days: data.estimated_days ? Number(data.estimated_days) : null,
      created_by: userId,
      updated_by: userId,
    },
  });
}

export async function createShipment(orderId, data, userId) {
  return prisma.shipment.create({
    data: {
      order_id: orderId,
      shipping_method_id: data.shippingMethodId,
      address_id: data.addressId,
      tracking_number: data.trackingNumber,
      carrier: data.carrier,
      shipped_at: data.shippedAt ? new Date(data.shippedAt) : null,
      created_by: userId,
      updated_by: userId,
    },
  });
}

export async function createReturn(orderId, data, userId) {
  return prisma.return.create({
    data: {
      order_id: orderId,
      product_id: data.productId,
      reason: data.reason,
      status: data.status ?? "REQUESTED",
      created_by: userId,
      updated_by: userId,
    },
  });
}

export async function listReturns(userId, isAdmin = false) {
  return prisma.return.findMany({
    where: isAdmin ? {} : { order: { user_id: userId } },
    include: { order: true, product: true },
    orderBy: { created_at: "desc" },
  });
}
