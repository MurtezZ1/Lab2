import { useState } from "react";

type PriceRangeFilterProps = {
  min?: number;
  max?: number;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function PriceRangeFilter({ min = 0, max = 2000 }: PriceRangeFilterProps) {
  const [price, setPrice] = useState(max);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-center">
        <span className="text-xs uppercase text-gray-400">Up to</span>
        <div className="text-lg font-bold text-white">{formatCurrency(price)}</div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={50}
        value={price}
        onChange={(event) => setPrice(Number(event.target.value))}
        aria-label="Price range"
        className="w-full accent-primary"
      />

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{formatCurrency(min)}</span>
        <span>{formatCurrency(max)}+</span>
      </div>
    </div>
  );
}
