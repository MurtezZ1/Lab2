import { env } from "../config/env.js";
import { requireStripe } from "../config/stripe.js";
import { findOrder } from "../repositories/orderRepository.js";
import {
  createCompletedDemoPayment,
  findPaymentByOrder,
  findPaymentByStripeId,
  updatePaymentOrderStatus,
  updateStripePaymentStatus,
  upsertStripePayment,
} from "../repositories/paymentRepository.js";
import { AppError } from "../utils/AppError.js";
import { serializeOrder } from "../utils/serializers.js";
import { notifyAnalyticsDashboardChanged } from "./analyticsService.js";
import { generateInvoice } from "./invoiceService.js";

const toCents = (amount) => Math.round(Number(amount) * 100);

function assertPayableOrder(order) {
  if (!order) throw new AppError("Order not found.", 404);
  if (order.status === "PAID") throw new AppError("Order is already paid.", 409);
  if (["CANCELLED", "RETURNED"].includes(order.status)) {
    throw new AppError("This order cannot be paid.", 400);
  }
}

function statusFromStripe(paymentIntent) {
  if (paymentIntent.status === "succeeded") return "COMPLETED";
  if (["canceled", "requires_payment_method"].includes(paymentIntent.status)) return "FAILED";
  return "PENDING";
}

async function syncPaymentStatus(paymentIntent, userId = null, eventName = "STRIPE_PAYMENT_VERIFIED") {
  const payment = await findPaymentByStripeId(paymentIntent.id);
  if (!payment) throw new AppError("Payment record not found for Stripe payment intent.", 404);

  const status = statusFromStripe(paymentIntent);
  const updatedPayment = await updateStripePaymentStatus({
    stripePaymentId: paymentIntent.id,
    status,
    event: eventName,
    payload: {
      stripePaymentId: paymentIntent.id,
      stripeStatus: paymentIntent.status,
      amountReceived: paymentIntent.amount_received,
    },
    userId,
  });

  if (status === "COMPLETED") {
    await updatePaymentOrderStatus(updatedPayment.order_id, "PAID", userId);
    if (userId) {
      await generateInvoice(updatedPayment.order_id, { id: userId, roles: ["Customer"] }).catch(() => {});
    }
    notifyAnalyticsDashboardChanged("payment_completed", {
      orderId: updatedPayment.order_id,
      paymentId: updatedPayment.id,
    }).catch(() => {});
  }

  return updatedPayment;
}

export async function createPaymentIntent(orderId, userId) {
  const order = await findOrder(orderId, userId, false);
  assertPayableOrder(order);

  if (!env.stripeSecretKey || !env.stripePublishableKey) {
    const demoPaymentId = `demo_pi_${order.id.replace(/-/g, "").slice(0, 18)}_${Date.now()}`;
    await createCompletedDemoPayment({ order, demoPaymentId, userId });
    const paidOrder = await updatePaymentOrderStatus(order.id, "PAID", userId);
    await generateInvoice(order.id, { id: userId, roles: ["Customer"] }).catch(() => {});
    notifyAnalyticsDashboardChanged("payment_completed", {
      orderId: order.id,
      source: "demo_payment",
    }).catch(() => {});

    return {
      clientSecret: "",
      paymentIntentId: demoPaymentId,
      publishableKey: "",
      demoMode: true,
      message: "Stripe is not configured locally, so a demo payment was completed.",
      order: serializeOrder(paidOrder),
    };
  }

  const stripe = requireStripe();

  const existingPayment = await findPaymentByOrder(order.id);
  if (existingPayment?.transaction_id && existingPayment.provider === "Stripe") {
    const existingIntent = await stripe.paymentIntents.retrieve(existingPayment.transaction_id);
    return {
      clientSecret: existingIntent.client_secret,
      paymentIntentId: existingIntent.id,
      publishableKey: env.stripePublishableKey,
      order: serializeOrder(order),
    };
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: toCents(order.total),
    currency: env.stripeCurrency,
    automatic_payment_methods: { enabled: true },
    metadata: {
      orderId: order.id,
      orderNumber: order.order_number,
      userId,
    },
  });

  await upsertStripePayment({
    order,
    stripePaymentId: paymentIntent.id,
    userId,
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    publishableKey: env.stripePublishableKey,
    order: serializeOrder(order),
  };
}

export async function verifyPaymentIntent(paymentIntentId, userId) {
  const stripe = requireStripe();
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const payment = await syncPaymentStatus(paymentIntent, userId);
  const order = await updatePaymentOrderStatus(
    payment.order_id,
    payment.status === "COMPLETED" ? "PAID" : payment.order.status,
    userId,
  );
  return {
    payment,
    order: serializeOrder(order),
    status: payment.status,
  };
}

export async function handleStripeWebhookEvent(event) {
  if (!["payment_intent.succeeded", "payment_intent.payment_failed", "payment_intent.canceled"].includes(event.type)) {
    return { handled: false };
  }

  const paymentIntent = event.data.object;
  const status = statusFromStripe(paymentIntent);
  const payment = await findPaymentByStripeId(paymentIntent.id);
  if (!payment) return { handled: false, reason: "payment_not_found" };

  await updateStripePaymentStatus({
    stripePaymentId: paymentIntent.id,
    status,
    event: event.type,
    payload: {
      stripePaymentId: paymentIntent.id,
      stripeStatus: paymentIntent.status,
      eventId: event.id,
    },
  });

  if (status === "COMPLETED") {
    await updatePaymentOrderStatus(payment.order_id, "PAID");
    await generateInvoice(payment.order_id, { id: payment.order.user_id, roles: ["Customer"] }).catch(() => {});
    notifyAnalyticsDashboardChanged("payment_completed", {
      orderId: payment.order_id,
      paymentId: payment.id,
      source: "stripe_webhook",
    }).catch(() => {});
  }

  return { handled: true, status };
}

