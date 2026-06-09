import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, Star } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/utils/products";

type RecommendationSectionProps = {
  title: string;
  products: Product[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
};

export default function RecommendationSection({
  title,
  products,
  loading = false,
  error = "",
  emptyMessage = "No recommendations available yet.",
}: RecommendationSectionProps) {
  return (
    <section className="container mx-auto px-6">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <Link to="/products" className="hidden items-center gap-2 text-primary hover:text-accent sm:flex">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="glass-card rounded-2xl p-4">
              <div className="h-48 animate-pulse rounded-xl bg-white/5" />
              <div className="mt-4 h-4 w-24 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-5 w-4/5 animate-pulse rounded bg-white/10" />
              <div className="mt-6 h-6 w-20 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="glass-card flex items-center gap-3 rounded-2xl p-5 text-sm text-red-200">
          <AlertCircle className="h-5 w-5 text-red-300" />
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="glass-card rounded-2xl p-5 text-sm text-gray-400">{emptyMessage}</div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={`${product.uuid ?? product.id}-${title}`}
              to={`/products/${product.id}`}
              className="glass-card group flex min-h-[22rem] flex-col overflow-hidden rounded-2xl p-4 transition-transform hover:-translate-y-1"
            >
              <div className="h-48 rounded-xl bg-white/5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-4 flex flex-1 flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {product.manufacturer || "Sunspot"}
                </span>
                <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-tight text-white group-hover:text-accent">
                  {product.name}
                </h3>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-300">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{formatRating(product.rating_average)}</span>
                </div>

                <div className="mt-auto pt-5 text-xl font-bold text-white">
                  {formatPrice(product.price)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function formatRating(value?: number) {
  const rating = Number(value ?? 0);
  return rating > 0 ? `${rating.toFixed(1)} / 5` : "No rating yet";
}
