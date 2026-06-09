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
GET  /api/admin/audit-logs
GET  /api/admin/audit-logs/export/csv
GET  /api/admin/audit-logs/export/excel
GET  /api/recommendations/personalized
GET  /api/recommendations/similar/:productId
GET  /api/admin/analytics/dashboard
GET  /api/admin/analytics/dashboard/export/:format
```

## Admin Audit Logs

The audit logs module uses the existing Prisma `AuditLog` model and is restricted to users with the `Admin` role.

Query filters:

```text
search, user, action, entity, dateFrom, dateTo, page, pageSize, sortOrder
```

The controller delegates listing and export work to `auditLogService`, while `auditLogRepository` owns all Prisma access. Old and new values are stored in `metadata.oldValue` and `metadata.newValue`.

## Similar Products Recommendations

`GET /api/recommendations/similar/:productId` returns products from the existing recommendation service with a `similarityScore`.

The score combines category, brand, price, rating, and product feature overlap, then returns the highest scoring products for the Product Details widget.

## Personalized Recommendations

`GET /api/recommendations/personalized` returns `personalizedProducts`, `frequentlyBoughtTogether`, and `trendingProducts`.

The endpoint uses optional JWT authentication. Authenticated users get recommendations from purchase history, cart items, wishlist, product views, and search history. Guests or users without history receive trending products as fallback.

## Admin Analytics Dashboard

`GET /api/admin/analytics/dashboard` returns real analytics from PostgreSQL, MongoDB, and Redis cache metadata. Access is restricted to `Admin` and `Manager` roles.

Exports:

```text
GET /api/admin/analytics/dashboard/export/pdf
GET /api/admin/analytics/dashboard/export/excel
GET /api/admin/analytics/dashboard/export/csv
```

The service caches dashboard responses in Redis with the `analytics:dashboard:` prefix and invalidates that cache when users register, orders are created, payments complete, or products are changed.
