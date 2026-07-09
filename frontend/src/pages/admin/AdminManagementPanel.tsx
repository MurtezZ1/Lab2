import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Order, Product, SupportTicket, User } from "@/types";
import { Eye, ImagePlus, PackageCheck } from "lucide-react";

type AdminManagementPanelProps = {
  users: User[];
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
  const [preview, setPreview] = useState({
    name: "Product preview",
    manufacturer: "Brand",
    type: "Category",
    price: "0",
    image: "/file.svg",
    description: "Preview appears here before publishing.",
  });

  const updatePreview = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setPreview((current) => ({ ...current, [name]: value }));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result ?? "");
      setPreview((current) => ({ ...current, image }));
      const hiddenInput = event.currentTarget.form?.elements.namedItem("image") as HTMLInputElement | null;
      if (hiddenInput) hiddenInput.value = image;
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
        <form onSubmit={onSaveProduct} className="glass-card rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-3">
            <PackageCheck className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-white">Products Management</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field name="name" label="Product Name" required onChange={updatePreview} />
            <Field name="manufacturer" label="Brand / Manufacturer" required onChange={updatePreview} />
            <Field name="model" label="Model" onChange={updatePreview} />
            <Field name="type" label="Category" required onChange={updatePreview} />
            <Field name="price" label="Price" type="number" required onChange={updatePreview} />
            <Field name="year" label="Year" type="number" onChange={updatePreview} />
            <Field name="processor" label="Processor" onChange={updatePreview} />
            <Field name="ram_size" label="RAM" onChange={updatePreview} />
            <Field name="storage" label="Storage" onChange={updatePreview} />
            <Field name="display" label="Display" onChange={updatePreview} />
            <Field name="battery" label="Battery" onChange={updatePreview} />
            <Field name="stock_quantity" label="Stock Quantity" type="number" onChange={updatePreview} />
            <Field name="image" label="Product Image URL" onChange={updatePreview} />
            <label className="rounded-xl border border-dashed border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-300">
              <span className="mb-2 flex items-center gap-2 font-bold text-white">
                <ImagePlus className="h-4 w-4 text-accent" />
                Upload Image Preview
              </span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:font-bold file:text-white" />
            </label>
            <label className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-300">
              <span className="mb-2 block font-bold text-white">Status</span>
              <select name="is_active" defaultValue="true" className="w-full bg-transparent text-white outline-none">
                <option value="true">Active / Published</option>
                <option value="false">Inactive / Draft</option>
              </select>
            </label>
          </div>
          <textarea
            name="description"
            placeholder="Detailed product description"
            onChange={updatePreview}
            className="mt-4 min-h-28 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />
          <textarea
            name="additional_features"
            placeholder="Extra features"
            className="mt-4 min-h-20 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />
          <button className="mt-5 rounded-xl bg-primary px-5 py-3 font-bold text-white transition-colors hover:bg-primary/90">
            Save Product
          </button>
        </form>

        <div className="glass-card rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-3">
            <Eye className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-bold text-white">Preview Before Publish</h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="aspect-square rounded-xl bg-black/30 p-4">
              <img src={preview.image || "/file.svg"} alt={preview.name} className="h-full w-full object-contain" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase text-primary">{preview.manufacturer}</p>
            <h3 className="mt-1 text-xl font-black text-white">{preview.name}</h3>
            <p className="mt-2 text-sm capitalize text-gray-400">{preview.type}</p>
            <p className="mt-3 text-2xl font-black text-white">${Number(preview.price || 0).toFixed(2)}</p>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">{preview.description}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4 xl:col-span-2">
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

function Field({
  name,
  label,
  type = "text",
  required = false,
  onChange,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase text-gray-500">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        onChange={onChange}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-primary"
      />
    </label>
  );
}
