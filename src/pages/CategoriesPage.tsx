import { Link } from "react-router-dom";
import { ArrowRight, Camera, Dumbbell, Laptop, Smartphone, Tablet } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

const categoryIcons = {
  laptop: Laptop,
  smartphone: Smartphone,
  tablet: Tablet,
  camera: Camera,
  "fitness tracker": Dumbbell,
};

const formatCategory = (category: string) =>
  category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function CategoriesPage() {
  const { products } = useProducts();
  const categories = Array.from(new Set(products.map((product) => product.type)));

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Categories</h1>
        <p className="text-gray-400">Browse products by device family.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons] ?? Laptop;
          const count = products.filter((product) => product.type === category).length;

          return (
            <Link
              key={category}
              to={`/category/${category.replaceAll(" ", "-")}`}
              className="glass-card rounded-2xl p-6 group hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="bg-primary/20 p-3 rounded-xl">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </div>

              <h2 className="text-xl font-bold text-white mt-8">{formatCategory(category)}</h2>
              <p className="text-sm text-gray-400 mt-2">{count} products available</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
