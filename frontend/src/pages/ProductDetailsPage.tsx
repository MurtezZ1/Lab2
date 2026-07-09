import AddToCartButton from "@/components/AddToCartButton";
import CartNotice from "@/components/CartNotice";
import ProductFeedback from "@/components/ProductFeedback";
import Product360Viewer from "@/components/Product360Viewer";
import SimilarProductsWidget from "@/components/SimilarProductsWidget";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCompare } from "@/redux/slices/compareSlice";
import { getProductById } from "@/services/productService";
import { trackProductView } from "@/services/recommendationService";
import type { Product } from "@/types";
import { hasVerifiedProduct3DModel } from "@/utils/product3dModels";
import { Battery, Box, Cpu, GitCompareArrows, HardDrive, Images, Info, Maximize, RotateCcw, Shield, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductDetailsPage() {
  const { id = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [compareNotice, setCompareNotice] = useState("");
  const [mediaView, setMediaView] = useState<"3d" | "photos">("photos");
  const compareItems = useAppSelector((state) => state.compare.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getProductById(id)
      .then((item) => {
        setProduct(item);
        setMediaView(item && hasVerifiedProduct3DModel(item.name) ? "3d" : "photos");
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
  const has3DModel = hasVerifiedProduct3DModel(product.name);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {has3DModel && (
              <button
                type="button"
                onClick={() => setMediaView("3d")}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-colors ${
                  mediaView === "3d"
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-white/10 text-gray-300 hover:border-primary/40 hover:text-white"
                }`}
              >
                <Box className="h-4 w-4" />
                3D Model
              </button>
            )}
            <button
              type="button"
              onClick={() => setMediaView("photos")}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-colors ${
                mediaView === "photos"
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-white/10 text-gray-300 hover:border-accent/40 hover:text-white"
              }`}
            >
              <Images className="h-4 w-4" />
              Photos
            </button>
          </div>

          {mediaView === "3d" && has3DModel ? (
            <Product360Viewer image={product.image} name={product.name} />
          ) : (
            <ProductPhotoGallery product={product} />
          )}

          {has3DModel && (
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-gray-300">
              This product has a verified interactive 3D model. You can switch back to photos anytime from the media controls above.
            </div>
          )}
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

function ProductPhotoGallery({ product }: { product: Product }) {
  const photos = [product.image, product.image, product.image, product.image];

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-3xl p-4">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03]">
          <img src={product.image} alt={product.name} className="h-full w-full object-contain p-8" />
          <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-black uppercase tracking-wide text-white backdrop-blur">
            Product Photos
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={`${photo}-${index}`}
            className={`glass-card relative aspect-square rounded-xl border transition-all ${
              index === 0 ? "border-accent" : "border-white/5 opacity-60 hover:opacity-100"
            }`}
          >
            <img src={photo} alt={`${product.name} photo ${index + 1}`} className="h-full w-full object-contain p-2" />
          </div>
        ))}
      </div>
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
