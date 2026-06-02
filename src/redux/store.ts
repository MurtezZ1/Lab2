import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import brandsReducer from "@/redux/slices/brandsSlice";
import cartReducer from "@/redux/slices/cartSlice";
import categoriesReducer from "@/redux/slices/categoriesSlice";
import notificationsReducer from "@/redux/slices/notificationsSlice";
import ordersReducer from "@/redux/slices/ordersSlice";
import productsReducer from "@/redux/slices/productsSlice";
import reportsReducer from "@/redux/slices/reportsSlice";
import usersReducer from "@/redux/slices/usersSlice";
import wishlistReducer from "@/redux/slices/wishlistSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    categories: categoriesReducer,
    brands: brandsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: ordersReducer,
    notifications: notificationsReducer,
    users: usersReducer,
    reports: reportsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
