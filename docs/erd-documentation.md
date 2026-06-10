# ERD Documentation

Main relational entities:

- Users have Roles through UserRoles.
- Roles have Permissions through RolePermissions.
- Users have Cart, Wishlist, Orders, Reviews, Addresses, Notifications, SupportTickets.
- Products belong to Categories and Brands.
- Products have ProductImages and Inventory.
- Orders have OrderItems, Payments, Invoices, Shipments, Returns and optional Coupons.
- Payments have PaymentLogs.
- Invoices belong to one Order and one User. Each Order can have one generated invoice.
- SupportTickets have TicketMessages.

MongoDB collections:

- Notifications
- SearchHistory
- UserActivity
- ProductViewHistory

Redis cache keys:

- `dashboard:stats`
- `reports:summary`
- planned: `products:*`, `categories:*`
