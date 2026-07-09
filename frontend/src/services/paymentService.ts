import type { Order } from "@/types";
import { apiClient } from "@/services/apiClient";

export type PaymentIntentResponse = {
  clientSecret: string;
  paymentIntentId: string;
  publishableKey: string;
  demoMode?: boolean;
  paymentMode?: "demo" | "test" | "live" | "configured";
  message?: string;
  order: Order;
};

export async function createPaymentIntent(orderId: string) {
  const { data } = await apiClient.post(`/payments/orders/${orderId}/intent`);
  return data.data as PaymentIntentResponse;
}

export async function verifyPayment(paymentIntentId: string) {
  const { data } = await apiClient.post("/payments/verify", { paymentIntentId });
  return data.data as { order: Order; status: string };
}
