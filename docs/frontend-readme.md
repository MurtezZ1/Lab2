# Sunspot Frontend

React + Vite frontend for the Electronic Online Shop.

## Run

```bash
npm install --prefix frontend
npm run dev --prefix frontend
```

From the repository root, you can also run:

```bash
npm install
npm run dev
```

## Build

```bash
npm run build --prefix frontend
```

## Main Features

- Home page
- Products page
- Product details
- Cart
- Wishlist
- Checkout
- Order history
- User dashboard
- Admin dashboard
- Notifications
- Support tickets
- Redux Toolkit state management
- Protected routes and role-based routes

## API Integration

`frontend/src/services/apiClient.ts` configures Axios with JWT access tokens and refresh token retry handling.

Current frontend behavior is connected to the Express backend for authentication, products, cart, orders, wishlist, notifications, support tickets, CMS, reports, and recommendations.
