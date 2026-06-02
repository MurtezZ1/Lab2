import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCartItems } from "@/redux/slices/cartSlice";
import { getCartItems } from "@/services/cartService";
import { useEffect } from "react";
import { connectSocket, socket } from "@/services/socketService";
import { setNotifications } from "@/redux/slices/notificationsSlice";
import { getNotifications } from "@/services/notificationService";

export default function MainLayout() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCartItems(getCartItems(user)));
  }, [dispatch, user]);

  useEffect(() => {
    connectSocket();
    const onNotification = (payload: { title: string; message: string }) => {
      const current = getNotifications();
      const next = [
        {
          id: crypto.randomUUID(),
          title: payload.title,
          message: payload.message,
          unread: true,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ];
      window.localStorage.setItem("sunspot_notifications", JSON.stringify(next));
      dispatch(setNotifications(next));
    };
    socket.on("notification", onNotification);
    socket.on("order:update", onNotification);
    socket.on("dashboard:update", () => {});
    return () => {
      socket.off("notification", onNotification);
      socket.off("order:update", onNotification);
    };
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-dark-bg text-foreground selection:bg-primary selection:text-white">
      <Navbar />
      <div className="pt-24">
        <Outlet />
      </div>
    </main>
  );
}
