import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { updateProductInventory } from "@/services/adminService";
import { getProductById, updateProduct } from "@/services/productService";
import type { Product } from "@/types";

const fields: Array<{ name: keyof Product | "stock_quantity"; label: string; type?: string }> = [
  { name: "name", label: "Product Name" },
  { name: "manufacturer", label: "Brand / Manufacturer" },
  { name: "model", label: "Model" },
  { name: "type", label: "Category" },
  { name: "price", label: "Price", type: "number" },
  { name: "year", label: "Year", type: "number" },
  { name: "processor", label: "Processor" },
  { name: "ram_size", label: "RAM" },
  { name: "storage", label: "Storage" },
  { name: "display", label: "Display" },
  { name: "os", label: "Operating System" },
  { name: "battery", label: "Battery" },
  { name: "weight", label: "Weight" },
  { name: "dimensions", label: "Dimensions" },
  { name: "keyboard", label: "Keyboard" },
  { name: "ports", label: "Ports" },
  { name: "connectivity", label: "Connectivity" },
  { name: "camera", label: "Camera" },
  { name: "stock_quantity", label: "Stock Quantity", type: "number" },
  { name: "image", label: "Main Image URL" },
];

export default function AdminProductEditPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProductById(id).then(setProduct);
  }, [id]);

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setProduct((current) => (current ? { ...current, [name]: value } : current));
  };

  const uploadPreview = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProduct((current) => (current ? { ...current, image: String(reader.result ?? "") } : current));
    reader.readAsDataURL(file);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!id || !product) return;
    setSaving(true);
    setMessage("");
    try {
      const saved = await updateProduct(id, {
        ...product,
        price: Number(product.price),
        year: product.year ? Number(product.year) : null,
        is_active: product.is_active !== false,
      });
      await updateProductInventory(saved.uuid ?? saved.id, Number(product.stock_quantity ?? 0));
      setProduct(saved);
      setMessage("Product updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Product could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  if (!product) return <div className="glass-card rounded-2xl p-8 text-gray-400">Loading product...</div>;

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>
          <h1 className="mt-3 text-3xl font-black text-white">Edit Product</h1>
          <p className="mt-2 text-gray-400">{product.name}</p>
        </div>
        <button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-white hover:bg-primary/80 disabled:opacity-60">
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-white">{message}</div>}

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="glass-card rounded-2xl p-6">
          <div className="aspect-square rounded-2xl border border-white/10 bg-black/30 p-5">
            <img src={product.image || "/file.svg"} alt={product.name} className="h-full w-full object-contain" />
          </div>
          <label className="mt-4 block rounded-xl border border-dashed border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-300">
            <span className="mb-2 flex items-center gap-2 font-bold text-white">
              <ImagePlus className="h-4 w-4 text-accent" />
              Upload Image Preview
            </span>
            <input type="file" accept="image/*" onChange={uploadPreview} className="w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:font-bold file:text-white" />
          </label>
          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-bold uppercase text-gray-500">Publish Status</span>
            <select name="is_active" value={product.is_active === false ? "false" : "true"} onChange={(event) => setProduct({ ...product, is_active: event.target.value === "true" })} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-primary">
              <option value="true">Active / Published</option>
              <option value="false">Inactive / Draft</option>
            </select>
          </label>
        </section>

        <section className="glass-card rounded-2xl p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <label key={field.name} className="block">
                <span className="mb-2 block text-xs font-bold uppercase text-gray-500">{field.label}</span>
                <input
                  name={field.name}
                  type={field.type ?? "text"}
                  value={String(product[field.name as keyof Product] ?? "")}
                  onChange={updateField}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-primary"
                />
              </label>
            ))}
          </div>
          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-bold uppercase text-gray-500">Description</span>
            <textarea name="description" value={product.description ?? ""} onChange={updateField} rows={4} className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-primary" />
          </label>
          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-bold uppercase text-gray-500">Additional Features</span>
            <textarea name="additional_features" value={product.additional_features ?? ""} onChange={updateField} rows={3} className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-primary" />
          </label>
        </section>
      </div>
    </form>
  );
}
