# API Documentation

Swagger UI:

```text
http://localhost:5000/api-docs
```

Important endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `GET /api/search`
- `GET /api/recommendations/personalized`
- `GET /api/recommendations/similar/:productId`
- `GET /api/recommendations/:productId`
- `POST /api/recommendations/view`
- `GET /api/reports`
- `GET /api/reports/export/:format`
- `GET /api/admin/audit-logs`
- `GET /api/admin/audit-logs/export/:format`
- `GET /api/admin/analytics/dashboard`
- `GET /api/admin/analytics/dashboard/export/:format`
- `POST /api/payments/orders/:orderId/intent`
- `POST /api/payments/verify`
- `POST /api/payments/webhook`
- `GET /api/dashboard`
- `GET /api/cms`
- `PUT /api/cms`
- `POST /api/files/upload`
- `POST /api/notifications/test`
- `POST /api/orders/test-update`

Payment flow:

1. Create an order with `POST /api/orders`.
2. Create a Stripe Payment Intent with `POST /api/payments/orders/:orderId/intent`.
3. Confirm the payment on the frontend with Stripe Elements.
4. Verify the payment with `POST /api/payments/verify`.
5. Stripe webhooks also update payment and order status asynchronously.

Admin audit logs:

- `GET /api/admin/audit-logs` returns paginated audit logs.
- `GET /api/admin/audit-logs/export/csv` downloads filtered logs as CSV.
- `GET /api/admin/audit-logs/export/excel` downloads filtered logs as XLSX.
- Supported query parameters: `search`, `user`, `action`, `entity`, `dateFrom`, `dateTo`, `page`, `pageSize`, `sortOrder`.
- Access is restricted to the `Admin` role.

Similar products:

- `GET /api/recommendations/similar/:productId` returns recommended products for the Product Details page.
- Each item includes product fields plus `similarityScore`.
- The score is based on category, brand, price, rating, and product feature overlap.

Personalized recommendations:

- `GET /api/recommendations/personalized` returns `personalizedProducts`, `frequentlyBoughtTogether`, `trendingProducts`, `fallback`, and `signals`.
- The endpoint uses purchase history, cart history, wishlist, MongoDB `ProductViewHistory`, and MongoDB `SearchHistory`.
- Guests and users with no history receive popular/trending products.

Admin analytics dashboard:

- `GET /api/admin/analytics/dashboard` returns KPI cards, chart data, MongoDB engagement counts, and Redis cache metadata.
- `GET /api/admin/analytics/dashboard/export/pdf` exports the current filtered dashboard as PDF.
- `GET /api/admin/analytics/dashboard/export/excel` exports the current filtered dashboard as XLSX.
- `GET /api/admin/analytics/dashboard/export/csv` exports the current filtered dashboard as CSV.
- Supported filters: `range`, `dateFrom`, and `dateTo`.
- Access is restricted to `Admin` and `Manager` roles.
