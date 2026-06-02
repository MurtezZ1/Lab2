import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useParams } from "react-router-dom";

const formatCategory = (category: string) =>
  category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const categoryAliases: Record<string, string> = {
  laptops: "laptop",
  smartphones: "smartphone",
  tablets: "tablet",
  cameras: "camera",
  "fitness-trackers": "fitness tracker",
};

export default function CategoryPage() {
  const { slug = "" } = useParams();
  const { products } = useProducts();
  const category = categoryAliases[slug] ?? slug.replaceAll("-", " ");
  const categoryProducts = products.filter((product) => product.type === category);

  if (products.length > 0 && categoryProducts.length === 0) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Category not found</h1>
        <p className="text-gray-400">No products were found for this category.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{formatCategory(category)}</h1>
          <p className="text-gray-400">Showing {categoryProducts.length} products in this category.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
