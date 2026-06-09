import { FormEvent, lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, FileClock, Package, Upload, Users } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import {
  getAdminOrders,
  getAdminSupportTickets,
  getAdminUsers,
  saveBrand,
  saveCategory,
  saveProduct,
} from "@/services/adminService";
import { getCmsContent, type CmsContent, updateCmsContent } from "@/services/cmsService";
import type { Order, SupportTicket } from "@/types";

const AdminManagementPanel = lazy(() => import("@/pages/admin/AdminManagementPanel"));
const AdminCmsPanel = lazy(() => import("@/pages/admin/AdminCmsPanel"));
const AdminReportsPanel = lazy(() => import("@/pages/admin/AdminReportsPanel"));

function PanelLoader() {
  return <div className="glass-card rounded-2xl p-6 mt-8 text-sm text-gray-400">Loading...</div>;
}

export default function AdminDashboardPage() {
  const { products } = useProducts();
  const [users, setUsers] = useState<Array<{ id: string; email: string; username: string; role: string }>>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [cms, setCms] = useState<CmsContent | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      getAdminUsers().catch(() => []),
      getAdminOrders().catch(() => []),
      getAdminSupportTickets().catch(() => []),
      getCmsContent().catch(() => null),
    ]).then(([nextUsers, nextOrders, nextTickets, nextCms]) => {
      setUsers(nextUsers);
      setOrders(nextOrders);
      setTickets(nextTickets);
      setCms(nextCms);
    });
  }, []);

  const createNamedEntity = async (event: FormEvent<HTMLFormElement>, type: "category" | "brand") => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = String(new FormData(form).get("name") ?? "").trim();
    if (!name) return;
    await (type === "category" ? saveCategory(name) : saveBrand(name));
    setMessage(`${type} saved.`);
    form.reset();
  };

  const createAdminProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    await saveProduct({
      name: String(data.get("name") ?? ""),
      manufacturer: String(data.get("manufacturer") ?? ""),
      type: String(data.get("type") ?? "product"),
      price: Number(data.get("price") ?? 0),
      image: String(data.get("image") ?? "/file.svg"),
      description: String(data.get("description") ?? ""),
    });
    setMessage("Product saved.");
    form.reset();
  };

  const saveCms = async () => {
    if (!cms) return;
    setCms(await updateCmsContent(cms));
    setMessage("CMS content saved.");
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          Admin Dashboard
        </h1>
        <Link
          to="/admin/audit-logs"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-200 hover:border-primary/40 hover:text-white"
        >
          <FileClock className="h-4 w-4 text-accent" />
          Audit Logs
        </Link>
      </div>

      {message && <div className="mb-6 glass-card rounded-2xl p-4 text-sm text-green-300">{message}</div>}

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-6"><Package className="w-7 h-7 text-primary" /><p className="mt-6 text-sm text-gray-400">Products</p><h2 className="text-3xl font-black text-white">{products.length}</h2></div>
        <div className="glass-card rounded-2xl p-6"><Users className="w-7 h-7 text-accent" /><p className="mt-6 text-sm text-gray-400">Users</p><h2 className="text-3xl font-black text-white">{users.length}</h2></div>
        <div className="glass-card rounded-2xl p-6"><BarChart3 className="w-7 h-7 text-purple-400" /><p className="mt-6 text-sm text-gray-400">Orders</p><h2 className="text-3xl font-black text-white">{orders.length}</h2></div>
      </div>

      <Suspense fallback={<PanelLoader />}>
        <AdminManagementPanel
          users={users}
          orders={orders}
          tickets={tickets}
          onSaveNamedEntity={createNamedEntity}
          onSaveProduct={createAdminProduct}
        />
      </Suspense>

      <div className="glass-card rounded-2xl p-6 mt-8">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Upload className="w-5 h-5 text-primary" /> Product Image Upload</h2>
        <input type="file" accept="image/*" className="mt-4 block w-full text-sm text-gray-300 file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-4 file:py-2 file:font-bold file:text-white" />
      </div>

      {cms && (
        <Suspense fallback={<PanelLoader />}>
          <AdminCmsPanel cms={cms} onChange={setCms} onSave={saveCms} />
        </Suspense>
      )}

      <Suspense fallback={<PanelLoader />}>
        <AdminReportsPanel />
      </Suspense>
    </div>
  );
}
