import ProductCarousel from "@/components/ProductCarousel";
import type { Product } from "@/types";

type RecommendationSectionProps = {
  title: string;
  products: Product[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  subtitle?: string;
  viewAllTo?: string;
};

export default function RecommendationSection({
  title,
  products,
  loading = false,
  error = "",
  emptyMessage = "No recommendations available yet.",
  subtitle,
  viewAllTo = "/products",
}: RecommendationSectionProps) {
  return (
    <ProductCarousel
      title={title}
      subtitle={subtitle}
      products={products}
      loading={loading}
      error={error}
      emptyMessage={emptyMessage}
      viewAllTo={viewAllTo}
    />
  );
}
