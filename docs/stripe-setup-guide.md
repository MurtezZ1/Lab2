# Stripe Setup Guide

## Environment Variables

Add these values to `backend/.env`:

```env
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_CURRENCY=usd
```

The frontend receives the publishable key from the backend Payment Intent response.

## Local Webhook Testing

Install the Stripe CLI, then run:

```bash
stripe login
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Copy the printed `whsec_...` value into `STRIPE_WEBHOOK_SECRET`.

## Test Payment

1. Start infrastructure and the app:

```bash
npm run infra:start
npm run backend:dev
npm run dev
```

2. Login as a user.
3. Add products to cart.
4. Go to checkout.
5. Use the Stripe test card:

```text
4242 4242 4242 4242
```

Use any future expiry date, any CVC, and any ZIP/postal code.

## Expected Result

- A Stripe Payment Intent is created.
- `payments.transaction_id` stores the Stripe Payment Intent ID.
- `payments.status` becomes `COMPLETED` after success.
- A `payment_logs` row records Stripe events.
- The related order status becomes `PAID`.

