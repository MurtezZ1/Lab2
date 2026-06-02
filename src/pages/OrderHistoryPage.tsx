import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setOrders } from "@/redux/slices/ordersSlice";
import { getOrders } from "@/services/orderService";
import { formatPrice } from "@/utils/products";
import { PackageSearch } from "lucide-react";
import { useEffect } from "react";

export default function OrderHistoryPage() {
  const user = useAppSelector((state) => state.auth.user);
  const orders = useAppSelector((state) => state.orders.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setOrders(getOrders(user)));
  }, [dispatch, user]);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <PackageSearch className="w-8 h-8 text-primary" />
        Order History
      </h1>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-gray-400">No orders yet.</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-bold text-white">{order.orderNumber}</h2>
                <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-sm text-gray-300">{order.status}</div>
              <div className="text-xl font-bold text-primary">{formatPrice(order.total)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
