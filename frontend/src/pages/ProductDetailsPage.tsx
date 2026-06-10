import AddToCartButton from "@/components/AddToCartButton";
import CartNotice from "@/components/CartNotice";
import ProductFeedback from "@/components/ProductFeedback";
import SimilarProductsWidget from "@/components/SimilarProductsWidget";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCompare } from "@/redux/slices/compareSlice";
import { getProductById } from "@/services/productService";
import { trackProductView } from "@/services/recommendationService";
import type { Product } from "@/types";
import { Battery, Cpu, GitCompareArrows, HardDrive, Info, Maximize, RotateCcw, Shield, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetailsPage() {
  const { id = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [compareNotice, setCompareNotice] = useState("");
  const compareItems = useAppSelector((state) => state.compare.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getProductById(id)
      .then((item) => {
        setProduct(item);
        if (item) void trackProductView(item);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="container mx-auto px-6 py-12 text-gray-400">Loading product...</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-6 py-12 text-gray-400">Product not found.</div>;
  }

  const handleCompare = () => {
    const alreadyAdded = compareItems.some(
      (item) => String(item.uuid ?? item.id) === String(product.uuid ?? product.id) || String(item.id) === String(product.id),
    );
    if (alreadyAdded) setCompareNotice("Product is already in compare.");
    else if (compareItems.length >= 3) setCompareNotice("Maximum 3 products can be compared.");
    else setCompareNotice(`${product.name} added to compare.`);
    dispatch(addToCompare(product));
    setTimeout(() => setCompareNotice(""), 2500);
  };

  const productSpecifications = getProductSpecifications(product);

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
          <div className="glass-card rounded-2xl border border-white/5 p-6">
            <div className="mb-5 flex items-center gap-3">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-white">Real Product Specifications</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {productSpecifications.map((spec) => (
                <div key={spec.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-bold uppercase text-gray-500">{spec.label}</p>
                  <p className="mt-1 text-sm font-semibold leading-relaxed text-white">{spec.value}</p>
                </div>
              ))}
            </div>
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
            {product.display && (
              <div className="flex items-center gap-3 p-4 rounded-xl glass bg-white/5 col-span-2">
                <Maximize className="w-6 h-6 text-purple-400" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase">Display</span>
                  <span className="text-sm text-white font-medium">{product.display}</span>
                </div>
              </div>
            )}
            {product.storage && (
              <div className="flex items-center gap-3 p-4 rounded-xl glass bg-white/5 col-span-2">
                <HardDrive className="w-6 h-6 text-green-400" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase">Storage</span>
                  <span className="text-sm text-white font-medium">{product.storage}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <AddToCartButton product={product} />
            <button
              type="button"
              onClick={handleCompare}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 font-bold text-white transition-colors hover:border-accent/50"
            >
              <GitCompareArrows className="h-5 w-5 text-accent" />
              Compare
            </button>
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

      <SimilarProductsWidget productId={product.uuid ?? product.id} />
      <CartNotice show={Boolean(compareNotice)} message={compareNotice} />
    </div>
  );
}

function getProductSpecifications(product: Product) {
  return [
    { label: "Brand", value: product.manufacturer },
    { label: "Model", value: product.model },
    { label: "Category", value: product.type },
    { label: "Year", value: product.year ? String(product.year) : "" },
    { label: "Processor", value: product.processor },
    { label: "RAM", value: product.ram_size },
    { label: "Storage", value: product.storage },
    { label: "Display", value: product.display },
    { label: "Operating System", value: product.os },
    { label: "Battery", value: product.battery },
    { label: "Weight", value: product.weight },
    { label: "Dimensions", value: product.dimensions },
    { label: "Keyboard", value: product.keyboard },
    { label: "Ports", value: product.ports },
    { label: "Connectivity", value: product.connectivity },
    { label: "Camera", value: product.camera },
    { label: "Extra Features", value: product.additional_features },
  ].filter((spec): spec is { label: string; value: string } => Boolean(spec.value && String(spec.value).trim()));
}
