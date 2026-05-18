import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { BadgePercent, Clock } from "lucide-react";

export default async function DealsPage() {
  const products = (await getProducts()).slice(0, 6);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-primary mb-4">
            <BadgePercent className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase">Flash Deals</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Today&apos;s Deals</h1>
          <p className="text-gray-400 max-w-2xl">Hand-picked offers from the current SunSpot catalog.</p>
        </div>

        <div className="glass px-4 py-3 rounded-xl flex items-center gap-3 text-sm text-gray-300 w-fit">
          <Clock className="w-5 h-5 text-accent" />
          Updated every 24 hours
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={Math.round(product.price * 0.85 * 100) / 100}
            image={product.image}
            manufacturer={product.manufacturer}
          />
        ))}
      </div>
    </div>
  );
}
