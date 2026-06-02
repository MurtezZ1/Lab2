import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCartItems } from "@/redux/slices/cartSlice";
import { getCartItems } from "@/services/cartService";
import { useEffect } from "react";

export default function MainLayout() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCartItems(getCartItems(user)));
  }, [dispatch, user]);

  return (
    <main className="min-h-screen bg-dark-bg text-foreground selection:bg-primary selection:text-white">
      <Navbar />
      <div className="pt-24">
        <Outlet />
      </div>
    </main>
  );
}
