# Phase 1 Backend Foundation - Safe Mode Report

## Scope

This phase extends the project with a backend foundation. It does not redesign the UI, remove pages, or change frontend routing.

## Compatibility

- React + Vite frontend remains unchanged.
- Legacy product seed artifacts remain only for history and are not used by the React frontend runtime.
- Legacy database artifacts remain only for history and are not referenced by active root database scripts.
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
- The frontend is now connected to backend APIs for the primary application workflows.
- Existing MySQL local database files are not migrated automatically into PostgreSQL; seed uses the current product JSON.
