import ProductCarousel from "@/components/ProductCarousel";
import RecommendationSection from "@/components/RecommendationSection";
import { useProducts } from "@/hooks/useProducts";
import {
  getPersonalizedRecommendations,
  type PersonalizedRecommendationBundle,
} from "@/services/recommendationService";
import { getCmsContent, type CmsContent } from "@/services/cmsService";
import { ArrowRight, Star, Zap, Shield, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/types";

const initialRecommendations: PersonalizedRecommendationBundle = {
  personalizedProducts: [],
  frequentlyBoughtTogether: [],
  trendingProducts: [],
  fallback: false,
  signals: [],
};

export default function HomePage() {
  const { products, loading: productsLoading, error: productsError } = useProducts({ take: 12 });
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendationBundle>(initialRecommendations);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recommendationsError, setRecommendationsError] = useState("");
  const [cms, setCms] = useState<CmsContent | null>(null);

  useEffect(() => {
    getPersonalizedRecommendations()
      .then(setRecommendations)
      .catch(() => setRecommendationsError("Recommendations could not be loaded."))
      .finally(() => setRecommendationsLoading(false));
    getCmsContent().then(setCms).catch(() => undefined);
  }, []);

  const popularProducts = useMemo(() => {
    return [...products].sort((left, right) => popularityScore(right) - popularityScore(left));
  }, [products]);

  const recommendedProducts = recommendations.personalizedProducts.length
    ? recommendations.personalizedProducts
    : popularProducts;
  const trendingProducts = recommendations.trendingProducts.length
    ? recommendations.trendingProducts
    : popularProducts;

  return (
    <div className="flex flex-col gap-24 pb-24">
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,132,255,0.15)_0%,rgba(9,9,11,1)_70%)]" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] mix-blend-screen" />
        </div>

        <div className="container relative z-10 px-6 mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-primary self-center lg:self-start mb-4">
              <Zap className="w-4 h-4 fill-primary" />
              <span className="text-sm font-semibold tracking-wide uppercase">Next-Gen Tech is Here</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
              {(cms?.hero.title ?? "Elevate Your Digital Lifestyle").replace("Digital Lifestyle", "")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Digital Lifestyle
              </span>
            </h1>

            <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0">
              {cms?.hero.subtitle ?? "Discover the most premium selection of laptops, smartphones, and accessories. Engineered for perfection, designed for you."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start">
              <Link to="/products" className="px-8 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(10,132,255,0.4)] transition-all flex items-center justify-center gap-2 group">
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/deals" className="px-8 py-4 rounded-xl glass border border-white/10 text-white font-bold hover:bg-white/5 transition-all flex items-center justify-center">
                View Flash Sales
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-white">5K+</span>
                <span className="text-sm text-gray-500">Premium Products</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-white">24H</span>
                <span className="text-sm text-gray-500">Fast Delivery</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-black text-white">100%</span>
                <span className="text-sm text-gray-500">Secure Checkout</span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl" />
            <div className="relative w-full h-full flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
              <img
                src="https://m.media-amazon.com/images/I/41MOVNsGMbL.jpg"
                alt="Hero Device"
                className="h-[500px] w-[500px] object-contain drop-shadow-[0_20px_50px_rgba(0,240,255,0.2)]"
              />
            </div>

            <div className="absolute top-1/4 right-10 glass p-4 rounded-2xl border border-white/10 animate-[float_4s_ease-in-out_infinite_reverse]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">4.9/5 Rating</p>
                  <p className="text-gray-400 text-xs">Based on 10k reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
            <div className="bg-primary/20 p-3 rounded-xl">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Free Express Delivery</h3>
              <p className="text-gray-400 text-sm mt-1">On all orders over $200</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
            <div className="bg-accent/20 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">2 Year Warranty</h3>
              <p className="text-gray-400 text-sm mt-1">Peace of mind guaranteed</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl flex items-start gap-4">
            <div className="bg-purple-500/20 p-3 rounded-xl">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Secure Payments</h3>
              <p className="text-gray-400 text-sm mt-1">256-bit SSL Encryption</p>
            </div>
          </div>
        </div>
      </section>

      <ProductCarousel
        title={cms?.homepage.featuredTitle ?? "Trending Now"}
        subtitle="Popular products ranked by customer activity, demand signals, ratings and recent catalog momentum."
        products={popularProducts}
        loading={productsLoading}
        error={productsError ?? ""}
        emptyMessage="Trending products are not available yet."
        viewAllTo="/products"
      />

      <section className="container mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold text-white mb-10 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Laptops", "Smartphones", "Tablets", "Cameras"].map((category) => (
            <Link to={`/category/${category.toLowerCase()}`} key={category} className="group relative h-48 rounded-2xl overflow-hidden glass-card flex items-center justify-center border border-white/5 hover:border-primary/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <h3 className="relative z-20 text-white font-bold text-xl group-hover:scale-110 transition-transform">{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      <RecommendationSection
        title="Recommended For You"
        subtitle={recommendations.fallback ? "Popular products selected while we learn your shopping preferences." : "Personalized from purchase history, wishlist, product views and AI recommendations."}
        products={recommendedProducts}
        loading={recommendationsLoading && !recommendedProducts.length}
        error={recommendationsError}
        emptyMessage="Popular recommendations are not available yet."
      />

      <RecommendationSection
        title="Trending Products"
        subtitle="Top-selling, high-demand and highly rated products from the store catalog."
        products={trendingProducts}
        loading={recommendationsLoading && !trendingProducts.length}
        error={recommendationsError}
        emptyMessage="Trending products are not available yet."
      />
    </div>
  );
}

function popularityScore(product: Product) {
  return (
    Number(product.recommendationScore ?? 0) * 100 +
    Number(product.rating_average ?? 0) * 20 +
    Number(product.discount_percentage ?? 0) +
    Number(product.stock_quantity ?? 0) * 0.05
  );
}
