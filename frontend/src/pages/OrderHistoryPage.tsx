import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setOrders } from "@/redux/slices/ordersSlice";
import EmptyState from "@/components/EmptyState";
import OrderTimeline from "@/components/OrderTimeline";
import { downloadInvoice, generateInvoice, viewInvoice } from "@/services/invoiceService";
import { getOrders } from "@/services/orderService";
import { formatPrice } from "@/utils/products";
import { Download, Eye, PackageSearch } from "lucide-react";
import { useEffect } from "react";

export default function OrderHistoryPage() {
  const user = useAppSelector((state) => state.auth.user);
  const orders = useAppSelector((state) => state.orders.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let active = true;
    getOrders(user).then((items) => {
      if (active) dispatch(setOrders(items));
    });
    return () => {
      active = false;
    };
  }, [dispatch, user]);

  const handleInvoice = async (orderId: string, mode: "download" | "view") => {
    const invoice = await generateInvoice(orderId).catch(() => null);
    const filename = invoice ? `${invoice.invoiceNumber}.pdf` : "invoice.pdf";
    if (mode === "download") await downloadInvoice(orderId, filename);
    else await viewInvoice(orderId);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <PackageSearch className="w-8 h-8 text-primary" />
        Order History
      </h1>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No orders yet"
            description="Your completed purchases, payment status, shipment progress, and invoices will appear here."
            actionLabel="Start Shopping"
            actionTo="/products"
          />
        ) : (
          orders.map((order) => (
            <div key={order.id} className="glass-card rounded-2xl p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="font-bold text-white">{order.orderNumber}</h2>
                  <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-sm font-bold uppercase text-gray-300">{order.status}</div>
                <div className="text-xl font-bold text-primary">{formatPrice(order.total)}</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void handleInvoice(order.id, "download")}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-gray-200 hover:border-primary/40"
                  >
                    <Download className="h-4 w-4" />
                    Download Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleInvoice(order.id, "view")}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-gray-200 hover:border-primary/40"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                </div>
              </div>
              <OrderTimeline order={order} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
