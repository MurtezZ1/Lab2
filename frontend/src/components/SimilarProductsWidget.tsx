import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Star } from "lucide-react";
import {
  getSimilarProducts,
  type SimilarProduct,
} from "@/services/recommendationService";
import { formatPrice } from "@/utils/products";

type SimilarProductsWidgetProps = {
  productId: number | string;
  title?: string;
};

export default function SimilarProductsWidget({
  productId,
  title = "Similar Products",
}: SimilarProductsWidgetProps) {
  const [products, setProducts] = useState<SimilarProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getSimilarProducts(productId)
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch(() => {
        if (active) setError("Similar products could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [productId]);

  return (
    <section className="mt-16">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
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
        <div className="glass-card rounded-2xl p-5 text-sm text-gray-400">
          No similar products found.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={`${product.uuid ?? product.id}-${product.similarityScore}`}
              to={`/products/${product.id}`}
              className="glass-card group flex min-h-[23rem] flex-col overflow-hidden rounded-2xl p-4 transition-transform hover:-translate-y-1"
            >
              <div className="relative h-48 rounded-xl bg-white/5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                  {Math.round((product.similarityScore ?? 0) * 100)}% match
                </span>
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
