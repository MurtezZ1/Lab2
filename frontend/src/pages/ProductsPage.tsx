import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { useProducts } from "@/hooks/useProducts";
import { Filter, ChevronDown, SearchX, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const productsHook = useProducts({ pageSize: 100 });
  const products = productsHook.products;
  const [brandFilter, setBrandFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchTerm = String(searchParams.get("search") ?? "").trim().toLowerCase();
  const manufacturers = Array.from(new Set(products.map((product) => product.manufacturer)));
  const categories = Array.from(new Set(products.map((product) => product.type)));
  const pageSize = 6;

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesBrand = brandFilter === "all" || product.manufacturer === brandFilter;
      const matchesCategory = categoryFilter === "all" || product.type === categoryFilter;
      const searchable = [
        product.name,
        product.manufacturer,
        product.model,
        product.type,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !searchTerm || searchable.includes(searchTerm);
      return matchesBrand && matchesCategory && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "brand") return a.manufacturer.localeCompare(b.manufacturer);
      return a.name.localeCompare(b.name);
    });
  }, [brandFilter, categoryFilter, products, searchTerm, sortBy]);

  const pageCount = Math.max(1, Math.ceil(visibleProducts.length / pageSize));
  const pageProducts = visibleProducts.slice((page - 1) * pageSize, page * pageSize);

  const filterPanel = (
    <FilterPanel
      brandFilter={brandFilter}
      categoryFilter={categoryFilter}
      sortBy={sortBy}
      manufacturers={manufacturers}
      categories={categories}
      onBrandChange={(value) => {
        setBrandFilter(value);
        setPage(1);
      }}
      onCategoryChange={(value) => {
        setCategoryFilter(value);
        setPage(1);
      }}
      onSortChange={(value) => {
        setSortBy(value);
        setPage(1);
      }}
    />
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
      <button
        type="button"
        onClick={() => setIsFilterOpen(true)}
        className="mb-5 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white lg:hidden"
      >
        <Filter className="h-4 w-4 text-primary" />
        Filters & Sort
      </button>

      {isFilterOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button className="absolute inset-0 bg-black/60" onClick={() => setIsFilterOpen(false)} aria-label="Close filters" />
          <aside className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border border-white/10 bg-zinc-950 p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-white">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="rounded-xl border border-white/10 p-2 text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            {filterPanel}
            <button onClick={() => setIsFilterOpen(false)} className="mt-6 w-full rounded-xl bg-primary px-4 py-3 font-bold text-white">
              Apply Filters
            </button>
          </aside>
        </div>
      )}

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="hidden w-72 flex-shrink-0 lg:block">
          <div className="glass-card sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl p-6">
            {filterPanel}
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {searchTerm ? `Search: ${searchParams.get("search")}` : "All Products"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
                Browse smart devices, accessories, 3D-enabled products and AI-picked recommendations.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Smart devices", "3D-enabled", "AI-picked", "Fast delivery"].map((chip) => (
                  <span key={chip} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-bold text-gray-300">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-fit text-sm text-gray-400 glass px-4 py-2 rounded-lg border border-white/10">
              Showing {visibleProducts.length} results
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {productsHook.loading ? Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            )) : pageProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {!productsHook.loading && visibleProducts.length === 0 && (
            <div className="mt-6">
              <EmptyState
                icon={SearchX}
                title="No matching products"
                description="Try changing the brand, category, sorting, or search keyword to discover more products."
                actionLabel="Clear Search"
                actionTo="/products"
              />
            </div>
          )}

          {visibleProducts.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  brandFilter,
  categoryFilter,
  sortBy,
  manufacturers,
  categories,
  onBrandChange,
  onCategoryChange,
  onSortChange,
}: {
  brandFilter: string;
  categoryFilter: string;
  sortBy: string;
  manufacturers: string[];
  categories: string[];
  onBrandChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
}) {
  return (
    <>
      <div className="mb-6 flex items-center gap-2 text-lg font-bold text-white">
        <Filter className="h-5 w-5 text-primary" />
        Filters
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 flex items-center justify-between text-sm font-semibold text-gray-300">
            Brands
            <ChevronDown className="h-4 w-4" />
          </h3>
          <div className="space-y-2">
            <label className="group flex cursor-pointer items-center gap-3">
              <input type="radio" name="brand" checked={brandFilter === "all"} onChange={() => onBrandChange("all")} className="accent-primary" />
              <span className="text-sm text-gray-400 transition-colors group-hover:text-white">All Brands</span>
            </label>
            {manufacturers.map((brand) => (
              <label key={brand} className="group flex cursor-pointer items-center gap-3">
                <input type="radio" name="brand" checked={brandFilter === brand} onChange={() => onBrandChange(brand)} className="accent-primary" />
                <span className="text-sm text-gray-400 transition-colors group-hover:text-white">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/10" />

        <div>
          <h3 className="mb-3 flex items-center justify-between text-sm font-semibold text-gray-300">
            Category
            <ChevronDown className="h-4 w-4" />
          </h3>
          <select value={categoryFilter} onChange={(event) => onCategoryChange(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none">
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="h-px bg-white/10" />

        <div>
          <h3 className="mb-3 flex items-center justify-between text-sm font-semibold text-gray-300">
            Sort By
            <ChevronDown className="h-4 w-4" />
          </h3>
          <select value={sortBy} onChange={(event) => onSortChange(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none">
            <option value="name">Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="brand">Brand</option>
          </select>
        </div>

        <div className="h-px bg-white/10" />

        <div>
          <h3 className="mb-3 flex items-center justify-between text-sm font-semibold text-gray-300">
            Price Range
            <ChevronDown className="h-4 w-4" />
          </h3>
          <PriceRangeFilter />
        </div>
      </div>
    </>
  );
}
