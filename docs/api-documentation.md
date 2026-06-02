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
- `GET /api/recommendations/:productId`
- `POST /api/recommendations/view`
- `GET /api/reports`
- `GET /api/reports/export/:format`
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
