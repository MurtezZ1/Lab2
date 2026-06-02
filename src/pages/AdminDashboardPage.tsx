import { FormEvent, useEffect, useState } from "react";
import { BarChart3, Package, Upload, Users } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { downloadReport } from "@/services/reportExportService";
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
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-primary" />
        Admin Dashboard
      </h1>

      {message && <div className="mb-6 glass-card rounded-2xl p-4 text-sm text-green-300">{message}</div>}

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card rounded-2xl p-6"><Package className="w-7 h-7 text-primary" /><p className="mt-6 text-sm text-gray-400">Products</p><h2 className="text-3xl font-black text-white">{products.length}</h2></div>
        <div className="glass-card rounded-2xl p-6"><Users className="w-7 h-7 text-accent" /><p className="mt-6 text-sm text-gray-400">Users</p><h2 className="text-3xl font-black text-white">{users.length}</h2></div>
        <div className="glass-card rounded-2xl p-6"><BarChart3 className="w-7 h-7 text-purple-400" /><p className="mt-6 text-sm text-gray-400">Orders</p><h2 className="text-3xl font-black text-white">{orders.length}</h2></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <form onSubmit={createAdminProduct} className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Products Management</h2>
          {["name", "manufacturer", "type", "price", "image"].map((field) => (
            <input key={field} name={field} required={field !== "image"} placeholder={field} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          ))}
          <textarea name="description" placeholder="description" className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          <button className="rounded-xl bg-primary px-4 py-2 font-bold text-white">Save Product</button>
        </form>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Categories & Brands Management</h2>
          <form onSubmit={(event) => createNamedEntity(event, "category")} className="flex gap-3">
            <input name="name" placeholder="Category name" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
            <button className="rounded-xl bg-primary px-4 py-2 font-bold text-white">Save</button>
          </form>
          <form onSubmit={(event) => createNamedEntity(event, "brand")} className="flex gap-3">
            <input name="name" placeholder="Brand name" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
            <button className="rounded-xl bg-primary px-4 py-2 font-bold text-white">Save</button>
          </form>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 mt-8">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Upload className="w-5 h-5 text-primary" /> Product Image Upload</h2>
        <input type="file" accept="image/*" className="mt-4 block w-full text-sm text-gray-300 file:mr-4 file:rounded-xl file:border-0 file:bg-primary file:px-4 file:py-2 file:font-bold file:text-white" />
      </div>

      <div className="glass-card rounded-2xl p-6 mt-8">
        <h2 className="text-xl font-bold text-white">Orders / Users / Support Tickets Management</h2>
        <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm text-gray-300">
          <div>Latest users: {users.slice(0, 3).map((user) => user.username).join(", ") || "none"}</div>
          <div>Latest orders: {orders.slice(0, 3).map((order) => order.orderNumber).join(", ") || "none"}</div>
          <div>Support tickets: {tickets.length}</div>
        </div>
      </div>

      {cms && (
        <div className="glass-card rounded-2xl p-6 mt-8 space-y-4">
          <h2 className="text-xl font-bold text-white">CMS Management</h2>
          <input value={cms.hero.title} onChange={(event) => setCms({ ...cms, hero: { ...cms.hero, title: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          <input value={cms.hero.subtitle} onChange={(event) => setCms({ ...cms, hero: { ...cms.hero, subtitle: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          <input value={cms.homepage.featuredTitle} onChange={(event) => setCms({ ...cms, homepage: { featuredTitle: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          <input value={cms.footer.text} onChange={(event) => setCms({ ...cms, footer: { text: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          <input value={cms.about.text} onChange={(event) => setCms({ ...cms, about: { text: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          <input value={cms.contact.email} onChange={(event) => setCms({ ...cms, contact: { email: event.target.value } })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          <button onClick={saveCms} className="rounded-xl bg-primary px-4 py-2 font-bold text-white">Save CMS</button>
        </div>
      )}

      <div className="glass-card rounded-2xl p-6 mt-8">
        <h2 className="text-xl font-bold text-white">Reports Management</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => downloadReport("pdf")} className="rounded-xl bg-primary px-4 py-2 font-bold text-white">PDF Export</button>
          <button onClick={() => downloadReport("excel")} className="rounded-xl border border-white/10 px-4 py-2 font-bold text-gray-200">Excel Export</button>
          <button onClick={() => downloadReport("csv")} className="rounded-xl border border-white/10 px-4 py-2 font-bold text-gray-200">CSV Export</button>
        </div>
      </div>
    </div>
  );
}
