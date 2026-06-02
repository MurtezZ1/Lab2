# Sunspot Backend Foundation

Safe-mode backend extension for the Electronic Online Shop. The React + Vite UI is not changed by this backend foundation.

## Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT access and refresh tokens
- bcrypt
- dotenv
- Stripe payments

## Install

```bash
cd backend
npm install
copy .env.example .env
```

Update `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and Stripe keys in `.env`.

Stripe variables:

```env
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_CURRENCY=usd
```

## Database

Create a PostgreSQL database:

```sql
CREATE DATABASE sunspot_electronic_shop;
```

Run migration and seed:

```bash
npm run db:setup
```

## Run

```bash
npm run dev
```

Health check:

```text
GET http://localhost:5000/health
```

## Implemented Routes

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/verify-email
GET  /api/auth/me
GET  /api/rbac/admin-only
GET  /api/rbac/reports
POST /api/payments/orders/:orderId/intent
POST /api/payments/verify
POST /api/payments/webhook
```
