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
- `GET /api/products/compare?ids=id1,id2`
- `GET /api/recommendations/personalized`
- `GET /api/recommendations/similar/:productId`
- `GET /api/recommendations/:productId`
- `POST /api/recommendations/view`
- `GET /api/reports`
- `GET /api/reports/export/:format`
- `GET /api/admin/audit-logs`
- `GET /api/admin/audit-logs/export/:format`
- `GET /api/admin/users`
- `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id/role`
- `PATCH /api/admin/users/:id/status`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/roles`
- `POST /api/admin/roles/:roleId/permissions`
- `DELETE /api/admin/roles/:roleId/permissions/:permissionId`
- `GET /api/admin/analytics/dashboard`
- `GET /api/admin/analytics/dashboard/export/:format`
- `POST /api/payments/orders/:orderId/intent`
- `POST /api/payments/verify`
- `POST /api/payments/webhook`
- `POST /api/ai/shopping-assistant`
- `GET /api/ai/analytics`
- `GET /api/invoices`
- `GET /api/invoices/:orderId`
- `GET /api/invoices/:orderId/download`
- `POST /api/invoices/generate/:orderId`
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
6. A successful payment generates an invoice record automatically.

PDF invoices:

- `GET /api/invoices` lists invoices for the current customer, or all invoices for `Admin` and `Manager`.
- `POST /api/invoices/generate/:orderId` creates a unique invoice number such as `INV-2026-000145`.
- `GET /api/invoices/:orderId` returns invoice metadata.
- `GET /api/invoices/:orderId/download` returns a PDF generated with real order, payment, customer, address, and item data.
- The PDF includes store header, invoice number, order number, payment status, customer information, product table, totals, footer, and a QR verification payload.
- Customers can access only their own invoices. Admin and Manager users can search, view, and download all invoices.
- Reports include invoice counts and recent invoice/customer data in sales, revenue, and customer report exports.

Admin audit logs:

- `GET /api/admin/audit-logs` returns paginated audit logs.
- `GET /api/admin/audit-logs/export/csv` downloads filtered logs as CSV.
- `GET /api/admin/audit-logs/export/excel` downloads filtered logs as XLSX.
- Supported query parameters: `search`, `user`, `action`, `entity`, `dateFrom`, `dateTo`, `page`, `pageSize`, `sortOrder`.
- Access is restricted to the `Admin` role.

Admin user management:

- `GET /api/admin/users` returns paginated users with search, role filter, and active/inactive filter.
- `GET /api/admin/users/:id` returns one account.
- `PATCH /api/admin/users/:id/role` accepts `{ "role": "Manager" }`.
- `PATCH /api/admin/users/:id/status` accepts `{ "is_active": false }`.
- `DELETE /api/admin/users/:id` performs a safe delete by suspending the account.
- All endpoints require JWT authentication and the `Admin` role.
- Role changes prevent self-demotion and prevent removing the last active Admin.
- Status changes prevent self-deactivation and prevent deactivating the last active Admin.
- Role/status/delete operations are written to `AuditLogs`.

Admin roles and permissions:

- `GET /api/admin/roles` returns roles and their assigned permissions.
- `POST /api/admin/roles/:roleId/permissions` assigns a permission to a role.
- `DELETE /api/admin/roles/:roleId/permissions/:permissionId` removes a permission.
- Permission changes are Admin-only and are logged in `AuditLogs`.

Similar products:

- `GET /api/recommendations/similar/:productId` returns recommended products for the Product Details page.
- Each item includes product fields plus `similarityScore`.
- The score is based on category, brand, price, rating, and product feature overlap.

Personalized recommendations:

- `GET /api/recommendations/personalized` returns `personalizedProducts`, `frequentlyBoughtTogether`, `trendingProducts`, `fallback`, and `signals`.
- The endpoint uses purchase history, cart history, wishlist, MongoDB `ProductViewHistory`, and MongoDB `SearchHistory`.
- Guests and users with no history receive popular/trending products.

Product comparison:

- `GET /api/products/compare?ids=id1,id2` compares two products.
- `GET /api/products/compare?ids=id1,id2,id3` compares three products.
- The endpoint returns product name, brand, category, price, rating, reviews count, stock, discount, specifications, features, and image.
- The frontend stores selected products in Redux Toolkit `compareSlice` and persists them in `localStorage`.
- Duplicate products are blocked and the maximum comparison size is 3 products.

AI shopping assistant:

- `POST /api/ai/shopping-assistant` accepts natural-language requests such as `{ "message": "I need a laptop for programming under 800 euros" }`.
- The endpoint extracts category, budget, brand preference, product type, purpose, and requested features.
- Recommendations use real PostgreSQL product data and rank products by category match, brand, price, rating, reviews, stock, discount, specifications, and AI product score.
- If `OPENAI_API_KEY` is configured, OpenAI improves the assistant explanation. If not, local NLP recommendation logic is used.
- MongoDB `AIChatHistory` stores the user id, question, response, extracted intent, recommended product ids, and timestamp.
- `GET /api/ai/analytics` is restricted to `Admin` and `Manager` roles and returns total AI chats, most common questions, and most requested categories.

Admin analytics dashboard:

- `GET /api/admin/analytics/dashboard` returns KPI cards, chart data, MongoDB engagement counts, and Redis cache metadata.
- `GET /api/admin/analytics/dashboard/export/pdf` exports the current filtered dashboard as PDF.
- `GET /api/admin/analytics/dashboard/export/excel` exports the current filtered dashboard as XLSX.
- `GET /api/admin/analytics/dashboard/export/csv` exports the current filtered dashboard as CSV.
- Supported filters: `range`, `dateFrom`, and `dateTo`.
- Access is restricted to `Admin` and `Manager` roles.
