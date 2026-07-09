import { useEffect, useMemo, useState } from "react";
import { Download, Eye, PackageCheck, RefreshCw, Search, Truck } from "lucide-react";
import { downloadInvoice, generateInvoice, viewInvoice } from "@/services/invoiceService";
import { getAdminOrders, updateAdminOrderStatus } from "@/services/adminService";
import type { Order } from "@/types";

const statuses = ["ALL", "PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"] as const;
const mutableStatuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<(typeof statuses)[number]>("ALL");
  const [search, setSearch] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const filteredOrders = useMemo(() => {
    const value = search.trim().toLowerCase();
    return orders.filter((order) => {
      const statusMatches = status === "ALL" || order.status === status;
      const searchMatches = !value || order.orderNumber.toLowerCase().includes(value) || order.id.toLowerCase().includes(value);
      return statusMatches && searchMatches;
    });
  }, [orders, search, status]);

  const loadOrders = async () => {
    setLoading(true);
    setMessage("");
    try {
      setOrders(await getAdminOrders());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Orders could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const changeStatus = async (order: Order, nextStatus: string) => {
    setMessage("");
    const updatedOrder = await updateAdminOrderStatus(order.id, nextStatus);
    setOrders((items) => items.map((item) => (item.id === updatedOrder.id ? updatedOrder : item)));
    setMessage(`Order ${updatedOrder.orderNumber} updated to ${updatedOrder.status}.`);
  };

  const handleGenerateInvoice = async (order: Order) => {
    await generateInvoice(order.id);
    setMessage(`Invoice generated for ${order.orderNumber}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-primary">Admin Commerce</p>
          <h1 className="mt-2 text-3xl font-black text-white">Orders Management</h1>
          <p className="mt-2 text-gray-400">Review orders, update fulfillment status, inspect products and manage invoices.</p>
        </div>
        <button onClick={loadOrders} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white hover:border-primary/40">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Orders
        </button>
      </div>

      {message && <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-white">{message}</div>}

      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative lg:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order number..."
              className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((item) => (
              <button
                key={item}
                onClick={() => setStatus(item)}
                className={`rounded-xl border px-3 py-2 text-xs font-black transition-colors ${status === item ? "border-primary bg-primary text-white" : "border-white/10 text-gray-300 hover:border-primary/40"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const isExpanded = expandedOrderId === order.id;
          const payment = order.payments?.[0];
          return (
            <article key={order.id} className="glass-card overflow-hidden rounded-2xl">
              <div className="grid gap-4 p-5 lg:grid-cols-[1.3fr_0.8fr_0.8fr_auto] lg:items-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-gray-500">Order</p>
                  <h2 className="mt-1 text-xl font-black text-white">{order.orderNumber}</h2>
                  <p className="mt-1 text-sm text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-gray-500">Total</p>
                  <p className="mt-1 text-lg font-black text-white">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">Payment: {payment?.status ?? "PENDING"}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-gray-500">Status</p>
                  <select
                    value={order.status}
                    onChange={(event) => changeStatus(order, event.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm font-bold text-white outline-none focus:border-primary"
                  >
                    {mutableStatuses.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setExpandedOrderId(isExpanded ? null : order.id)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white hover:border-primary/40">
                    <Eye className="h-4 w-4" />
                    {isExpanded ? "Hide" : "View"}
                  </button>
                  <button onClick={() => handleGenerateInvoice(order)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white hover:border-primary/40">
                    <PackageCheck className="h-4 w-4" />
                    Invoice
                  </button>
                  <button onClick={() => downloadInvoice(order.id, `${order.orderNumber}.pdf`)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white hover:border-primary/40">
                    <Download className="h-4 w-4" />
                    PDF
                  </button>
                  <button onClick={() => viewInvoice(order.id)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white hover:border-primary/40">
                    View PDF
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-white/10 p-5">
                  <div className="mb-4 flex items-center gap-2 text-sm font-black text-white">
                    <Truck className="h-4 w-4 text-primary" />
                    Ordered Products
                  </div>
                  <div className="grid gap-3">
                    {order.items.map((item) => (
                      <div key={item.id ?? `${order.id}-${item.productId}`} className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/20 p-3">
                        <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-white">{item.name}</p>
                          <p className="text-sm text-gray-400">Qty {item.quantity} x ${item.price.toFixed(2)}</p>
                        </div>
                        <p className="font-black text-white">${item.subtotal.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
        {!loading && filteredOrders.length === 0 && (
          <div className="glass-card rounded-2xl p-8 text-center text-gray-400">No orders match the current filters.</div>
        )}
      </div>
    </div>
  );
}
