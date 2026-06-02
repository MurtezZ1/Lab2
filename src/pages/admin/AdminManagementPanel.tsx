import type { FormEvent } from "react";
import type { Order, Product, SupportTicket } from "@/types";

type AdminManagementPanelProps = {
  users: Array<{ id: string; email: string; username: string; role: string }>;
  orders: Order[];
  tickets: SupportTicket[];
  onSaveNamedEntity: (event: FormEvent<HTMLFormElement>, type: "category" | "brand") => void;
  onSaveProduct: (event: FormEvent<HTMLFormElement>) => void;
};

export default function AdminManagementPanel({
  users,
  orders,
  tickets,
  onSaveNamedEntity,
  onSaveProduct,
}: AdminManagementPanelProps) {
  return (
    <>
      <div className="grid lg:grid-cols-2 gap-8">
        <form onSubmit={onSaveProduct} className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Products Management</h2>
          {["name", "manufacturer", "type", "price", "image"].map((field) => (
            <input key={field} name={field} required={field !== "image"} placeholder={field} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          ))}
          <textarea name="description" placeholder="description" className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
          <button className="rounded-xl bg-primary px-4 py-2 font-bold text-white">Save Product</button>
        </form>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Categories & Brands Management</h2>
          <form onSubmit={(event) => onSaveNamedEntity(event, "category")} className="flex gap-3">
            <input name="name" placeholder="Category name" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
            <button className="rounded-xl bg-primary px-4 py-2 font-bold text-white">Save</button>
          </form>
          <form onSubmit={(event) => onSaveNamedEntity(event, "brand")} className="flex gap-3">
            <input name="name" placeholder="Brand name" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none" />
            <button className="rounded-xl bg-primary px-4 py-2 font-bold text-white">Save</button>
          </form>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 mt-8">
        <h2 className="text-xl font-bold text-white">Orders / Users / Support Tickets Management</h2>
        <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm text-gray-300">
          <div>Latest users: {users.slice(0, 3).map((user) => user.username).join(", ") || "none"}</div>
          <div>Latest orders: {orders.slice(0, 3).map((order) => order.orderNumber).join(", ") || "none"}</div>
          <div>Support tickets: {tickets.length}</div>
        </div>
      </div>
    </>
  );
}
