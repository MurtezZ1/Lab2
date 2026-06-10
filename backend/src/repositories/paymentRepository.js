import { prisma } from "../config/prisma.js";

export function findPaymentByOrder(orderId) {
  return prisma.payment.findFirst({
    where: { order_id: orderId },
    include: { order: true, logs: true },
    orderBy: { created_at: "desc" },
  });
}

export function findPaymentByStripeId(stripePaymentId) {
  return prisma.payment.findFirst({
    where: { transaction_id: stripePaymentId },
    include: { order: true, logs: true },
  });
}

export async function upsertStripePayment({ order, stripePaymentId, userId }) {
  const pendingPayment = await prisma.payment.findFirst({
    where: { order_id: order.id, transaction_id: null },
    orderBy: { created_at: "desc" },
  });

  if (pendingPayment) {
    return prisma.payment.update({
      where: { id: pendingPayment.id },
      data: {
        provider: "Stripe",
        transaction_id: stripePaymentId,
        amount: order.total,
        status: "PENDING",
        updated_by: userId,
        logs: {
          create: {
            event: "STRIPE_PAYMENT_INTENT_CREATED",
            payload: { stripePaymentId, orderId: order.id },
            created_by: userId,
          },
        },
      },
      include: { logs: true, order: true },
    });
  }

  return prisma.payment.upsert({
    where: { transaction_id: stripePaymentId },
    update: {
      provider: "Stripe",
      amount: order.total,
      status: "PENDING",
      updated_by: userId,
      logs: {
        create: {
          event: "STRIPE_PAYMENT_INTENT_CREATED",
          payload: { stripePaymentId, orderId: order.id },
          created_by: userId,
        },
      },
    },
    create: {
      order_id: order.id,
      provider: "Stripe",
      transaction_id: stripePaymentId,
      amount: order.total,
      status: "PENDING",
      created_by: userId,
      updated_by: userId,
      logs: {
        create: {
          event: "STRIPE_PAYMENT_INTENT_CREATED",
          payload: { stripePaymentId, orderId: order.id },
          created_by: userId,
        },
      },
    },
    include: { logs: true, order: true },
  });
}

export function updateStripePaymentStatus({ stripePaymentId, status, event, payload, userId = null }) {
  const paidAt = status === "COMPLETED" ? new Date() : null;
  return prisma.payment.update({
    where: { transaction_id: stripePaymentId },
    data: {
      status,
      paid_at: paidAt,
      updated_by: userId,
      logs: {
        create: {
          event,
          payload,
          created_by: userId,
        },
      },
    },
    include: { order: true, logs: true },
  });
}

export function updatePaymentOrderStatus(orderId, status, userId = null) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status, updated_by: userId },
    include: {
      items: { include: { product: { include: { category: true, brand: true, images: true, inventory: true } } } },
      payments: { include: { logs: true } },
      shipments: true,
      returns: true,
    },
  });
}

export async function createCompletedDemoPayment({ order, demoPaymentId, userId }) {
  const existingPayment = await prisma.payment.findFirst({
    where: { order_id: order.id },
    orderBy: { created_at: "desc" },
  });

  if (existingPayment) {
    return prisma.payment.update({
      where: { id: existingPayment.id },
      data: {
        provider: "Demo",
        transaction_id: demoPaymentId,
        amount: order.total,
        status: "COMPLETED",
        paid_at: new Date(),
        updated_by: userId,
        logs: {
          create: {
            event: "DEMO_PAYMENT_COMPLETED",
            payload: {
              demoPaymentId,
              orderId: order.id,
              reason: "Stripe keys are not configured in local environment.",
            },
            created_by: userId,
          },
        },
      },
      include: { order: true, logs: true },
    });
  }

  return prisma.payment.create({
    data: {
      order_id: order.id,
      provider: "Demo",
      transaction_id: demoPaymentId,
      amount: order.total,
      status: "COMPLETED",
      paid_at: new Date(),
      created_by: userId,
      updated_by: userId,
      logs: {
        create: {
          event: "DEMO_PAYMENT_COMPLETED",
          payload: {
            demoPaymentId,
            orderId: order.id,
            reason: "Stripe keys are not configured in local environment.",
          },
          created_by: userId,
        },
      },
    },
    include: { order: true, logs: true },
  });
}
