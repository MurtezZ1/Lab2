import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setNotifications } from "@/redux/slices/notificationsSlice";
import { getNotifications, markNotificationsRead } from "@/services/notificationService";
import { Bell } from "lucide-react";
import { useEffect } from "react";

export default function NotificationsPage() {
  const notifications = useAppSelector((state) => state.notifications.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setNotifications(getNotifications()));
  }, [dispatch]);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Bell className="w-8 h-8 text-primary" />
          Notifications
        </h1>
        <button onClick={() => dispatch(setNotifications(markNotificationsRead()))} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-200 hover:bg-white/5">
          Mark all read
        </button>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-bold text-white">{notification.title}</h2>
                <p className="mt-1 text-sm text-gray-400">{notification.message}</p>
              </div>
              {notification.unread && <span className="rounded-full bg-primary px-2 py-1 text-xs font-bold text-white">New</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
