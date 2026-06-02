import { AppError } from "../utils/AppError.js";

export function validatePaymentVerification(body = {}) {
  if (!body.paymentIntentId || typeof body.paymentIntentId !== "string") {
    throw new AppError("paymentIntentId is required.", 400);
  }
}

