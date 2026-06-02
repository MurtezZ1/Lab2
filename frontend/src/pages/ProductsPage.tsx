import ProductCard from "@/components/ProductCard";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import { useProducts } from "@/hooks/useProducts";
import { Filter, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

export default function ProductsPage() {
  const { products } = useProducts();
  const [brandFilter, setBrandFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const manufacturers = Array.from(new Set(products.map((product) => product.manufacturer)));
  const categories = Array.from(new Set(products.map((product) => product.type)));
  const pageSize = 6;

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesBrand = brandFilter === "all" || product.manufacturer === brandFilter;
      const matchesCategory = categoryFilter === "all" || product.type === categoryFilter;
      return matchesBrand && matchesCategory;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "brand") return a.manufacturer.localeCompare(b.manufacturer);
      return a.name.localeCompare(b.name);
    });
  }, [brandFilter, categoryFilter, products, sortBy]);

  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / pageSize));
  const pageProducts = visibleProducts.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="glass-card p-6 rounded-2xl sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-white font-bold text-lg">
              <Filter className="w-5 h-5 text-primary" />
              Filters
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center justify-between">
                  Brands
                  <ChevronDown className="w-4 h-4" />
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="brand"
                      checked={brandFilter === "all"}
                      onChange={() => {
                        setBrandFilter("all");
                        setPage(1);
                      }}
                      className="accent-primary"
                    />
                    <span className="text-gray-400 group-hover:text-white transition-colors text-sm">All Brands</span>
                  </label>
                  {manufacturers.map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="brand"
                        checked={brandFilter === brand}
                        onChange={() => {
                          setBrandFilter(brand);
                          setPage(1);
                        }}
                        className="accent-primary"
                      />
                      <span className="text-gray-400 group-hover:text-white transition-colors text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center justify-between">
                  Category
                  <ChevronDown className="w-4 h-4" />
                </h3>
                <select
                  value={categoryFilter}
                  onChange={(event) => {
                    setCategoryFilter(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center justify-between">
                  Sort By
                  <ChevronDown className="w-4 h-4" />
                </h3>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="brand">Brand</option>
                </select>
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center justify-between">
                  Price Range
                  <ChevronDown className="w-4 h-4" />
                </h3>
                <PriceRangeFilter />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">All Products</h1>
            <div className="text-sm text-gray-400 glass px-4 py-2 rounded-lg border border-white/10">
              Showing {visibleProducts.length} results
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-gray-300 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">Page {page} of {pageCount}</span>
            <button
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              disabled={page === pageCount}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-gray-300 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
