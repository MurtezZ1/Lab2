import { getProductById } from "@/lib/products";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShoppingCart, Star, Shield, Truck, RotateCcw, Cpu, Battery, Maximize } from "lucide-react";
import AddToCartButton from "./AddToCartButton";

export const revalidate = 60;

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(productId)) {
    notFound();
  }

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  // Parse JSON fields if they exist
  let displaySpecs = null;
  try { displaySpecs = product.display ? JSON.parse(product.display) : null; } catch (e) {}

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Image Gallery */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-12 aspect-square relative flex items-center justify-center border border-white/5 group">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
            />
            <button className="absolute top-6 right-6 p-3 rounded-xl glass bg-black/50 text-white hover:text-primary hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
          {/* Thumbnail Mock */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`glass-card rounded-xl aspect-square relative border ${i === 1 ? 'border-primary' : 'border-white/5 opacity-50 hover:opacity-100 cursor-pointer'} transition-all`}>
                 <Image src={product.image} alt="thumbnail" fill className="object-contain p-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary w-fit text-sm font-semibold">
            {product.manufacturer}
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-gray-400 text-sm">4.9 (128 Reviews)</span>
            <span className="text-gray-600 text-sm">|</span>
            <span className="text-green-400 text-sm font-medium">In Stock</span>
          </div>

          <div className="text-4xl font-bold text-white my-2">
            ${product.price.toFixed(2)}
          </div>

          <p className="text-gray-400 leading-relaxed text-lg">
            {product.description || "No description available for this premium product."}
          </p>

          <div className="h-px bg-white/10 my-4" />

          {/* Quick Specs */}
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
            <AddToCartButton productId={product.id} />
          </div>

          {/* Service Promises */}
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
    </div>
  );
}
