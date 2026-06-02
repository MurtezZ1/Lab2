import AddToCartButton from "@/components/AddToCartButton";
import ProductFeedback from "@/components/ProductFeedback";
import { getProductById } from "@/services/productService";
import { getSimilarProducts } from "@/services/recommendationService";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";
import { Battery, Cpu, Maximize, RotateCcw, Shield, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetailsPage() {
  const { id = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(id)
      .then((item) => {
        setProduct(item);
        return getSimilarProducts(item?.id);
      })
      .then(setSimilar)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-6 py-12 text-gray-400">Loading product...</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-6 py-12 text-gray-400">Product not found.</div>;
  }

  let displaySpecs: { width?: string; height?: string } | null = null;
  try {
    displaySpecs = product.display ? JSON.parse(product.display) : null;
  } catch {
    displaySpecs = null;
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-12 aspect-square relative flex items-center justify-center border border-white/5 group">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
            />
            <button className="absolute top-6 right-6 p-3 rounded-xl glass bg-black/50 text-white hover:text-primary hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className={`glass-card rounded-xl aspect-square relative border ${item === 1 ? "border-primary" : "border-white/5 opacity-50 hover:opacity-100 cursor-pointer"} transition-all`}>
                <img src={product.image} alt="thumbnail" className="h-full w-full object-contain p-2" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary w-fit text-sm font-semibold">
            {product.manufacturer}
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">{product.name}</h1>

          <div className="flex flex-col gap-3">
            <ProductFeedback productId={product.id} />
            <span className="text-green-400 text-sm font-medium">In Stock</span>
          </div>

          <div className="text-4xl font-bold text-white my-2">${product.price.toFixed(2)}</div>

          <p className="text-gray-400 leading-relaxed text-lg">
            {product.description || "No description available for this premium product."}
          </p>

          <div className="h-px bg-white/10 my-4" />

          <div className="grid grid-cols-2 gap-4">
            {product.processor && (
              <div className="flex items-center gap-3 p-4 rounded-xl glass bg-white/5">
                <Cpu className="w-6 h-6 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase">Processor</span>
                  <span className="text-sm text-white font-medium truncate" title={product.processor}>{product.processor.split(" ")[0]} {product.processor.split(" ")[1]}</span>
                </div>
              </div>
            )}
            {product.battery && (
              <div className="flex items-center gap-3 p-4 rounded-xl glass bg-white/5">
                <Battery className="w-6 h-6 text-accent" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase">Battery</span>
                  <span className="text-sm text-white font-medium truncate" title={product.battery}>{product.battery.split(":")[0]}</span>
                </div>
              </div>
            )}
            {displaySpecs && (
              <div className="flex items-center gap-3 p-4 rounded-xl glass bg-white/5 col-span-2">
                <Maximize className="w-6 h-6 text-purple-400" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase">Display Dimensions</span>
                  <span className="text-sm text-white font-medium">{displaySpecs.width} x {displaySpecs.height} inches</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <AddToCartButton product={product} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="flex flex-col items-center gap-2 text-center p-4 rounded-xl glass-card">
              <Truck className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-300">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center p-4 rounded-xl glass-card">
              <Shield className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-300">2-Year Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center p-4 rounded-xl glass-card">
              <RotateCcw className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-300">30-Day Return</span>
            </div>
          </div>
        </div>
      </div>
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-white mb-8">Similar Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similar.map((item) => <ProductCard key={item.id} {...item} />)}
        </div>
      </section>
    </div>
  );
}
