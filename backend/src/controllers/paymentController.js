import { env } from "../config/env.js";
import { requireStripe } from "../config/stripe.js";
import {
  createPaymentIntent,
  handleStripeWebhookEvent,
  verifyPaymentIntent,
} from "../services/paymentService.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPaymentIntentController = asyncHandler(async (req, res) => {
  const data = await createPaymentIntent(req.params.orderId, req.user.id);
  res.status(201).json({ success: true, data });
});

export const verifyPaymentController = asyncHandler(async (req, res) => {
  const data = await verifyPaymentIntent(req.body.paymentIntentId, req.user.id);
  res.json({ success: true, data });
});

export const stripeWebhookController = asyncHandler(async (req, res) => {
  const stripe = requireStripe();
  if (!env.stripeWebhookSecret) throw new AppError("Stripe webhook secret is not configured.", 500);

  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, env.stripeWebhookSecret);
  } catch (error) {
    throw new AppError(`Stripe webhook signature verification failed: ${error.message}`, 400);
  }

  const result = await handleStripeWebhookEvent(event);
  res.json({ success: true, data: result });
});

