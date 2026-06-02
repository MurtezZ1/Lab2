# React + Vite Migration Report

The storefront now runs on React + Vite while preserving the existing visual design, Tailwind classes, page structure, and user flow.

## Current Runtime

- Routing is handled by `react-router-dom`.
- Products load from the backend product catalog API.
- Authentication uses backend JWT access and refresh tokens.
- Cart, orders, wishlist, reviews, support tickets, notifications, reports, CMS, and recommendations are connected to backend APIs.
- PostgreSQL is the active relational database through Prisma.
- MongoDB and Redis are started through Docker Compose for local development.

## Verification

- Frontend build passes.
- Backend source check passes.
- PostgreSQL migration status is up to date.
- Main API smoke tests pass.
