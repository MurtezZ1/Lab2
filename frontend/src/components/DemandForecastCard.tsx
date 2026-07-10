import { Brain, PackageCheck, TrendingUp } from "lucide-react";
import type { Product } from "@/types";
import { calculateDemandForecast } from "@/utils/demandForecast";

export default function DemandForecastCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const forecast = calculateDemandForecast(product);
  const tone =
    forecast.level === "High"
      ? "border-green-400/30 bg-green-500/10 text-green-200"
      : forecast.level === "Medium"
        ? "border-yellow-400/30 bg-yellow-500/10 text-yellow-100"
        : "border-blue-400/30 bg-blue-500/10 text-blue-100";

  return (
    <section className={`glass-card rounded-2xl border border-white/10 ${compact ? "p-4" : "p-5 sm:p-6"}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500">
            <Brain className="h-4 w-4 text-primary" />
            ML Demand Forecast
          </div>
          <h2 className="mt-2 text-xl font-black text-white">
            {forecast.level} Demand
          </h2>
        </div>
        <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-black ${tone}`}>
          {forecast.confidence}% confidence
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-bold uppercase text-gray-500">Demand Score</p>
          <p className="mt-2 text-2xl font-black text-white">{forecast.score}/100</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-bold uppercase text-gray-500">Stock</p>
          <p className="mt-2 text-2xl font-black text-white">{product.stock_quantity ?? 0}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-bold uppercase text-gray-500">Rating Signal</p>
          <p className="mt-2 text-2xl font-black text-white">{Number(product.rating_average ?? 0).toFixed(1)}</p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-black/30 p-4">
        {forecast.inventorySignal === "success" ? (
          <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-green-300" />
        ) : (
          <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-yellow-300" />
        )}
        <p className="text-sm leading-relaxed text-gray-300">{forecast.stockAction}</p>
      </div>
    </section>
  );
}

