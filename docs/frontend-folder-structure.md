# Frontend Folder Documentation

```text
src/
  components/   Reusable UI components
  hooks/        Shared React hooks
  layouts/      App layouts
  pages/        Route-level pages
  redux/        Redux Toolkit store and slices
  routes/       React Router configuration and guards
  services/     API and browser persistence services
  styles/       Global Tailwind CSS
  types/        Shared TypeScript types
  utils/        Formatting and normalization helpers
```

## Redux Slices

- `authSlice`
- `productsSlice`
- `categoriesSlice`
- `brandsSlice`
- `cartSlice`
- `wishlistSlice`
- `ordersSlice`
- `notificationsSlice`
- `usersSlice`
- `reportsSlice`

## Route Guards

- `ProtectedRoute` protects authenticated customer pages.
- `RoleRoute` protects role-based pages such as `/admin`.
