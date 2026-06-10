import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Award, GitCompareArrows, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearCompare, removeFromCompare } from "@/redux/slices/compareSlice";
import { compareProducts } from "@/services/productService";
import type { ComparedProduct } from "@/types";
import { formatPrice } from "@/utils/products";

type Row = {
  label: string;
  key: string;
  getValue: (product: ComparedProduct) => string | number;
  best?: "lowest" | "highest" | "largestNumber" | "processor" | "display" | "ports";
  badge?: string;
  weight?: number;
};

const rows: Row[] = [
  { label: "Price", key: "price", getValue: (product) => product.price, best: "lowest", badge: "Best Price", weight: 1.5 },
  { label: "Brand", key: "brand", getValue: (product) => product.brand || product.manufacturer },
  { label: "Category", key: "category", getValue: (product) => product.category || product.type },
  { label: "Rating", key: "rating", getValue: (product) => product.rating || product.rating_average || 0, best: "highest", badge: "Best Rating", weight: 1.2 },
  { label: "Reviews", key: "reviewsCount", getValue: (product) => product.reviewsCount ?? 0, best: "highest", weight: 0.8 },
  { label: "Storage", key: "storage", getValue: (product) => product.specifications?.storage ?? product.storage ?? "Not specified", best: "largestNumber", badge: "Best Storage", weight: 1.1 },
  { label: "RAM", key: "ram", getValue: (product) => product.specifications?.ram ?? product.ram_size ?? "Not specified", best: "largestNumber", badge: "Best RAM", weight: 1.1 },
  { label: "Camera", key: "camera", getValue: (product) => product.specifications?.camera ?? product.camera ?? "Not specified", best: "largestNumber", badge: "Best Camera", weight: 0.9 },
  { label: "Battery", key: "battery", getValue: (product) => product.specifications?.battery ?? product.battery ?? "Not specified", best: "largestNumber", badge: "Biggest Battery", weight: 1 },
  { label: "Processor", key: "processor", getValue: (product) => product.specifications?.processor ?? product.processor ?? "Not specified", best: "processor", badge: "Best Performance", weight: 1.4 },
  { label: "Display", key: "display", getValue: (product) => product.specifications?.display ?? product.display ?? "Not specified", best: "display", badge: "Best Display", weight: 1 },
  { label: "OS", key: "os", getValue: (product) => product.specifications?.os ?? product.os ?? "Not specified" },
  { label: "Weight", key: "weight", getValue: (product) => product.specifications?.weight ?? product.weight ?? "Not specified", best: "lowest", badge: "Lightest", weight: 0.7 },
  { label: "Dimensions", key: "dimensions", getValue: (product) => product.specifications?.dimensions ?? product.dimensions ?? "Not specified" },
  { label: "Keyboard", key: "keyboard", getValue: (product) => product.specifications?.keyboard ?? product.keyboard ?? "Not specified" },
  { label: "Ports", key: "ports", getValue: (product) => product.specifications?.ports ?? product.ports ?? "Not specified", best: "ports", badge: "Most Ports", weight: 0.7 },
  { label: "Connectivity", key: "connectivity", getValue: (product) => product.specifications?.connectivity ?? product.connectivity ?? "Not specified" },
  { label: "Stock", key: "stock", getValue: (product) => product.stock ?? product.stock_quantity ?? 0, best: "highest", badge: "Most Stock", weight: 0.7 },
  { label: "Discount", key: "discount", getValue: (product) => product.discount ?? product.discount_percentage ?? 0, best: "highest", badge: "Best Discount", weight: 0.8 },
  { label: "Features", key: "features", getValue: (product) => product.features ?? product.additional_features ?? "Not specified" },
];

