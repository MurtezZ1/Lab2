import { useEffect, useMemo, useState } from "react";
import { Edit, Package, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { getProductsPage } from "@/services/productService";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductsPage({ includeInactive: "true" })
      .then((data) => setProducts(data.items ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return products;
    return products.filter((product) =>
      [product.name, product.manufacturer, product.model, product.type].some((item) => String(item ?? "").toLowerCase().includes(value)),
    );
  }, [products, search]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.25em] text-primary">Admin Catalog</p>
        <h1 className="mt-2 text-3xl font-black text-white">Products Management</h1>
        <p className="mt-2 text-gray-400">Open a dedicated edit page for product specs, image, price, stock and publish status.</p>
      </div>

      <div className="glass-card rounded-2xl p-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <article key={product.uuid ?? product.id} className="glass-card rounded-2xl p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="h-20 w-20 shrink-0 rounded-xl border border-white/10 bg-black/30 p-2">
                <img src={product.image || "/file.svg"} alt={product.name} className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-wide text-primary">{product.manufacturer}</p>
                <h2 className="truncate text-xl font-black text-white">{product.name}</h2>
                <p className="mt-1 text-sm text-gray-400">{product.model || product.type} · Stock {product.stock_quantity ?? 0}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-black text-white">${Number(product.price).toFixed(2)}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${product.is_active === false ? "bg-yellow-400/10 text-yellow-300" : "bg-green-400/10 text-green-300"}`}>
                  {product.is_active === false ? "Draft" : "Active"}
                </span>
                <Link to={`/admin/products/${product.id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white hover:border-primary/40">
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
              </div>
            </div>
          </article>
        ))}
        {!loading && !filteredProducts.length && (
          <div className="glass-card rounded-2xl p-8 text-center text-gray-400">No products found.</div>
        )}
        {loading && (
          <div className="glass-card rounded-2xl p-8 text-center text-gray-400">
            <Package className="mx-auto mb-3 h-6 w-6 text-primary" />
            Loading products...
          </div>
        )}
      </div>
    </div>
  );
}
