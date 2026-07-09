import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { hasVerifiedProduct3DModel } from "@/utils/product3dModels";
import { Box, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Product3DModelsPage() {
  const { products, loading, error } = useProducts({ pageSize: 100 });
  const productsWith3D = products.filter((product) => hasVerifiedProduct3DModel(product.name));

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            <Box className="h-4 w-4" />
            Interactive 3D Products
          </div>
          <h1 className="text-3xl font-black text-white lg:text-5xl">Products With 3D Models</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
            Browse products that include a verified interactive 3D model. Open a product to switch between the 3D model and normal photos.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-gray-200 transition-colors hover:border-primary/50 hover:text-white"
        >
          <ImageIcon className="h-4 w-4 text-accent" />
          View All Products
        </Link>
      </div>

      {loading && <div className="glass-card rounded-2xl p-8 text-gray-400">Loading 3D products...</div>}

      {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">{error}</div>}

      {!loading && !error && (
        <>
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-gray-300">
            Showing <span className="font-bold text-white">{productsWith3D.length}</span> products with verified 3D models.
          </div>
          {productsWith3D.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {productsWith3D.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-8 text-gray-400">No verified 3D products are currently available.</div>
          )}
        </>
      )}
    </div>
  );
}