export default function ComparePage() {
  const selectedProducts = useAppSelector((state) => state.compare.items);
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<ComparedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ids = useMemo(() => selectedProducts.map((product) => product.uuid ?? product.id), [selectedProducts]);

  useEffect(() => {
    if (ids.length < 2) {
      setProducts([]);
      return;
    }

    let active = true;
    setLoading(true);
    setError("");
    compareProducts(ids)
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch(() => {
        if (active) setError("Comparison data could not be loaded.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ids]);

  const rowWinners = useMemo(() => {
    const winners: Record<string, Set<string>> = {};
    rows.forEach((row) => {
      if (!row.best || !products.length) return;
      const values = products.map((product) => ({ product, numeric: comparisonValue(row, row.getValue(product)) }));
      const valid = values.filter((item) => Number.isFinite(item.numeric));
      if (!valid.length) return;
      const target =
        row.best === "lowest"
          ? Math.min(...valid.map((item) => item.numeric))
          : Math.max(...valid.map((item) => item.numeric));
      winners[row.key] = new Set(valid.filter((item) => item.numeric === target).map((item) => String(item.product.uuid ?? item.product.id)));
    });
    return winners;
  }, [products]);

  const comparisonScores = useMemo(() => {
    const comparableRows = rows.filter((row) => row.best);
    const totals = new Map<string, { product: ComparedProduct; points: number }>();
    products.forEach((product) => {
      totals.set(String(product.uuid ?? product.id), { product, points: 0 });
    });

    const maxPoints = comparableRows.reduce((total, row) => total + (row.weight ?? 1), 0);
    comparableRows.forEach((row) => {
      const winners = rowWinners[row.key];
      if (!winners?.size) return;
      const rowPoints = (row.weight ?? 1) / winners.size;
      winners.forEach((winnerKey) => {
        const total = totals.get(winnerKey);
        if (total) total.points += rowPoints;
      });
    });

    const scores = Array.from(totals.values())
      .map(({ product, points }) => ({
        product,
        points,
        percent: maxPoints ? Math.round((points / maxPoints) * 100) : 0,
      }))
      .sort((left, right) => right.percent - left.percent);

    const best = scores[0];
    const second = scores[1];
    const betterBy = best && second
      ? second.percent > 0
        ? Math.max(0, Math.round(((best.percent - second.percent) / second.percent) * 100))
        : best.percent
      : 0;

    return { scores, best, betterBy };
  }, [products, rowWinners]);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
            <GitCompareArrows className="h-8 w-8 text-accent" />
            Compare Products
          </h1>
          <p className="mt-2 text-sm text-gray-400">Compare 2 or 3 products side-by-side.</p>
        </div>
        {selectedProducts.length > 0 && (
          <button
            type="button"
            onClick={() => dispatch(clearCompare())}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-gray-200 hover:border-red-400/40"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {selectedProducts.length < 2 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-lg font-bold text-white">Add at least 2 products to compare.</p>
          <p className="mt-2 text-sm text-gray-400">You can compare up to 3 products.</p>
          <Link to="/products" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 font-bold text-white">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="glass-card overflow-hidden rounded-2xl">
          {loading && <div className="p-8 text-center text-gray-400">Loading comparison...</div>}
          {error && <div className="p-8 text-center text-red-200">{error}</div>}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="sticky left-0 z-10 bg-[#08090d] px-5 py-4 text-gray-400">Feature</th>
                    {products.map((product) => (
                      <th key={product.uuid ?? product.id} className="min-w-56 px-5 py-4 align-top">
                        <div className="flex flex-col gap-3">
                          <div className="h-36 rounded-xl bg-white/5 p-3">
                            <img src={product.productImage || product.image} alt={product.name} className="h-full w-full object-contain" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase text-primary">{product.brand || product.manufacturer}</p>
                            <Link to={`/products/${product.id}`} className="mt-1 block text-lg font-bold text-white hover:text-accent">
                              {product.name}
                            </Link>
                          </div>
                          <button
                            type="button"
                            onClick={() => dispatch(removeFromCompare(product.uuid ?? product.id))}
                            className="w-fit rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-gray-300 hover:border-red-400/40"
                          >
                            Remove
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {rows.map((row) => (
                    <tr key={row.key}>
                      <td className="sticky left-0 z-10 bg-[#08090d] px-5 py-4 font-bold text-gray-300">{row.label}</td>
                      {products.map((product) => {
                        const value = row.getValue(product);
                        const productKey = String(product.uuid ?? product.id);
                        const isBest = rowWinners[row.key]?.has(productKey);
                        return (
                          <td key={`${productKey}-${row.key}`} className="px-5 py-4 text-gray-200">
                            <div className="flex flex-col gap-2">
                              <span>{formatValue(row.key, value)}</span>
                              {isBest && row.badge && (
                                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-accent/15 px-2 py-1 text-xs font-bold text-accent">
                                  <Award className="h-3 w-3" />
                                  {row.badge}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!loading && !error && comparisonScores.best && products.length >= 2 && (
        <section className="mt-8 glass-card rounded-2xl p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-accent">Overall recommendation</p>
              <h2 className="mt-2 text-2xl font-black text-white">
                {comparisonScores.best.product.name} is the strongest choice
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                It scores {comparisonScores.best.percent}% overall and is {comparisonScores.betterBy}% better than the next closest product in this comparison.
              </p>
            </div>
            <Award className="h-10 w-10 text-accent" />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {comparisonScores.scores.map((score, index) => (
              <div key={score.product.uuid ?? score.product.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-white">{score.product.name}</p>
                  {index === 0 && (
                    <span className="rounded-full bg-accent/15 px-2 py-1 text-xs font-bold text-accent">Best Overall</span>
                  )}
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${score.percent}%` }} />
                </div>
                <p className="mt-2 text-sm font-bold text-gray-200">{score.percent}% comparison score</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function formatValue(key: string, value: string | number) {
  if (key === "price") return formatPrice(Number(value));
  if (key === "rating") return Number(value) ? `${Number(value).toFixed(1)} / 5` : "No rating";
  if (key === "discount") return `${Number(value).toFixed(0)}%`;
  if (key === "stock" || key === "reviewsCount") return String(value);
  return String(value || "Not specified");
}

function numericValue(value: string | number) {
  if (typeof value === "number") return value;
  const match = String(value).match(/[\d.]+/);
  return match ? Number(match[0]) : Number.NaN;
}

function comparisonValue(row: Row, value: string | number) {
  if (row.best === "processor") return processorScore(value);
  if (row.best === "display") return displayScore(value);
  if (row.best === "ports") return portScore(value);
  return numericValue(value);
}

function processorScore(value: string | number) {
  const text = String(value).toLowerCase();
  let score = numericValue(value);
  if (!Number.isFinite(score)) score = 0;

  if (text.includes("m3")) score += 120;
  else if (text.includes("m2")) score += 100;
  else if (text.includes("snapdragon 888") || text.includes("exynos 2100")) score += 82;
  else if (text.includes("ryzen 7")) score += 78;
  else if (text.includes("ryzen 5")) score += 70;
  else if (text.includes("core i7")) score += 76;
  else if (text.includes("core i5")) score += 62;
  else if (text.includes("digic x") || text.includes("bionz")) score += 58;
  else if (text.includes("tegra")) score += 52;
  else if (text.includes("processor") || text.includes("chipset")) score += 40;

  return score;
}

function portScore(value: string | number) {
  const text = String(value);
  if (!text || text === "Not specified") return Number.NaN;
  return text.split(",").filter((part) => part.trim()).length;
}

function displayScore(value: string | number) {
  const text = String(value).toLowerCase();
  const size = numericValue(value);
  let score = Number.isFinite(size) ? size : 0;

  if (text.includes("oled")) score += 45;
  if (text.includes("retina") || text.includes("xdr")) score += 35;
  if (text.includes("amoled")) score += 30;
  if (text.includes("4k")) score += 28;
  if (text.includes("qhd")) score += 20;
  if (text.includes("full hd") || text.includes("1080")) score += 12;
  if (text.includes("240hz")) score += 24;
  else if (text.includes("120hz")) score += 16;
  if (text.includes("touch")) score += 6;

  return score;
}
