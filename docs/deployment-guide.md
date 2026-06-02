# Deployment Guide

## Frontend

```bash
npm install
npm run build --prefix frontend
```

Deploy `frontend/dist/` to a static host.

## Backend

```bash
cd backend
npm install
copy .env.example .env
npm run prisma:deploy
npm run prisma:seed
npm run start
```

Required services:

- PostgreSQL
- Optional MongoDB for activity/history collections
- Optional Redis for caching

## Environment

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `MONGO_URL`
- `REDIS_URL`
- `CLIENT_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_CURRENCY`

## Stripe Webhook

Production Stripe webhooks should forward events to:

```text
https://your-backend-domain.com/api/payments/webhook
```

Required events:

- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`
