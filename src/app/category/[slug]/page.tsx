import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products";
import { notFound } from "next/navigation";

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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryAliases[slug] ?? slug.replaceAll("-", " ");
  const products = (await getProducts()).filter((product) => product.type === category);

  if (products.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{formatCategory(category)}</h1>
          <p className="text-gray-400">Showing {products.length} products in this category.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            manufacturer={product.manufacturer}
          />
        ))}
      </div>
    </div>
  );
}
