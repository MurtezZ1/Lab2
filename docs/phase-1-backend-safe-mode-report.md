# Phase 1 Backend Foundation - Safe Mode Report

## Scope

This phase extends the project with a backend foundation. It does not redesign the UI, remove pages, or change frontend routing.

## Compatibility

- React + Vite frontend remains unchanged.
- Existing product source `public/sunspot_products.json` remains available.
- Existing MySQL Prisma schema in `public/prisma/schema.prisma` is left untouched for compatibility.
- New PostgreSQL Prisma schema is isolated in `backend/prisma/schema.prisma`.

## Database Changes

The backend PostgreSQL schema includes:

- Users
- Roles
- UserRoles
- Permissions
- RolePermissions
- RefreshTokens
- AuditLogs
- Notifications
- Settings
- Files
- Categories
- Brands
- Products
- ProductImages
- Inventory
- Cart
- CartItems
- Wishlist
- Reviews
- Orders
- OrderItems
- Payments
- PaymentLogs
- Addresses
- Coupons
- CouponUsage
- ShippingMethods
- Shipments
- Returns
- SupportTickets
- TicketMessages

## Risks

- PostgreSQL must be installed and running before migrations can be applied.
- The frontend still uses localStorage/JSON services until Phase 2 connects it to backend APIs.
- Existing MySQL local database files are not migrated automatically into PostgreSQL; seed uses the current product JSON.
