import { Route, Routes } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AccountPage from "@/pages/AccountPage";
import CartPage from "@/pages/CartPage";
import CategoriesPage from "@/pages/CategoriesPage";
import CategoryPage from "@/pages/CategoryPage";
import DealsPage from "@/pages/DealsPage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import CheckoutPage from "@/pages/CheckoutPage";
import NotificationsPage from "@/pages/NotificationsPage";
import OrderHistoryPage from "@/pages/OrderHistoryPage";
import ProductDetailsPage from "@/pages/ProductDetailsPage";
import ProductsPage from "@/pages/ProductsPage";
import SupportTicketsPage from "@/pages/SupportTicketsPage";
import UserDashboardPage from "@/pages/UserDashboardPage";
import WishlistPage from "@/pages/WishlistPage";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleRoute from "@/routes/RoleRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/support" element={<SupportTicketsPage />} />
        </Route>
        <Route element={<RoleRoute roles={["admin", "Admin"]} />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
