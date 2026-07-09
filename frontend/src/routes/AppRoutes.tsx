import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleRoute from "@/routes/RoleRoute";

const AccountPage = lazy(() => import("@/pages/AccountPage"));
const AdminAuditLogsPage = lazy(() => import("@/pages/AdminAuditLogsPage"));
const AdminAnalyticsDashboardPage = lazy(() => import("@/pages/AdminAnalyticsDashboardPage"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage"));
const AdminLaunchReadinessPage = lazy(() => import("@/pages/AdminLaunchReadinessPage"));
const AdminProductEditPage = lazy(() => import("@/pages/AdminProductEditPage"));
const AdminProductsPage = lazy(() => import("@/pages/AdminProductsPage"));
const AdminOrdersPage = lazy(() => import("@/pages/AdminOrdersPage"));
const AdminRolesPage = lazy(() => import("@/pages/AdminRolesPage"));
const AdminSectionPage = lazy(() => import("@/pages/AdminSectionPage"));
const AdminSystemMonitorPage = lazy(() => import("@/pages/AdminSystemMonitorPage"));
const AdminUsersPage = lazy(() => import("@/pages/AdminUsersPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const ComparePage = lazy(() => import("@/pages/ComparePage"));
const CategoriesPage = lazy(() => import("@/pages/CategoriesPage"));
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const DealsPage = lazy(() => import("@/pages/DealsPage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const OrderHistoryPage = lazy(() => import("@/pages/OrderHistoryPage"));
const PaymentFailedPage = lazy(() => import("@/pages/PaymentFailedPage"));
const PaymentSuccessPage = lazy(() => import("@/pages/PaymentSuccessPage"));
const Product3DModelsPage = lazy(() => import("@/pages/Product3DModelsPage"));
const ProductDetailsPage = lazy(() => import("@/pages/ProductDetailsPage"));
const ProductsPage = lazy(() => import("@/pages/ProductsPage"));
const SupportTicketsPage = lazy(() => import("@/pages/SupportTicketsPage"));
const StaticContentPage = lazy(() => import("@/pages/StaticContentPage"));
const UserDashboardPage = lazy(() => import("@/pages/UserDashboardPage"));
const WishlistPage = lazy(() => import("@/pages/WishlistPage"));

function RouteLoader() {
  return <div className="container mx-auto px-6 py-12 text-gray-400">Loading...</div>;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/3d-models" element={<Product3DModelsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/about" element={<StaticContentPage page="about" />} />
          <Route path="/contact" element={<StaticContentPage page="contact" />} />
          <Route path="/privacy-policy" element={<StaticContentPage page="privacy" />} />
          <Route path="/terms-of-service" element={<StaticContentPage page="terms" />} />
          <Route path="/returns-policy" element={<StaticContentPage page="returns" />} />
          <Route path="/shipping-policy" element={<StaticContentPage page="shipping" />} />
          <Route path="/cookie-policy" element={<StaticContentPage page="cookies" />} />
          <Route path="/account" element={<AccountPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/payment-failed" element={<PaymentFailedPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/support" element={<SupportTicketsPage />} />
          </Route>
          <Route element={<RoleRoute roles={["admin", "Admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/launch-readiness" element={<AdminLaunchReadinessPage />} />
              <Route path="/admin/system-monitor" element={<AdminSystemMonitorPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/roles" element={<AdminRolesPage />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/products/:id/edit" element={<AdminProductEditPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/reports" element={<AdminSectionPage section="reports" />} />
              <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
              <Route path="/admin/cms" element={<AdminSectionPage section="cms" />} />
              <Route path="/admin/notifications" element={<AdminSectionPage section="notifications" />} />
              <Route path="/admin/settings" element={<AdminSectionPage section="settings" />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsDashboardPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
